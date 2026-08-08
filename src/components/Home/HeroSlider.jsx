import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../i18n/LangContext';

import slide1 from '../../assets/images/slider/slide1.png';
import slide2 from '../../assets/images/slider/slide2.png';
import slide3 from '../../assets/images/slider/slide3.png';

const slides = [
    { id: 1, image: slide1, align: 'left' },
    { id: 2, image: slide2, align: 'right' },
    { id: 3, image: slide3, align: 'left' }
];

export default function HeroSlider({ onPriceClick }) {
    const { lang, t } = useLang();
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="hero-slider">
            {slides.map((slide, index) => {
                const isActive = index === currentSlide;

                return (
                    <div key={slide.id} className={`hero-slide ${isActive ? 'active' : ''}`}>
                        <div className="hero-slide__bg" style={{ backgroundImage: `url(${slide.image})` }} />
                        <div className="hero-slide__overlay" />
                        <div className="container" style={{ height: '100%' }}>
                            <div className={`hero-slide__content align-${slide.align} ${isActive ? 'fade-in-active' : ''}`}>
                                <div className="hero__eyebrow">Голландські текстильні традиції</div>
                                <h1 dangerouslySetInnerHTML={{ __html: t(`hero.title${slide.id}`) }} />
                                <p className="hero__sub">{t(`hero.subtitle${slide.id}`)}</p>
                                <div className="hero__btns">
                                    <Link to="/catalog" className="btn btn-primary">
                                        {lang === 'ua' ? 'Переглянути тканини' : 'Посмотреть ткани'}
                                    </Link>
                                    <button onClick={onPriceClick} className="btn btn-outline">
                                        {lang === 'ua' ? 'Отримати прайс' : 'Получить прайс'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            <div className="hero-slider__dots">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`hero-slider__dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
