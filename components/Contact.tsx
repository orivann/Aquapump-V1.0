import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { translations } from '@/constants/translations';
import { Mail, MessageSquare } from 'lucide-react-native';
import { useState } from 'react';
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

export default function Contact() {
  const { t, isRTL } = useLanguage();
  const { theme, themeMode } = useTheme();
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
    <View style={[styles.container, { backgroundColor: themeMode === 'dark' ? theme.colors.dark : theme.colors.secondary }]}>
      <Text style={[styles.sectionTitle, styles.centerText, { color: themeMode === 'dark' ? theme.colors.light : '#1E40AF' }]}>
        {t(translations.contact.title)}
      </Text>

      <View style={styles.formContainer}>
        <View style={[styles.inputGroup, { backgroundColor: theme.colors.accent }]}>
          <Mail size={20} color={theme.colors.primary} strokeWidth={2} />
          <TextInput
            style={[styles.input, isRTL && styles.inputRTL, { color: theme.colors.light }]}
            value={name}
            onChangeText={setName}
            placeholder={t(translations.contact.name)}
            placeholderTextColor={theme.colors.gray}
          />
        </View>

        <View style={[styles.inputGroup, { backgroundColor: theme.colors.accent }]}>
          <Mail size={20} color={theme.colors.primary} strokeWidth={2} />
          <TextInput
            style={[styles.input, isRTL && styles.inputRTL, { color: theme.colors.light }]}
            value={email}
            onChangeText={setEmail}
            placeholder={t(translations.contact.email)}
            placeholderTextColor={theme.colors.gray}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={[styles.inputGroup, { backgroundColor: theme.colors.accent }]}>
          <MessageSquare size={20} color={theme.colors.primary} strokeWidth={2} />
          <TextInput
            style={[styles.input, styles.textArea, isRTL && styles.inputRTL, { color: theme.colors.light }]}
            value={message}
            onChangeText={setMessage}
            placeholder={t(translations.contact.message)}
            placeholderTextColor={theme.colors.gray}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={[styles.submitButton, { backgroundColor: theme.colors.primary }, theme.shadows.md]} onPress={handleSubmit}>
          <Text style={[styles.submitButtonText, { color: theme.colors.dark }]}>{t(translations.contact.send)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.whatsappButton, { borderColor: theme.colors.success }]}>
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
}

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