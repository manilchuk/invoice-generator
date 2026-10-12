import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InvoiceForm } from '@/components/invoice/InvoiceForm';
import type { ClientOption } from '@/types/invoice';
import styles from '../dashboard.module.css';

export const instant = false;

export default async function NewInvoicePage() {
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

  // Визначаємо початок і кінець поточного місяця
  const monthStart = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
  const nextMonth = new Date(currentYear, currentMonth, 1);
  const monthEnd = nextMonth.toISOString().split('T')[0];

  // Рахуємо, скільки рахунків уже створено в цьому місяці
  const { count } = await supabase
    .from('invoices')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('invoice_date', monthStart)
    .lt('invoice_date', monthEnd);

  const nextSequence = (count ?? 0) + 1;

  const clientOptions: ClientOption[] = clients ?? [];

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Новий рахунок</h1>
        <p className={styles.pageDescription}>Заповніть дані та створіть PDF-рахунок</p>
      </div>

      <InvoiceForm
        clients={clientOptions}
        nextSequence={nextSequence}
        currentYear={currentYear}
        currentMonth={currentMonth}
      />
    </>
  );
}
