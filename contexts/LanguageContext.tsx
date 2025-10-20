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
  const [isLoading, setIsLoading] = useState(Platform.OS !== 'web');

  useEffect(() => {
    if (Platform.OS === 'web') {
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (stored && (stored === 'en' || stored === 'he')) {
          setLanguage(stored as Language);
          setIsRTL(stored === 'he');
          I18nManager.forceRTL(stored === 'he');
        } else {
          await AsyncStorage.setItem(LANGUAGE_KEY, 'en');
        }
      } catch (error) {
        console.error('[LanguageContext] Failed to initialize:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const changeLanguage = useCallback(async (newLanguage: Language) => {
    try {
      console.log('[LanguageContext] Changing language to:', newLanguage);
      if (Platform.OS !== 'web') {
        await AsyncStorage.setItem(LANGUAGE_KEY, newLanguage);
        I18nManager.forceRTL(newLanguage === 'he');
      }
      setLanguage(newLanguage);
      setIsRTL(newLanguage === 'he');
    } catch (error) {
      console.error('[LanguageContext] Failed to save language:', error);
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
