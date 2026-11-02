'use client';

import { useState, useEffect, type SyntheticEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Alert } from '@/components/ui/Alert';
import { sendSupportMessage } from '@/app/dashboard/support/actions';
import styles from './SupportModal.module.css';

interface SupportModalProps {
  onClose: () => void;
}

export function SupportModal({ onClose }: SupportModalProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  // Блокуємо скрол + закриття по Esc
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape' && !sending) {
        onClose();
      }
    }

    document.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose, sending]);

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setError('');

    if (!subject.trim() || subject.trim().length < 3) {
      setError('Тема має містити мінімум 3 символи');
      return;
    }

    if (!message.trim() || message.trim().length < 10) {
      setError('Повідомлення має містити мінімум 10 символів');
      return;
    }

    setSending(true);

    const result = await sendSupportMessage({ subject, message });

    if (!result.success) {
      setError(result.error ?? 'Помилка відправки');
      setSending(false);
      return;
    }

    setSuccess(true);
    setSending(false);
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Технічна підтримка</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Закрити">
            ×
          </button>
        </div>

        {success ? (
          <div className={styles.body}>
            <Alert variant="success">
              Дякуємо! Ваше повідомлення надіслано. Ми відповімо вам на email найближчим часом.
            </Alert>
            <div className={styles.actions}>
              <Button type="button" onClick={onClose} fullWidth>
                Закрити
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.body}>
            {error && <Alert variant="error">{error}</Alert>}

            <p className={styles.description}>
              Опишіть вашу проблему, побажання або запитання. Ми відповімо на email, вказаний у
              вашому акаунті.
            </p>

            <Input
              label="Тема *"
              name="subject"
              placeholder="Наприклад: Не створюється рахунок"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              autoFocus
              maxLength={100}
            />

            <Textarea
              label="Повідомлення *"
              name="message"
              placeholder="Детально опишіть ситуацію. Якщо є скріншот — прикріпіть його у відповіді на цей лист."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              maxLength={2000}
              hint={`${message.length}/2000 символів`}
            />

            <div className={styles.actions}>
              <Button type="button" variant="secondary" onClick={onClose} disabled={sending}>
                Скасувати
              </Button>
              <Button type="submit" loading={sending}>
                Надіслати
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
