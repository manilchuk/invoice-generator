import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
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
        </nav>

        <div className={styles.userMenu}>
          <span className={styles.userEmail}>{user.email}</span>
          <LogoutButton />
        </div>
      </header>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
