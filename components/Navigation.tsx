import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Globe, Sun, Moon } from 'lucide-react-native';
import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function NavigationInner() {
  const { language, changeLanguage, isRTL } = useLanguage();
  const { theme, themeMode, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    changeLanguage(language === 'en' ? 'he' : 'en');
  };

  return (
    <View style={[styles.container, Platform.OS === 'web' ? styles.fixedOnWeb : null]} testID="navbar-root">
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View
          style={[
            styles.navBar,
            {
              backgroundColor: themeMode === 'dark' ? 'rgba(10, 25, 41, 0.98)' : 'rgba(255, 255, 255, 0.98)',
              borderBottomColor: theme.colors.primary + '20',
            },
          ]}
        >
          <View style={[styles.navContent, isRTL && styles.navContentRTL]} testID="navbar-content">
            <Text
              accessibilityRole="header"
              testID="navbar-logo"
              style={[styles.logo, { color: themeMode === 'dark' ? theme.colors.primary : '#0B3B8C' }]}
            >
              AquaPump
            </Text>

            <View style={styles.controls}>
              <TouchableOpacity
                testID="btn-toggle-theme"
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                style={[
                  styles.controlButton,
                  {
                    borderColor: theme.colors.primary + '40',
                    backgroundColor: themeMode === 'dark' ? 'rgba(0, 0, 0, 0.25)' : '#FFFFFF',
                  },
                ]}
                onPress={toggleTheme}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                activeOpacity={0.8}
              >
                {themeMode === 'dark' ? (
                  <Sun size={22} color={theme.colors.primary} strokeWidth={2.5} />
                ) : (
                  <Moon size={22} color={theme.colors.primary} strokeWidth={2.5} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                testID="btn-toggle-language"
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={language === 'en' ? 'Switch to Hebrew' : 'Switch to English'}
                style={[
                  styles.controlButton,
                  {
                    borderColor: theme.colors.primary + '40',
                    backgroundColor: themeMode === 'dark' ? 'rgba(0, 0, 0, 0.25)' : '#FFFFFF',
                  },
                ]}
                onPress={toggleLanguage}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                activeOpacity={0.8}
              >
                <Globe size={22} color={theme.colors.primary} strokeWidth={2.5} />
                <Text style={[styles.langText, { color: themeMode === 'dark' ? '#FFFFFF' : theme.colors.primary }]}>{language === 'en' ? 'EN' : 'עב'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const Navigation = memo(NavigationInner);
export default Navigation;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  fixedOnWeb: {
    // RNW doesn't type 'fixed', but it works at runtime; fall back to absolute if needed
    position: Platform.OS === 'web' ? ('fixed' as unknown as 'absolute') : 'absolute',
  },
  navBar: {
    height: 100,
    width: '100%',
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  navContent: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 4,
    maxWidth: 1400,
    alignSelf: 'center',
  },
  safeArea: {
    width: '100%',
  },
  navContentRTL: {
    flexDirection: 'row-reverse',
  },
  logo: {
    fontSize: 30,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    minHeight: 48,
    minWidth: 56,
  },
  langText: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
