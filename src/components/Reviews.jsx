import { useLang } from '../i18n/LangContext';
import { useState } from 'react';
import './Reviews.css';

const REVIEWS = [
    {
        id: 1,
        name: 'Andrii Ivanov',
        rating: 5,
        text: 'Покупал ткани для пошива спецодежды. Отличный, крепкий материал. Подсказали ателье. Обслужили быстро. Ещё и кофе угощали. Спасибо, ребята',
        date: '6 років тому',
    },
    {
        id: 2,
        name: 'Людмила Демихова',
        rating: 5,
        text: 'Большой выбор высококачественных тканей голландского производства для сорочку, блуз и спецодежда. Приветливый, внимательно персонал',
        date: '5 років тому',
    },
    {
        id: 4,
        name: 'Елена К',
        rating: 5,
        text: 'С этой компанией мы сотрудничаем более 20лет,с их первых шагов на рынке Украины.С каждым годом ассортимент предлагаемых товаров растет.Менеджеры изучают спрос и пожелания заказчиков,предлагают различные варианты тканей и по плотности,и по …',
        date: '5 років тому',
    },
    {
        id: 5,
        name: 'Ольга Красовська',
        rating: 5,
        text: 'Большой выбор ткани для пошива спецодежды. Прекрасное обслуживание.',
        date: '7 років тому',
    },
    {
        id: 6,
        name: 'Lena Gluzd',
        rating: 5,
        text: 'Хороший выбор тканей 👍🏼',
        date: '7 років тому',
    },
    {
        id: 7,
        name: 'Sharp Fs8010',
        rating: 5,
        text: 'Хорошее качество ткани.',
        date: '7 років тому',
    },
    {
        id: 8,
        name: 'Леся Дудченко',
        rating: 5,
        text: 'Хорошая компания, проверенное качество, менеджеры умнички',
        date: '6 років тому',
    },
];

function Stars({ count = 5 }) {
    return (
        <div className="review-card__stars" aria-label={`${count} з 5`}>
            {[1, 2, 3, 4, 5].map((i) => (
                <svg
                    key={i}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={i <= count ? '#b08a4e' : 'none'}
                    stroke={i <= count ? '#b08a4e' : '#d4cfc4'}
                    strokeWidth="1.5"
                >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ))}
        </div>
    );
}

export default function Reviews() {
    const { lang, t } = useLang();
    const [showAll, setShowAll] = useState(false);

    const visibleReviews = showAll ? REVIEWS : REVIEWS.slice(0, 4);

    return (
        <section className="reviews-section section">
            <div className="container">
                <div className="reviews-section__header">
                    <div className="section__eyebrow">
                        {lang === 'ua' ? 'Відгуки клієнтів' : 'Отзывы клиентов'}
                    </div>
                    <h2 className="section__title">
                        {lang === 'ua' ? 'Нам довіряють виробники' : 'Нам доверяют производители'}
                    </h2>

                    {/* Rating badge */}
                    <a
                        href="https://www.google.com/maps/place/%D0%A0%D0%90%D0%97%D0%9D%D0%9E%D0%91%D0%AB%D0%A2%D0%9F%D0%A0%D0%9E%D0%94%D0%A3%D0%9A%D0%A2+%D0%A7%D0%90%D0%9E/@50.5056769,30.4761775,17z/data=!4m6!3m5!1s0x40d4d276bf5c4f11:0x9df43d63d8bc3a6b!8m2!3d50.5056769!4d30.4761775!16s%2Fg%2F11xtxg9vl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="reviews-rating-badge"
                    >
                        <span className="reviews-rating-badge__score">4.7</span>
                        <div className="reviews-rating-badge__stars">
                            <Stars count={5} />
                        </div>
                        <span className="reviews-rating-badge__label">
                            {lang === 'ua' ? 'на Google Maps' : 'на Google Maps'}
                        </span>
                    </a>
                </div>

                <div className="reviews-grid">
                    {visibleReviews.map((review) => (
                        <article key={review.id} className="review-card">
                            <div className="review-card__top">
                                <div className="review-card__avatar">
                                    {(review.name).charAt(0)}
                                </div>
                                <div className="review-card__meta">
                                    <div className="review-card__name">
                                        {review.name}
                                    </div>
                                    <div className="review-card__role">
                                        {review.role}
                                    </div>
                                </div>
                                <Stars count={review.rating} />
                            </div>

                            <p className="review-card__text">
                                {review.text}
                            </p>

                            <div className="review-card__footer">
                                <span className="review-card__date">{review.date}</span>
                                <span className="review-card__source">Google</span>
                            </div>
                        </article>
                    ))}
                </div>

                {!showAll && REVIEWS.length > 4 && (
                    <div className="reviews-section__cta">
                        <button
                            type="button"
                            className="btn btn--outline reviews-load-more"
                            onClick={() => setShowAll(true)}
                        >
                            {lang === 'ua' ? 'Завантажити ще' : 'Загрузить ещё'}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}