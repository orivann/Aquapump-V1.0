import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
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
  const { language, changeLanguage } = useLanguage();
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
    { title: 'Products', href: '#products' },
    { title: 'Technology', href: '#technology' },
    { title: 'About', href: '#about' },
  ];

  return (
    <View style={[styles.container, Platform.OS === 'web' ? styles.fixedOnWeb : null]} testID="navbar-root">
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {Platform.OS === 'web' ? (
          <View
            style={[
              styles.navBar,
              {
                backgroundColor: isDark ? 'rgba(10, 25, 41, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                borderBottomColor: isDark ? 'rgba(25, 195, 230, 0.15)' : 'rgba(91, 103, 245, 0.15)',
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
              <Text
                accessibilityRole="header"
                testID="navbar-logo"
                style={[styles.logo, { color: isDark ? theme.colors.primary : '#5B67F5' }]}
              >
                AquaPump
              </Text>

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
                      borderColor: isDark ? 'rgba(25, 195, 230, 0.3)' : 'rgba(91, 103, 245, 0.15)',
                      backgroundColor: isDark ? 'rgba(25, 195, 230, 0.1)' : 'rgba(91, 103, 245, 0.08)',
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
                      borderColor: isDark ? 'rgba(25, 195, 230, 0.3)' : 'rgba(91, 103, 245, 0.15)',
                      backgroundColor: isDark ? 'rgba(25, 195, 230, 0.1)' : 'rgba(91, 103, 245, 0.08)',
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
                      backgroundColor: isDark ? theme.colors.primary : '#5B67F5',
                    },
                  ]}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.quoteButtonText}>
                    Get Quote
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
                borderBottomColor: isDark ? 'rgba(25, 195, 230, 0.15)' : 'rgba(91, 103, 245, 0.15)',
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
              <Text
                accessibilityRole="header"
                testID="navbar-logo"
                style={[styles.logo, { color: isDark ? theme.colors.primary : '#5B67F5' }]}
              >
                AquaPump
              </Text>

              <View style={styles.controls}>
                <TouchableOpacity
                  testID="btn-toggle-language"
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={language === 'en' ? 'Switch to Hebrew' : 'Switch to English'}
                  style={[
                    styles.controlButton,
                    {
                      borderColor: isDark ? 'rgba(25, 195, 230, 0.3)' : 'rgba(91, 103, 245, 0.15)',
                      backgroundColor: isDark ? 'rgba(25, 195, 230, 0.1)' : 'rgba(91, 103, 245, 0.08)',
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
                      borderColor: isDark ? 'rgba(25, 195, 230, 0.3)' : 'rgba(91, 103, 245, 0.15)',
                      backgroundColor: isDark ? 'rgba(25, 195, 230, 0.1)' : 'rgba(91, 103, 245, 0.08)',
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
    position: Platform.OS === 'web' ? ('fixed' as unknown as 'absolute') : 'absolute',
  },
  navBar: {
    height: 72,
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
    paddingHorizontal: 32,
    maxWidth: 1400,
    alignSelf: 'center',
  },
  safeArea: {
    width: '100%',
  },
  logo: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  navLinks: {
    flexDirection: 'row',
    gap: 40,
    alignItems: 'center',
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
    gap: 12,
    alignItems: 'center',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    minHeight: 40,
    minWidth: 40,
  },
  quoteButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    minHeight: 40,
  },
  quoteButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
});
