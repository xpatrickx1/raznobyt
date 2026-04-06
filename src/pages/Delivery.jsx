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
            <div className="about-story-image fade-up fade-up-1">
              <Image
                src={dostavka}
                alt="Тканини на складі"
              />
              <div className="about-design-accent"></div>
            </div>
            <div className="about-story-content fade-up fade-up-2">
              {/* <div className="section__eyebrow">{t('delivery.title')}</div> */}
              {/* <h2 className="section__title" style={{ textAlign: 'left', marginBottom: 24 }}>
                {t('about.storyTitle')}
              </h2> */}
              <p className="about-story-text"><p className="delivery-text">{t('delivery.text1')}</p></p>
              <br />
              <div className="delivery-companies">
                <div className="companies-box">
                  {t('delivery.companies')}
                </div>
              </div>
              <div className="delivery-warning">
                <div className="warning-body">
                  <h4 className="warning-title">{t('delivery.warningTitle')}</h4>
                  <p className="warning-text">{t('delivery.warningText')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container section-sm">
        <div className="content-narrow">
          <div className="delivery-content">





          </div>
        </div>
      </div>

      <style jsx>{`
        .content-narrow {
          max-width: 800px;
          margin: 0 auto;
        }
        .delivery-content {
          font-size: 17px;
          line-height: 1.7;
          color: var(--c-text);
        }
        .delivery-text {
          margin-bottom: 24px;
        }
        .companies-box {
          background: var(--c-surface);
          border: 1px solid transparent;
          border-radius: var(--radius-none);
          padding: 25px;
          box-shadow: var(--shadow-lg);
          font-weight: 600;
          color: var(--c-accent);
          margin-bottom: 40px;
          text-align: center;
        }
        .delivery-warning {
          display: flex;
          gap: 20px;
          background: var(--c-surface);
          border: 1px solid transparent;
          border-radius: var(--radius-none);
          padding: 25px;
          box-shadow: var(--shadow-lg);
        }
        .warning-icon {
          font-size: 24px;
        }
        .warning-title {
          color: var(--c-accent);
          margin-bottom: 8px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .warning-text {
          font-size: 15px;
          color: var(--c-text-muted);
          margin: 0;
        }
        @media (max-width: 600px) {
          .delivery-warning {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </>
  );
}
