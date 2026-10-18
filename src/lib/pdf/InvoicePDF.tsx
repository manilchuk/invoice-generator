import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import type { InvoicePDFProps } from '@/types/invoice';
import { amountToWords } from '@/lib/utils/amountToWords';

// ============================================
// СТИЛІ
// ============================================
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 10,
    padding: 40,
    color: '#111827',
  },

  // === HEADER ===
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'column',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    maxWidth: 200,
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: 'contain',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  companyDetail: {
    fontSize: 9,
    color: '#374151',
    marginBottom: 1,
  },

  // === TITLE ===
  titleBlock: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  titleDate: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  // === INFO ROW ===
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    width: 110,
  },
  infoValue: {
    fontSize: 10,
    flex: 1,
  },

  // === TABLE ===
  table: {
    marginTop: 10,
    marginBottom: 10,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#000',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 'bold',
    padding: 6,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  tableCell: {
    fontSize: 9,
    padding: 6,
    borderRightWidth: 1,
    borderColor: '#000',
  },
  tableCellCenter: {
    textAlign: 'center',
  },
  tableCellRight: {
    textAlign: 'right',
  },

  // Ширини колонок (відсотки)
  colNum: { width: '5%' },
  colName: { width: '35%' },
  colUnit: { width: '10%' },
  colQty: { width: '8%' },
  colPrice: { width: '21%' },
  colSum: { width: '21%' },

  // === TOTALS ===
  totalsBlock: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 0, // ← прибрали відступ, щоб приєднати до таблиці
    marginBottom: 20,
  },
  totalsTable: {
    width: '42%',
  },
  totalsRow: {
    flexDirection: 'row',
  },
  totalsRowLast: {
    flexDirection: 'row',
  },
  totalsLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    padding: 6,
    flex: 1,
    textAlign: 'right',
  },
  totalsValue: {
    fontSize: 9,
    padding: 6,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    width: '50%',
    textAlign: 'right',
  },

  // === AMOUNT IN WORDS ===
  amountInWordsBlock: {
    marginBottom: 20,
  },
  amountInWordsLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  amountInWords: {
    fontSize: 10,
    marginBottom: 4,
  },

  // === MANAGER CONTACTS ===
  managerBlock: {
    marginBottom: 20,
  },
  managerText: {
    fontSize: 9,
    color: '#374151',
  },

  // === SIGNATURE ===
  signatureBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // ← зміни flex-end на center
    marginTop: 20,
    paddingTop: 10,
  },
  signatureLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signatureLabel: {
    fontSize: 9,
  },
  signatureImage: {
    width: 100,
    height: 50,
    objectFit: 'contain',
  },
  signatureRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  signatureManager: {
    fontSize: 10,
  },

  // === FOOTER ===
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    fontSize: 7,
    color: '#9ca3af',
    textAlign: 'center',
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
  // Обчислення сум
  const totalWithoutVat = invoice.total - invoice.vat_amount;

  return (
    <Document
      title={`Рахунок-фактура № ${invoice.invoice_number}`}
      author={profile.company_name ?? 'InvoiceFlow'}
      creator="InvoiceFlow"
    >
      <Page size="A4" style={styles.page}>
        {/* ============ HEADER (ЛОГО + РЕКВІЗИТИ) ============ */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {profile.logo_url && <Image src={profile.logo_url} style={styles.logo} />}
            <Text style={styles.companyName}>{profile.company_name ?? 'Без назви'}</Text>
            {profile.tax_id && (
              <Text style={styles.companyDetail}>ІПН/ЄДРПОУ: {profile.tax_id}</Text>
            )}
            {profile.address && <Text style={styles.companyDetail}>{profile.address}</Text>}
            {profile.iban && <Text style={styles.companyDetail}>IBAN: {profile.iban}</Text>}
            {profile.bank_name && (
              <Text style={styles.companyDetail}>Банк: {profile.bank_name}</Text>
            )}
            {profile.email && <Text style={styles.companyDetail}>{profile.email}</Text>}
          </View>

          <View style={styles.headerRight}>
            {profile.phone && <Text style={styles.companyDetail}>тел. {profile.phone}</Text>}
          </View>
        </View>

        {/* ============ TITLE ============ */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Рахунок-фактура № {invoice.invoice_number}</Text>
          <Text style={styles.titleDate}>від {formatDate(invoice.invoice_date)}</Text>
        </View>

        {/* ============ INFO: ПЛАТНИК + СТРОК ============ */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Платник:</Text>
          <Text style={styles.infoValue}>
            {client ? client.name : '—'}
            {client?.tax_id ? ` (ІПН: ${client.tax_id})` : ''}
          </Text>
        </View>

        {invoice.due_date && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Сплатити до:</Text>
            <Text style={styles.infoValue}>{formatDate(invoice.due_date)}</Text>
          </View>
        )}

        {/* ============ TABLE ============ */}
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colNum]}>№</Text>
            <Text style={[styles.tableHeaderCell, styles.colName]}>Товар/Послуга</Text>
            <Text style={[styles.tableHeaderCell, styles.colUnit]}>Од.вим.</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>К-сть</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>Ціна без ПДВ</Text>
            <Text style={[styles.tableHeaderCell, styles.colSum]}>Сума без ПДВ</Text>
          </View>

          {/* Rows */}
          {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellCenter, styles.colNum]}>
                {index + 1}
              </Text>
              <Text style={[styles.tableCell, styles.colName]}>{item.description}</Text>
              <Text style={[styles.tableCell, styles.tableCellCenter, styles.colUnit]}>
                {item.unit || 'шт'}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellCenter, styles.colQty]}>
                {item.quantity}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellRight, styles.colPrice]}>
                {formatMoney(item.price)}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellRight, styles.colSum]}>
                {formatMoney(item.quantity * item.price)}
              </Text>
            </View>
          ))}
        </View>

        {/* ============ TOTALS ============ */}
        <View style={styles.totalsBlock}>
          <View style={styles.totalsTable}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Разом без ПДВ:</Text>
              <Text style={styles.totalsValue}>{formatMoney(totalWithoutVat)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>ПДВ 20%:</Text>
              <Text style={styles.totalsValue}>{formatMoney(invoice.vat_amount)}</Text>
            </View>
            <View style={styles.totalsRowLast}>
              <Text style={styles.totalsLabel}>Всього з ПДВ:</Text>
              <Text style={styles.totalsValue}>{formatMoney(invoice.total)}</Text>
            </View>
          </View>
        </View>

        {/* ============ AMOUNT IN WORDS ============ */}
        <View style={styles.amountInWordsBlock}>
          <Text style={styles.amountInWordsLabel}>Всього на суму:</Text>
          <Text style={styles.amountInWords}>{amountToWords(invoice.total)}</Text>

          {invoice.vat_enabled && (
            <Text style={styles.amountInWords}>ПДВ: {formatMoney(invoice.vat_amount)} грн</Text>
          )}
        </View>

        {/* ============ MANAGER CONTACTS ============ */}
        {profile.phone && (
          <View style={styles.managerBlock}>
            <Text style={styles.managerText}>Контакти менеджера: {profile.phone}</Text>
          </View>
        )}

        {/* ============ NOTES ============ */}
        {invoice.notes && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 9, color: '#374151' }}>Примітки: {invoice.notes}</Text>
          </View>
        )}

        {/* ============ SIGNATURE ============ */}
        <View style={styles.signatureBlock}>
          <View style={styles.signatureLeft}>
            <Text style={styles.signatureLabel}>Виписав(-ла)</Text>
            {profile.signature_url && (
              <Image src={profile.signature_url} style={styles.signatureImage} />
            )}
          </View>

          {profile.manager_name && (
            <View style={styles.signatureRight}>
              <Text style={styles.signatureManager}>{profile.manager_name}</Text>
            </View>
          )}
        </View>

        {/* ============ FOOTER ============ */}
        <Text style={styles.footer} fixed>
          Створено в InvoiceFlow • fopdop.xyz
        </Text>
      </Page>
    </Document>
  );
}
