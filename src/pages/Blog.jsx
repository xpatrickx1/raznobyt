import React, { useState, useEffect } from 'react';
import { useLang } from '../i18n/LangContext';
import SEO from '../components/SEO';
import HeroSection from '../components/HeroSection';
import { Link } from 'react-router-dom';
import postsData from '../data/posts.json';

export default function Blog() {
    const { lang, t } = useLang();
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 8;

    // Change page
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0); // Scroll to top when page changes
    };

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = postsData.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(postsData.length / postsPerPage);

    return (
        <>
            <SEO
                title={t('blog.title') || 'Блог'}
                description={t('blog.subtitle')}
                keywords="блог, новини, тканини, спецодяг"
            />

            <HeroSection
                title={t('blog.title')}
                className="category"
            // subtitle={lang === 'ua' ? 'Весь асортимент в одному місце' : 'Весь ассортимент в одном месте'}
            />

            {/* BLOG GRID SECTION */}
            <section className="section">
                <div className="container">
                    <div className="blog-grid">
                        {currentPosts.map(post => (
                            <div key={post.id} className="blog-card">
                                <div className="blog-card__img-wrap">
                                    <img src={post.image} alt={post.title[lang]} className="blog-card__img" loading="lazy" />
                                </div>
                                <div className="blog-card__body">
                                    <div className="blog-card__meta">
                                        <span className="blog-card__date">{new Date(post.date).toLocaleDateString(lang === 'ua' ? 'uk-UA' : 'ru-RU')}</span>
                                    </div>
                                    <h3 className="blog-card__title">
                                        {post.title[lang]}
                                    </h3>
                                    <p className="blog-card__excerpt">
                                        {post.excerpt[lang]}
                                    </p>
                                    {/* Uncomment when post detail page is implemented */}
                                    {/* <Link to={`/blog/${post.slug}`} className="blog-card__link">
                    {t('blog.readMore') || 'Читати далі'} →
                  </Link> */}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                &laquo;
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                <button
                                    key={number}
                                    className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
                                    onClick={() => handlePageChange(number)}
                                >
                                    {number}
                                </button>
                            ))}

                            <button
                                className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                &raquo;
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
