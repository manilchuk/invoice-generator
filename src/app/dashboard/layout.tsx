import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
import { SupportButton } from '@/components/ui/SupportButton';
import styles from './dashboard.module.css';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.logo}>
          Invoice<span>Flow</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.navLink}>
            Рахунки
          </Link>
          <Link href="/dashboard/settings" className={styles.navLink}>
            Реквізити
          </Link>
          {user.email === process.env.ADMIN_EMAIL && (
            <Link href="/dashboard/metrics" className={styles.navLink}>
              Метрики
            </Link>
          )}
        </nav>

        <div className={styles.userMenu}>
          <SupportButton variant="compact" />
          <span className={styles.userEmail}>{user.email}</span>
          <LogoutButton />
        </div>
      </header>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
