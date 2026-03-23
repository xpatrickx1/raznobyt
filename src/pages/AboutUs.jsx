import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import SEO from '../components/SEO';

export default function AboutUs() {
    const { t, lang } = useLang();

    const values = t('about.missionValues') || [];
    const stats = t('about.stats') || [];

    return (
        <>
            <SEO
                title={t('about.title') + " - Різнобит Textile Group"}
                description={t('about.subtitle')}
            />

            {/* About Hero */}
            <section className="hero">
                <div className="hero__bg" />
                <div className="hero__pattern" />
                <div className="container">
                    <div className="hero__content fade-up fade-up-1">
                        <div className="hero__eyebrow">Різнобит Textile Group</div>
                        <h1 className="fade-up fade-up-2">{t('about.title')}</h1>
                        <p className="hero__sub">{t('about.subtitle')}</p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="section" style={{ background: 'var(--c-bg)' }}>
                <div className="container">
                    <div className="about-stats fade-up fade-up-2">
                        {Array.isArray(stats) && stats.map((stat, i) => (
                            <div key={i} className="about-stat-item">
                                <div className="about-stat-value">{stat.value}</div>
                                <div className="about-stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="section">
                <div className="container">
                    <div className="about-story-grid">
                        <div className="about-story-image fade-up fade-up-1">
                            <img
                                src="https://images.unsplash.com/photo-1558022839-a99c9dae8dc4?q=80&w=800&auto=format&fit=crop"
                                alt="Тканини на складі"
                            />
                            <div className="about-design-accent"></div>
                        </div>
                        <div className="about-story-content fade-up fade-up-2">
                            <div className="section__eyebrow">Про компанію</div>
                            <h2 className="section__title" style={{ textAlign: 'left', marginBottom: 24 }}>
                                {t('about.storyTitle')}
                            </h2>
                            <p className="about-story-text">{t('about.storyText1')}</p>
                            <br />
                            <p className="about-story-text">{t('about.storyText2')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="section" style={{ background: 'var(--c-bg-alt)' }}>
                <div className="container">
                    <div className="section__header">
                        <div className="section__eyebrow">Філософія</div>
                        <h2 className="section__title">{t('about.missionTitle')}</h2>
                    </div>
                    <div className="about-values-grid">
                        {Array.isArray(values) && values.map((val, i) => (
                            <div key={i} className="about-value-card fade-up" style={{ animationDelay: `${i * 0.15}s` }}>
                                <div className="about-value-icon">
                                    <div className="about-value-dot" />
                                </div>
                                <h3 className="about-value-title">{val.title}</h3>
                                <p className="about-value-desc">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-cta" style={{ background: 'var(--c-accent)', padding: '56px 0' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,38px)', color: '#fff', marginBottom: 12 }}>{t('about.ctaTitle')}</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 28, fontSize: 15 }}>{t('about.ctaText')}</p>
                    <Link to="/contacts" className="btn btn-primary" style={{ marginTop: 32 }}>
                        {t('about.ctaButton')}
                    </Link>
                </div>
            </section>
        </>
    );
}
