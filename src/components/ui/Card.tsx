import { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}

export function Card({ children, className, padded = true }: CardProps) {
  const classes = [styles.card, padded ? styles.padded : '', className ?? '']
    .filter(Boolean)
    .join(' ');
  return <div className={classes}>{children}</div>;
}

interface CardHeaderProps {
  title: string;
  description?: string;
}

export function CardHeader({ title, description }: CardHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.title}>{title}</div>
      {description && <div className={styles.description}>{description}</div>}
    </div>
  );
}
