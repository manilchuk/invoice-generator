import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from './invoice-guide.module.css';

export const metadata = {
  title: 'Як створити рахунок-фактуру для ФОП у 2026 році — InvoiceFlow',
  description:
    'Покрокова інструкція, як створити рахунок-фактуру для ФОП. Безкоштовний генератор PDF з ПДВ та сумою прописом.',
};

export default function InvoiceGuidePage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          Invoice<span>Flow</span>
        </Link>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>Як створити рахунок-фактуру для ФОП у 2026 році</h1>
        <p className={styles.subtitle}>
          Покрокова інструкція та безкоштовний інструмент для створення рахунків
        </p>

        {/* Крок 1 */}
        <div className={styles.step}>
          <div className={styles.stepNumber}>1</div>
          <div>
            <h2 className={styles.stepTitle}>Заповніть реквізити ФОП</h2>
            <p className={styles.stepText}>
              Введіть назву ФОП, ІПН, IBAN та банк. Це потрібно зробити лише один раз — усі майбутні
              рахунки використовуватимуть ці дані.
            </p>
          </div>
        </div>

        {/* Крок 2 */}
        <div className={styles.step}>
          <div className={styles.stepNumber}>2</div>
          <div>
            <h2 className={styles.stepTitle}>Додайте клієнта та послуги</h2>
            <p className={styles.stepText}>
              Введіть дані клієнта (назва, ІПН) та список наданих послуг. Сума розрахується
              автоматично.
            </p>
          </div>
        </div>

        {/* Крок 3 */}
        <div className={styles.step}>
          <div className={styles.stepNumber}>3</div>
          <div>
            <h2 className={styles.stepTitle}>Скачайте PDF або надішліть клієнту</h2>
            <p className={styles.stepText}>
              Отримайте готовий рахунок-фактуру у форматі PDF. Або надішліть його клієнту на email
              прямо з сервісу.
            </p>
          </div>
        </div>

        <div className={styles.ctaBlock}>
          <p className={styles.ctaText}>
            Спробуйте створити свій перший рахунок за 30 секунд — це безкоштовно.
          </p>
          <Link href="/register">
            <Button size="lg">Створити рахунок зараз</Button>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2026 InvoiceFlow</p>
      </footer>
    </div>
  );
}
