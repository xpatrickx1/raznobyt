import { createContext, useContext } from 'react';
import translations from './translations.json';

// UA — мова за замовчуванням (без префікса), RU живе під /ru/...
export const DEFAULT_LANG = 'ua';
export const LANGS = ['ua', 'ru'];
export const HTML_LANG = { ua: 'uk', ru: 'ru' };

export function getLangFromPath(pathname = '/') {
  return pathname === '/ru' || pathname.startsWith('/ru/') ? 'ru' : DEFAULT_LANG;
}

// '/ru/catalog/x/' → '/catalog/x/'
export function stripLang(pathname = '/') {
  if (pathname === '/ru' || pathname === '/ru/') return '/';
  return pathname.startsWith('/ru/') ? pathname.slice(3) : pathname;
}

// '/catalog/' + 'ru' → '/ru/catalog/'. Не чіпає зовнішні/відносні посилання.
export function localizePath(path, lang) {
  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) return path;
  const clean = stripLang(path);
  if (lang === DEFAULT_LANG) return clean;
  return clean === '/' ? '/ru/' : `/ru${clean}`;
}

const LangContext = createContext({ lang: DEFAULT_LANG, t: (k) => k });

export function LangProvider({ lang = DEFAULT_LANG, children }) {
  const t = (key) => {
    const keys = key.split('.');
    let val = translations[lang];
    for (const k of keys) {
      val = val?.[k];
    }
    return val ?? key;
  };

  return (
    <LangContext.Provider value={{ lang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
