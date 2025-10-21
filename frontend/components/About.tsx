import { View, Text, StyleSheet, Dimensions, Animated, Platform } from 'react-native';
import { useLanguage } from '@frontend/contexts/LanguageContext';
import { useTheme } from '@frontend/contexts/ThemeContext';
import { translations } from '@frontend/constants/translations';
import { Building2, MapPin, Award } from 'lucide-react-native';
import { memo, useRef, useEffect } from 'react';

const { width } = Dimensions.get('window');

const About = memo(function About() {
  const { language, isRTL } = useLanguage();
  const { theme, themeMode } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const titleFadeAnim = useRef(new Animated.Value(1)).current;

  const isDark = themeMode === 'dark';

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 45,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#1A1F2E' : '#FFFFFF',
        },
      ]}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Animated.View style={[styles.titleContainer, { opacity: titleFadeAnim }]}>
          <Text
            accessibilityRole="header"
            style={[
              styles.title,
              isRTL && styles.rtlText,
              {
                color: isDark ? '#38BDF8' : '#1E40AF',
              },
            ]}
          >
            {translations.about.title[language]}
          </Text>
        </Animated.View>

        <Text
          style={[
            styles.description,
            {
              color: isDark ? '#CBD5E1' : '#64748B',
              textAlign: 'center',
            },
          ]}
        >
          {translations.about.description[language]}
        </Text>

        <View style={styles.infoGrid}>
          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : '#F8FAFC',
                borderColor: isDark ? 'rgba(34, 211, 238, 0.25)' : 'rgba(14, 165, 233, 0.15)',
              },
              Platform.OS === 'web' && styles.infoCardWeb,
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
              <Building2 size={24} color={theme.colors.primary} strokeWidth={2} />
            </View>
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.infoTitle,
                  {
                    color: isDark ? '#F0F9FF' : '#1E40AF',
                  },
                ]}
              >
                {translations.about.company[language]}
              </Text>
              <Text
                style={[
                  styles.infoText,
                  {
                    color: isDark ? '#CBD5E1' : '#64748B',
                  },
                ]}
              >
                {translations.about.companyName[language]}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : '#F8FAFC',
                borderColor: isDark ? 'rgba(34, 211, 238, 0.25)' : 'rgba(14, 165, 233, 0.15)',
              },
              Platform.OS === 'web' && styles.infoCardWeb,
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
              <MapPin size={24} color={theme.colors.primary} strokeWidth={2} />
            </View>
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.infoTitle,
                  {
                    color: isDark ? '#F0F9FF' : '#1E40AF',
                  },
                ]}
              >
                {translations.about.location[language]}
              </Text>
              <Text
                style={[
                  styles.infoText,
                  {
                    color: isDark ? '#CBD5E1' : '#64748B',
                  },
                ]}
              >
                {translations.about.locationName[language]}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : '#F8FAFC',
                borderColor: isDark ? 'rgba(34, 211, 238, 0.25)' : 'rgba(14, 165, 233, 0.15)',
              },
              Platform.OS === 'web' && styles.infoCardWeb,
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
              <Award size={24} color={theme.colors.primary} strokeWidth={2} />
            </View>
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.infoTitle,
                  {
                    color: isDark ? '#F0F9FF' : '#1E40AF',
                  },
                ]}
              >
                {translations.about.experience[language]}
              </Text>
              <Text
                style={[
                  styles.infoText,
                  {
                    color: isDark ? '#CBD5E1' : '#64748B',
                  },
                ]}
              >
                {translations.about.experienceYears[language]}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
});

export default About;

const styles = StyleSheet.create({
  container: {
    width: width,
    paddingVertical: 100,
    paddingHorizontal: 24,
  },
  content: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 44,
    fontWeight: '700' as const,
    letterSpacing: -1,
    textAlign: 'center',
  },
  rtlText: {
    writingDirection: 'rtl' as const,
  },
  description: {
    fontSize: 18,
    lineHeight: 30,
    marginBottom: 56,
    maxWidth: 800,
    alignSelf: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 20,
    gap: 16,
    borderWidth: 1,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    minWidth: 280,
  },
  infoCardWeb: {
    ...(Platform.OS === 'web' && {
      transition: 'all 0.3s ease',
    } as any),
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  textContainer: {
    flexDirection: 'column',
    gap: 4,
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  infoText: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
});
