'use client';

import { useState, FormEvent, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { ClientSelector } from './ClientSelector';
import { ItemsTable } from './ItemsTable';
import { saveInvoice } from '@/app/dashboard/new/actions';
import { updateInvoice } from '@/app/dashboard/invoices/[id]/actions';
import type { ClientOption, InvoiceFormState, InvoiceItem } from '@/types/invoice';
import styles from '@/app/dashboard/new/new.module.css';

// ============================================
// ХЕЛПЕРИ
// ============================================

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function buildInvoiceNumber(year: number, month: number, sequence: number): string {
  const y = year;
  const m = String(month).padStart(2, '0');
  const s = String(sequence).padStart(4, '0');
  return `${y}-${m}-${s}`;
}

// ============================================
// PROPS
// ============================================

interface InitialData {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
  notes: string;
  clientId: string | null;
  clientName: string | null;
  clientEmail: string | null;
  clientAddress: string | null;
  clientTaxId: string | null;
}

interface InvoiceFormProps {
  clients: ClientOption[];
  mode?: 'create' | 'edit';
  initialData?: InitialData;
  nextSequence?: number;
  currentYear?: number;
  currentMonth?: number;
}

// ============================================
// КОМПОНЕНТ
// ============================================

export function InvoiceForm({
  clients,
  mode = 'create',
  initialData,
  nextSequence,
  currentYear,
  currentMonth,
}: InvoiceFormProps) {
  const router = useRouter();
  const isEdit = mode === 'edit';

  // === ПОЧАТКОВИЙ СТАН ФОРМИ ===
  const [clientMode, setClientMode] = useState<'existing' | 'new'>(
    isEdit ? (initialData?.clientId ? 'existing' : 'new') : clients.length > 0 ? 'existing' : 'new'
  );

  const [form, setForm] = useState<InvoiceFormState>(() => {
    if (isEdit && initialData) {
      return {
        clientId: initialData.clientId ?? '',
        clientName: initialData.clientName ?? '',
        clientEmail: initialData.clientEmail ?? '',
        clientAddress: initialData.clientAddress ?? '',
        clientTaxId: initialData.clientTaxId ?? '',
        invoiceNumber: initialData.invoiceNumber,
        invoiceDate: initialData.invoiceDate,
        dueDate: initialData.dueDate,
        items:
          initialData.items.length > 0
            ? initialData.items
            : [{ description: '', quantity: 1, price: 0, unit: 'шт' }],
        notes: initialData.notes,
      };
    }

    return {
      clientId: '',
      clientName: '',
      clientEmail: '',
      clientAddress: '',
      clientTaxId: '',
      invoiceNumber: buildInvoiceNumber(
        currentYear ?? new Date().getFullYear(),
        currentMonth ?? new Date().getMonth() + 1,
        nextSequence ?? 1
      ),
      invoiceDate: todayISO(),
      dueDate: '',
      items: [{ description: '', quantity: 1, price: 0, unit: 'шт' }],
      notes: '',
    };
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // === ХЕЛПЕРИ ДЛЯ ОНОВЛЕННЯ ===
  function updateForm<K extends keyof InvoiceFormState>(field: K, value: InvoiceFormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateNewClient(field: 'name' | 'email' | 'address' | 'tax_id', value: string) {
    const fieldMap = {
      name: 'clientName',
      email: 'clientEmail',
      address: 'clientAddress',
      tax_id: 'clientTaxId',
    } as const;
    updateForm(fieldMap[field], value);
  }

  // === ВАЛІДАЦІЯ ===
  const validation = useMemo(() => {
    const errors: string[] = [];

    if (clientMode === 'existing' && !form.clientId) {
      errors.push('Виберіть клієнта');
    }
    if (clientMode === 'new' && !form.clientName.trim()) {
      errors.push('Введіть ім\u0027я клієнта');
    }
    if (!form.invoiceNumber.trim()) {
      errors.push('Введіть номер рахунку');
    }
    if (!form.invoiceDate) {
      errors.push('Виберіть дату');
    }

    const hasEmptyItems = form.items.some((item) => !item.description.trim() || item.price <= 0);
    if (hasEmptyItems) {
      errors.push('Заповніть усі позиції (опис та ціна > 0)');
    }

    return errors;
  }, [form, clientMode]);

  const total = form.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const canSubmit = validation.length === 0 && !saving;

  // === SUBMIT ===
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (validation.length > 0) {
      setError(validation[0]);
      return;
    }

    setSaving(true);

    // === РЕЖИМ РЕДАГУВАННЯ ===
    if (isEdit && initialData) {
      const result = await updateInvoice({
        invoiceId: initialData.id,
        clientMode,
        clientId: form.clientId,
        newClient:
          clientMode === 'new'
            ? {
                name: form.clientName,
                email: form.clientEmail,
                address: form.clientAddress,
                tax_id: form.clientTaxId,
              }
            : null,
        invoiceNumber: form.invoiceNumber,
        invoiceDate: form.invoiceDate,
        dueDate: form.dueDate || null,
        items: form.items,
        total,
        notes: form.notes || null,
      });

      if (!result.success) {
        setError(result.error ?? 'Помилка оновлення');
        setSaving(false);
        return;
      }

      setSaving(false);
      setTimeout(() => {
        router.push(`/dashboard/invoices/${initialData.id}?updated=1`);
        router.refresh();
      }, 400);
      return;
    }

    // === РЕЖИМ СТВОРЕННЯ ===
    const result = await saveInvoice({
      clientMode,
      clientId: form.clientId,
      newClient:
        clientMode === 'new'
          ? {
              name: form.clientName,
              email: form.clientEmail,
              address: form.clientAddress,
              tax_id: form.clientTaxId,
            }
          : null,
      invoiceNumber: form.invoiceNumber,
      invoiceDate: form.invoiceDate,
      dueDate: form.dueDate || null,
      items: form.items,
      total,
      notes: form.notes || null,
    });

    if (!result.success) {
      setError(result.error ?? 'Помилка збереження');
      setSaving(false);
      return;
    }

    setSaving(false);
    router.push(`/dashboard/invoices/${result.invoiceId}?created=1`);
    return;
  }

  // ============================================
  // JSX
  // ============================================
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* ============ КЛІЄНТ ============ */}
      <Card padded={false}>
        <CardHeader title="Клієнт" description="Кому виставляємо рахунок" />
        <div style={{ padding: 24 }}>
          <ClientSelector
            clients={clients}
            mode={clientMode}
            onModeChange={setClientMode}
            selectedClientId={form.clientId}
            onClientSelect={(id) => updateForm('clientId', id)}
            newClient={{
              name: form.clientName,
              email: form.clientEmail,
              address: form.clientAddress,
              tax_id: form.clientTaxId,
            }}
            onNewClientChange={updateNewClient}
          />
        </div>
      </Card>

      {/* ============ ДАНІ РАХУНКУ ============ */}
      <Card padded={false}>
        <CardHeader
          title="Рахунок"
          description={isEdit ? 'Редагування рахунку' : 'Номер та дати'}
        />
        <div style={{ padding: 24 }} className={styles.form}>
          <div className={styles.row3}>
            <Input
              label="Номер рахунку *"
              name="invoiceNumber"
              placeholder="2026-10-0001"
              value={form.invoiceNumber}
              onChange={(e) => updateForm('invoiceNumber', e.target.value)}
              required
            />
            <Input
              label="Дата рахунку *"
              name="invoiceDate"
              type="date"
              value={form.invoiceDate}
              onChange={(e) => updateForm('invoiceDate', e.target.value)}
              required
            />
            <Input
              label="Сплатити до"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={(e) => updateForm('dueDate', e.target.value)}
              hint="Необов'язково"
            />
          </div>
        </div>
      </Card>

      {/* ============ ПОСЛУГИ ============ */}
      <Card padded={false}>
        <CardHeader title="Послуги" description="Додайте позиції рахунку" />
        <div style={{ padding: 24 }}>
          <ItemsTable items={form.items} onChange={(items) => updateForm('items', items)} />
        </div>
      </Card>

      {/* ============ ПРИМІТКИ ============ */}
      <Card padded={false}>
        <CardHeader title="Примітки" description="Додаткова інформація для клієнта" />
        <div style={{ padding: 24 }}>
          <Textarea
            label=""
            name="notes"
            placeholder="Наприклад: оплата протягом 5 робочих днів"
            value={form.notes}
            onChange={(e) => updateForm('notes', e.target.value)}
            rows={3}
          />
        </div>
      </Card>

      {/* ============ ДІЇ ============ */}
      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={() => router.back()} disabled={saving}>
          Скасувати
        </Button>
        <div className={styles.actionsRight}>
          <Button type="submit" loading={saving} disabled={!canSubmit}>
            {isEdit ? 'Зберегти зміни' : 'Створити рахунок'} · {total.toFixed(2)} ₴
          </Button>
        </div>
      </div>
    </form>
  );
}
