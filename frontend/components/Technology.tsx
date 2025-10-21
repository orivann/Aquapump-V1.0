import { useLanguage } from '@frontend/contexts/LanguageContext';
import { useTheme } from '@frontend/contexts/ThemeContext';
import { translations } from '@frontend/constants/translations';
import { Zap, Shield, Wifi } from 'lucide-react-native';
import React, { memo, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isRTL: boolean;
  theme: any;
  themeMode: 'light' | 'dark';
  index: number;
}

const FeatureCard = memo(function FeatureCard({ icon, title, description, isRTL, theme, themeMode, index }: FeatureCardProps) {
  const isDark = themeMode === 'dark';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay: index * 200,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        delay: index * 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : '#FFFFFF',
          borderColor: isDark ? 'rgba(34, 211, 238, 0.25)' : 'rgba(14, 165, 233, 0.2)',
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
        Platform.OS === 'web' && styles.cardWeb,
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
        {icon}
      </View>
      <Text style={[styles.cardTitle, isRTL && styles.rtlText, { color: isDark ? '#F0F9FF' : '#1E40AF' }]}>
        {title}
      </Text>
      <Text style={[styles.cardDescription, isRTL && styles.rtlText, { color: isDark ? '#CBD5E1' : '#64748B' }]}>
        {description}
      </Text>
    </Animated.View>
  );
});

interface TechnologyProps {
  scrollY: Animated.Value;
}

const Technology = memo(function Technology({ scrollY }: TechnologyProps) {
  const { t, isRTL } = useLanguage();
  const { theme, themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  const titleFadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(titleFadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(titleFadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isRTL]);

  const features = useMemo(() => [
    {
      icon: <Zap size={44} color={theme.colors.primary} strokeWidth={2} />,
      title: t(translations.technology.efficiency.title),
      description: t(translations.technology.efficiency.description),
    },
    {
      icon: <Shield size={44} color={theme.colors.primary} strokeWidth={2} />,
      title: t(translations.technology.durability.title),
      description: t(translations.technology.durability.description),
    },
    {
      icon: <Wifi size={44} color={theme.colors.primary} strokeWidth={2} />,
      title: t(translations.technology.smart.title),
      description: t(translations.technology.smart.description),
    },
  ], [theme.colors.primary, t]);

  const parallaxY = scrollY.interpolate({
    inputRange: [height * 0.5, height * 1.5],
    outputRange: [50, -50],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#0F1419' : '#F8FAFC',
          transform: [{ translateY: parallaxY }],
        },
      ]}
    >
      <Animated.View style={[styles.titleContainer, { opacity: titleFadeAnim }]}>
        <Text 
          accessibilityRole="header"
          style={[styles.sectionTitle, isRTL && styles.rtlText, { color: isDark ? '#38BDF8' : '#1E40AF' }]}>
          {t(translations.technology.title)}
        </Text>
      </Animated.View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
        style={styles.scrollView}
        decelerationRate="fast"
        snapToInterval={width * 0.8 + 24}
        snapToAlignment="start"
      >
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            isRTL={isRTL}
            theme={theme}
            themeMode={themeMode}
            index={index}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
});

export default Technology;

const styles = StyleSheet.create({
  container: {
    width: width,
    paddingVertical: 100,
    alignItems: 'center',
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 48,
  },
  sectionTitle: {
    fontSize: 44,
    fontWeight: '700' as const,
    textAlign: 'center',
    paddingHorizontal: 24,
    letterSpacing: -1,
  },
  rtlText: {
    writingDirection: 'rtl' as const,
  },
  scrollView: {
    width: '100%',
  },
  cardsContainer: {
    paddingHorizontal: 24,
    gap: 24,
  },
  card: {
    width: width * 0.8,
    maxWidth: 380,
    borderRadius: 24,
    padding: 32,
    marginRight: 24,
    borderWidth: 1,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  cardWeb: {
    ...(Platform.OS === 'web' && {
      transition: 'all 0.3s ease',
    } as any),
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '700' as const,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  cardDescription: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 28,
  },
});
