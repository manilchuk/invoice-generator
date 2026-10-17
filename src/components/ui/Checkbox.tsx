'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import styles from './Checkbox.module.css';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  hint?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, hint, className, id, ...props }, ref) => {
    const checkboxId = id ?? props.name;

    return (
      <div className={styles.wrapper}>
        <label htmlFor={checkboxId} className={styles.label}>
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={`${styles.checkbox} ${className ?? ''}`}
            {...props}
          />
          <span className={styles.text}>{label}</span>
        </label>
        {hint && <span className={styles.hint}>{hint}</span>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
