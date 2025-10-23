import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { translations } from '../constants/translations';
import { Sun, Moon } from 'lucide-react-native';
import React, { memo, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

function NavigationInner() {
  const [mounted, setMounted] = useState(false);
  const { language, changeLanguage, t } = useLanguage();
  const { theme, themeMode, toggleTheme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    setMounted(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const isDark = themeMode === 'dark';

  if (!mounted) {
    return null;
  }

  const navLinks = [
    { title: t(translations.nav.products), href: '#products' },
    { title: t(translations.nav.technology), href: '#technology' },
    { title: t(translations.nav.sustainability), href: '#about' },
  ];

  return (
    <SafeAreaView edges={['top']} style={[styles.container, Platform.OS === 'web' ? styles.fixedOnWeb : null]} testID="navbar-root">
      {Platform.OS === 'web' ? (
        <View
          style={[
            styles.navBar,
            {
              backgroundColor: isDark ? 'rgba(10, 25, 41, 0.85)' : 'rgba(255, 255, 255, 0.85)',
              borderBottomColor: isDark ? 'rgba(132, 196, 125, 0.25)' : 'rgba(0, 34, 123, 0.15)',
            },
          ]}
        >
          <Animated.View
            style={[
              styles.navContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
            testID="navbar-content"
          >
            <View style={styles.logoContainer}>
              <View style={[styles.logoIcon, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.logoEmoji}>💧</Text>
              </View>
              <Text
                accessibilityRole="header"
                testID="navbar-logo"
                style={[styles.logo, { color: isDark ? theme.colors.primary : theme.colors.primary }]}
              >
                AquaPump
              </Text>
            </View>

            <View style={styles.navLinks}>
              {navLinks.map((link) => (
                <TouchableOpacity
                  key={link.title}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={link.title}
                  style={styles.navLink}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.navLinkText, { color: isDark ? theme.colors.text : '#1E293B' }]}>
                    {link.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.controls}>
              <TouchableOpacity
                testID="btn-toggle-language"
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={language === 'en' ? 'Switch to Hebrew' : 'Switch to English'}
                style={[
                  styles.controlButton,
                  {
                    borderColor: isDark ? 'rgba(132, 196, 125, 0.4)' : 'rgba(0, 34, 123, 0.2)',
                    backgroundColor: isDark ? 'rgba(132, 196, 125, 0.15)' : 'rgba(0, 34, 123, 0.08)',
                  },
                ]}
                onPress={() => changeLanguage(language === 'en' ? 'he' : 'en')}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                activeOpacity={0.7}
              >
                <Text style={[styles.languageText, { color: theme.colors.primary }]}>
                  {language === 'en' ? 'עב' : 'EN'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                testID="btn-toggle-theme"
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                style={[
                  styles.controlButton,
                  {
                    borderColor: isDark ? 'rgba(132, 196, 125, 0.4)' : 'rgba(0, 34, 123, 0.2)',
                    backgroundColor: isDark ? 'rgba(132, 196, 125, 0.15)' : 'rgba(0, 34, 123, 0.08)',
                  },
                ]}
                onPress={toggleTheme}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                activeOpacity={0.7}
              >
                {isDark ? (
                  <Sun size={18} color={theme.colors.primary} strokeWidth={2.5} />
                ) : (
                  <Moon size={18} color={theme.colors.primary} strokeWidth={2.5} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Get Quote"
                style={[
                  styles.quoteButton,
                  {
                    backgroundColor: theme.colors.primary,
                  },
                ]}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                activeOpacity={0.85}
              >
                <Text style={[styles.quoteButtonText, { color: isDark ? theme.colors.dark : theme.colors.light }]}>
                  {t(translations.hero.quoteCTA)}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      ) : (
        <BlurView
          intensity={isDark ? 80 : 90}
          tint={isDark ? 'dark' : 'light'}
          style={[
            styles.navBar,
            {
              borderBottomColor: isDark ? 'rgba(132, 196, 125, 0.25)' : 'rgba(0, 34, 123, 0.15)',
            },
          ]}
        >
          <Animated.View
            style={[
              styles.navContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
            testID="navbar-content"
          >
            <View style={styles.logoContainer}>
              <View style={[styles.logoIcon, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.logoEmoji}>💧</Text>
              </View>
              <Text
                accessibilityRole="header"
                testID="navbar-logo"
                style={[styles.logo, { color: isDark ? theme.colors.primary : theme.colors.primary }]}
              >
                AquaPump
              </Text>
            </View>

            <View style={styles.controls}>
              <TouchableOpacity
                testID="btn-toggle-language"
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={language === 'en' ? 'Switch to Hebrew' : 'Switch to English'}
                style={[
                  styles.controlButton,
                  {
                    borderColor: isDark ? 'rgba(132, 196, 125, 0.4)' : 'rgba(0, 34, 123, 0.2)',
                    backgroundColor: isDark ? 'rgba(132, 196, 125, 0.15)' : 'rgba(0, 34, 123, 0.08)',
                  },
                ]}
                onPress={() => changeLanguage(language === 'en' ? 'he' : 'en')}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                activeOpacity={0.7}
              >
                <Text style={[styles.languageText, { color: theme.colors.primary }]}>
                  {language === 'en' ? 'עב' : 'EN'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                testID="btn-toggle-theme"
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                style={[
                  styles.controlButton,
                  {
                    borderColor: isDark ? 'rgba(132, 196, 125, 0.4)' : 'rgba(0, 34, 123, 0.2)',
                    backgroundColor: isDark ? 'rgba(132, 196, 125, 0.15)' : 'rgba(0, 34, 123, 0.08)',
                  },
                ]}
                onPress={toggleTheme}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                activeOpacity={0.7}
              >
                {isDark ? (
                  <Sun size={18} color={theme.colors.primary} strokeWidth={2.5} />
                ) : (
                  <Moon size={18} color={theme.colors.primary} strokeWidth={2.5} />
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </BlurView>
      )}
    </SafeAreaView>
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
    backgroundColor: 'transparent',
  },
  fixedOnWeb: {
    position: Platform.OS === 'web' ? ('fixed' as unknown as 'absolute') : 'absolute',
  },
  navBar: {
    height: 64,
    width: '100%',
    borderBottomWidth: 1,
    justifyContent: 'center',
    ...(Platform.OS === 'web' && {
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    } as any),
  },
  navContent: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    maxWidth: 1400,
    alignSelf: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 18,
  },
  logo: {
    fontSize: 20,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  navLinks: {
    flexDirection: 'row',
    gap: 32,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  navLink: {
    paddingVertical: 8,
  },
  navLinkText: {
    fontSize: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.2,
  },
  controls: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    height: 36,
    minWidth: 36,
  },
  quoteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
  languageText: {
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
});
