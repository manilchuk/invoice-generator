import { notFound, redirect } from 'next/navigation';
import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { InvoiceForm } from '@/components/invoice/InvoiceForm';
import type { ClientOption, InvoiceItem } from '@/types/invoice';
import styles from '@/app/dashboard/dashboard.module.css';

export const instant = false;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditInvoicePage({ params }: PageProps) {
  const { id } = await params;

  await connection();

  const supabase = await createClient();

  // 1. Авторизація
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // 2. Отримуємо рахунок (тільки свій!)
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (invoiceError || !invoice) {
    notFound();
  }

  // 3. Перевірка, що реквізити заповнені
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_name, iban')
    .eq('id', user.id)
    .single();

  if (!profile?.company_name || !profile?.iban) {
    redirect('/dashboard/settings');
  }

  // 4. Отримуємо список клієнтів
  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, email, address, tax_id')
    .eq('user_id', user.id)
    .order('name', { ascending: true });

  // 5. Отримуємо клієнта рахунку (якщо є)
  let clientName: string | null = null;
  let clientEmail: string | null = null;
  let clientAddress: string | null = null;
  let clientTaxId: string | null = null;

  if (invoice.client_id) {
    const { data: client } = await supabase
      .from('clients')
      .select('name, email, address, tax_id')
      .eq('id', invoice.client_id)
      .single();

    if (client) {
      clientName = client.name;
      clientEmail = client.email;
      clientAddress = client.address;
      clientTaxId = client.tax_id;
    }
  }

  const clientOptions: ClientOption[] = clients ?? [];

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Редагування рахунку № {invoice.invoice_number}</h1>
        <p className={styles.pageDescription}>Внесіть зміни та збережіть</p>
      </div>

      <InvoiceForm
        clients={clientOptions}
        mode="edit"
        initialData={{
          id: invoice.id,
          invoiceNumber: invoice.invoice_number,
          invoiceDate: invoice.invoice_date,
          dueDate: invoice.due_date ?? '',
          items: (invoice.items as InvoiceItem[]) ?? [],
          notes: invoice.notes ?? '',
          clientId: invoice.client_id,
          clientName,
          clientEmail,
          clientAddress,
          clientTaxId,
          vatEnabled: invoice.vat_enabled ?? false,
        }}
      />
    </>
  );
}
