import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fopdop.xyz'),
  title: {
    default: 'InvoiceFlow — генератор рахунків для ФОП та фрілансерів',
    template: '%s | InvoiceFlow',
  },
  description:
    'Створюйте професійні PDF-рахунки за 30 секунд. Реквізити, клієнти, логотип — усе в одному місці.',
  keywords: ['рахунок', 'invoice', 'ФОП', 'фрілансер', 'PDF', 'бухгалтерія'],
  authors: [{ name: 'InvoiceFlow' }],
  creator: 'InvoiceFlow',
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: 'https://fopdop.xyz',
    siteName: 'InvoiceFlow',
    title: 'InvoiceFlow — генератор рахунків для ФОП',
    description: 'Створюйте професійні PDF-рахунки за 30 секунд.',
    images: [
      {
        url: 'https://fopdop.xyz/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'InvoiceFlow — генератор рахунків',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InvoiceFlow — генератор рахунків',
    description: 'Створюйте PDF-рахунки за 30 секунд.',
    images: ['https://fopdop.xyz/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
