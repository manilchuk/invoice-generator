import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import styles from './dashboard.module.css';

export const instant = false;

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Отримуємо профіль та рахунки
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user!.id).single();

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const hasProfile = !!(profile?.company_name && profile?.iban);

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Рахунки</h1>
        <p className={styles.pageDescription}>Керуйте своїми рахунками та клієнтами</p>
      </div>

      {!hasProfile && (
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
      )}

      {hasProfile && (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Останні 5 рахунків</div>
            <Link href="/dashboard/new">
              <Button>+ Новий рахунок</Button>
            </Link>
          </div>

          {(!invoices || invoices.length === 0) && (
            <Card>
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>
                  Поки немає рахунків
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                  Створіть свій перший рахунок
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </>
  );
}
