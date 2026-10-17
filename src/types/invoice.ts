export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  unit?: string;
}

export interface InvoiceProfile {
  company_name: string | null;
  tax_id: string | null;
  iban: string | null;
  bank_name: string | null;
  address: string | null;
  logo_url: string | null;
  email: string | null;
  phone: string | null;
  manager_name: string | null;
  signature_url: string | null;
}

export interface InvoiceClient {
  name: string;
  email?: string | null;
  address?: string | null;
  tax_id?: string | null;
}

export interface InvoiceData {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string | null;
  items: InvoiceItem[];
  total: number;
  notes: string | null;
  vat_enabled: boolean;
  vat_amount: number;
}

export interface InvoicePDFProps {
  profile: InvoiceProfile;
  client: InvoiceClient;
  invoice: InvoiceData;
}

// ============================================
// ТИПИ ДЛЯ ФОРМИ СТВОРЕННЯ РАХУНКУ
// ============================================

export interface ClientOption {
  id: string;
  name: string;
  email: string | null;
  address: string | null;
  tax_id: string | null;
}

export interface InvoiceFormState {
  clientId: string; // ID існуючого клієнта (або 'new')
  clientName: string; // Ім'я клієнта (для нового або відображення)
  clientEmail: string;
  clientAddress: string;
  clientTaxId: string;
  invoiceNumber: string;
  invoiceDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD або порожній
  items: InvoiceItem[];
  notes: string;
  vatEnabled: boolean;
}

export interface SaveInvoiceResult {
  success: boolean;
  invoiceId?: string;
  error?: string;
}

// ============================================
// ТИПИ ДЛЯ АВТОРИЗАЦІЇ
// ============================================

export interface ForgotPasswordFormState {
  email: string;
}

export interface ResetPasswordFormState {
  password: string;
  confirm: string;
}

// ============================================
// ТИПИ ДЛЯ EMAIL-РОЗСИЛКИ
// ============================================

export interface SendInvoiceEmailInput {
  invoiceId: string;
  recipientEmail: string;
  recipientName: string;
  customMessage?: string;
}

export interface SendInvoiceEmailResult {
  success: boolean;
  error?: string;
}
