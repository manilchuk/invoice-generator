import { ReactNode } from 'react';
import styles from './Alert.module.css';

interface AlertProps {
  variant: 'error' | 'success';
  children: ReactNode;
}

export function Alert({ variant, children }: AlertProps) {
  return <div className={`${styles.alert} ${styles[variant]}`}>{children}</div>;
}
