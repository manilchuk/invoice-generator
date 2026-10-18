import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SettingsForm } from '@/components/dashboard/SettingsForm';
import styles from '../dashboard.module.css';

export const instant = false;

export default async function SettingsPage() {
  await connection();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user!.id).single();

  if (!profile) {
    return <div>Помилка: профіль не знайдено</div>;
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Реквізити</h1>
        <p className={styles.pageDescription}>Ці дані використовуються при створенні рахунків</p>
      </div>

      <SettingsForm profile={profile} userEmail={user!.email ?? ''} />
    </>
  );
}
