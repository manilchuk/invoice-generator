'use client';

import { useState, useEffect, type SyntheticEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Alert } from '@/components/ui/Alert';
import { sendInvoiceEmail } from '@/app/dashboard/invoices/[id]/send-email-action';
import styles from './SendInvoiceModal.module.css';

interface SendInvoiceModalProps {
  invoiceId: string;
  invoiceNumber: string;
  defaultEmail?: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function SendInvoiceModal({
  invoiceId,
  invoiceNumber,
  defaultEmail,
  onClose,
  onSuccess,
}: SendInvoiceModalProps) {
  const [email, setEmail] = useState(defaultEmail ?? '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  // Блокуємо скрол сторінки + закриття по Esc
  useEffect(() => {
    // 1. Блокуємо скрол body
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 2. Обробник Esc
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape' && !sending) {
        onClose();
      }
    }

    document.addEventListener('keydown', handleEsc);

    // Очищення при закритті модалки
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose, sending]);

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Введіть коректний email');
      return;
    }

    setSending(true);

    const result = await sendInvoiceEmail(invoiceId, email, message.trim() || undefined);

    if (!result.success) {
      setError(result.error ?? 'Помилка відправки');
      setSending(false);
      return;
    }

    onSuccess();
    onClose();
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Надіслати рахунок</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Закрити">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.body}>
          {error && <Alert variant="error">{error}</Alert>}

          <p className={styles.description}>
            Рахунок № <strong>{invoiceNumber}</strong> буде надіслано з PDF-вкладенням.
          </p>

          <Input
            label="Email отримувача *"
            type="email"
            name="email"
            placeholder="client@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />

          <Textarea
            label="Персональне повідомлення (опціонально)"
            name="message"
            placeholder="Наприклад: Дякую за співпрацю! Якщо є запитання — пишіть."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            maxLength={500}
            hint={`${message.length}/500 символів`}
          />

          <div className={styles.actions}>
            <Button type="button" variant="secondary" onClick={onClose} disabled={sending}>
              Скасувати
            </Button>
            <Button type="submit" loading={sending}>
              📧 Надіслати
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
