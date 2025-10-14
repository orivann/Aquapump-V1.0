import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Globe, Sun, Moon } from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Navigation() {
  const { language, changeLanguage, isRTL } = useLanguage();
  const { theme, themeMode, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    console.log('[Navigation] Toggling language from', language);
    changeLanguage(language === 'en' ? 'he' : 'en');
  };

  const langLabel = useMemo(() => (language === 'en' ? 'EN' : (Platform.OS === 'web' ? 'HE' : 'עב')), [language]);

  return (
    <View style={styles.container} testID="navbar-root">
      <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={[styles.navBar, { backgroundColor: themeMode === 'dark' ? 'rgba(10, 25, 41, 0.95)' : 'rgba(255, 255, 255, 0.95)' }]} />
      
      <View style={[styles.navContent, isRTL && styles.navContentRTL]} testID="navbar-content">
        <Text 
          accessibilityRole="header"
          testID="navbar-logo"
          style={[styles.logo, { color: themeMode === 'dark' ? theme.colors.primary : '#1E40AF' }]}>AquaPump</Text>

        <View style={styles.controls}>
          <TouchableOpacity
            testID="btn-toggle-theme"
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={[styles.controlButton, { borderColor: theme.colors.primary + '40', backgroundColor: themeMode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.8)' }]}
            onPress={toggleTheme}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.8}
          >
            {themeMode === 'dark' ? (
              <Sun size={24} color={theme.colors.primary} strokeWidth={2.5} />
            ) : (
              <Moon size={24} color={theme.colors.primary} strokeWidth={2.5} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            testID="btn-toggle-language"
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={language === 'en' ? 'Switch to Hebrew' : 'Switch to English'}
            style={[styles.controlButton, { borderColor: theme.colors.primary + '40', backgroundColor: themeMode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.8)' }]}
            onPress={toggleLanguage}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.8}
          >
            <Globe size={24} color={theme.colors.primary} strokeWidth={2.5} />
            <Text style={[styles.langText, { color: themeMode === 'dark' ? '#FFFFFF' : theme.colors.primary }]}>{langLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    pointerEvents: 'box-none' as const,
  },
  navBar: {
    height: 96,
  },
  navContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 96,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
    gap: 12,
  },
  safeArea: {
    width: '100%',
  },
  navContentRTL: {
    flexDirection: 'row-reverse',
  },
  logo: {
    fontSize: 28,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
    flex: 0,
    flexShrink: 1,
    minWidth: 0,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    flex: 0,
    flexShrink: 1,
    alignItems: 'center',
    minWidth: 0,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    minHeight: 48,
    minWidth: 56,
  },
  langText: {
    fontSize: 16,
    fontWeight: '800' as const,
    letterSpacing: 0.5,
  },
});
