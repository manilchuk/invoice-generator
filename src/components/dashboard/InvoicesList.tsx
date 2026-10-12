import Link from 'next/link';
import type { InvoiceItem } from '@/types/invoice';
import styles from './InvoicesList.module.css';

type InvoiceStatus = 'draft' | 'sent' | 'paid';

interface InvoiceListItem {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string | null;
  total: number;
  status: InvoiceStatus;
  items: InvoiceItem[] | null;
  client: { name: string } | null;
}

interface InvoicesListProps {
  invoices: InvoiceListItem[];
}

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Чернетка',
  sent: 'Надіслано',
  paid: 'Оплачено',
};

function formatMoney(amount: number): string {
  return new Intl.NumberFormat('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function InvoicesList({ invoices }: InvoicesListProps) {
  return (
    <div className={styles.table}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>Номер</div>
        <div>Дата</div>
        <div>Клієнт</div>
        <div className={styles.colRight}>Сума</div>
        <div className={styles.colCenter}>Статус</div>
        <div></div>
      </div>

      {/* ROWS */}
      {invoices.map((inv) => (
        <Link key={inv.id} href={`/dashboard/invoices/${inv.id}`} className={styles.row}>
          <div className={styles.number}>№ {inv.invoice_number}</div>
          <div className={styles.date}>{formatDate(inv.invoice_date)}</div>
          <div className={styles.client}>
            {inv.client?.name ?? <span className={styles.muted}>— клієнта видалено —</span>}
          </div>
          <div className={`${styles.amount} ${styles.colRight}`}>{formatMoney(inv.total)} ₴</div>
          <div className={styles.colCenter}>
            <span className={`${styles.badge} ${styles[`badge_${inv.status}`]}`}>
              {STATUS_LABELS[inv.status]}
            </span>
          </div>
          <div className={styles.arrow}>→</div>
        </Link>
      ))}
    </div>
  );
}
