import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { translations } from '@/constants/translations';
import { Mail, MessageSquare } from 'lucide-react-native';
import { useState, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

const { width } = Dimensions.get('window');

const Contact = memo(function Contact() {
  const { t, isRTL } = useLanguage();
  const { theme, themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert(
        isRTL ? 'שגיאה' : 'Error',
        isRTL ? 'אנא מלא את כל השדות' : 'Please fill all fields'
      );
      return;
    }

    Alert.alert(
      isRTL ? 'תודה!' : 'Thank you!',
      isRTL ? 'נחזור אליך בקרוב' : "We'll get back to you soon"
    );
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? theme.colors.dark : theme.colors.secondary }]}>
      <Text 
        accessibilityRole="header"
        style={[styles.sectionTitle, styles.centerText, { color: isDark ? theme.colors.light : '#1E40AF' }]}>
        {t(translations.contact.title)}
      </Text>

      <View style={styles.formContainer}>
        <View style={[styles.inputGroup, { backgroundColor: isDark ? theme.colors.accent : '#FFFFFF', borderColor: isDark ? 'transparent' : theme.colors.primary + '20' }]}>
          <Mail size={20} color={theme.colors.primary} strokeWidth={2} />
          <TextInput
            style={[styles.input, isRTL && styles.inputRTL, { color: isDark ? theme.colors.light : '#0F172A' }]}
            value={name}
            onChangeText={setName}
            placeholder={t(translations.contact.name)}
            placeholderTextColor={isDark ? theme.colors.gray : '#94A3B8'}
          />
        </View>

        <View style={[styles.inputGroup, { backgroundColor: isDark ? theme.colors.accent : '#FFFFFF', borderColor: isDark ? 'transparent' : theme.colors.primary + '20' }]}>
          <Mail size={20} color={theme.colors.primary} strokeWidth={2} />
          <TextInput
            style={[styles.input, isRTL && styles.inputRTL, { color: isDark ? theme.colors.light : '#0F172A' }]}
            value={email}
            onChangeText={setEmail}
            placeholder={t(translations.contact.email)}
            placeholderTextColor={isDark ? theme.colors.gray : '#94A3B8'}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={[styles.inputGroup, { backgroundColor: isDark ? theme.colors.accent : '#FFFFFF', borderColor: isDark ? 'transparent' : theme.colors.primary + '20' }]}>
          <MessageSquare size={20} color={theme.colors.primary} strokeWidth={2} />
          <TextInput
            style={[styles.input, styles.textArea, isRTL && styles.inputRTL, { color: isDark ? theme.colors.light : '#0F172A' }]}
            value={message}
            onChangeText={setMessage}
            placeholder={t(translations.contact.message)}
            placeholderTextColor={isDark ? theme.colors.gray : '#94A3B8'}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity 
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Submit contact form"
          style={[styles.submitButton, { backgroundColor: theme.colors.primary }, theme.shadows.md]} 
          onPress={handleSubmit}>
          <Text style={[styles.submitButtonText, { color: '#FFFFFF' }]}>{t(translations.contact.send)}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Contact via WhatsApp"
          style={[styles.whatsappButton, { borderColor: theme.colors.success, backgroundColor: isDark ? 'transparent' : theme.colors.success + '10' }]}>
          <MessageSquare size={20} color={theme.colors.success} strokeWidth={2} />
          <Text style={[styles.whatsappButtonText, { color: theme.colors.success }]}>{t(translations.contact.whatsapp)}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.footer, { borderTopColor: theme.colors.primary + '30' }]}>
        <Text style={[styles.footerText, styles.centerText, { color: theme.colors.gray }]}>
          {t(translations.footer.copyright)}
        </Text>
      </View>
    </View>
  );
});

export default Contact;

const styles = StyleSheet.create({
  container: {
    width: width,
    paddingVertical: 96,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 40,
    fontWeight: '700' as const,
    marginBottom: 48,
    paddingHorizontal: 24,
  },
  centerText: {
    textAlign: 'center',
  },
  formContainer: {
    width: '90%',
    maxWidth: 600,
    gap: 24,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  inputRTL: {
    textAlign: 'right',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    marginTop: 4,
  },
  whatsappButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  footer: {
    marginTop: 96,
    paddingTop: 32,
    borderTopWidth: 1,
    width: '90%',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
});