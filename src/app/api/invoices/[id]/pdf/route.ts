import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { InvoicePDF } from '@/lib/pdf/InvoicePDF';
import { registerFonts } from '@/lib/pdf/fonts';
import type { InvoiceItem } from '@/types/invoice';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // 1. Отримуємо ID
  const { id } = await params;

  // 2. Авторизація
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 3. Отримуємо рахунок
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (invoiceError || !invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  // 4. Отримуємо профіль
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  // 5. Отримуємо клієнта
  let client = {
    name: 'Клієнт',
    email: null as string | null,
    address: null as string | null,
    tax_id: null as string | null,
  };

  if (invoice.client_id) {
    const { data: clientData } = await supabase
      .from('clients')
      .select('*')
      .eq('id', invoice.client_id)
      .single();

    if (clientData) {
      client = {
        name: clientData.name,
        email: clientData.email,
        address: clientData.address,
        tax_id: clientData.tax_id,
      };
    }
  }

  // 6. Реєструємо шрифти (один раз)
  registerFonts();

  // 7. Рендеримо PDF
  try {
    const pdfElement = React.createElement(InvoicePDF, {
      profile,
      client,
      invoice: {
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        invoice_date: invoice.invoice_date,
        due_date: invoice.due_date,
        items: (invoice.items as InvoiceItem[]) ?? [],
        total: Number(invoice.total),
        notes: invoice.notes,
        vat_enabled: invoice.vat_enabled ?? false,
        vat_amount: Number(invoice.vat_amount ?? 0),
      },
    });

    // @react-pdf/renderer має неточні типи — примусово приводимо
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stream = await renderToStream(pdfElement as any);

    // 8. Перетворюємо ReadableStream у Buffer
    const chunks: Buffer[] = [];
    for await (const chunk of stream as AsyncIterable<Buffer | Uint8Array>) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

    // 9. Віддаємо PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="invoice-${invoice.invoice_number}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
  }
}
