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

export default function Navigation() {
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
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  navBar: {
    height: 80,
  },
  navContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  navContentRTL: {
    flexDirection: 'row-reverse',
  },
  logo: {
    fontSize: 26,
    fontWeight: '800' as const,
    letterSpacing: -0.8,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    minHeight: 44,
    minWidth: 44,
  },
  langText: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
});