import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import SEO from '../components/SEO';
import Image from '../components/Image';
import notFound from '../assets/images/not_found.png';

export default function NotFound() {
    const { lang, t } = useLang();

    const content = {
        ua: {
            title: '404 — Сторінку не знайдено',
            subtitle: 'Упс! Здається, цю тканину ми ще не виткали або вона закінчилася в нашому рулоні.',
            backHome: 'На головну',
            toCatalog: 'В каталог'
        },
        ru: {
            title: '404 — Страница не найдена',
            subtitle: 'Упс! Кажется, эту ткань мы еще не соткали или она закончилась в нашем рулоне.',
            backHome: 'На главную',
            toCatalog: 'В каталог'
        }
    };

    const strings = content[lang] || content.ua;

    return (
        <>
            <SEO title={strings.title} />
            <div className="not-found-page">
                <div className="container">
                    <div className="not-found-content fade-up">
                        <div className="not-found-visual">
                            <Image
                                src={notFound}
                                alt="404 Illustration"
                                className="not-found-img"
                            />
                            <div className="not-found-number">404</div>
                        </div>

                        <h1 className="not-found-title">{strings.title}</h1>
                        <p className="not-found-sub">{strings.subtitle}</p>

                        <div className="not-found-actions">
                            <Link to="/" className="btn btn-accent">
                                {strings.backHome}
                            </Link>
                            <Link to="/catalog" className="btn btn btn-primary">
                                {strings.toCatalog}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .not-found-page {
          min-height: calc(100vh - var(--nav-h));
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 0;
          text-align: center;
          background: radial-gradient(circle at center, #fff 0%, var(--c-bg-alt) 100%);
        }
        .not-found-content {
          max-width: 600px;
          margin: 0 auto;
        }
        .not-found-visual {
          position: relative;
          margin-bottom: 40px;
        }
        .not-found-img {
          width: 320px;
          height: auto;
          margin: 0 auto;
          filter: drop-shadow(0 20px 40px rgba(0,0,0,0.1));
          border-radius: 20px;
        }
        .not-found-number {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: var(--font-display);
          font-size: 120px;
          font-weight: 700;
          color: var(--c-accent);
          opacity: 0.1;
          pointer-events: none;
          letter-spacing: -0.05em;
        }
        .not-found-title {
          font-size: 32px;
          margin-bottom: 16px;
          color: var(--c-text);
        }
        .not-found-sub {
          font-size: 18px;
          color: var(--c-text-muted);
          margin-bottom: 40px;
          line-height: 1.6;
        }
        .not-found-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
        }
        @media (max-width: 768px) {
          .not-found-actions {
            flex-direction: column;
          }
          .not-found-number {
            font-size: 80px;
          }
          .not-found-img {
            width: 240px;
          }
        }
      `}} />
        </>
    );
}
