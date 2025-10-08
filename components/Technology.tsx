import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { translations } from '@/constants/translations';
import { Zap, Shield, Wifi } from 'lucide-react-native';
import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';

const { width } = Dimensions.get('window');

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isRTL: boolean;
  theme: any;
}

const FeatureCard = memo(function FeatureCard({ icon, title, description, isRTL, theme }: FeatureCardProps) {
  return (
    <View
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${title}: ${description}`}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.accent,
          borderColor: theme.colors.primary + '30',
        },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
        {icon}
      </View>
      <Text style={[styles.cardTitle, isRTL && styles.rtlText, { color: theme.colors.light }]}>{title}</Text>
      <Text style={[styles.cardDescription, isRTL && styles.rtlText, { color: theme.colors.gray }]}>
        {description}
      </Text>
    </View>
  );
});

export default function Technology({ scrollY }: { scrollY: Animated.Value }) {
  const { t, isRTL } = useLanguage();
  const { theme, themeMode } = useTheme();
  const isDark = themeMode === 'dark';

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
    <View style={[styles.container, { backgroundColor: isDark ? theme.colors.dark : theme.colors.secondary }]}>
      <Text 
        accessibilityRole="header"
        style={[styles.sectionTitle, isRTL && styles.rtlText, { color: isDark ? theme.colors.light : '#1E40AF' }]}>
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
            isRTL={isRTL}
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