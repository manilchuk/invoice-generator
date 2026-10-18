import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { Card, CardHeader } from '@/components/ui/Card';
import { getMetrics } from './actions';
import styles from './metrics.module.css';

export const instant = false;

const STATUS_LABELS: Record<string, string> = {
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
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default async function MetricsPage() {
  await connection();

  const result = await getMetrics();

  // Якщо не адмін — редірект на dashboard
  if (!result.success || !result.data) {
    redirect('/dashboard');
  }

  const { stats, activeUsers, recentInvoices, invoicesByStatus } = result.data;

  // Знаходимо статистику по кожному статусу
  const statusMap = new Map(invoicesByStatus.map((s) => [s.status, s]));

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Метрики застосунку</h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Тільки для адміністратора</p>
      </div>

      {/* === КАРТОЧКИ КОРИСТУВАЧІВ === */}
      <div className={styles.cardsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Всього користувачів</div>
          <div className={styles.statValue}>{stats.total_users}</div>
          <div className={styles.statSub}>
            +{stats.users_last_7d} за тиждень · +{stats.users_last_30d} за місяць
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>Активні користувачі</div>
          <div className={`${styles.statValue} ${styles.statValueSuccess}`}>{activeUsers}</div>
          <div className={styles.statSub}>створили 2+ рахунки</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>Всього рахунків</div>
          <div className={styles.statValue}>{stats.total_invoices}</div>
          <div className={styles.statSub}>
            +{stats.invoices_last_7d} за тиждень · +{stats.invoices_last_30d} за місяць
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>Сума рахунків</div>
          <div className={`${styles.statValue} ${styles.statValuePrimary}`}>
            {formatMoney(stats.total_invoices_sum)} ₴
          </div>
          <div className={styles.statSub}>
            +{formatMoney(stats.invoices_sum_last_7d)} ₴ за тиждень
          </div>
        </div>
      </div>

      {/* === РОЗПОДІЛ ЗА СТАТУСОМ === */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Рахунки за статусом</div>
        <div className={styles.statusGrid}>
          {(['draft', 'sent', 'paid'] as const).map((status) => {
            const stat = statusMap.get(status);
            return (
              <div
                key={status}
                className={`${styles.statusCard} ${styles[`statusCard${status.charAt(0).toUpperCase() + status.slice(1)}` as keyof typeof styles]}`}
              >
                <div className={styles.statusName}>{STATUS_LABELS[status]}</div>
                <div className={styles.statusCount}>{stat?.count ?? 0}</div>
                <div className={styles.statusSum}>на {formatMoney(stat?.total_sum ?? 0)} ₴</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* === ОСТАННІ РАХУНКИ === */}
      <Card padded={false}>
        <CardHeader title="Останні 10 рахунків" description="Найновіші рахунки у системі" />
        {recentInvoices.length === 0 ? (
          <div className={styles.empty}>Поки немає рахунків</div>
        ) : (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <div>Номер</div>
              <div>Сума</div>
              <div>Статус</div>
              <div>Дата</div>
            </div>
            {recentInvoices.map((inv) => (
              <div key={inv.id} className={styles.tableRow}>
                <div>№ {inv.invoice_number}</div>
                <div className={styles.tableRowAmount}>{formatMoney(inv.total)} ₴</div>
                <div>
                  <span
                    className={`${styles.badge} ${styles[`badge_${inv.status}` as keyof typeof styles]}`}
                  >
                    {STATUS_LABELS[inv.status]}
                  </span>
                </div>
                <div className={styles.tableRowDate}>{formatDate(inv.created_at)}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
