'use server';

import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';
import { generateInvoicePdf } from '@/lib/pdf/generateInvoicePdf';
import { buildInvoiceEmailHtml } from '@/lib/email/sendInvoiceEmailHtml';
import type { InvoiceItem, SendInvoiceEmailResult } from '@/types/invoice';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvoiceEmail(
  invoiceId: string,
  recipientEmail: string,
  customMessage?: string
): Promise<SendInvoiceEmailResult> {
  try {
    // === 1. Валідація ===
    if (!recipientEmail || !recipientEmail.includes('@')) {
      return { success: false, error: 'Некоректний email' };
    }

    if (!process.env.RESEND_API_KEY) {
      return { success: false, error: 'Resend API Key не налаштований' };
    }

    // === 2. Авторизація ===
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Не авторизовано' };

    // === 3. Отримуємо рахунок ===
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .eq('user_id', user.id)
      .single();

    if (invoiceError || !invoice) {
      return { success: false, error: 'Рахунок не знайдено' };
    }

    // === 4. Отримуємо профіль ===
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return { success: false, error: 'Профіль не знайдено' };
    }

    // === 5. Отримуємо клієнта ===
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

    // === 6. Генеруємо PDF ===
    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await generateInvoicePdf({
        profile: {
          company_name: profile.company_name,
          tax_id: profile.tax_id,
          iban: profile.iban,
          bank_name: profile.bank_name,
          address: profile.address,
          logo_url: profile.logo_url,
          email: profile.email,
          phone: profile.phone,
          manager_name: profile.manager_name,
          signature_url: profile.signature_url,
        },
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
    } catch (pdfError) {
      console.error('PDF generation failed:', pdfError);
      return { success: false, error: 'Помилка генерації PDF' };
    }

    // === 7. Формуємо HTML-лист ===
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fopdop.xyz';
    const htmlBody = buildInvoiceEmailHtml({
      invoiceNumber: invoice.invoice_number,
      invoiceDate: invoice.invoice_date,
      total: Number(invoice.total),
      clientName: client.name,
      companyName: profile.company_name ?? 'InvoiceFlow',
      customMessage,
      siteUrl,
    });

    // === 8. Відправляємо через Resend ===
    const fromName = profile.company_name ?? 'InvoiceFlow';
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'noreply@fopdop.xyz';
    const filename = `Рахунок-${invoice.invoice_number}.pdf`;

    const { error: sendError } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [recipientEmail],
      subject: `Рахунок № ${invoice.invoice_number} від ${fromName}`,
      html: htmlBody,
      attachments: [
        {
          filename,
          content: pdfBuffer.toString('base64'),
        },
      ],
    });

    if (sendError) {
      console.error('Resend error:', sendError);
      return {
        success: false,
        error: `Помилка відправки: ${sendError.message}`,
      };
    }

    // === 9. Оновлюємо статус на "sent" (якщо був draft) ===
    if (invoice.status === 'draft') {
      await supabase
        .from('invoices')
        .update({ status: 'sent' })
        .eq('id', invoice.id)
        .eq('user_id', user.id);
    }

    return { success: true };
  } catch (err) {
    console.error('sendInvoiceEmail error:', err);
    return {
      success: false,
      error: 'Несподівана помилка. Спробуйте ще раз.',
    };
  }
}
