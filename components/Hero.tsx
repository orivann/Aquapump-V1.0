import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { translations } from '@/constants/translations';
import { MessageCircle } from 'lucide-react-native';
import React, { useRef, useEffect, memo } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const PumpVisual = memo(function PumpVisual({ theme }: { theme: any }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <View style={styles.visualContainer}>
      <Animated.View
        style={[
          styles.pumpOuter,
          {
            transform: [{ scale: pulseAnim }],
            backgroundColor: theme.colors.primary + '30',
            borderColor: theme.colors.primary + '60',
          },
        ]}
      >
        <View style={[styles.pumpMiddle, { backgroundColor: theme.colors.accent + '80', borderColor: theme.colors.chrome + '40' }]}>
          <View style={[styles.pumpInner, { backgroundColor: theme.colors.primary }]} />
        </View>
      </Animated.View>
      
      <View
        style={[
          styles.ring1,
          {
            borderColor: theme.colors.primary + '20',
          },
        ]}
      />
      
      <View
        style={[
          styles.ring2,
          {
            borderColor: theme.colors.chrome + '15',
          },
        ]}
      />
    </View>
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
  const slideAnim = useRef(new Animated.Value(50)).current;

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
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <View style={[styles.container, { backgroundColor: theme.gradients.hero[0] }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text 
          accessibilityRole="header"
          style={[styles.headline, styles.centerText, { color: isDark ? theme.colors.light : '#1E40AF' }]}>
          {t(translations.hero.headline)}
        </Text>
        <Text style={[styles.subheadline, styles.centerText, { color: isDark ? theme.colors.gray : '#475569' }]}>
          {t(translations.hero.subheadline)}
        </Text>

        <View style={styles.buttonsWrapper}>
          <View style={[styles.ctaContainer, isRTL && styles.rtlRow]}>
            <TouchableOpacity 
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Explore our pump models"
              style={[styles.primaryButton, { backgroundColor: theme.colors.primary }, theme.shadows.md]}
              onPress={handleExplore}
              activeOpacity={0.8}
            >
              <Text style={[styles.primaryButtonText, { color: '#FFFFFF' }]}>
                {t(translations.hero.exploreCTA)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Get a quote"
              style={[styles.secondaryButton, { borderColor: theme.colors.primary, backgroundColor: isDark ? 'transparent' : '#FFFFFF' }]}
              onPress={handleQuote}
              activeOpacity={0.8}
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
            style={[styles.whatsappButton, { backgroundColor: theme.colors.success + '20', borderColor: theme.colors.success }]}
            onPress={handleWhatsApp}
            activeOpacity={0.8}
          >
            <MessageCircle size={20} color={theme.colors.success} strokeWidth={2.5} />
            <Text style={[styles.whatsappButtonText, { color: theme.colors.success }]}>
              {t(translations.hero.whatsappCTA)}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <PumpVisual theme={theme} />

      <View style={styles.scrollIndicator}>
        <Animated.View
          style={[
            styles.scrollDot,
            {
              opacity: fadeAnim,
              backgroundColor: theme.colors.primary,
            },
          ]}
        />
      </View>
    </View>
  );
});

export default Hero;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visualContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.4,
  },
  pumpOuter: {
    width: 300,
    height: 300,
    borderRadius: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  pumpMiddle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  pumpInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  ring1: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  ring2: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  content: {
    zIndex: 10,
    alignItems: 'center',
    paddingHorizontal: 24,
    maxWidth: 800,
  },
  headline: {
    fontSize: 64,
    fontWeight: '700' as const,
    marginBottom: 16,
    letterSpacing: -1,
  },
  subheadline: {
    fontSize: 18,
    fontWeight: '400' as const,
    marginBottom: 40,
    lineHeight: 28,
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
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  primaryButtonText: {
    color: '#050A14',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  secondaryButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
  },
  whatsappButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  scrollDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
