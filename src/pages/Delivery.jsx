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
              <p className="about-story-text delivery-text">{t('delivery.text1')}</p>
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
    </>
  );
}
