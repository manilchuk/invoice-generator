'use client';

import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import type { ClientOption } from '@/types/invoice';
import styles from '@/app/dashboard/new/new.module.css';

interface ClientSelectorProps {
  clients: ClientOption[];
  mode: 'existing' | 'new';
  onModeChange: (mode: 'existing' | 'new') => void;
  selectedClientId: string;
  onClientSelect: (id: string) => void;
  newClient: {
    name: string;
    email: string;
    address: string;
    tax_id: string;
  };
  onNewClientChange: (field: keyof ClientSelectorProps['newClient'], value: string) => void;
}

export function ClientSelector({
  clients,
  mode,
  onModeChange,
  selectedClientId,
  onClientSelect,
  newClient,
  onNewClientChange,
}: ClientSelectorProps) {
  return (
    <div>
      {/* === TABS === */}
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${mode === 'existing' ? styles.active : ''}`}
          onClick={() => onModeChange('existing')}
        >
          Існуючий клієнт
        </button>
        <button
          type="button"
          className={`${styles.tab} ${mode === 'new' ? styles.active : ''}`}
          onClick={() => onModeChange('new')}
        >
          Новий клієнт
        </button>
      </div>

      {/* === EXISTING CLIENT === */}
      {mode === 'existing' && (
        <>
          {clients.length === 0 ? (
            <div className={styles.emptyState}>
              Ще немає клієнтів. Створіть першого на вкладці &laquo;Новий клієнт&raquo;.
            </div>
          ) : (
            <div>
              <label
                htmlFor="client-select"
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 6,
                }}
              >
                Виберіть клієнта
              </label>
              <select
                id="client-select"
                value={selectedClientId}
                onChange={(e) => onClientSelect(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface)',
                  fontSize: 14,
                  fontFamily: 'inherit',
                }}
              >
                <option value="">— Оберіть зі списку —</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {c.email ? ` (${c.email})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}

      {/* === NEW CLIENT === */}
      {mode === 'new' && (
        <div className={styles.newClientFields}>
          <Input
            label="Ім'я клієнта *"
            name="clientName"
            placeholder="ТОВ Ромашка або Іваненко Іван"
            value={newClient.name}
            onChange={(e) => onNewClientChange('name', e.target.value)}
            required
          />

          <div className={styles.row}>
            <Input
              label="Email"
              name="clientEmail"
              type="email"
              placeholder="client@example.com"
              value={newClient.email}
              onChange={(e) => onNewClientChange('email', e.target.value)}
            />
            <Input
              label="ІПН / ЄДРПОУ"
              name="clientTaxId"
              placeholder="1234567890"
              value={newClient.tax_id}
              onChange={(e) => onNewClientChange('tax_id', e.target.value)}
            />
          </div>

          <Textarea
            label="Адреса"
            name="clientAddress"
            placeholder="м. Київ, вул. Хрещатик, 1"
            value={newClient.address}
            onChange={(e) => onNewClientChange('address', e.target.value)}
            rows={2}
          />
        </div>
      )}
    </div>
  );
}
