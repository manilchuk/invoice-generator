'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import styles from '../auth.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Пароль має містити мінімум 6 символів');
      return;
    }

    if (password !== confirm) {
      setError('Пароли не співпадають');
      return;
    }

    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Перевіряємо, чи одразу створилась сесія (email confirmation вимкнено)
    // чи потрібно підтверджувати email (email confirmation увімкнено)
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setSuccess('Реєстрація успішна! Перевірте вашу пошту та підтвердіть email — потім увійдіть.');
      setLoading(false);
    }
  }

  return (
    <Card>
      <h1 className={styles.heading}>Реєстрація</h1>
      <p className={styles.subheading}>Створіть акаунт за 30 секунд</p>

      <form onSubmit={handleSubmit} className={styles.fields}>
        {error && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          disabled={!!success}
        />

        <Input
          label="Пароль"
          type="password"
          name="password"
          placeholder="Мінімум 6 символів"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          disabled={!!success}
        />

        <Input
          label="Повторіть пароль"
          type="password"
          name="confirm"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          autoComplete="new-password"
          disabled={!!success}
        />

        <Button type="submit" fullWidth loading={loading} disabled={!!success}>
          Зареєструватись
        </Button>
      </form>

      <div className={styles.footer}>
        Вже маєте акаунт? <Link href="/login">Увійти</Link>
      </div>
    </Card>
  );
}
