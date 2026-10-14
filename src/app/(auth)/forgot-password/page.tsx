'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import styles from '../auth.module.css';

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSuccess('Лист надіслано! Перевірте вашу пошту — там посилання для скидання пароля.');
    setLoading(false);
  }

  return (
    <Card>
      <h1 className={styles.heading}>Забули пароль?</h1>
      <p className={styles.subheading}>Введіть email — ми надішлемо посилання для скидання</p>

      {success ? (
        <>
          <div className={styles.infoBox}>{success}</div>
          <div className={styles.backLink}>
            <Link href="/login">← Повернутись до входу</Link>
          </div>
        </>
      ) : (
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

          <Button type="submit" fullWidth loading={loading}>
            Надіслати посилання
          </Button>

          <div className={styles.backLink}>
            <Link href="/login">← Повернутись до входу</Link>
          </div>
        </form>
      )}
    </Card>
  );
}
