import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { translations } from '@/constants/translations';
import { MessageCircle, ChevronDown } from 'lucide-react-native';
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

const { width, height } = Dimensions.get('window');

const PumpVisual = memo(function PumpVisual({ theme, scrollY }: { theme: any; scrollY: Animated.Value }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );

    pulseAnimation.start();
    rotateAnimation.start();

    return () => {
      pulseAnimation.stop();
      rotateAnimation.stop();
    };
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const parallaxScale = scrollY.interpolate({
    inputRange: [0, height],
    outputRange: [1, 1.3],
    extrapolate: 'clamp',
  });

  const parallaxOpacity = scrollY.interpolate({
    inputRange: [0, height * 0.5],
    outputRange: [0.4, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.visualContainer,
        {
          opacity: parallaxOpacity,
          transform: [{ scale: parallaxScale }],
        },
      ]}
    >
      <Animated.View
        style={[
          styles.pumpOuter,
          {
            transform: [{ scale: pulseAnim }, { rotate }],
            backgroundColor: theme.colors.primary + '20',
            borderColor: theme.colors.primary + '40',
          },
        ]}
      >
        <View style={[styles.pumpMiddle, { backgroundColor: theme.colors.primary + '30', borderColor: theme.colors.primary + '50' }]}>
          <View style={[styles.pumpInner, { backgroundColor: theme.colors.primary }]} />
        </View>
      </Animated.View>
      
      <Animated.View
        style={[
          styles.ring1,
          {
            borderColor: theme.colors.primary + '15',
            transform: [{ rotate }],
          },
        ]}
      />
      
      <Animated.View
        style={[
          styles.ring2,
          {
            borderColor: theme.colors.primary + '10',
            transform: [{ rotate: '-45deg' }],
          },
        ]}
      />
    </Animated.View>
  );
});

interface HeroProps {
  scrollY: Animated.Value;
  onQuotePress?: () => void;
}

const Hero = memo(function Hero({ scrollY, onQuotePress }: HeroProps) {
  const { t, isRTL } = useLanguage();
  const { theme, themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;

  const handleWhatsApp = () => {
    console.log('Opening WhatsApp...');
  };

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
  }, []);

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
    <View style={[styles.container, { backgroundColor: isDark ? '#0A1929' : '#F8FAFC' }]}>
      <PumpVisual theme={theme} scrollY={scrollY} />

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
        <Text 
          accessibilityRole="header"
          style={[styles.headline, styles.centerText, { color: isDark ? theme.colors.primary : '#1E40AF' }]}>
          {t(translations.hero.headline)}
        </Text>
        <Text style={[styles.subheadline, styles.centerText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
          {t(translations.hero.subheadline)}
        </Text>

        <View style={styles.buttonsWrapper}>
          <View style={[styles.ctaContainer, isRTL && styles.rtlRow]}>
            <TouchableOpacity 
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Explore our pump models"
              style={[
                styles.primaryButton,
                { backgroundColor: theme.colors.primary },
                Platform.OS === 'web' && styles.primaryButtonWeb,
              ]}
              onPress={handleExplore}
              activeOpacity={0.85}
            >
              <Text style={[styles.primaryButtonText, { color: '#FFFFFF' }]}>
                {t(translations.hero.exploreCTA)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Get a quote"
              style={[
                styles.secondaryButton,
                {
                  borderColor: theme.colors.primary,
                  backgroundColor: isDark ? 'rgba(25, 195, 230, 0.1)' : 'rgba(14, 165, 233, 0.08)',
                },
                Platform.OS === 'web' && styles.secondaryButtonWeb,
              ]}
              onPress={handleQuote}
              activeOpacity={0.85}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>
                {t(translations.hero.quoteCTA)}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Chat on WhatsApp"
            style={[
              styles.whatsappButton,
              {
                backgroundColor: isDark ? 'rgba(0, 255, 136, 0.15)' : 'rgba(16, 185, 129, 0.1)',
                borderColor: isDark ? '#00FF88' : '#10B981',
              },
            ]}
            onPress={handleWhatsApp}
            activeOpacity={0.85}
          >
            <MessageCircle size={20} color={isDark ? '#00FF88' : '#10B981'} strokeWidth={2.5} />
            <Text style={[styles.whatsappButtonText, { color: isDark ? '#00FF88' : '#10B981' }]}>
              {t(translations.hero.whatsappCTA)}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.scrollIndicator,
          {
            opacity: contentOpacity,
          },
        ]}
      >
        <ChevronDown size={24} color={theme.colors.primary} strokeWidth={2} />
      </Animated.View>
    </View>
  );
});

export default Hero;

const styles = StyleSheet.create({
  container: {
    width: width,
    minHeight: height,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  visualContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pumpOuter: {
    width: 280,
    height: 280,
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  pumpMiddle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  pumpInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  ring1: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  ring2: {
    position: 'absolute',
    width: 520,
    height: 520,
    borderRadius: 260,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  content: {
    zIndex: 10,
    alignItems: 'center',
    paddingHorizontal: 24,
    maxWidth: 900,
    width: '100%',
  },
  headline: {
    fontSize: 52,
    fontWeight: '700' as const,
    marginBottom: 20,
    letterSpacing: -1.5,
    lineHeight: 60,
  },
  subheadline: {
    fontSize: 20,
    fontWeight: '400' as const,
    marginBottom: 48,
    lineHeight: 32,
    maxWidth: 700,
  },
  centerText: {
    textAlign: 'center',
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
    paddingHorizontal: 36,
    paddingVertical: 18,
    borderRadius: 14,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
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
  },
  secondaryButton: {
    paddingHorizontal: 36,
    paddingVertical: 18,
    borderRadius: 14,
    borderWidth: 2,
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
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  whatsappButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
});
