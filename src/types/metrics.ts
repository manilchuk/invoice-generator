// ============================================
// ТИПИ ДЛЯ ДАШБОРДА МЕТРИК
// ============================================

export interface AppStats {
  total_users: number;
  total_invoices: number;
  total_invoices_sum: number;
  users_last_7d: number;
  invoices_last_7d: number;
  invoices_sum_last_7d: number;
  users_last_30d: number;
  invoices_last_30d: number;
}

export interface RecentInvoice {
  id: string;
  invoice_number: string;
  total: number;
  status: 'draft' | 'sent' | 'paid';
  created_at: string;
}

export interface InvoiceStatusStat {
  status: 'draft' | 'sent' | 'paid';
  count: number;
  total_sum: number;
}

export interface MetricsData {
  stats: AppStats;
  activeUsers: number;
  recentInvoices: RecentInvoice[];
  invoicesByStatus: InvoiceStatusStat[];
}
