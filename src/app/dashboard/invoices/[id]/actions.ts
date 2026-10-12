'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

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

  revalidatePath('/dashboard');
  redirect('/dashboard');
}
