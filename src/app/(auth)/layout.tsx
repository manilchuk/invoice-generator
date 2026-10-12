import { ReactNode } from 'react';
import styles from './auth.module.css';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.logo}>
          Invoice<span>Flow</span>
        </div>
        {children}
      </div>
    </div>
  );
}
