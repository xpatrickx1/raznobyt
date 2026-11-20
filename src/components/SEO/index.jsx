import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useLang, stripLang, localizePath, HTML_LANG } from '../../i18n/LangContext';

export const SITE_URL = 'https://raznobyt.com';

const OG_LOCALE = { ua: 'uk_UA', ru: 'ru_UA' };

// query: суфікс для сторінок пагінації (напр. '?page=2') — canonical і hreflang вказують на ту саму сторінку
export default function SEO({ title, description, noindex = false, query = '', brandSuffix = true }) {
    const { lang } = useLang();
    const { pathname } = useLocation();
    const siteName = 'Різнобит';
    const fullTitle = title ? (brandSuffix ? `${title} | ${siteName}` : title) : siteName;

    const basePath = stripLang(pathname);
    const uaUrl = SITE_URL + localizePath(basePath, 'ua') + query;
    const ruUrl = SITE_URL + localizePath(basePath, 'ru') + query;
    const canonical = lang === 'ru' ? ruUrl : uaUrl;

    return (
        <Helmet>
            <html lang={HTML_LANG[lang]} />
            <title>{fullTitle}</title>
            {description && <meta name="description" content={description} />}
            {noindex && <meta name="robots" content="noindex" />}
            <meta property="og:title" content={fullTitle} />
            {description && <meta property="og:description" content={description} />}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonical} />
            <meta property="og:locale" content={OG_LOCALE[lang]} />
            <meta property="og:locale:alternate" content={OG_LOCALE[lang === 'ru' ? 'ua' : 'ru']} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            {!noindex && <link rel="canonical" href={canonical} />}
            {!noindex && <link rel="alternate" hrefLang="uk" href={uaUrl} />}
            {!noindex && <link rel="alternate" hrefLang="ru" href={ruUrl} />}
            {!noindex && <link rel="alternate" hrefLang="x-default" href={uaUrl} />}
        </Helmet>
    );
}
