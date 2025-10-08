import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { translations } from '@/constants/translations';
import { Zap, Shield, Wifi } from 'lucide-react-native';
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  isRTL: boolean;
  scrollY: Animated.Value;
  theme: any;
}

function FeatureCard({ icon, title, description, delay, isRTL, scrollY, theme }: FeatureCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const depthAnim = scrollY.interpolate({
    inputRange: [height * 0.5, height * 1.5],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, fadeAnim, scaleAnim]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ scale: Animated.multiply(scaleAnim, depthAnim) }],
          backgroundColor: theme.colors.accent,
          borderColor: theme.colors.primary + '30',
        },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
        <Text>{icon}</Text>
      </View>
      <Text style={[styles.cardTitle, isRTL && styles.rtlText, { color: theme.colors.light }]}>{title}</Text>
      <Text style={[styles.cardDescription, isRTL && styles.rtlText, { color: theme.colors.gray }]}>
        {description}
      </Text>
    </Animated.View>
  );
}

export default function Technology({ scrollY }: { scrollY: Animated.Value }) {
  const { t, isRTL } = useLanguage();
  const { theme, themeMode } = useTheme();

  const features = [
    {
      icon: <Zap size={40} color={theme.colors.primary} strokeWidth={2} />,
      title: t(translations.technology.efficiency.title),
      description: t(translations.technology.efficiency.description),
    },
    {
      icon: <Shield size={40} color={theme.colors.primary} strokeWidth={2} />,
      title: t(translations.technology.durability.title),
      description: t(translations.technology.durability.description),
    },
    {
      icon: <Wifi size={40} color={theme.colors.primary} strokeWidth={2} />,
      title: t(translations.technology.smart.title),
      description: t(translations.technology.smart.description),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: themeMode === 'dark' ? theme.colors.dark : theme.colors.secondary }]}>
      <Text style={[styles.sectionTitle, isRTL && styles.rtlText, { color: themeMode === 'dark' ? theme.colors.light : '#1E40AF' }]}>
        {t(translations.technology.title)}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
        style={styles.scrollView}
      >
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            delay={index * 200}
            isRTL={isRTL}
            scrollY={scrollY}
            theme={theme}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    paddingVertical: 96,
  },
  sectionTitle: {
    fontSize: 40,
    fontWeight: '700' as const,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  rtlText: {
    textAlign: 'right',
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
    maxWidth: 350,
    borderRadius: 24,
    padding: 24,
    marginRight: 24,
    borderWidth: 1,
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
});