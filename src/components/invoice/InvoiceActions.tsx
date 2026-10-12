'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { updateInvoiceStatus, deleteInvoice } from '@/app/dashboard/invoices/[id]/actions';
import styles from '@/app/dashboard/invoices/[id]/view.module.css';

type InvoiceStatus = 'draft' | 'sent' | 'paid';

interface InvoiceActionsProps {
  invoiceId: string;
  invoiceNumber: string;
  currentStatus: InvoiceStatus;
}

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Чернетка',
  sent: 'Надіслано',
  paid: 'Оплачено',
};

export function InvoiceActions({ invoiceId, invoiceNumber, currentStatus }: InvoiceActionsProps) {
  const [status, setStatus] = useState<InvoiceStatus>(currentStatus);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  // === ЗМІНА СТАТУСУ ===
  async function handleStatusChange(newStatus: InvoiceStatus) {
    if (newStatus === status) return;

    setUpdating(true);
    setError('');

    const result = await updateInvoiceStatus(invoiceId, newStatus);

    if (!result.success) {
      setError(result.error ?? 'Помилка оновлення');
      setUpdating(false);
      return;
    }

    setStatus(newStatus);
    setUpdating(false);
  }

  // === ВИДАЛЕННЯ ===
  async function handleDelete() {
    const confirmed = window.confirm(
      `Ви впевнені, що хочете видалити рахунок № ${invoiceNumber}? Цю дію не можна скасувати.`
    );

    if (!confirmed) return;

    setDeleting(true);
    setError('');

    const result = await deleteInvoice(invoiceId);

    // Якщо помилка — показуємо
    if (!result.success) {
      setError(result.error ?? 'Помилка видалення');
      setDeleting(false);
    }
    // Якщо успіх — redirect всередині Server Action
  }

  return (
    <div className={styles.actions}>
      {/* PDF */}
      <a href={`/api/invoices/${invoiceId}/pdf`} target="_blank" rel="noopener noreferrer">
        <Button type="button" variant="secondary">
          📄 Скачати PDF
        </Button>
      </a>

      {/* STATUS DROPDOWN */}
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value as InvoiceStatus)}
        disabled={updating}
        style={{
          padding: '10px 12px',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-surface)',
          fontSize: 14,
          fontFamily: 'inherit',
          cursor: updating ? 'not-allowed' : 'pointer',
          opacity: updating ? 0.5 : 1,
        }}
      >
        {(Object.keys(STATUS_LABELS) as InvoiceStatus[]).map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>

      {/* DELETE */}
      <Button
        type="button"
        variant="danger"
        onClick={handleDelete}
        loading={deleting}
        disabled={updating || deleting}
      >
        Видалити
      </Button>

      {/* ERROR (якщо є) */}
      {error && (
        <div
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-danger-bg)',
            color: 'var(--color-danger)',
            fontSize: 13,
            marginTop: 4,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
