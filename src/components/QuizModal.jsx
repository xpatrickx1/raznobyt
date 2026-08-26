import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLang } from '../i18n/LangContext';
import './QuizModal.css';

const STEPS = {
    INTRO: 0,
    PURPOSE: 1,
    VOLUME: 2,
    DEADLINE: 3,
    CONTACTS: 4,
    SUCCESS: 5,
};

const PURPOSE_OPTIONS = [
    { id: 'workwear', ua: 'Робочий / корпоративний одяг', ru: 'Рабочая / корпоративная одежда' },
    { id: 'medical', ua: 'Медичний одяг', ru: 'Медицинская одежда' },
    { id: 'protective', ua: 'Захисний / спецзахист (FR, antistatic)', ru: 'Защитная / спецзащита (FR, antistatic)' },
    { id: 'shirts', ua: 'Сорочки / блузи', ru: 'Рубашки / блузы' },
    { id: 'other', ua: 'Інше', ru: 'Другое' },
];

const DEADLINE_OPTIONS = [
    { id: 'asap', ua: 'Якнайшвидше', ru: 'Как можно скорее' },
    { id: 'week', ua: 'Протягом тижня', ru: 'В течение недели' },
    { id: 'month', ua: 'Протягом місяця', ru: 'В течение месяца' },
    { id: 'plan', ua: 'Планую наперед', ru: 'Планирую заранее' },
];

