import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import Image from './Image';
import './CategoryHighlight.css';

/**
 * items: [{
 *   id, title, titleRu?, image, slug?,
 *   features: string[] | { ua: string[], ru: string[] },
 *   link?: string
 * }]
 */
export default function CategoryHighlight({
    eyebrow,
    title,
    intro,
    items = [],
    ctaLabel,
}) {
    const { lang } = useLang();

    const t = (ua, ru) => (lang === 'ua' ? ua : ru);

    return (
        <section className="cat-highlight section">
            <div className="container">
                {(eyebrow || title || intro) && (
                    <div className="cat-highlight__header">
                        {eyebrow && <div className="section__eyebrow">{eyebrow}</div>}
                        {title && <h2 className="section__title">{title}</h2>}
                        {intro && (
                            <div className="cat-highlight__intro">
                                {Array.isArray(intro)
                                    ? intro.map((p, i) => <p key={i}>{p}</p>)
                                    : <p>{intro}</p>}
                            </div>
                        )}
                    </div>
                )}

                <div className="cat-highlight__grid">
                    {items.map((item) => {
                        const features = Array.isArray(item.features)
                            ? item.features
                            : (lang === 'ua' ? item.features?.ua : item.features?.ru) || [];

                        const itemTitle =
                            lang === 'ru' && item.titleRu ? item.titleRu : item.title;

                        const href = item.link || (item.slug ? `/catalog/${item.slug}` : '#');

                        return (
                            <article key={item.id} className="cat-card">
                                <h3 className="cat-card__title">{itemTitle}</h3>

                                <div className="cat-card__body">
                                    {item.image && (
                                        <div className="cat-card__image">
                                            <Image src={item.image} alt={itemTitle} loading="lazy" />
                                        </div>
                                    )}

                                    <ul className="cat-card__features">
                                        {features.map((f, i) => (
                                            <li key={i}>{f}</li>
                                        ))}
                                    </ul>
                                </div>

                                <Link to={href} className="cat-card__link">
                                    {ctaLabel || t('Переглянути →', 'Смотреть →')}
                                </Link>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}