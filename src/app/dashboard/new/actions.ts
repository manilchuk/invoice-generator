'use server';

import { createClient } from '@/lib/supabase/server';
import type { InvoiceItem, SaveInvoiceResult } from '@/types/invoice';

interface SaveInvoiceInput {
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
}

export async function saveInvoice(input: SaveInvoiceInput): Promise<SaveInvoiceResult> {
  try {
    const supabase = await createClient();

    // 1. Авторизація
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Не авторизовано' };
    }

    // 2. Визначаємо client_id
    let clientId: string | null = null;

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

    // 3. Створюємо рахунок
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        user_id: user.id,
        client_id: clientId,
        invoice_number: input.invoiceNumber,
        invoice_date: input.invoiceDate,
        due_date: input.dueDate,
        items: input.items,
        total: input.total,
        notes: input.notes,
        status: 'draft',
      })
      .select('id')
      .single();

    if (invoiceError || !invoice) {
      return {
        success: false,
        error: `Не вдалося створити рахунок: ${invoiceError?.message ?? 'unknown'}`,
      };
    }

    return { success: true, invoiceId: invoice.id };
  } catch (err) {
    console.error('saveInvoice error:', err);
    return {
      success: false,
      error: 'Несподівана помилка. Спробуйте ще раз.',
    };
  }
}
