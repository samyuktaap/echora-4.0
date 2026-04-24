import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage, LANGUAGES } = useLanguage();

  return (
    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
      {LANGUAGES.map(lang => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          style={{
            padding: '0.25rem 0.5rem',
            borderRadius: '6px',
            border: '1.5px solid',
            borderColor: language === lang.code ? 'var(--primary-mid)' : 'var(--border-color)',
            background: language === lang.code ? 'rgba(59,130,246,0.15)' : 'transparent',
            color: language === lang.code ? 'var(--primary-light)' : 'var(--text-muted)',
            fontSize: '0.7rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          title={lang.name}
        >
          {lang.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
