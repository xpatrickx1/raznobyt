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
            <div className="container" style={{ padding: '60px 0', minHeight: '60vh' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: 24 }}>
                    {t('nav.documents')}
                </h1>
                <p style={{ color: 'var(--c-text-muted)', marginBottom: 40, fontSize: 16, maxWidth: 600 }}>
                    {lang === 'ua'
                        ? 'Тут ви можете завантажити необхідні документи, сертифікати та актуальні прайс-листи.'
                        : 'Здесь вы можете скачать необходимые документы, сертификаты и актуальные прайс-листы.'}
                </p>

                {documentsData.map((group, groupIndex) => (
                    <div key={groupIndex} style={{ marginBottom: 48 }}>
                        {group.year && (
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, borderBottom: '2px solid var(--c-border)', paddingBottom: 12, marginBottom: 24, color: 'var(--c-text)' }}>
                                {getText(group.year)}
                            </h2>
                        )}
                        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                            {group.items && group.items.map((doc, i) => (
                                <a
                                    key={i}
                                    href={getFileUrl(doc.url)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="document-card"
                                    style={{
                                        padding: 24,
                                        border: '1px solid var(--c-border)',
                                        borderRadius: 'var(--radius-lg)',
                                        background: 'var(--c-bg)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 12,
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    <div style={{ fontSize: 32 }}>📄</div>
                                    <div style={{ fontWeight: 600, fontSize: 16, wordBreak: 'break-word' }}>
                                        {getText(doc.title)}
                                    </div>
                                    <div style={{ marginTop: 'auto', paddingTop: 12, color: 'var(--c-accent)', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        {lang === 'ua' ? 'Відкрити файл' : 'Открыть файл'}
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </div>
                                </a>
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
            `}</style>
        </>
    );
}
