import React from 'react';
import { useLang } from '../i18n/LangContext';

/**
 * Common Hero section for inner pages
 * @param {Object} props
 * @param {string} props.title - Main heading
 * @param {string} props.subtitle - Description text below heading
 */

import { Link } from 'react-router-dom';

export default function HeroSection({ title, subtitle, breadcrumbs }) {
    const { lang, t } = useLang();

    const breadcrumbItems = breadcrumbs || [
        { label: t('nav.home'), path: '/' },
        { label: title }
    ];

    return (
        <section className="hero">
            <div className="hero__bg" />
            <div className="hero__pattern" />
            <div className="container">
                <nav className="breadcrumbs fade-up fade-up-1">
                    {breadcrumbItems.map((item, i) => (
                        <React.Fragment key={i}>
                            {item.path ? (
                                <Link to={item.path} className="breadcrumbs__link">{item.label}</Link>
                            ) : (
                                <span className="breadcrumbs__current">{item.label}</span>
                            )}
                            {i < breadcrumbItems.length - 1 && (
                                <span className="breadcrumbs__sep"> › </span>
                            )}
                        </React.Fragment>
                    ))}
                </nav>
                <div className="hero__content fade-up fade-up-1">
                    <h1 className="">{title}</h1>
                    <p className="hero__sub">{subtitle}</p>
                </div>
            </div>
        </section>
    );
}
