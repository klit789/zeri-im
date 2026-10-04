import { createContext, useContext, useMemo, useState } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('sq');

  const value = useMemo(() => {
    const t = translations[lang];
    const tr = (key, vars) => {
      const parts = key.split('.');
      let cur = t;
      for (const p of parts) {
        cur = cur?.[p];
      }
      if (typeof cur !== 'string') return key;
      return cur.replace(/\{\{(\w+)\}\}/g, (_, k) => vars?.[k] ?? '');
    };
    return {
      lang,
      setLang: () => setLang((l) => (l === 'sq' ? 'en' : 'sq')),
      t,
      tr,
    };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage outside provider');
  return ctx;
}