export default function QuizModal({ isOpen, onClose }) {
    const { lang } = useLang();
    const [step, setStep] = useState(STEPS.INTRO);
    const [form, setForm] = useState({
        purpose: '',
        volume: '',
        deadline: '',
        name: '',
        phone: '',
        consent: false,
    });
    const [sending, setSending] = useState(false);
    const modalRef = useRef(null);

    // Reset при відкритті
    useEffect(() => {
        if (isOpen) {
            setStep(STEPS.INTRO);
            setForm({
                purpose: '',
                volume: '',
                deadline: '',
                name: '',
                phone: '',
                consent: false,
            });
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Escape
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const t = (ua, ru) => (lang === 'ua' ? ua : ru);

    const setField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const goNext = () => setStep((s) => s + 1);
    const goBack = () => setStep((s) => Math.max(STEPS.INTRO, s - 1));

    const canSubmit =
        form.name.trim().length > 1 &&
        form.phone.trim().length >= 10 &&
        form.consent;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit || sending) return;

        setSending(true);
        try {
            // TODO: відправка на бекенд / telegram / formspree
            // await fetch('/api/quiz', { method: 'POST', body: JSON.stringify(form) });
            console.log('Quiz data:', form);
            await new Promise((r) => setTimeout(r, 600));
            setStep(STEPS.SUCCESS);
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return createPortal(
        <div className="quiz-overlay" onClick={handleOverlayClick}>
            <div className="quiz-modal" role="dialog" aria-modal="true">
                <button
                    type="button"
                    className="quiz-modal__close"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ✕
                </button>

                {/* ===== INTRO ===== */}
                {step === STEPS.INTRO && (
                    <div className="quiz-screen quiz-screen--intro">
                        <h2 className="quiz-title">
                            {t(
                                'Підберемо тканину під ваше виробництво за 1 хвилину',
                                'Подберём ткань под ваше производство за 1 минуту'
                            )}
                        </h2>
                        <p className="quiz-subtitle">
                            {t(
                                'Дізнайтеся наявність, орієнтовну ціну та терміни відгрузки — без зобовʼязань',
                                'Узнайте наличие, ориентировочную цену и сроки отгрузки — без обязательств'
                            )}
                        </p>

                        <ul className="quiz-benefits">
                            <li>
                                ✅ {t('Склад у Києві, відгрузка 1–3 дні', 'Склад в Киеве, отгрузка 1–3 дня')}
                            </li>
                            <li>
                                💰 {t('Гуртові ціни без посередників', 'Оптовые цены без посредников')}
                            </li>
                            <li>
                                👍 {t('Голландські тканини Ten Cate / Tootal', 'Голландские ткани Ten Cate / Tootal')}
                            </li>
                            <li>
                                🎁 {t(
                                    'Персональна пропозиція після кількох питань',
                                    'Персональное предложение после нескольких вопросов'
                                )}
                            </li>
                        </ul>

                        <button type="button" className="quiz-btn quiz-btn--primary" onClick={goNext}>
                            {t('Дізнатися пропозицію', 'Узнать предложение')}
                        </button>
                    </div>
                )}

                {/* ===== PURPOSE ===== */}
                {/* ===== PURPOSE ===== */}
                {step === STEPS.PURPOSE && (
                    <div className="quiz-screen">
                        <div className="quiz-progress">
                            <div className="quiz-progress__bar" style={{ width: '25%' }} />
                        </div>

                        <h3 className="quiz-question">
                            {t('Що ви плануєте шити?', 'Что вы планируете шить?')}
                        </h3>

                        <div className="quiz-options">
                            {PURPOSE_OPTIONS.map((opt) => (
                                <label
                                    key={opt.id}
                                    className={`quiz-option ${form.purpose === opt.id ? 'quiz-option--active' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="purpose"
                                        value={opt.id}
                                        checked={form.purpose === opt.id}
                                        onChange={() => setField('purpose', opt.id)}
                                    />
                                    <span>{lang === 'ua' ? opt.ua : opt.ru}</span>
                                </label>
                            ))}
                        </div>

                        <div className="quiz-nav">
                            <button type="button" className="quiz-btn quiz-btn--ghost" onClick={goBack}>
                                ← {t('Назад', 'Назад')}
                            </button>
                            <button
                                type="button"
                                className="quiz-btn quiz-btn--primary"
                                onClick={goNext}
                                disabled={!form.purpose}
                            >
                                {t('Далі', 'Далее')} →
                            </button>
                        </div>
                    </div>
                )}

                {/* ===== VOLUME ===== */}
                {step === STEPS.VOLUME && (
                    <div className="quiz-screen">
                        <div className="quiz-progress">
                            <div className="quiz-progress__bar" style={{ width: '50%' }} />
                        </div>

                        <h3 className="quiz-question">
                            {t('Який орієнтовний обʼєм?', 'Какой ориентировочный объём?')}
                        </h3>
                        <p className="quiz-hint">
                            {t('Напр. 200 м.п. або 500 виробів', 'Напр. 200 п.м. или 500 изделий')}
                        </p>

                        <input
                            type="text"
                            className="quiz-input"
                            placeholder={t('200 м.п.', '200 п.м.')}
                            value={form.volume}
                            onChange={(e) => setField('volume', e.target.value)}
                            autoFocus
                        />

                        <div className="quiz-nav">
                            <button type="button" className="quiz-btn quiz-btn--ghost" onClick={goBack}>
                                ← {t('Назад', 'Назад')}
                            </button>
                            <button
                                type="button"
                                className="quiz-btn quiz-btn--primary"
                                onClick={goNext}
                                disabled={!form.volume.trim()}
                            >
                                {t('Далі', 'Далее')} →
                            </button>
                        </div>
                    </div>
                )}

                {/* ===== DEADLINE ===== */}
                {step === STEPS.DEADLINE && (
                    <div className="quiz-screen">
                        <div className="quiz-progress">
                            <div className="quiz-progress__bar" style={{ width: '75%' }} />
                        </div>

                        <h3 className="quiz-question">
                            {t('Коли потрібна тканина?', 'Когда нужна ткань?')}
                        </h3>

                        <div className="quiz-options">
                            {DEADLINE_OPTIONS.map((opt) => (
                                <label
                                    key={opt.id}
                                    className={`quiz-option ${form.deadline === opt.id ? 'quiz-option--active' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="deadline"
                                        value={opt.id}
                                        checked={form.deadline === opt.id}
                                        onChange={() => setField('deadline', opt.id)}
                                    />
                                    <span>{lang === 'ua' ? opt.ua : opt.ru}</span>
                                </label>
                            ))}
                        </div>

                        <div className="quiz-nav">
                            <button type="button" className="quiz-btn quiz-btn--ghost" onClick={goBack}>
                                ← {t('Назад', 'Назад')}
                            </button>
                            <button
                                type="button"
                                className="quiz-btn quiz-btn--primary"
                                onClick={goNext}
                                disabled={!form.deadline}
                            >
                                {t('Далі', 'Далее')} →
                            </button>
                        </div>
                    </div>
                )}

                {/* ===== CONTACTS ===== */}
                {step === STEPS.CONTACTS && (
                    <form className="quiz-screen" onSubmit={handleSubmit}>
                        <div className="quiz-progress">
                            <div className="quiz-progress__bar" style={{ width: '100%' }} />
                        </div>

                        <h3 className="quiz-question">
                            {t('Куди надіслати пропозицію?', 'Куда отправить предложение?')}
                        </h3>

                        <div className="quiz-fields">
                            <input
                                type="text"
                                className="quiz-input"
                                placeholder={t('Ваше імʼя', 'Ваше имя')}
                                value={form.name}
                                onChange={(e) => setField('name', e.target.value)}
                                required
                            />
                            <input
                                type="tel"
                                className="quiz-input"
                                placeholder={t('Номер телефону', 'Номер телефона')}
                                value={form.phone}
                                onChange={(e) => setField('phone', e.target.value)}
                                required
                            />

                            <label className="quiz-consent">
                                <input
                                    type="checkbox"
                                    checked={form.consent}
                                    onChange={(e) => setField('consent', e.target.checked)}
                                />
                                <span>
                                    {t(
                                        'Я погоджуюсь з обробкою персональних даних',
                                        'Я соглашаюсь с обработкой персональных данных'
                                    )}
                                    .{' '}
                                    <a href="/privacy" target="_blank" rel="noopener noreferrer">
                                        Privacy Policy
                                    </a>
                                </span>
                            </label>
                        </div>

                        <div className="quiz-nav">
                            <button type="button" className="quiz-btn quiz-btn--ghost" onClick={goBack}>
                                ← {t('Назад', 'Назад')}
                            </button>
                            <button
                                type="submit"
                                className="quiz-btn quiz-btn--primary"
                                disabled={!canSubmit || sending}
                            >
                                {sending
                                    ? t('Надсилаємо…', 'Отправляем…')
                                    : t('Отримати пропозицію', 'Получить предложение')}
                            </button>
                        </div>
                    </form>
                )}

                {/* ===== SUCCESS ===== */}
                {step === STEPS.SUCCESS && (
                    <div className="quiz-screen quiz-screen--success">
                        <div className="quiz-success-icon">✓</div>
                        <h2 className="quiz-title">{t('Дякуємо!', 'Спасибо!')}</h2>
                        <p className="quiz-subtitle">
                            {t(
                                'Менеджер звʼяжеться з вами протягом робочого дня з наявності та пропозицією.',
                                'Менеджер свяжется с вами в течение рабочего дня с наличием и предложением.'
                            )}
                        </p>
                        <button type="button" className="quiz-btn quiz-btn--primary" onClick={onClose}>
                            {t('Закрити', 'Закрыть')}
                        </button>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}