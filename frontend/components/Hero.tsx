import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { translations } from '../constants/translations';
import { ArrowRight } from 'lucide-react-native';
import React, { useRef, useEffect, memo } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import WaveBottom from './WaveBottom';

const { width, height } = Dimensions.get('window');

interface HeroProps {
  scrollY: Animated.Value;
  onQuotePress?: () => void;
}

const Hero = memo(function Hero({ scrollY, onQuotePress }: HeroProps) {
  const { isRTL, t, language } = useLanguage();
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;
  const headlineFadeAnim = useRef(new Animated.Value(1)).current;

  const handleExplore = () => {
    router.push('/pumps');
  };

  const handleQuote = () => {
    if (onQuotePress) {
      onQuotePress();
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headlineFadeAnim, {
        toValue: 0.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(headlineFadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [language, headlineFadeAnim]);

  const parallaxY = scrollY.interpolate({
    inputRange: [0, height],
    outputRange: [0, -height * 0.3],
    extrapolate: 'clamp',
  });

  const contentOpacity = scrollY.interpolate({
    inputRange: [0, height * 0.5],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={isDark ? ['#1a1f2e', '#0f1419'] : ['#5B67F5', '#7B68EE', '#9B88FF']}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: Animated.multiply(fadeAnim, contentOpacity),
              transform: [
                { translateY: Animated.add(slideAnim, parallaxY) },
              ],
            },
          ]}
        >
          <View style={styles.badge}>
            <View style={[styles.badgeIcon, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
              <View style={[styles.badgeIconInner, { backgroundColor: '#FFFFFF' }]} />
            </View>
            <Text style={styles.badgeText}>{language === 'en' ? 'Industry-Leading Water Solutions' : 'פתרונות מים מובילים בתעשייה'}</Text>
          </View>

          <Animated.View style={[styles.headlineContainer, { opacity: headlineFadeAnim }]}>
            <Text 
              accessibilityRole="header"
              style={[
                styles.headline,
                isRTL && styles.rtlText,
              ]}>
              {t(translations.hero.headline)}
            </Text>
            <Text style={[
                styles.subheadline,
                isRTL && styles.rtlText,
              ]}>
              {t(translations.hero.subheadline)}
            </Text>
          </Animated.View>

          <View style={styles.buttonsWrapper}>
            <View style={[styles.ctaContainer, isRTL && styles.rtlRow]}>
              <TouchableOpacity 
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Explore Technology"
                style={[
                  styles.primaryButton,
                  Platform.OS === 'web' && styles.primaryButtonWeb,
                ]}
                onPress={handleExplore}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryButtonText}>
                  {t(translations.hero.exploreCTA)}
                </Text>
                <ArrowRight size={20} color="#5B67F5" strokeWidth={2.5} />
              </TouchableOpacity>
              <TouchableOpacity 
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Get a quote"
                style={[
                  styles.secondaryButton,
                  Platform.OS === 'web' && styles.secondaryButtonWeb,
                ]}
                onPress={handleQuote}
                activeOpacity={0.85}
              >
                <Text style={styles.secondaryButtonText}>
                  {t(translations.hero.quoteCTA)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <WaveBottom color={isDark ? '#0F1419' : '#F8FAFC'} />
      </LinearGradient>
    </View>
  );
});

export default Hero;

const styles = StyleSheet.create({
  wrapper: {
    width: width,
    minHeight: height,
  },
  gradientContainer: {
    width: '100%',
    minHeight: height,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  content: {
    zIndex: 10,
    alignItems: 'center',
    paddingHorizontal: 24,
    maxWidth: 900,
    width: '100%',
    paddingBottom: 120,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  badgeIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeIconInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500' as const,
  },
  headlineContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 48,
  },
  headline: {
    fontSize: 56,
    fontWeight: '700' as const,
    marginBottom: 24,
    letterSpacing: -1.5,
    lineHeight: 64,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  subheadline: {
    fontSize: 20,
    fontWeight: '400' as const,
    lineHeight: 32,
    maxWidth: 700,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  rtlText: {
    writingDirection: 'rtl' as const,
  },
  buttonsWrapper: {
    alignItems: 'center',
    gap: 20,
    width: '100%',
  },
  ctaContainer: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonWeb: {
    ...(Platform.OS === 'web' && {
      transition: 'all 0.3s ease',
    } as any),
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
    color: '#5B67F5',
  },
  secondaryButton: {
    paddingHorizontal: 36,
    paddingVertical: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  secondaryButtonWeb: {
    ...(Platform.OS === 'web' && {
      transition: 'all 0.3s ease',
    } as any),
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
    color: '#FFFFFF',
  },
});
