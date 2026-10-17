'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, type, ...props }, ref) => {
    const inputId = id ?? props.name;
    const [showPassword, setShowPassword] = useState(false);

    // Якщо type="password" — показуємо кнопку toggle
    const isPassword = type === 'password';
    const actualType = isPassword && showPassword ? 'text' : type;

    const classes = [
      styles.input,
      error ? styles.hasError : '',
      isPassword ? styles.hasToggle : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.inputContainer}>
          <input ref={ref} id={inputId} type={actualType} className={classes} {...props} />
          {isPassword && (
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Сховати пароль' : 'Показати пароль'}
              tabIndex={-1}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          )}
        </div>
        {error && <span className={styles.error}>{error}</span>}
        {!error && hint && <span className={styles.hint}>{hint}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
