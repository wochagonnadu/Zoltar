
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Import JSON modules using correct relative paths.
// If 'contexts' directory is at the same level as 'locales' directory, these paths are correct.
// e.g., src/contexts/I18nContext.tsx and src/locales/en.json
import enTranslationsModule from '../locales/en.json';
import ruTranslationsModule from '../locales/ru.json';
import deTranslationsModule from '../locales/de.json';

// Access the actual JSON data, usually via '.default' when import assertions are not used/supported
// The '|| enTranslationsModule' is a fallback in case the module isn't wrapped with a default export.
const enTranslationsData = (enTranslationsModule as any).default || enTranslationsModule;
const ruTranslationsData = (ruTranslationsModule as any).default || ruTranslationsModule;
const deTranslationsData = (deTranslationsModule as any).default || deTranslationsModule;


type Language = 'en' | 'ru' | 'de';
type Translations = { [key: string]: string | Translations };

interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
  translations: Translations;
}

const defaultLanguage: Language = 'en';
const supportedLanguages: Language[] = ['en', 'ru', 'de'];

const allLoadedTranslations: Record<Language, Translations> = {
  en: enTranslationsData,
  ru: ruTranslationsData,
  de: deTranslationsData,
};

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
  try {
    const storedLang = localStorage.getItem('zoltarLanguage') as Language;
    if (storedLang && supportedLanguages.includes(storedLang)) {
      return storedLang;
    }
    const browserLang = navigator.language.split('-')[0] as Language;
    if (supportedLanguages.includes(browserLang)) {
      return browserLang;
    }
  } catch (error) {
    console.warn("Could not determine initial language from storage/browser, defaulting to 'en'.", error);
  }
  return defaultLanguage;
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initialLanguage = getInitialLanguage();
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const [translations, setTranslations] = useState<Translations>(allLoadedTranslations[initialLanguage] || allLoadedTranslations[defaultLanguage]);

  useEffect(() => {
    const newTranslations = allLoadedTranslations[language];
    if (newTranslations && Object.keys(newTranslations).length > 0) { // Ensure translations are not empty
      setTranslations(newTranslations);
    } else {
      // Fallback if selected language translations are missing or empty
      if (language !== defaultLanguage && allLoadedTranslations[defaultLanguage] && Object.keys(allLoadedTranslations[defaultLanguage]).length > 0) {
        setTranslations(allLoadedTranslations[defaultLanguage]);
        console.warn(`Translations for language '${language}' not found or empty, falling back to default '${defaultLanguage}'.`);
      } else if (Object.keys(enTranslationsData).length > 0) { // Ultimate fallback to English if default is also problematic
         setTranslations(enTranslationsData);
         console.warn(`Translations for language '${language}' and default language not found or empty, falling back to English.`);
      } else {
        // This case means even English translations are missing/empty, which is critical.
        console.error("Critical: No translations available, not even for English. Please check locale JSON files.");
        setTranslations({}); // Set to empty to avoid errors, though UI will show keys.
      }
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    if (supportedLanguages.includes(lang)) {
      setLanguageState(lang);
      try {
        localStorage.setItem('zoltarLanguage', lang);
      } catch (error) {
        console.warn("Could not save language to localStorage.", error);
      }
    } else {
      console.warn(`Unsupported language: ${lang}. Defaulting to ${defaultLanguage}.`);
      setLanguageState(defaultLanguage);
      try {
        localStorage.setItem('zoltarLanguage', defaultLanguage);
      } catch (error) {
         console.warn("Could not save default language to localStorage.", error);
      }
    }
  };

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }): string => {
    const keys = key.split('.');
    let result: string | Translations | undefined = translations;

    for (const k of keys) {
      if (typeof result === 'object' && result !== null && k in result) {
        result = result[k];
      } else {
        // console.warn(`Translation key not found: ${key} in language ${language}`);
        return key; 
      }
    }
    
    if (typeof result === 'string') {
      if (replacements) {
        return Object.entries(replacements).reduce((acc, [placeholder, value]) => {
          return acc.replace(new RegExp(`{${placeholder}}`, 'g'), String(value));
        }, result);
      }
      return result;
    }

    // console.warn(`Translation key found, but not a string: ${key} in language ${language}`);
    return key;
  }, [translations, language]); 

  // Fallback for initial render if translations aren't ready
  if (Object.keys(translations).length === 0 && language !== defaultLanguage) {
     // Attempt to load default language translations if current ones are empty
     const defaultTranslations = allLoadedTranslations[defaultLanguage];
     if (defaultTranslations && Object.keys(defaultTranslations).length > 0) {
         setTranslations(defaultTranslations);
     } else if (enTranslationsData && Object.keys(enTranslationsData).length > 0) { // Fallback to English if default is also empty
        setTranslations(enTranslationsData);
     }
     // Render null or a loading indicator while translations are being settled
     // This might cause a flicker but prevents errors from t() being called with empty translations
     return null; 
  }


  return (
    <I18nContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </I18nContext.Provider>
  );
};
