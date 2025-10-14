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
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

function useLanguageValue() {
  const [language, setLanguage] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (stored === 'en' || stored === 'he') {
        setLanguage(stored);
        setIsRTL(stored === 'he');
        if (Platform.OS === 'web') {
          try {
            const dir = stored === 'he' ? 'rtl' : 'ltr';
            if (typeof document !== 'undefined') {
              document.documentElement?.setAttribute('dir', dir);
            }
          } catch (e) {
            console.log('[Language] Failed to set dir on web during load', e);
          }
        }
      } else {
        await AsyncStorage.setItem(LANGUAGE_KEY, 'en');
        setLanguage('en');
        setIsRTL(false);
        if (Platform.OS === 'web') {
          try {
            if (typeof document !== 'undefined') {
              document.documentElement?.setAttribute('dir', 'ltr');
            }
          } catch (e) {
            console.log('[Language] Failed to set default dir on web', e);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = useCallback(async (newLanguage: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, newLanguage);
      setLanguage(newLanguage);
      setIsRTL(newLanguage === 'he');
      
      if (Platform.OS !== 'web') {
        I18nManager.forceRTL(newLanguage === 'he');
      } else {
        try {
          const dir = newLanguage === 'he' ? 'rtl' : 'ltr';
          if (typeof document !== 'undefined') {
            document.documentElement?.setAttribute('dir', dir);
          }
        } catch (e) {
          console.log('[Language] Failed to set dir on web during change', e);
        }
      }
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  }, []);

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
