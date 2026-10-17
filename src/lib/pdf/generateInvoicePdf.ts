import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import { InvoicePDF } from './InvoicePDF';
import { registerFonts } from './fonts';
import type { InvoiceProfile, InvoiceClient, InvoiceData } from '@/types/invoice';

interface GeneratePdfInput {
  profile: InvoiceProfile;
  client: InvoiceClient;
  invoice: InvoiceData;
}

export async function generateInvoicePdf(input: GeneratePdfInput): Promise<Buffer> {
  registerFonts();

  const pdfElement = React.createElement(InvoicePDF, {
    profile: input.profile,
    client: input.client,
    invoice: input.invoice,
  });

  // @react-pdf/renderer має неточні типи — примусово приводимо
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stream = await renderToStream(pdfElement as any);

  const chunks: Buffer[] = [];
  for await (const chunk of stream as AsyncIterable<Buffer | Uint8Array>) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}
