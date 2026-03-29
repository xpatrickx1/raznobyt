import { useLang } from '../i18n/LangContext';
import SEO from '../components/SEO';
import documentsData from '../data/documents.json';

// Завантаження всіх документів з папки assets/docs для Vite
const docModules = import.meta.glob('../assets/docs/**/*', { eager: true });

export default function Documents() {
    const { lang, t } = useLang();

    // Отримання URL файлу (через Vite import.meta або як рядок)
    const getFileUrl = (path) => {
        if (!path) return '#';
        if (docModules[path]) {
            return docModules[path].default;
        }
        return path;
    };

    // Отримання локалізованого тексту (переклад або просто рядок)
    const getText = (field) => {
        if (!field) return '';
        if (typeof field === 'object') return field[lang] || field.ua;
        return field;
    };

    return (
        <>
            <SEO
                title={t('nav.documents')}
                description={lang === 'ua' ? 'Документи та файли для завантаження' : 'Документы и файлы для скачивания'}
            />

            <section className="hero">
                <div className="hero__bg" />
                <div className="hero__pattern" />
                <div className="container">
                    <div className="hero__content fade-up fade-up-1">
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: 24 }}>
                            {t('nav.documents')}
                        </h1>
                        <p style={{ color: 'var(--c-white)', marginBottom: 40, fontSize: 16, maxWidth: 600 }}>
                            {lang === 'ua'
                                ? 'Тут ви можете завантажити необхідні документи, щорічні звіти та повідомлення пр збори ПрАТ "Разнобитпродукт".'
                                : 'Здесь вы можете скачать необходимые документы, годовые отчеты и сообщения о собраниях ЗАО "Разнобитпродукт".'}
                        </p>
                    </div>
                </div>
            </section>
            <div className="container" style={{ padding: '60px 0', minHeight: '60vh' }}>
                {/* <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: 24 }}>
                    {t('nav.documents')}
                </h1>
                <p style={{ color: 'var(--c-text-muted)', marginBottom: 40, fontSize: 16, maxWidth: 600 }}>
                    {lang === 'ua'
                        ? 'Тут ви можете завантажити необхідні документи, щорічні звіти та повідомлення пр збори ПрАТ "Разнобитпродукт".'
                        : 'Здесь вы можете скачать необходимые документы, годовые отчеты и сообщения о собраниях ЗАО "Разнобитпродукт".'}
                </p> */}

                {documentsData.map((group, groupIndex) => (
                    <div key={groupIndex} style={{ marginBottom: 48 }}>
                        {group.year && (
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, borderBottom: '2px solid var(--c-border)', paddingBottom: 12, marginBottom: 24, color: 'var(--c-text)' }}>
                                {getText(group.year)}
                            </h2>
                        )}
                        <div style={{ display: 'grid', gap: 12 }}>
                            {group.items && group.items.map((doc, i) => (
                                <div key={i} className="document-card">
                                    <div className="document-card__title">
                                        {getText(doc.title)}
                                    </div>
                                    <div className='document-card__files'>
                                        {[doc.url, doc.url2, doc.url3, doc.url4].filter(Boolean).map((u, idx) => {
                                            let label = 'Файл';
                                            if (u.includes('.doc.p7s.p7s')) label = '.doc.p7s.p7s';
                                            else if (u.includes('.doc.p7s')) label = '.doc.p7s';
                                            else if (u.includes('.docx.p7s.p7s')) label = '.docx.p7s.p7s';
                                            else if (u.includes('.docx.p7s')) label = '.docx.p7s';
                                            else if (u.includes('.pdf.p7s.p7s')) label = '.pdf.p7s.p7s';
                                            else if (u.includes('.pdf.p7s')) label = '.pdf.p7s';
                                            else if (u.includes('.doc')) label = '.doc';
                                            else if (u.includes('.docx')) label = '.docx';
                                            else if (u.includes('.pdf')) label = '.pdf';

                                            return (
                                                <a
                                                    key={idx}
                                                    href={getFileUrl(u)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 6,
                                                        padding: '6px 12px',
                                                        background: 'var(--c-bg-alt)',
                                                        color: 'var(--c-accent)',
                                                        borderRadius: 'var(--radius-sm)',
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                        textDecoration: 'none',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    className="doc-mini-link"
                                                >
                                                    {label}
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .document-card:hover {
                    border-color: var(--c-accent) !important;
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.06);
                }
                .doc-mini-link:hover {
                    background: var(--c-accent) !important;
                    color: #fff !important;
                }
            `}</style>
        </>
    );
}
