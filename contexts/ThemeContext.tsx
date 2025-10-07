import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { lightTheme, darkTheme, Theme } from '@/constants/theme';

export type ThemeMode = 'light' | 'dark';

const THEME_KEY = '@aquapump_theme';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_KEY);
      if (stored === 'light' || stored === 'dark') {
        setThemeMode(stored);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = useCallback(async () => {
    const newMode = themeMode === 'dark' ? 'light' : 'dark';
    try {
      await AsyncStorage.setItem(THEME_KEY, newMode);
      setThemeMode(newMode);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }, [themeMode]);

  const theme: Theme = useMemo(() => {
    return themeMode === 'dark' ? darkTheme : lightTheme;
  }, [themeMode]);

  return useMemo(() => ({
    themeMode,
    theme,
    isLoading,
    toggleTheme,
  }), [themeMode, theme, isLoading, toggleTheme]);
});