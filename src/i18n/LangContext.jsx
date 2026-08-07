import { createContext, useContext, useState } from 'react';
import translations from './translations.json';

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lang') || 'ua';
    }
    return 'ua';
  });

  const toggleLang = () => {
    const next = lang === 'ua' ? 'ru' : 'ua';
    setLang(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', next);
    }
  };

  const t = (key) => {
    const keys = key.split('.');
    let val = translations[lang];
    for (const k of keys) {
      val = val?.[k];
    }
    return val ?? key;
  };

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
