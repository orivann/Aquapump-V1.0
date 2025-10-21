import { useLanguage } from '@frontend/contexts/LanguageContext';
import { useTheme } from '@frontend/contexts/ThemeContext';
import { Globe, Sun, Moon } from 'lucide-react-native';
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
  const { language, changeLanguage, isRTL } = useLanguage();
  const { theme, themeMode, toggleTheme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;
  const logoFadeAnim = useRef(new Animated.Value(1)).current;
  const controlsFadeAnim = useRef(new Animated.Value(1)).current;

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

  useEffect(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(logoFadeAnim, {
          toValue: 0.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(logoFadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(controlsFadeAnim, {
          toValue: 0.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(controlsFadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [isRTL, logoFadeAnim, controlsFadeAnim]);

  const toggleLanguage = () => {
    changeLanguage(language === 'en' ? 'he' : 'en');
  };

  const isDark = themeMode === 'dark';

  if (!mounted) {
    return null;
  }

  return (
    <View style={[styles.container, Platform.OS === 'web' ? styles.fixedOnWeb : null]} testID="navbar-root">
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {Platform.OS === 'web' ? (
          <View
            style={[
              styles.navBar,
              {
                backgroundColor: isDark ? 'rgba(10, 25, 41, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                borderBottomColor: isDark ? 'rgba(25, 195, 230, 0.15)' : 'rgba(14, 165, 233, 0.15)',
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
              <Animated.View style={{ opacity: logoFadeAnim }}>
                <Text
                  accessibilityRole="header"
                  testID="navbar-logo"
                  style={[styles.logo, { color: isDark ? theme.colors.primary : '#1E40AF' }]}
                >
                  AquaPump
                </Text>
              </Animated.View>

              <Animated.View style={[styles.controls, { opacity: controlsFadeAnim }]}>
                <TouchableOpacity
                  testID="btn-toggle-theme"
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                  style={[
                    styles.controlButton,
                    {
                      borderColor: isDark ? 'rgba(25, 195, 230, 0.3)' : 'rgba(14, 165, 233, 0.3)',
                      backgroundColor: isDark ? 'rgba(25, 195, 230, 0.1)' : 'rgba(14, 165, 233, 0.08)',
                    },
                  ]}
                  onPress={toggleTheme}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  activeOpacity={0.7}
                >
                  {isDark ? (
                    <Sun size={20} color={theme.colors.primary} strokeWidth={2.5} />
                  ) : (
                    <Moon size={20} color={theme.colors.primary} strokeWidth={2.5} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  testID="btn-toggle-language"
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={language === 'en' ? 'Switch to Hebrew' : 'Switch to English'}
                  style={[
                    styles.controlButton,
                    styles.langButton,
                    {
                      borderColor: isDark ? 'rgba(25, 195, 230, 0.3)' : 'rgba(14, 165, 233, 0.3)',
                      backgroundColor: isDark ? 'rgba(25, 195, 230, 0.1)' : 'rgba(14, 165, 233, 0.08)',
                    },
                  ]}
                  onPress={toggleLanguage}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  activeOpacity={0.7}
                >
                  <Globe size={20} color={theme.colors.primary} strokeWidth={2.5} />
                  <Text style={[styles.langText, { color: theme.colors.primary }]}>
                    {language === 'en' ? 'EN' : 'עב'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </View>
        ) : (
          <BlurView
            intensity={isDark ? 80 : 90}
            tint={isDark ? 'dark' : 'light'}
            style={[
              styles.navBar,
              {
                borderBottomColor: isDark ? 'rgba(25, 195, 230, 0.15)' : 'rgba(14, 165, 233, 0.15)',
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
              <Animated.View style={{ opacity: logoFadeAnim }}>
                <Text
                  accessibilityRole="header"
                  testID="navbar-logo"
                  style={[styles.logo, { color: isDark ? theme.colors.primary : '#1E40AF' }]}
                >
                  AquaPump
                </Text>
              </Animated.View>

              <Animated.View style={[styles.controls, { opacity: controlsFadeAnim }]}>
                <TouchableOpacity
                  testID="btn-toggle-theme"
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                  style={[
                    styles.controlButton,
                    {
                      borderColor: isDark ? 'rgba(25, 195, 230, 0.3)' : 'rgba(14, 165, 233, 0.3)',
                      backgroundColor: isDark ? 'rgba(25, 195, 230, 0.1)' : 'rgba(14, 165, 233, 0.08)',
                    },
                  ]}
                  onPress={toggleTheme}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  activeOpacity={0.7}
                >
                  {isDark ? (
                    <Sun size={20} color={theme.colors.primary} strokeWidth={2.5} />
                  ) : (
                    <Moon size={20} color={theme.colors.primary} strokeWidth={2.5} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  testID="btn-toggle-language"
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={language === 'en' ? 'Switch to Hebrew' : 'Switch to English'}
                  style={[
                    styles.controlButton,
                    styles.langButton,
                    {
                      borderColor: isDark ? 'rgba(25, 195, 230, 0.3)' : 'rgba(14, 165, 233, 0.3)',
                      backgroundColor: isDark ? 'rgba(25, 195, 230, 0.1)' : 'rgba(14, 165, 233, 0.08)',
                    },
                  ]}
                  onPress={toggleLanguage}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  activeOpacity={0.7}
                >
                  <Globe size={20} color={theme.colors.primary} strokeWidth={2.5} />
                  <Text style={[styles.langText, { color: theme.colors.primary }]}>
                    {language === 'en' ? 'EN' : 'עב'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
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
    paddingHorizontal: 24,
    maxWidth: 1400,
    alignSelf: 'center',
  },
  safeArea: {
    width: '100%',
  },
  logo: {
    fontSize: 26,
    fontWeight: '700' as const,
    letterSpacing: -0.8,
  },
  controls: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 44,
    minWidth: 44,
  },
  langButton: {
    minWidth: 72,
  },
  langText: {
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
});
