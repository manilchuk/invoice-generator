'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import styles from '../auth.module.css';

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);

  // Перевіряємо, чи є валідна сесія з токеном
  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setHasValidSession(!!session);
      setCheckingSession(false);
    }

    // Невелика затримка — Supabase SDK обробляє токен з URL
    const timer = setTimeout(checkSession, 300);
    return () => clearTimeout(timer);
  }, [supabase]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Пароль має містити мінімум 6 символів');
      return;
    }

    if (password !== confirm) {
      setError('Паролі не співпадають');
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess('Пароль успішно змінено! Перенаправлення...');

    setTimeout(() => {
      router.push('/dashboard');
      router.refresh();
    }, 1500);
  }

  // Стан завантаження — перевіряємо токен
  if (checkingSession) {
    return (
      <Card>
        <h1 className={styles.heading}>Перевірка посилання...</h1>
        <p className={styles.subheading}>Зачекайте кілька секунд</p>
      </Card>
    );
  }

  // Токен невалідний або протермінований
  if (!hasValidSession) {
    return (
      <Card>
        <h1 className={styles.heading}>Посилання недійсне</h1>
        <p className={styles.subheading}>Можливо, воно протерміноване або вже використане</p>

        <div className={styles.infoBox}>
          Посилання для скидання пароля дійсне протягом 1 години з моменту відправлення. Якщо ви вже
          використали його — запросіть нове.
        </div>

        <div className={styles.backLink}>
          <Link href="/forgot-password">← Запросити нове посилання</Link>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h1 className={styles.heading}>Новий пароль</h1>
      <p className={styles.subheading}>Введіть новий пароль для вашого акаунту</p>

      <form onSubmit={handleSubmit} className={styles.fields}>
        {error && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Input
          label="Новий пароль"
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
          Змінити пароль
        </Button>
      </form>
    </Card>
  );
}
