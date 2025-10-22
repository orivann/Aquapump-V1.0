import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { Platform, Animated, StyleSheet } from 'react-native';
import { lightTheme, darkTheme, Theme } from '../constants/theme';

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
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [isLoading, setIsLoading] = useState<boolean>(Platform.OS !== 'web');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [displayMode, setDisplayMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    if (Platform.OS === 'web') return;

    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_KEY);
        if (stored && (stored === 'light' || stored === 'dark')) {
          setThemeMode(stored as ThemeMode);
          setDisplayMode(stored as ThemeMode);
        } else {
          setThemeMode('dark');
          setDisplayMode('dark');
          await AsyncStorage.setItem(THEME_KEY, 'dark');
        }
      } catch (error) {
        console.error('[ThemeContext] Failed to initialize:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (displayMode !== themeMode) {
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

      setTimeout(() => setDisplayMode(themeMode), 200);
    }
  }, [themeMode, displayMode, fadeAnim]);

  const toggleTheme = useCallback(async () => {
    const newMode = themeMode === 'dark' ? 'light' : 'dark';
    try {
      console.log('[ThemeContext] Toggling theme to:', newMode);
      setThemeMode(newMode);
      if (Platform.OS !== 'web') {
        await AsyncStorage.setItem(THEME_KEY, newMode);
      }
    } catch (error) {
      console.error('[ThemeContext] Failed to save theme:', error);
    }
  }, [themeMode]);

  const theme: Theme = useMemo(() => {
    return displayMode === 'dark' ? darkTheme : lightTheme;
  }, [displayMode]);

  const value = useMemo(
    () => ({
      themeMode: displayMode,
      theme,
      isLoading,
      toggleTheme,
    }),
    [displayMode, theme, isLoading, toggleTheme]
  );

  const currentTheme = displayMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={value}>
      <Animated.View
        style={[
          styles.container,
          { opacity: fadeAnim, backgroundColor: currentTheme.colors.secondary },
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
    console.warn(
      '[ThemeContext] useTheme called outside ThemeProvider, returning defaults'
    );
    return {
      themeMode: 'dark' as ThemeMode,
      theme: darkTheme,
      isLoading: false,
      toggleTheme: async () => {},
    };
  }
  return context;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
