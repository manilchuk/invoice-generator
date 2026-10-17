import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { InvoiceForm } from '@/components/invoice/InvoiceForm';
import type { ClientOption, InvoiceItem } from '@/types/invoice';
import styles from '../dashboard.module.css';

export const instant = false;

interface PageProps {
  searchParams: Promise<{ from?: string }>;
}

export default async function NewInvoicePage({ searchParams }: PageProps) {
  const { from } = await searchParams;

  await connection();

  const supabase = await createClient();

  // 1. Авторизація
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // 2. Перевірка, що реквізити заповнені
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_name, iban')
    .eq('id', user.id)
    .single();

  if (!profile?.company_name || !profile?.iban) {
    redirect('/dashboard/settings');
  }

  // 3. Отримуємо список клієнтів
  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, email, address, tax_id')
    .eq('user_id', user.id)
    .order('name', { ascending: true });

  // 4. Обчислюємо наступний номер рахунку
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const monthStart = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
  const nextMonth = new Date(currentYear, currentMonth, 1);
  const monthEnd = nextMonth.toISOString().split('T')[0];

  const { count } = await supabase
    .from('invoices')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('invoice_date', monthStart)
    .lt('invoice_date', monthEnd);

  const nextSequence = (count ?? 0) + 1;

  // 5. Якщо є ?from=[id] — підтягуємо дані копії
  let initialData = undefined;

  if (from) {
    const { data: source } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', from)
      .eq('user_id', user.id)
      .single();

    if (source) {
      // Отримуємо клієнта
      let clientName: string | null = null;
      let clientEmail: string | null = null;
      let clientAddress: string | null = null;
      let clientTaxId: string | null = null;

      if (source.client_id) {
        const { data: client } = await supabase
          .from('clients')
          .select('name, email, address, tax_id')
          .eq('id', source.client_id)
          .single();

        if (client) {
          clientName = client.name;
          clientEmail = client.email;
          clientAddress = client.address;
          clientTaxId = client.tax_id;
        }
      }

      initialData = {
        id: source.id,
        invoiceNumber: '', // порожній — InvoiceForm згенерує новий
        invoiceDate: '', // порожній — InvoiceForm підставить сьогодні
        dueDate: '', // порожній — користувач встановить сам
        items: (source.items as InvoiceItem[]) ?? [],
        notes: source.notes ?? '',
        clientId: source.client_id,
        clientName,
        clientEmail,
        clientAddress,
        clientTaxId,
        vatEnabled: source.vat_enabled ?? false,
      };
    }
  }

  const clientOptions: ClientOption[] = clients ?? [];

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Новий рахунок</h1>
        <p className={styles.pageDescription}>Заповніть дані та створіть PDF-рахунок</p>
      </div>

      <InvoiceForm
        clients={clientOptions}
        initialData={initialData}
        nextSequence={nextSequence}
        currentYear={currentYear}
        currentMonth={currentMonth}
      />
    </>
  );
}
