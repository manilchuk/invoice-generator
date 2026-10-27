import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from './landing.module.css';

export default function HomePage() {
  return (
    <div className={styles.landing}>
      {/* ============ HEADER ============ */}
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            Invoice<span>Flow</span>
          </Link>
          <nav className={styles.nav}>
            <Link href="/login" className={styles.navLink}>
              Увійти
            </Link>
            <Link href="/register">
              <Button size="sm">Спробувати безкоштовно</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>🇺🇦 Для українських ФОП та фрілансерів</div>
            <h1 className={styles.heroTitle}>
              Генератор рахунків-фактур <br />
              <span className={styles.heroTitleAccent}>за 30 секунд</span>
            </h1>
            <p className={styles.heroDescription}>
              Створюйте професійні PDF-рахунки з ПДВ, сумою прописом та підписом. Збережіть
              реквізити один раз — і забудьте про Word та Excel.
            </p>
            <div className={styles.heroActions}>
              <Link href="/register">
                <Button size="lg">Створити перший рахунок</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="secondary">
                  Увійти
                </Button>
              </Link>
            </div>
            <p className={styles.heroNote}>Безкоштовно • Без реєстрації картки</p>
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Все, що потрібно для рахунків</h2>
          <p className={styles.sectionDescription}>
            Замість того, щоб щоразу копіювати реквізити в Word — зробіть це один раз у нас
          </p>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚡</div>
              <h3 className={styles.featureTitle}>PDF за 30 секунд</h3>
              <p className={styles.featureText}>
                Заповніть дані, додайте позиції — і скачайте готовий PDF. Без Word, Excel та
                Photoshop.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💰</div>
              <h3 className={styles.featureTitle}>ПДВ та сума прописом</h3>
              <p className={styles.featureText}>
                Автоматичний розрахунок ПДВ 20%. Сума прописом українською — як вимагає стандарт.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>✍️</div>
              <h3 className={styles.featureTitle}>Підпис та логотип</h3>
              <p className={styles.featureText}>
                Завантажте свій логотип і підпис — і кожен рахунок виглядатиме професійно.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📧</div>
              <h3 className={styles.featureTitle}>Email-розсилка</h3>
              <p className={styles.featureText}>
                Надішліть рахунок клієнту одним кліком. PDF автоматично прикріпиться до листа.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>👥</div>
              <h3 className={styles.featureTitle}>Клієнти та історія</h3>
              <p className={styles.featureText}>
                Зберігайте клієнтів — для повторних рахунків. Уся історія під рукою.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔒</div>
              <h3 className={styles.featureTitle}>Безпека</h3>
              <p className={styles.featureText}>
                Дані зберігаються в захищеному хмарному сховищі. Тільки ви бачите свої рахунки.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Як це працює</h2>
          <p className={styles.sectionDescription}>Три прості кроки — і рахунок готовий</p>

          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Заповніть реквізити</h3>
              <p className={styles.stepText}>
                Один раз введіть назву ФОП, ІПН, IBAN, банк. Додайте логотип і підпис.
              </p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Додайте клієнта та послуги</h3>
              <p className={styles.stepText}>
                Введіть дані клієнта та список послуг. Сума розрахується автоматично.
              </p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Скачайте PDF або надішліть</h3>
              <p className={styles.stepText}>
                Готовий рахунок-фактура — у PDF. Або надішліть клієнту на email одним кліком.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Готові спробувати?</h2>
          <p className={styles.ctaDescription}>
            Створіть свій перший рахунок за 30 секунд. Безкоштовно, без картки.
          </p>
          <Link href="/register">
            <Button size="lg">Спробувати безкоштовно</Button>
          </Link>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div>
              <Link href="/" className={styles.logo}>
                Invoice<span>Flow</span>
              </Link>
              <p className={styles.footerText}>
                Генератор рахунків для українських ФОП та фрілансерів
              </p>
            </div>
            <div className={styles.footerLinks}>
              <Link href="/login">Увійти</Link>
              <Link href="/register">Реєстрація</Link>
            </div>
          </div>
          <div className={styles.footerBottom}>
            © 2026 InvoiceFlow • <a href="https://fopdop.xyz">fopdop.xyz</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
