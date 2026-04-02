import React from 'react';

/**
 * Common Hero section for inner pages
 * @param {Object} props
 * @param {string} props.title - Main heading
 * @param {string} props.subtitle - Description text below heading
 */

import { Link } from 'react-router-dom';

export default function HeroSection({ title, subtitle }) {
    return (
        <section className="hero">
            <div className="hero__bg" />
            <div className="hero__pattern" />
            <div className="container">
                <nav className="breadcrumbs fade-up fade-up-1">
                    <Link to="/catalog" className="breadcrumbs__link">{title}</Link>
                    <span className="breadcrumbs__sep"> {'>'} </span>
                    <span className="breadcrumbs__current">{title}</span>
                </nav>
                <div className="hero__content fade-up fade-up-1">
                    <h1 className="">{title}</h1>
                    <p className="hero__sub">{subtitle}</p>
                </div>
            </div>
        </section>
    );
}
