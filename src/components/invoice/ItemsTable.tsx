'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { InvoiceItem } from '@/types/invoice';
import styles from '@/app/dashboard/new/new.module.css';

interface ItemsTableProps {
  items: InvoiceItem[];
  onChange: (items: InvoiceItem[]) => void;
}

export function ItemsTable({ items, onChange }: ItemsTableProps) {
  function addItem() {
    onChange([...items, { description: '', quantity: 1, price: 0, unit: 'шт' }]);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function updateItem<K extends keyof InvoiceItem>(index: number, field: K, value: InvoiceItem[K]) {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  }

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div>
      <div className={styles.itemsList}>
        {items.map((item, index) => (
          <div key={index} className={styles.itemRow}>
            <Input
              label={index === 0 ? 'Опис послуги' : ''}
              name={`description-${index}`}
              placeholder="Розробка сайту"
              value={item.description}
              onChange={(e) => updateItem(index, 'description', e.target.value)}
            />

            <Input
              label={index === 0 ? 'К-сть' : ''}
              name={`quantity-${index}`}
              type="number"
              min="0.01"
              step="0.01"
              value={item.quantity}
              onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
            />

            <Input
              label={index === 0 ? 'Ціна, ₴' : ''}
              name={`price-${index}`}
              type="number"
              min="0"
              step="0.01"
              value={item.price}
              onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
            />

            <Input
              label={index === 0 ? 'Сума, ₴' : ''}
              name={`total-${index}`}
              value={(item.quantity * item.price).toFixed(2)}
              disabled
              readOnly
            />

            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => removeItem(index)}
              disabled={items.length === 1}
              title="Видалити позицію"
              aria-label="Видалити позицію"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className={styles.addItemBtn}>
        <Button type="button" variant="secondary" size="sm" onClick={addItem}>
          + Додати позицію
        </Button>
      </div>

      <div className={styles.total}>
        <span className={styles.totalLabel}>Всього:</span>
        <span className={styles.totalValue}>{total.toFixed(2)} ₴</span>
      </div>
    </div>
  );
}
