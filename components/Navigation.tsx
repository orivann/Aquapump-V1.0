import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Globe, Sun, Moon } from 'lucide-react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { memo } from 'react';

const Navigation = memo(function Navigation() {
  const { language, changeLanguage, isRTL } = useLanguage();
  const { theme, themeMode, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    changeLanguage(language === 'en' ? 'he' : 'en');
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <View style={[styles.navBar, { backgroundColor: themeMode === 'dark' ? theme.colors.secondary + '95' : theme.colors.secondary + 'F5' }]} />
      ) : (
        <BlurView intensity={90} style={styles.navBar} tint={themeMode === 'dark' ? 'dark' : 'light'} />
      )}
      
      <View style={[styles.navContent, isRTL && styles.navContentRTL]}>
        <Text 
          accessibilityRole="header"
          style={[styles.logo, { color: themeMode === 'dark' ? theme.colors.primary : '#1E40AF' }]}>AquaPump</Text>

        <View style={styles.controls}>
          <TouchableOpacity
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={[styles.controlButton, { borderColor: theme.colors.primary + '40', backgroundColor: themeMode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.8)' }]}
            onPress={toggleTheme}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            {themeMode === 'dark' ? (
              <Sun size={24} color={theme.colors.primary} strokeWidth={2.5} />
            ) : (
              <Moon size={24} color={theme.colors.primary} strokeWidth={2.5} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={language === 'en' ? 'Switch to Hebrew' : 'Switch to English'}
            style={[styles.controlButton, { borderColor: theme.colors.primary + '40', backgroundColor: themeMode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.8)' }]}
            onPress={toggleLanguage}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Globe size={24} color={theme.colors.primary} strokeWidth={2.5} />
            <Text style={[styles.langText, { color: themeMode === 'dark' ? '#FFFFFF' : theme.colors.primary }]}>{language === 'en' ? 'EN' : 'עב'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

export default Navigation;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  navBar: {
    height: 100,
  },
  navContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Platform.OS === 'web' ? 48 : 32,
    paddingTop: 12,
    maxWidth: Platform.OS === 'web' ? 1400 : undefined,
    alignSelf: 'center',
    width: '100%',
  },
  navContentRTL: {
    flexDirection: 'row-reverse',
  },
  logo: {
    fontSize: Platform.OS === 'web' ? 36 : 32,
    fontWeight: '800' as const,
    letterSpacing: -0.8,
    marginRight: Platform.OS === 'web' ? 60 : 24,
  },
  controls: {
    flexDirection: 'row',
    gap: Platform.OS === 'web' ? 18 : 14,
    marginLeft: Platform.OS === 'web' ? 60 : 24,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    minHeight: 50,
    minWidth: 50,
  },
  langText: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
});