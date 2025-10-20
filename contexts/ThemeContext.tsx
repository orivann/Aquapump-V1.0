import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState, createContext, useContext, ReactNode, useRef } from 'react';
import { Platform, Animated, StyleSheet } from 'react-native';
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
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [displayMode, setDisplayMode] = useState(value.themeMode);

  useEffect(() => {
    if (displayMode !== value.themeMode) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      
      setTimeout(() => setDisplayMode(value.themeMode), 200);
    }
  }, [value.themeMode, displayMode, fadeAnim]);

  const currentTheme = displayMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={value}>
      <Animated.View 
        style={[
          styles.container,
          { 
            opacity: fadeAnim,
            backgroundColor: currentTheme.colors.secondary 
          }
        ]}
      >
        {children}
      </Animated.View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

function useThemeValue(): ThemeContextType {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [isLoading, setIsLoading] = useState<boolean>(Platform.OS !== 'web');

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_KEY);
        if (stored && (stored === 'light' || stored === 'dark')) {
          setThemeMode(stored as ThemeMode);
        } else {
          await AsyncStorage.setItem(THEME_KEY, 'light');
        }
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
