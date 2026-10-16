import Link from 'next/link';
import { connection } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { InvoicesList } from '@/components/dashboard/InvoicesList';
import styles from './dashboard.module.css';

export const instant = false;

export default async function DashboardPage() {
  await connection();
  noStore();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Отримуємо профіль (для перевірки заповненості)
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_name, iban')
    .eq('id', user!.id)
    .single();

  const hasProfile = !!(profile?.company_name && profile?.iban);

  // Якщо реквізити не заповнені — показуємо тільки prompt
  if (!hasProfile) {
    return (
      <>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Рахунки</h1>
          <p className={styles.pageDescription}>Керуйте своїми рахунками та клієнтами</p>
        </div>

        <Card>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Заповніть реквізити</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                Додайте свої дані ФОП, щоб створювати рахунки
              </div>
            </div>
            <Link href="/dashboard/settings">
              <Button>Заповнити</Button>
            </Link>
          </div>
        </Card>
      </>
    );
  }

  // === Отримуємо рахунки з клієнтами ===
  const { data: invoicesData } = await supabase
    .from('invoices')
    .select(
      `
      id,
      invoice_number,
      invoice_date,
      due_date,
      total,
      status,
      items,
      client:clients (name)
    `
    )
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });

  // Нормалізуємо дані (Supabase повертає client як об'єкт або масив)
  const invoices = (invoicesData ?? []).map((inv) => ({
    id: inv.id,
    invoice_number: inv.invoice_number,
    invoice_date: inv.invoice_date,
    due_date: inv.due_date,
    total: Number(inv.total),
    status: inv.status as 'draft' | 'sent' | 'paid',
    items: inv.items,
    client: Array.isArray(inv.client) ? inv.client[0] : inv.client,
  }));

  return (
    <>
      <div className={styles.pageHeader}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h1 className={styles.pageTitle}>Рахунки</h1>
            <p className={styles.pageDescription}>
              {invoices.length === 0
                ? 'Поки немає рахунків'
                : `Всього рахунків: ${invoices.length}`}
            </p>
          </div>
          <Link href="/dashboard/new">
            <Button>+ Новий рахунок</Button>
          </Link>
        </div>
      </div>

      {invoices.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>📄</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
              Поки немає рахунків
            </div>
            <div
              style={{
                fontSize: 13,
                color: 'var(--color-text-muted)',
                marginBottom: 20,
              }}
            >
              Створіть свій перший рахунок — це займе 30 секунд
            </div>
            <Link href="/dashboard/new">
              <Button>Створити перший рахунок</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <InvoicesList invoices={invoices} />
      )}
    </>
  );
}
