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

  // 4. Отримуємо останній номер рахунку (для автогенерації)
  const { data: lastInvoice } = await supabase
    .from('invoices')
    .select('invoice_number')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const clientOptions: ClientOption[] = clients ?? [];

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Новий рахунок</h1>
        <p className={styles.pageDescription}>Заповніть дані та створіть PDF-рахунок</p>
      </div>

      <InvoiceForm clients={clientOptions} lastInvoiceNumber={lastInvoice?.invoice_number} />
    </>
  );
}
