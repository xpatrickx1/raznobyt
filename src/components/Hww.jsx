import { useLang } from '../i18n/LangContext';
import './Hww.css';

const STEPS = [
    {
        id: 1,
        title: { ua: 'Запит', ru: 'Запрос' },
        text: {
            ua: 'Надсилаєте артикул, метраж або опис задачі. Відповідаємо протягом робочого дня.',
            ru: 'Присылаете артикул, метраж или описание задачи. Отвечаем в течение рабочего дня.',
        },
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
    },
    {
        id: 2,
        title: { ua: 'Зразок', ru: 'Образец' },
        text: {
            ua: 'Підбираємо тканину, надсилаємо зразки або фото зі складу. Узгоджуємо склад і щільність.',
            ru: 'Подбираем ткань, отправляем образцы или фото со склада. Согласовываем состав и плотность.',
        },
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
            </svg>
        ),
    },
    {
        id: 3,
        title: { ua: 'Рахунок', ru: 'Счёт' },
        text: {
            ua: 'Виставляємо рахунок з фіксованою ціною. Працюємо з юрособами та ФОП, повний пакет документів.',
            ru: 'Выставляем счёт с фиксированной ценой. Работаем с юрлицами и ФЛП, полный пакет документов.',
        },
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
            </svg>
        ),
    },
    {
        id: 4,
        title: { ua: 'Відгрузка', ru: 'Отгрузка' },
        text: {
            ua: 'Формуємо замовлення на складі в Києві та відправляємо за 1–3 дні зручним перевізником.',
            ru: 'Формируем заказ на складе в Киеве и отправляем за 1–3 дня удобным перевозчиком.',
        },
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <path d="M16 8h4l3 5v3h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
        ),
    },
];

export default function HowWeWork() {
    const { lang } = useLang();

    return (
        <section className="how-section section">
            <div className="container">
                <div className="how-section__header">
                    <div className="section__eyebrow">
                        {lang === 'ua' ? 'Процес' : 'Процесс'}
                    </div>
                    <h2 className="section__title">
                        {lang === 'ua' ? 'Як ми працюємо' : 'Как мы работаем'}
                    </h2>
                    <p className="how-section__subtitle">
                        {lang === 'ua'
                            ? 'Простий і прозорий шлях від запиту до відгрузки'
                            : 'Простой и прозрачный путь от запроса до отгрузки'}
                    </p>
                </div>

                <div className="how-steps">
                    {STEPS.map((step, index) => (
                        <div key={step.id} className="how-step">
                            <div className="how-step__icon-wrap">
                                <div className="how-step__icon">{step.icon}</div>
                                <span className="how-step__number">{step.id}</span>
                            </div>

                            <h3 className="how-step__title">
                                {lang === 'ua' ? step.title.ua : step.title.ru}
                            </h3>
                            <p className="how-step__text">
                                {lang === 'ua' ? step.text.ua : step.text.ru}
                            </p>

                            {/* Стрілка між кроками (крім останнього) */}
                            {index < STEPS.length - 1 && (
                                <div className="how-step__arrow" aria-hidden="true">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M5 12h14M13 6l6 6-6 6" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}