'use server';

import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SupportMessageInput {
  subject: string;
  message: string;
}

interface SupportMessageResult {
  success: boolean;
  error?: string;
}

export async function sendSupportMessage(
  input: SupportMessageInput
): Promise<SupportMessageResult> {
  try {
    // === 1. Валідація ===
    if (!input.subject || input.subject.trim().length < 3) {
      return { success: false, error: 'Тема має містити мінімум 3 символи' };
    }

    if (!input.message || input.message.trim().length < 10) {
      return { success: false, error: 'Повідомлення має містити мінімум 10 символів' };
    }

    if (!process.env.RESEND_API_KEY) {
      return { success: false, error: 'Resend API Key не налаштований' };
    }

    // === 2. Авторизація ===
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Не авторизовано' };
    }

    // === 3. Отримуємо профіль (для контексту) ===
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_name, email')
      .eq('id', user.id)
      .single();

    // === 4. Формуємо лист ===
    const adminEmail = process.env.ADMIN_EMAIL ?? 'manilchuk.v@gmail.com';
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'noreply@fopdop.xyz';
    const userEmail = user.email ?? 'невідомо';
    const userName = profile?.company_name ?? 'Користувач';

    const htmlBody = `
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <title>Повідомлення від користувача</title>
</head>
<body style="margin: 0; padding: 0; background: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #111827;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 560px; background: #ffffff; border-radius: 12px; overflow: hidden;">
          
          <!-- HEADER -->
          <tr>
            <td style="padding: 24px 32px; background: #2563eb; color: #ffffff;">
              <div style="font-size: 18px; font-weight: 700;">📬 Нове повідомлення від користувача</div>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding: 32px;">
              <div style="font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Від</div>
              <div style="font-size: 15px; font-weight: 600; margin-bottom: 16px;">${escapeHtml(userName)}</div>

              <div style="font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Email</div>
              <div style="font-size: 15px; margin-bottom: 16px;">
                <a href="mailto:${escapeHtml(userEmail)}" style="color: #2563eb;">${escapeHtml(userEmail)}</a>
              </div>

              <div style="font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Тема</div>
              <div style="font-size: 15px; font-weight: 600; margin-bottom: 24px;">${escapeHtml(input.subject)}</div>

              <div style="font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Повідомлення</div>
              <div style="font-size: 15px; padding: 16px; background: #f9fafb; border-radius: 8px; border-left: 3px solid #2563eb; white-space: pre-wrap;">${escapeHtml(input.message)}</div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding: 16px 32px; background: #f9fafb; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center;">
              Повідомлення надіслано через InvoiceFlow • ${new Date().toLocaleString('uk-UA')}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    // === 5. Відправляємо ===
    const { error: sendError } = await resend.emails.send({
      from: `InvoiceFlow <${fromEmail}>`,
      to: [adminEmail],
      replyTo: userEmail,
      subject: `[Support] ${input.subject}`,
      html: htmlBody,
    });

    if (sendError) {
      console.error('Resend error:', sendError);
      return {
        success: false,
        error: `Помилка відправки: ${sendError.message}`,
      };
    }

    return { success: true };
  } catch (err) {
    console.error('sendSupportMessage error:', err);
    return {
      success: false,
      error: 'Несподівана помилка. Спробуйте ще раз.',
    };
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
