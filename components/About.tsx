import { View, Text, StyleSheet, Animated } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { translations } from '@/constants/translations';
import { Building2, MapPin, Award } from 'lucide-react-native';

interface AboutProps {
  scrollY: Animated.Value;
}

export default function About({ scrollY }: AboutProps) {
  const { language, isRTL } = useLanguage();
  const { theme, themeMode } = useTheme();

  const opacity = scrollY.interpolate({
    inputRange: [0, 200, 400],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const translateY = scrollY.interpolate({
    inputRange: [0, 200, 400],
    outputRange: [50, 50, 0],
    extrapolate: 'clamp',
  });

  const isDark = themeMode === 'dark';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? theme.colors.dark : theme.colors.light,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: isDark ? theme.colors.primary : theme.colors.accent,
              textAlign: isRTL ? 'right' : 'left',
              writingDirection: isRTL ? 'rtl' : 'ltr',
            },
          ]}
        >
          {translations.about.title[language]}
        </Text>

        <Text
          style={[
            styles.description,
            {
              color: isDark ? theme.colors.textSecondary : theme.colors.textDark,
              textAlign: isRTL ? 'right' : 'left',
              writingDirection: isRTL ? 'rtl' : 'ltr',
            },
          ]}
        >
          {translations.about.description[language]}
        </Text>

        <View style={styles.infoGrid}>
          <View style={[styles.infoCard, { backgroundColor: isDark ? theme.colors.cardDark : theme.colors.cardLight }]}>
            <Building2 size={32} color={theme.colors.primary} style={styles.icon} />
            <Text
              style={[
                styles.infoTitle,
                {
                  color: isDark ? theme.colors.text : theme.colors.accent,
                  textAlign: 'center',
                },
              ]}
            >
              {translations.about.company[language]}
            </Text>
            <Text
              style={[
                styles.infoText,
                {
                  color: isDark ? theme.colors.textSecondary : theme.colors.textDark,
                  textAlign: 'center',
                },
              ]}
            >
              {translations.about.companyName[language]}
            </Text>
          </View>

          <View style={[styles.infoCard, { backgroundColor: isDark ? theme.colors.cardDark : theme.colors.cardLight }]}>
            <MapPin size={32} color={theme.colors.primary} style={styles.icon} />
            <Text
              style={[
                styles.infoTitle,
                {
                  color: isDark ? theme.colors.text : theme.colors.accent,
                  textAlign: 'center',
                },
              ]}
            >
              {translations.about.location[language]}
            </Text>
            <Text
              style={[
                styles.infoText,
                {
                  color: isDark ? theme.colors.textSecondary : theme.colors.textDark,
                  textAlign: 'center',
                },
              ]}
            >
              {translations.about.locationName[language]}
            </Text>
          </View>

          <View style={[styles.infoCard, { backgroundColor: isDark ? theme.colors.cardDark : theme.colors.cardLight }]}>
            <Award size={32} color={theme.colors.primary} style={styles.icon} />
            <Text
              style={[
                styles.infoTitle,
                {
                  color: isDark ? theme.colors.text : theme.colors.accent,
                  textAlign: 'center',
                },
              ]}
            >
              {translations.about.experience[language]}
            </Text>
            <Text
              style={[
                styles.infoText,
                {
                  color: isDark ? theme.colors.textSecondary : theme.colors.textDark,
                  textAlign: 'center',
                },
              ]}
            >
              {translations.about.experienceYears[language]}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  content: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '700' as const,
    marginBottom: 24,
  },
  description: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 48,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
  },
  infoCard: {
    flex: 1,
    minWidth: 250,
    maxWidth: 350,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  icon: {
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
