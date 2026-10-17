interface InvoiceEmailData {
  invoiceNumber: string;
  invoiceDate: string;
  total: number;
  clientName: string;
  companyName: string;
  customMessage?: string;
  siteUrl: string;
}

export function buildInvoiceEmailHtml(data: InvoiceEmailData): string {
  const { invoiceNumber, invoiceDate, total, clientName, companyName, customMessage, siteUrl } =
    data;

  const formattedTotal = new Intl.NumberFormat('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(total);

  const formattedDate = new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(invoiceDate));

  return `
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Рахунок № ${invoiceNumber}</title>
</head>
<body style="margin: 0; padding: 0; background: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #111827;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 560px; background: #ffffff; border-radius: 12px; overflow: hidden;">
          
          <!-- HEADER -->
          <tr>
            <td style="padding: 32px 40px 0; text-align: center;">
              <div style="font-size: 24px; font-weight: 700; color: #111827;">
                Invoice<span style="color: #2563eb;">Flow</span>
              </div>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding: 24px 40px 32px;">
              <h1 style="font-size: 22px; font-weight: 600; margin: 0 0 16px 0; color: #111827;">
                Рахунок № ${invoiceNumber}
              </h1>

              <p style="font-size: 15px; color: #374151; margin: 0 0 16px 0;">
                Вітаємо, ${clientName}!
              </p>

              ${customMessage ? `<p style="font-size: 15px; color: #374151; margin: 0 0 16px 0; padding: 12px 16px; background: #f9fafb; border-radius: 8px; border-left: 3px solid #2563eb;">${escapeHtml(customMessage)}</p>` : ''}

              <p style="font-size: 15px; color: #374151; margin: 0 0 24px 0;">
                ${companyName} виставив вам новий рахунок. Деталі — у вкладенні до цього листа.
              </p>

              <!-- INVOICE SUMMARY -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #f9fafb; border-radius: 10px; padding: 20px; margin: 0 0 24px 0;">
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #6b7280;">Номер рахунку</td>
                  <td style="padding: 4px 0; font-size: 14px; font-weight: 600; color: #111827; text-align: right;">${invoiceNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #6b7280;">Дата</td>
                  <td style="padding: 4px 0; font-size: 14px; color: #111827; text-align: right;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 4px; font-size: 13px; color: #6b7280; border-top: 1px solid #e5e7eb;">Сума до сплати</td>
                  <td style="padding: 12px 0 4px; font-size: 20px; font-weight: 700; color: #2563eb; text-align: right; border-top: 1px solid #e5e7eb;">${formattedTotal} ₴</td>
                </tr>
              </table>

              <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px 0;">
                PDF-рахунок додано до цього листа як вкладення.
              </p>

              <p style="font-size: 14px; color: #6b7280; margin: 0;">
                Якщо у вас є запитання — просто дайте відповідь на цей лист.
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding: 24px 40px; background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0 0 4px 0;">
                Надіслано через InvoiceFlow
              </p>
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                <a href="${siteUrl}" style="color: #9ca3af; text-decoration: underline;">${siteUrl.replace(/^https?:\/\//, '')}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// Утиліта для безпечного вставлення тексту в HTML
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
