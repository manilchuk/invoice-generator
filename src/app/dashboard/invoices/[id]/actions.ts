'use server';

import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { InvoiceItem } from '@/types/invoice';

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function updateInvoiceStatus(
  invoiceId: string,
  status: 'draft' | 'sent' | 'paid'
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Не авторизовано' };

    const { error } = await supabase
      .from('invoices')
      .update({ status })
      .eq('id', invoiceId)
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/dashboard/invoices/${invoiceId}`);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('updateInvoiceStatus error:', err);
    return { success: false, error: 'Несподівана помилка' };
  }
}

export async function deleteInvoice(invoiceId: string): Promise<ActionResult> {
  noStore();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Не авторизовано' };

  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', invoiceId)
    .eq('user_id', user.id);

  if (error) {
    console.error('deleteInvoice error:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard', 'layout');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/invoices');
  return { success: true };
}

interface UpdateInvoiceInput {
  invoiceId: string;
  clientMode: 'existing' | 'new';
  clientId: string;
  newClient: {
    name: string;
    email: string;
    address: string;
    tax_id: string;
  } | null;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string | null;
  items: InvoiceItem[];
  total: number;
  notes: string | null;
  vat_enabled: boolean;
  vat_amount: number;
}

export async function updateInvoice(
  input: UpdateInvoiceInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Не авторизовано' };

    // === 1. Перевіряємо, що рахунок існує і належить користувачу ===
    const { data: existing, error: fetchError } = await supabase
      .from('invoices')
      .select('id, client_id')
      .eq('id', input.invoiceId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existing) {
      return { success: false, error: 'Рахунок не знайдено' };
    }

    // === 2. Визначаємо client_id ===
    let clientId: string | null = existing.client_id;

    if (input.clientMode === 'existing') {
      if (!input.clientId) {
        return { success: false, error: 'Клієнта не вибрано' };
      }
      clientId = input.clientId;
    } else if (input.clientMode === 'new' && input.newClient) {
      // Створюємо нового клієнта
      const { data: newClient, error: clientError } = await supabase
        .from('clients')
        .insert({
          user_id: user.id,
          name: input.newClient.name,
          email: input.newClient.email || null,
          address: input.newClient.address || null,
          tax_id: input.newClient.tax_id || null,
        })
        .select('id')
        .single();

      if (clientError || !newClient) {
        return {
          success: false,
          error: `Не вдалося створити клієнта: ${clientError?.message ?? 'unknown'}`,
        };
      }

      clientId = newClient.id;
    }

    // === 3. Оновлюємо рахунок ===
    const { error: updateError } = await supabase
      .from('invoices')
      .update({
        client_id: clientId,
        invoice_number: input.invoiceNumber,
        invoice_date: input.invoiceDate,
        due_date: input.dueDate,
        items: input.items,
        total: input.total,
        vat_enabled: input.vat_enabled,
        vat_amount: input.vat_amount,
        notes: input.notes,
      })
      .eq('id', input.invoiceId)
      .eq('user_id', user.id);

    if (updateError) {
      return {
        success: false,
        error: `Не вдалося оновити рахунок: ${updateError.message}`,
      };
    }

    revalidatePath(`/dashboard/invoices/${input.invoiceId}`);
    revalidatePath('/dashboard');

    return { success: true };
  } catch (err) {
    console.error('updateInvoice error:', err);
    return {
      success: false,
      error: 'Несподівана помилка. Спробуйте ще раз.',
    };
  }
}
