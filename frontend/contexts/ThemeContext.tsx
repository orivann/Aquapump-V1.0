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
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [isLoading, setIsLoading] = useState<boolean>(Platform.OS !== 'web');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const isTogglingRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        let stored: string | null = null;
        
        if (Platform.OS === 'web') {
          stored = localStorage.getItem(THEME_KEY);
        } else {
          stored = await AsyncStorage.getItem(THEME_KEY);
        }
        
        if (stored && (stored === 'light' || stored === 'dark')) {
          setThemeMode(stored as ThemeMode);
        } else {
          const defaultMode = 'dark';
          setThemeMode(defaultMode);
          if (Platform.OS === 'web') {
            localStorage.setItem(THEME_KEY, defaultMode);
          } else {
            await AsyncStorage.setItem(THEME_KEY, defaultMode);
          }
        }
      } catch (error) {
        console.error('[ThemeContext] Failed to initialize:', error);
      } finally {
        if (Platform.OS !== 'web') {
          setIsLoading(false);
        }
      }
    })();
  }, []);

  const toggleTheme = useCallback(() => {
    if (isTogglingRef.current) {
      console.log('[ThemeContext] Toggle in progress, ignoring');
      return;
    }
    
    isTogglingRef.current = true;
    
    setThemeMode((current) => {
      const newMode = current === 'dark' ? 'light' : 'dark';
      console.log('[ThemeContext] Toggling theme from', current, 'to', newMode);
      
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        isTogglingRef.current = false;
      });
      
      (async () => {
        try {
          if (Platform.OS === 'web') {
            localStorage.setItem(THEME_KEY, newMode);
          } else {
            await AsyncStorage.setItem(THEME_KEY, newMode);
          }
        } catch (error) {
          console.error('[ThemeContext] Failed to save theme:', error);
        }
      })();
      
      return newMode;
    });
  }, [fadeAnim]);

  const theme: Theme = useMemo(() => {
    return themeMode === 'dark' ? darkTheme : lightTheme;
  }, [themeMode]);

  const value = useMemo(
    () => ({
      themeMode,
      theme,
      isLoading,
      toggleTheme,
    }),
    [themeMode, theme, isLoading, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <Animated.View
        style={[
          styles.container,
          { opacity: fadeAnim, backgroundColor: theme.colors.secondary },
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
      toggleTheme: () => {},
    };
  }
  return context;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
