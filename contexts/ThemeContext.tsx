import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState, createContext, useContext, ReactNode } from 'react';
import { lightTheme, darkTheme, Theme } from '@/constants/theme';

export type ThemeMode = 'light' | 'dark';

const THEME_KEY = '@aquapump_theme';

interface ThemeContextType {
  themeMode: ThemeMode;
  theme: Theme;
  isLoading: boolean;
  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const value = useThemeValue();
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

function useThemeValue() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(THEME_KEY, 'light');
        setThemeMode('light');
      } catch (error) {
        console.error('[ThemeContext] Failed to initialize:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const toggleTheme = useCallback(async () => {
    const newMode = themeMode === 'dark' ? 'light' : 'dark';
    try {
      console.log('[ThemeContext] Toggling theme to:', newMode);
      await AsyncStorage.setItem(THEME_KEY, newMode);
      setThemeMode(newMode);
    } catch (error) {
      console.error('[ThemeContext] Failed to save theme:', error);
    }
  }, [themeMode]);

  const theme: Theme = useMemo(() => {
    return themeMode === 'dark' ? darkTheme : lightTheme;
  }, [themeMode]);

  return {
    themeMode,
    theme,
    isLoading,
    toggleTheme,
  };
}
