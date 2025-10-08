import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { translations } from '@/constants/translations';
import { MessageCircle } from 'lucide-react-native';
import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  PanResponder,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

function PumpVisual({ scrollY, theme }: { scrollY: Animated.Value; theme: any }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const parallaxAnim = scrollY.interpolate({
    inputRange: [0, height],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [rotateAnim, pulseAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.visualContainer,
        { transform: [{ translateY: parallaxAnim }] },
      ]}
    >
      <Animated.View
        style={[
          styles.pumpOuter,
          {
            transform: [{ rotate: rotation }, { scale: pulseAnim }],
            backgroundColor: theme.colors.primary + '30',
            borderColor: theme.colors.primary + '60',
          },
        ]}
      >
        <View style={[styles.pumpMiddle, { backgroundColor: theme.colors.accent + '80', borderColor: theme.colors.chrome + '40' }]}>
          <View style={[styles.pumpInner, { backgroundColor: theme.colors.primary }]} />
        </View>
      </Animated.View>
      
      <Animated.View
        style={[
          styles.ring1,
          {
            transform: [{ rotate: rotation }],
            borderColor: theme.colors.primary + '20',
          },
        ]}
      />
      
      <Animated.View
        style={[
          styles.ring2,
          {
            transform: [
              { rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['360deg', '0deg'],
              }) },
            ],
            borderColor: theme.colors.chrome + '15',
          },
        ]}
      />
    </Animated.View>
  );
}

function MagneticButton({ children, onPress, theme }: { children: React.ReactNode; onPress: () => void; theme: any }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (Platform.OS === 'web') {
          // Web magnetic effect
          const rect = (evt.currentTarget as any).getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const deltaX = gestureState.moveX - centerX;
          const deltaY = gestureState.moveY - centerY;
          const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
          if (distance < 100) {
            setPosition({ x: deltaX * 0.1, y: deltaY * 0.1 });
          }
        }
      },
      onPanResponderRelease: () => {
        setPosition({ x: 0, y: 0 });
        onPress();
      },
    })
  );

  return (
    <Animated.View
      style={{
        transform: [{ translateX: position.x }, { translateY: position.y }],
      }}
      {...panResponder.current.panHandlers}
    >
      {children}
    </Animated.View>
  );
}

interface HeroProps {
  scrollY: Animated.Value;
  onQuotePress?: () => void;
}

export default function Hero({ scrollY, onQuotePress }: HeroProps) {
  const { t, isRTL } = useLanguage();
  const { theme, themeMode } = useTheme();
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
        <Text style={[styles.headline, styles.centerText, { color: themeMode === 'dark' ? theme.colors.light : '#1E40AF' }]}>
          {t(translations.hero.headline)}
        </Text>
        <Text style={[styles.subheadline, styles.centerText, { color: themeMode === 'dark' ? theme.colors.gray : '#475569' }]}>
          {t(translations.hero.subheadline)}
        </Text>

        <View style={styles.buttonsWrapper}>
          <View style={[styles.ctaContainer, isRTL && styles.rtlRow]}>
            <MagneticButton onPress={handleExplore} theme={theme}>
              <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.colors.primary }, theme.shadows.md]}>
                <Text style={[styles.primaryButtonText, { color: '#FFFFFF' }]}>
                  {t(translations.hero.exploreCTA)}
                </Text>
              </TouchableOpacity>
            </MagneticButton>
            <MagneticButton onPress={handleQuote} theme={theme}>
              <TouchableOpacity style={[styles.secondaryButton, { borderColor: theme.colors.primary }]}>
                <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>
                  {t(translations.hero.quoteCTA)}
                </Text>
              </TouchableOpacity>
            </MagneticButton>
          </View>

          <MagneticButton onPress={handleWhatsApp} theme={theme}>
            <TouchableOpacity style={[styles.whatsappButton, { backgroundColor: theme.colors.success + '20', borderColor: theme.colors.success }]}>
              <MessageCircle size={20} color={theme.colors.success} strokeWidth={2.5} />
              <Text style={[styles.whatsappButtonText, { color: theme.colors.success }]}>
                {t(translations.hero.whatsappCTA)}
              </Text>
            </TouchableOpacity>
          </MagneticButton>
        </View>
      </Animated.View>

      <PumpVisual scrollY={scrollY} theme={theme} />

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
}

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
    fontSize: 48,
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