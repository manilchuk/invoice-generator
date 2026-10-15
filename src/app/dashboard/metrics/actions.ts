'use server';

import { createClient } from '@/lib/supabase/server';
import type { AppStats, MetricsData, RecentInvoice, InvoiceStatusStat } from '@/types/metrics';

/**
 * Перевіряє, чи поточний користувач — адмін (власник застосунку).
 * Адмін визначається через змінну середовища ADMIN_EMAIL.
 */
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase: null, error: 'Не авторизовано' };
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || user.email !== adminEmail) {
    return { supabase: null, error: 'Доступ заборонено' };
  }

  return { supabase, error: null };
}

export async function getMetrics(): Promise<{
  success: boolean;
  data?: MetricsData;
  error?: string;
}> {
  const { supabase, error } = await requireAdmin();

  if (error || !supabase) {
    return { success: false, error: error ?? 'Доступ заборонено' };
  }

  // === 1. Загальна статистика ===
  const { data: statsData, error: statsError } = await supabase.rpc('get_app_stats');

  if (statsError) {
    console.error('get_app_stats error:', statsError);
    return { success: false, error: statsError.message };
  }

  // RPC повертає масив з одним об'єктом
  const stats: AppStats = statsData?.[0] ?? {
    total_users: 0,
    total_invoices: 0,
    total_invoices_sum: 0,
    users_last_7d: 0,
    invoices_last_7d: 0,
    invoices_sum_last_7d: 0,
    users_last_30d: 0,
    invoices_last_30d: 0,
  };

  // === 2. Активні користувачі ===
  const { data: activeData, error: activeError } = await supabase.rpc('get_active_users');

  if (activeError) {
    console.error('get_active_users error:', activeError);
  }

  const activeUsers = (activeData as number | null) ?? 0;

  // === 3. Останні 10 рахунків ===
  const { data: recentData, error: recentError } = await supabase.rpc('get_recent_invoices');

  if (recentError) {
    console.error('get_recent_invoices error:', recentError);
  }

  const recentInvoices: RecentInvoice[] = ((recentData as RecentInvoice[]) ?? []).map((inv) => ({
    ...inv,
    total: Number(inv.total),
  }));

  // === 4. Розподіл за статусом ===
  const { data: statusData, error: statusError } = await supabase.rpc('get_invoices_by_status');

  if (statusError) {
    console.error('get_invoices_by_status error:', statusError);
  }

  const invoicesByStatus: InvoiceStatusStat[] = ((statusData as InvoiceStatusStat[]) ?? []).map(
    (stat) => ({
      ...stat,
      count: Number(stat.count),
      total_sum: Number(stat.total_sum),
    })
  );

  return {
    success: true,
    data: {
      stats,
      activeUsers,
      recentInvoices,
      invoicesByStatus,
    },
  };
}
