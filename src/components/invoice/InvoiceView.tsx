import { Card, CardHeader } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { InvoiceActions } from './InvoiceActions';
import type { InvoiceItem } from '@/types/invoice';
import styles from '@/app/dashboard/invoices/[id]/view.module.css';

type InvoiceStatus = 'draft' | 'sent' | 'paid';

interface InvoiceViewProps {
  invoice: {
    id: string;
    invoice_number: string;
    invoice_date: string;
    due_date: string | null;
    items: InvoiceItem[];
    total: number;
    notes: string | null;
    status: InvoiceStatus;
    created_at: string;
  };
  client: {
    name: string;
    email: string | null;
    address: string | null;
    tax_id: string | null;
  } | null;
  profile: {
    company_name: string | null;
    bank_name: string | null;
    iban: string | null;
  } | null;
  justCreated?: boolean;
  justUpdated?: boolean;
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
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function InvoiceView({
  invoice,
  client,
  profile,
  justCreated = false,
  justUpdated = false,
}: InvoiceViewProps) {
  return (
    <div className={styles.layout}>
      {/* ============ SUCCESS ALERTS ============ */}
      {justCreated && <Alert variant="success">Рахунок успішно створено!</Alert>}
      {justUpdated && <Alert variant="success">Рахунок успішно оновлено!</Alert>}

      {/* ============ TOP BAR ============ */}
      <div className={styles.topBar}>
        <div className={styles.titleBlock}>
          <a href="/dashboard" className={styles.backLink}>
            ← Назад до рахунків
          </a>
          <div className={styles.title}>
            Рахунок № {invoice.invoice_number}
            <span className={`${styles.statusBadge} ${styles[`status_${invoice.status}`]}`}>
              {STATUS_LABELS[invoice.status]}
            </span>
          </div>
          <div className={styles.dateRow}>
            <div className={styles.dateItem}>
              <strong>Створено:</strong>
              <span>{formatDate(invoice.created_at)}</span>
            </div>
            {invoice.due_date && (
              <div className={styles.dateItem}>
                <strong>Сплатити до:</strong>
                <span>{formatDate(invoice.due_date)}</span>
              </div>
            )}
          </div>
        </div>

        <InvoiceActions
          invoiceId={invoice.id}
          invoiceNumber={invoice.invoice_number}
          currentStatus={invoice.status}
        />
      </div>

      {/* ============ CLIENT + PAYMENT ============ */}
      <Card padded={false}>
        <CardHeader title="Сторони" description="Клієнт та реквізити оплати" />
        <div style={{ padding: 24 }} className={styles.infoGrid}>
          {/* Клієнт */}
          <div className={styles.infoBlock}>
            <div className={styles.infoLabel}>Отримувач</div>
            {client ? (
              <>
                <div className={styles.infoValueBold}>{client.name}</div>
                {client.tax_id && <div className={styles.infoValueMuted}>ІПН: {client.tax_id}</div>}
                {client.address && <div className={styles.infoValueMuted}>{client.address}</div>}
                {client.email && <div className={styles.infoValueMuted}>{client.email}</div>}
              </>
            ) : (
              <div className={styles.infoValueMuted}>Клієнта видалено з бази</div>
            )}
          </div>

          {/* Реквізити оплати */}
          <div className={styles.infoBlock}>
            <div className={styles.infoLabel}>Реквізити оплати</div>
            {profile?.company_name && (
              <div className={styles.infoValue}>{profile.company_name}</div>
            )}
            {profile?.bank_name && (
              <div className={styles.paymentRow}>
                <span className={styles.paymentLabel}>Банк</span>
                <span className={styles.paymentValue}>{profile.bank_name}</span>
              </div>
            )}
            {profile?.iban && (
              <div className={styles.paymentRow}>
                <span className={styles.paymentLabel}>IBAN</span>
                <span className={styles.paymentValue}>{profile.iban}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* ============ ITEMS ============ */}
      <Card padded={false}>
        <CardHeader title="Послуги" />
        <div className={styles.itemsTable}>
          <div className={styles.tableHeader}>
            <div>Опис</div>
            <div className={styles.colCenter}>К-сть</div>
            <div className={styles.colRight}>Ціна</div>
            <div className={styles.colRight}>Сума</div>
          </div>

          {invoice.items.map((item, index) => (
            <div key={index} className={styles.tableRow}>
              <div>{item.description}</div>
              <div className={styles.colCenter}>
                {item.quantity}
                {item.unit ? ` ${item.unit}` : ''}
              </div>
              <div className={styles.colRight}>{formatMoney(item.price)} ₴</div>
              <div className={styles.colRight}>
                <strong>{formatMoney(item.quantity * item.price)} ₴</strong>
              </div>
            </div>
          ))}

          <div className={styles.totalBlock}>
            <span className={styles.totalLabel}>Всього до сплати:</span>
            <span className={styles.totalValue}>{formatMoney(invoice.total)} ₴</span>
          </div>
        </div>
      </Card>

      {/* ============ NOTES ============ */}
      {invoice.notes && (
        <Card padded={false}>
          <CardHeader title="Примітки" />
          <div style={{ padding: 24 }}>
            <div className={styles.notesText}>{invoice.notes}</div>
          </div>
        </Card>
      )}
    </div>
  );
}
