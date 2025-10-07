import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Globe, Sun, Moon, MessageCircle } from 'lucide-react-native';
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

  const handleWhatsApp = () => {
    console.log('Opening WhatsApp...');
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <View style={[styles.navBar, { backgroundColor: themeMode === 'dark' ? theme.colors.secondary + '95' : theme.colors.secondary + 'F5' }]} />
      ) : (
        <BlurView intensity={90} style={styles.navBar} tint={themeMode === 'dark' ? 'dark' : 'light'} />
      )}
      
      <View style={[styles.navContent, isRTL && styles.navContentRTL]}>
        <Text style={[styles.logo, { color: themeMode === 'dark' ? theme.colors.primary : '#1E40AF' }]}>AquaPump</Text>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.whatsappButton, { backgroundColor: theme.colors.success + '20', borderColor: theme.colors.success }]}
            onPress={handleWhatsApp}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MessageCircle size={22} color={theme.colors.success} strokeWidth={2.5} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, { borderColor: theme.colors.primary + '40', backgroundColor: themeMode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.8)' }]}
            onPress={toggleTheme}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {themeMode === 'dark' ? (
              <Sun size={22} color={theme.colors.primary} strokeWidth={2.5} />
            ) : (
              <Moon size={22} color={theme.colors.primary} strokeWidth={2.5} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, { borderColor: theme.colors.primary + '40', backgroundColor: themeMode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.8)' }]}
            onPress={toggleLanguage}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Globe size={22} color={theme.colors.primary} strokeWidth={2.5} />
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
    height: 110,
  },
  navContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  navContentRTL: {
    flexDirection: 'row-reverse',
  },
  logo: {
    fontSize: 28,
    fontWeight: '800' as const,
    letterSpacing: -0.8,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 2,
    minHeight: 50,
    minWidth: 50,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 50,
  },
  langText: {
    fontSize: 15,
    fontWeight: '700' as const,
  },
});