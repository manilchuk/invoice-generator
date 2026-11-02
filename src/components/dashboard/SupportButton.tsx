'use client';

import { useState } from 'react';
import { SupportIcon } from '@/components/ui/icons/SupportIcon';
import { SupportModal } from './SupportModal';
import styles from './SupportButton.module.css';

export function SupportButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={styles.button}
        onClick={() => setIsOpen(true)}
        aria-label="Технічна підтримка"
        title="Технічна підтримка"
      >
        <SupportIcon size={20} />
      </button>

      {isOpen && <SupportModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
