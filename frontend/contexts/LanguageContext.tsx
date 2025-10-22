import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { I18nManager, Platform } from 'react-native';

export type Language = 'en' | 'he';

const LANGUAGE_KEY = '@aquapump_language';

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  isLoading: boolean;
  changeLanguage: (newLanguage: Language) => Promise<void>;
  t: (translations: { en: string; he: string }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const value = useLanguageValue();
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    console.warn('[LanguageContext] useLanguage called outside LanguageProvider, returning defaults');
    return {
      language: 'en' as Language,
      isRTL: false,
      isLoading: false,
      changeLanguage: async () => {},
      t: (translations: { en: string; he: string }) => translations.en,
    };
  }
  return context;
}

function useLanguageValue(): LanguageContextType {
  const [language, setLanguage] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(Platform.OS !== 'web');

  useEffect(() => {
    (async () => {
      try {
        let stored: string | null = null;
        
        if (Platform.OS === 'web') {
          stored = localStorage.getItem(LANGUAGE_KEY);
        } else {
          stored = await AsyncStorage.getItem(LANGUAGE_KEY);
        }
        
        if (stored && (stored === 'en' || stored === 'he')) {
          setLanguage(stored as Language);
          setIsRTL(stored === 'he');
          if (Platform.OS !== 'web') {
            I18nManager.forceRTL(stored === 'he');
          }
        } else {
          const defaultLang = 'en';
          setLanguage(defaultLang);
          if (Platform.OS === 'web') {
            localStorage.setItem(LANGUAGE_KEY, defaultLang);
          } else {
            await AsyncStorage.setItem(LANGUAGE_KEY, defaultLang);
          }
        }
      } catch (error) {
        console.error('[LanguageContext] Failed to initialize:', error);
      } finally {
        if (Platform.OS !== 'web') {
          setIsLoading(false);
        }
      }
    })();
  }, []);

  const changeLanguage = useCallback(async (newLanguage: Language) => {
    try {
      console.log('[LanguageContext] Changing language from', language, 'to:', newLanguage);
      
      if (Platform.OS === 'web') {
        localStorage.setItem(LANGUAGE_KEY, newLanguage);
        console.log('[LanguageContext] Saved language to localStorage:', newLanguage);
      } else {
        await AsyncStorage.setItem(LANGUAGE_KEY, newLanguage);
        I18nManager.forceRTL(newLanguage === 'he');
        console.log('[LanguageContext] Saved language to AsyncStorage:', newLanguage);
      }
      
      setLanguage(newLanguage);
      setIsRTL(newLanguage === 'he');
      console.log('[LanguageContext] Language changed successfully');
    } catch (error) {
      console.error('[LanguageContext] Failed to save language:', error);
    }
  }, [language]);

  const t = useCallback((translations: { en: string; he: string }) => {
    return translations[language];
  }, [language]);

  return {
    language,
    isRTL,
    isLoading,
    changeLanguage,
    t,
  };
}
