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

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError('Невірний email або пароль');
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <Card>
      <h1 className={styles.heading}>Вхід</h1>
      <p className={styles.subheading}>Увійдіть, щоб керувати рахунками</p>

      <form onSubmit={handleSubmit} className={styles.fields}>
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <Input
          label="Пароль"
          type="password"
          name="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <Button type="submit" fullWidth loading={loading}>
          Увійти
        </Button>
      </form>

      <div className={styles.footer}>
        Немає акаунту? <Link href="/register">Зареєструватись</Link>
      </div>
    </Card>
  );
}
