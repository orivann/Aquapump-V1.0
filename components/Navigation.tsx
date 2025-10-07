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
        <View style={[styles.navBar, { backgroundColor: theme.colors.secondary + '80' }]} />
      ) : (
        <BlurView intensity={80} style={styles.navBar} tint={themeMode === 'dark' ? 'dark' : 'light'} />
      )}
      
      <View style={[styles.navContent, isRTL && styles.navContentRTL]}>
        <Text style={[styles.logo, { color: theme.colors.light }]}>AquaPump</Text>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, { borderColor: theme.colors.primary + '40' }]}
            onPress={toggleTheme}
          >
            {themeMode === 'dark' ? (
              <Sun size={20} color={theme.colors.primary} strokeWidth={2} />
            ) : (
              <Moon size={20} color={theme.colors.primary} strokeWidth={2} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, { borderColor: theme.colors.primary + '40' }]}
            onPress={toggleLanguage}
          >
            <Globe size={20} color={theme.colors.primary} strokeWidth={2} />
            <Text style={[styles.langText, { color: theme.colors.light }]}>{language === 'en' ? 'EN' : 'עב'}</Text>
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
    height: 70,
  },
  navContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  navContentRTL: {
    flexDirection: 'row-reverse',
  },
  logo: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
  },
  langText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
});