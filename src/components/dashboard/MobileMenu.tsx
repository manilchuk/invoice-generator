'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  userEmail: string;
  isAdmin: boolean;
  children: React.ReactNode;
}

export function MobileMenu({ userEmail, isAdmin, children }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Блокуємо скрол при відкритому меню
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Кнопка-бургер */}
      <button
        type="button"
        className={styles.burger}
        onClick={() => setIsOpen(true)}
        aria-label="Відкрити меню"
      >
        <svg width="24" height="24" fill="currentColor" aria-hidden="true">
          <use href="/sprite.svg#icon-menu" />
        </svg>
      </button>

      {/* Мобільне меню */}
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <span className={styles.logo}>
                Invoice<span>Flow</span>
              </span>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsOpen(false)}
                aria-label="Закрити меню"
              >
                ×
              </button>
            </div>

            <nav className={styles.nav}>
              <Link href="/dashboard" className={styles.navLink} onClick={() => setIsOpen(false)}>
                Рахунки
              </Link>
              <Link
                href="/dashboard/settings"
                className={styles.navLink}
                onClick={() => setIsOpen(false)}
              >
                Реквізити
              </Link>
              {isAdmin && (
                <Link
                  href="/dashboard/metrics"
                  className={styles.navLink}
                  onClick={() => setIsOpen(false)}
                >
                  Метрики
                </Link>
              )}
            </nav>

            <div className={styles.bottom}>
              <div className={styles.email}>{userEmail}</div>
              <div className={styles.actions}>{children}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
