import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Globe, Sun, Moon } from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';

export default function Navigation() {
  const { language, changeLanguage, isRTL } = useLanguage();
  const { theme, themeMode, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    changeLanguage(language === 'en' ? 'he' : 'en');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.navBar, { backgroundColor: themeMode === 'dark' ? 'rgba(10, 25, 41, 0.95)' : 'rgba(255, 255, 255, 0.95)' }]} />
      
      <View style={[styles.navContent, isRTL && styles.navContentRTL]}>
        <Text 
          accessibilityRole="header"
          style={[styles.logo, { color: themeMode === 'dark' ? theme.colors.primary : '#1E40AF' }]}>AquaPump</Text>

        <View style={styles.controls}>
          <TouchableOpacity
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={[styles.controlButton, { borderColor: theme.colors.primary + '40', backgroundColor: themeMode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.8)' }]}
            onPress={toggleTheme}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            {themeMode === 'dark' ? (
              <Sun size={24} color={theme.colors.primary} strokeWidth={2.5} />
            ) : (
              <Moon size={24} color={theme.colors.primary} strokeWidth={2.5} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={language === 'en' ? 'Switch to Hebrew' : 'Switch to English'}
            style={[styles.controlButton, { borderColor: theme.colors.primary + '40', backgroundColor: themeMode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.8)' }]}
            onPress={toggleLanguage}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Globe size={24} color={theme.colors.primary} strokeWidth={2.5} />
            <Text style={[styles.langText, { color: themeMode === 'dark' ? '#FFFFFF' : theme.colors.primary }]}>{language === 'en' ? 'EN' : 'עב'}</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  },
  navBar: {
    height: Platform.OS === 'web' ? 90 : 95,
  },
  navContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'web' ? 90 : 95,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Platform.OS === 'web' ? 48 : 24,
    paddingTop: Platform.OS === 'web' ? 0 : 12,
    maxWidth: Platform.OS === 'web' ? 1400 : undefined,
    alignSelf: 'center',
    width: '100%',
  },
  navContentRTL: {
    flexDirection: 'row-reverse',
  },
  logo: {
    fontSize: Platform.OS === 'web' ? 32 : 28,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
    flex: 0,
    flexShrink: 0,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    flex: 0,
    flexShrink: 0,
    alignItems: 'center',
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
    minWidth: 48,
  },
  langText: {
    fontSize: 15,
    fontWeight: '700' as const,
  },
});
