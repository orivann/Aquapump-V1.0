import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { translations } from '@/constants/translations';
import { Building2, MapPin, Award } from 'lucide-react-native';

export default function About() {
  const { language } = useLanguage();
  const { theme, themeMode } = useTheme();

  const isDark = themeMode === 'dark';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? theme.colors.dark : theme.colors.light,
        },
      ]}
    >
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: isDark ? theme.colors.primary : '#1E40AF',
              textAlign: 'center',
            },
          ]}
        >
          {translations.about.title[language]}
        </Text>

        <Text
          style={[
            styles.description,
            {
              color: isDark ? theme.colors.textSecondary : '#475569',
              textAlign: 'center',
            },
          ]}
        >
          {translations.about.description[language]}
        </Text>

        <View style={styles.infoGrid}>
          <View style={[styles.infoCard, { backgroundColor: isDark ? theme.colors.cardDark : theme.colors.cardLight }]}>
            <Building2 size={18} color={theme.colors.primary} style={styles.icon} />
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.infoTitle,
                  {
                    color: isDark ? theme.colors.text : '#1E40AF',
                  },
                ]}
              >
                {translations.about.company[language]}
              </Text>
              <Text
                style={[
                  styles.infoText,
                  {
                    color: isDark ? theme.colors.textSecondary : '#475569',
                  },
                ]}
              >
                {translations.about.companyName[language]}
              </Text>
            </View>
          </View>

          <View style={[styles.infoCard, { backgroundColor: isDark ? theme.colors.cardDark : theme.colors.cardLight }]}>
            <MapPin size={18} color={theme.colors.primary} style={styles.icon} />
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.infoTitle,
                  {
                    color: isDark ? theme.colors.text : '#1E40AF',
                  },
                ]}
              >
                {translations.about.location[language]}
              </Text>
              <Text
                style={[
                  styles.infoText,
                  {
                    color: isDark ? theme.colors.textSecondary : '#475569',
                  },
                ]}
              >
                {translations.about.locationName[language]}
              </Text>
            </View>
          </View>

          <View style={[styles.infoCard, { backgroundColor: isDark ? theme.colors.cardDark : theme.colors.cardLight }]}>
            <Award size={18} color={theme.colors.primary} style={styles.icon} />
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.infoTitle,
                  {
                    color: isDark ? theme.colors.text : '#1E40AF',
                  },
                ]}
              >
                {translations.about.experience[language]}
              </Text>
              <Text
                style={[
                  styles.infoText,
                  {
                    color: isDark ? theme.colors.textSecondary : '#475569',
                  },
                ]}
              >
                {translations.about.experienceYears[language]}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  content: {
    maxWidth: 1000,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    flexShrink: 0,
  },
  textContainer: {
    flexDirection: 'column',
    gap: 2,
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 16,
  },
});
