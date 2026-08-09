import { useLang } from '../i18n/LangContext';
import SEO from '../components/SEO';
import Image from '../components/Image';
import HeroSection from '../components/HeroSection';
import dostavka from '../assets/images/dostavka.jpg';

export default function Delivery() {
  const { t } = useLang();

  return (
    <>
      <SEO
        title={`${t('delivery.title')} — Різнобит Textile Group`}
        description={t('delivery.subtitle')}
      />

      <HeroSection
        title={t('delivery.title')}
        subtitle={t('delivery.subtitle')}
      />

      <section className="section">
        <div className="container">
          <div className="about-story-grid">
            {/* Ліва колонка — зображення */}
            <div className="about-story-image fade-up fade-up-1">
              <Image
                src={dostavka}
                alt="Тканини на складі"
              />
              <div className="about-design-accent"></div>
            </div>

            {/* Права колонка — контент */}
            <div className="about-story-content fade-up fade-up-2">
              <p className="about-story-text delivery-text">
                {t('delivery.text1')}
              </p>

              {/* Блок перевізників */}
              <div className="delivery-card delivery-card--companies">
                <div className="delivery-card__icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" rx="2" />
                    <path d="M16 8h4l3 5v3h-7V8z" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <div className="delivery-card__body">
                  <h3 className="delivery-card__title">{t('delivery.companiesTitle') || 'Перевізники'}</h3>
                  <p className="delivery-card__text">{t('delivery.companies')}</p>
                </div>
              </div>

              {/* Попередження */}
              <div className="delivery-card delivery-card--warning">
                <div className="delivery-card__icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <div className="delivery-card__body">
                  <h3 className="delivery-card__title">{t('delivery.warningTitle')}</h3>
                  <p className="delivery-card__text">{t('delivery.warningText')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Переваги / ключові моменти */}
          <div className="delivery-features fade-up fade-up-3">
            <div className="delivery-feature">
              <div className="delivery-feature__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <h4 className="delivery-feature__title">{t('delivery.feature1Title') || 'Складські запаси'}</h4>
              <p className="delivery-feature__text">{t('delivery.feature1Text') || 'Більшість тканин завжди в наявності на складі'}</p>
            </div>

            <div className="delivery-feature">
              <div className="delivery-feature__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h4 className="delivery-feature__title">{t('delivery.feature2Title') || 'Швидка відправка'}</h4>
              <p className="delivery-feature__text">{t('delivery.feature2Text') || 'Відправляємо замовлення в найкоротші терміни'}</p>
            </div>

            <div className="delivery-feature">
              <div className="delivery-feature__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h4 className="delivery-feature__title">{t('delivery.feature3Title') || 'Надійна упаковка'}</h4>
              <p className="delivery-feature__text">{t('delivery.feature3Text') || 'Тканини надійно упаковані для безпечного транспортування'}</p>
            </div>

            <div className="delivery-feature">
              <div className="delivery-feature__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h4 className="delivery-feature__title">{t('delivery.feature4Title') || 'Доставка по Україні'}</h4>
              <p className="delivery-feature__text">{t('delivery.feature4Text') || 'Працюємо з перевіреними службами по всій країні'}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}