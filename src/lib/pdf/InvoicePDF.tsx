import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import type { InvoicePDFProps } from '@/types/invoice';

// ============================================
// СТИЛІ
// ============================================
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 10,
    padding: 40,
    color: '#111827',
    lineHeight: 1.4,
  },

  // === HEADER ===
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    flexDirection: 'column',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  logo: {
    width: 70,
    height: 70,
    objectFit: 'contain',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#111827',
  },
  companyDetail: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 2,
  },

  // === INVOICE TITLE ===
  invoiceTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 2,
  },
  invoiceDate: {
    fontSize: 9,
    color: '#6b7280',
  },

  // === INFO BLOCK (client + details) ===
  infoBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    gap: 20,
  },
  infoColumn: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 8,
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 10,
    color: '#111827',
    marginBottom: 2,
  },
  infoValueBold: {
    fontSize: 10,
    color: '#111827',
    fontWeight: 'bold',
    marginBottom: 2,
  },

  // === TABLE ===
  table: {
    marginTop: 10,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tableCell: {
    fontSize: 10,
    color: '#111827',
  },

  colDescription: { flex: 5 },
  colQuantity: { flex: 1, textAlign: 'center' },
  colPrice: { flex: 2, textAlign: 'right' },
  colTotal: { flex: 2, textAlign: 'right' },

  // === TOTAL ===
  totalBlock: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6b7280',
    marginRight: 20,
    paddingTop: 8,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
    paddingTop: 6,
    minWidth: 120,
    textAlign: 'right',
  },

  // === NOTES ===
  notesBlock: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  notesLabel: {
    fontSize: 8,
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  notesText: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.5,
  },

  // === FOOTER ===
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#9ca3af',
    textAlign: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
});

// ============================================
// ХЕЛПЕРИ
// ============================================
function formatMoney(amount: number): string {
  return new Intl.NumberFormat('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

// ============================================
// КОМПОНЕНТ
// ============================================
export function InvoicePDF({ profile, client, invoice }: InvoicePDFProps) {
  return (
    <Document
      title={`Рахунок ${invoice.invoice_number}`}
      author={profile.company_name ?? 'InvoiceFlow'}
      creator="InvoiceFlow"
    >
      <Page size="A4" style={styles.page}>
        {/* ============ HEADER ============ */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {profile.logo_url && <Image src={profile.logo_url} style={styles.logo} />}
            <Text style={styles.companyName}>{profile.company_name ?? 'Без назви'}</Text>
            {profile.tax_id && (
              <Text style={styles.companyDetail}>ІПН/ЄДРПОУ: {profile.tax_id}</Text>
            )}
            {profile.address && <Text style={styles.companyDetail}>{profile.address}</Text>}
            {profile.email && <Text style={styles.companyDetail}>{profile.email}</Text>}
          </View>

          <View style={styles.headerRight}>
            <Text style={styles.invoiceTitle}>РАХУНОК</Text>
            <Text style={styles.invoiceNumber}>№ {invoice.invoice_number}</Text>
            <Text style={styles.invoiceDate}>від {formatDate(invoice.invoice_date)}</Text>
          </View>
        </View>

        {/* ============ INFO BLOCK ============ */}
        <View style={styles.infoBlock}>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Отримувач</Text>
            <Text style={styles.infoValueBold}>{client.name}</Text>
            {client.tax_id && <Text style={styles.infoValue}>ІПН: {client.tax_id}</Text>}
            {client.address && <Text style={styles.infoValue}>{client.address}</Text>}
            {client.email && <Text style={styles.infoValue}>{client.email}</Text>}
          </View>

          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Реквізити оплати</Text>
            {profile.bank_name && <Text style={styles.infoValue}>Банк: {profile.bank_name}</Text>}
            {profile.iban && <Text style={styles.infoValue}>IBAN: {profile.iban}</Text>}
            {invoice.due_date && (
              <Text style={styles.infoValueBold}>Сплатити до: {formatDate(invoice.due_date)}</Text>
            )}
          </View>
        </View>

        {/* ============ TABLE ============ */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colDescription]}>Опис послуги</Text>
            <Text style={[styles.tableHeaderCell, styles.colQuantity]}>К-сть</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>Ціна</Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>Сума</Text>
          </View>

          {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colDescription]}>{item.description}</Text>
              <Text style={[styles.tableCell, styles.colQuantity]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.colPrice]}>{formatMoney(item.price)} ₴</Text>
              <Text style={[styles.tableCell, styles.colTotal]}>
                {formatMoney(item.quantity * item.price)} ₴
              </Text>
            </View>
          ))}
        </View>

        {/* ============ TOTAL ============ */}
        <View style={styles.totalBlock}>
          <Text style={styles.totalLabel}>ВСЬОГО ДО СПЛАТИ:</Text>
          <Text style={styles.totalValue}>{formatMoney(invoice.total)} ₴</Text>
        </View>

        {/* ============ NOTES ============ */}
        {invoice.notes && (
          <View style={styles.notesBlock}>
            <Text style={styles.notesLabel}>Примітки</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* ============ FOOTER ============ */}
        <Text style={styles.footer} fixed>
          Рахунок № {invoice.invoice_number} від {formatDate(invoice.invoice_date)} • Створено в
          InvoiceFlow
        </Text>
      </Page>
    </Document>
  );
}
