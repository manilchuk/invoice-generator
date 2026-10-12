'use client';

import { TextareaHTMLAttributes, forwardRef } from 'react';
import styles from './Textarea.module.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const textareaId = id ?? props.name;
    const classes = [styles.textarea, error ? styles.hasError : '', className ?? '']
      .filter(Boolean)
      .join(' ');

    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={textareaId} className={styles.label}>
            {label}
          </label>
        )}
        <textarea ref={ref} id={textareaId} className={classes} {...props} />
        {error && <span className={styles.error}>{error}</span>}
        {!error && hint && <span className={styles.hint}>{hint}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
