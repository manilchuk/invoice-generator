import styles from './SupportButton.module.css';

interface SupportButtonProps {
  variant?: 'default' | 'compact';
}

export function SupportButton({ variant = 'default' }: SupportButtonProps) {
  const supportUrl = process.env.NEXT_PUBLIC_SUPPORT_URL;

  // Якщо змінна не налаштована — не показуємо кнопку
  if (!supportUrl) return null;

  return (
    <a
      href={supportUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.button} ${variant === 'compact' ? styles.compact : ''}`}
      title="Підтримати розробку InvoiceFlow"
    >
      <span className={styles.icon}>☕</span>
      <span className={styles.label}>
        {variant === 'compact' ? 'Підтримати' : 'Підтримати розробку'}
      </span>
    </a>
  );
}
