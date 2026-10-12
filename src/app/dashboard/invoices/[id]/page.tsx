import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InvoiceView } from '@/components/invoice/InvoiceView';
import type { InvoiceItem } from '@/types/invoice';

export const instant = false;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoicePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Авторизація
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // 2. Отримуємо рахунок (тільки свій!)
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (invoiceError || !invoice) {
    notFound();
  }

  // 3. Отримуємо клієнта (може бути null, якщо видалений)
  let client = null;
  if (invoice.client_id) {
    const { data: clientData } = await supabase
      .from('clients')
      .select('name, email, address, tax_id')
      .eq('id', invoice.client_id)
      .single();
    client = clientData;
  }

  // 4. Отримуємо профіль (реквізити)
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_name, bank_name, iban')
    .eq('id', user.id)
    .single();

  // 5. Рендеримо
  return (
    <InvoiceView
      invoice={{
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        invoice_date: invoice.invoice_date,
        due_date: invoice.due_date,
        items: (invoice.items as InvoiceItem[]) ?? [],
        total: Number(invoice.total),
        notes: invoice.notes,
        status: invoice.status as 'draft' | 'sent' | 'paid',
        created_at: invoice.created_at,
      }}
      client={client}
      profile={profile}
    />
  );
}
