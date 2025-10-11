import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { I18nManager, Platform } from 'react-native';
import createContextHook from '@nkzw/create-context-hook';

export type Language = 'en' | 'he';

const LANGUAGE_KEY = '@aquapump_language';

export const [LanguageProvider, useLanguage] = createContextHook(() => {
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
      } else {
        await AsyncStorage.setItem(LANGUAGE_KEY, 'en');
        setLanguage('en');
        setIsRTL(false);
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
});
