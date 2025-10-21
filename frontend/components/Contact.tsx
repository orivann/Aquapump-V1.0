import { useLanguage } from '@frontend/contexts/LanguageContext';
import { useTheme } from '@frontend/contexts/ThemeContext';
import { translations } from '@frontend/constants/translations';
import { Mail, MessageSquare, Send } from 'lucide-react-native';
import { useState, memo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  Platform,
} from 'react-native';

const { width } = Dimensions.get('window');

const Contact = memo(function Contact() {
  const { t, isRTL } = useLanguage();
  const { theme, themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const titleFadeAnim = useRef(new Animated.Value(1)).current;

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
    <View style={[styles.container, { backgroundColor: isDark ? '#0F1419' : '#F8FAFC' }]}>
      <Animated.View
        style={[
          styles.contentWrapper,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Animated.View style={[styles.titleContainer, { opacity: titleFadeAnim }]}>
          <Text 
            accessibilityRole="header"
            style={[styles.sectionTitle, isRTL && styles.rtlText, { color: isDark ? '#38BDF8' : '#1E40AF' }]}>
            {t(translations.contact.title)}
          </Text>
        </Animated.View>

        <View style={styles.formContainer}>
          <View
            style={[
              styles.inputGroup,
              {
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : '#FFFFFF',
                borderColor: isDark ? 'rgba(34, 211, 238, 0.25)' : 'rgba(14, 165, 233, 0.2)',
              },
            ]}
          >
            <Mail size={22} color={theme.colors.primary} strokeWidth={2} />
            <TextInput
              style={[styles.input, isRTL && styles.inputRTL, { color: isDark ? '#F0F9FF' : '#0F172A' }]}
              value={name}
              onChangeText={setName}
              placeholder={t(translations.contact.name)}
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
            />
          </View>

          <View
            style={[
              styles.inputGroup,
              {
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : '#FFFFFF',
                borderColor: isDark ? 'rgba(34, 211, 238, 0.25)' : 'rgba(14, 165, 233, 0.2)',
              },
            ]}
          >
            <Mail size={22} color={theme.colors.primary} strokeWidth={2} />
            <TextInput
              style={[styles.input, isRTL && styles.inputRTL, { color: isDark ? '#F0F9FF' : '#0F172A' }]}
              value={email}
              onChangeText={setEmail}
              placeholder={t(translations.contact.email)}
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View
            style={[
              styles.inputGroup,
              styles.textAreaGroup,
              {
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : '#FFFFFF',
                borderColor: isDark ? 'rgba(34, 211, 238, 0.25)' : 'rgba(14, 165, 233, 0.2)',
              },
            ]}
          >
            <MessageSquare size={22} color={theme.colors.primary} strokeWidth={2} />
            <TextInput
              style={[styles.input, styles.textArea, isRTL && styles.inputRTL, { color: isDark ? theme.colors.light : '#0F172A' }]}
              value={message}
              onChangeText={setMessage}
              placeholder={t(translations.contact.message)}
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity 
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Submit contact form"
            style={[
              styles.submitButton,
              { backgroundColor: theme.colors.primary },
              Platform.OS === 'web' && styles.submitButtonWeb,
            ]} 
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Send size={20} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={[styles.submitButtonText, { color: '#FFFFFF' }]}>
              {t(translations.contact.send)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Contact via WhatsApp"
            style={[
              styles.whatsappButton,
              {
                borderColor: isDark ? '#00FF88' : '#10B981',
                backgroundColor: isDark ? 'rgba(0, 255, 136, 0.1)' : 'rgba(16, 185, 129, 0.08)',
              },
            ]}
            activeOpacity={0.85}
          >
            <MessageSquare size={20} color={isDark ? '#00FF88' : '#10B981'} strokeWidth={2} />
            <Text style={[styles.whatsappButtonText, { color: isDark ? '#00FF88' : '#10B981' }]}>
              {t(translations.contact.whatsapp)}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={[styles.footer, { borderTopColor: isDark ? 'rgba(25, 195, 230, 0.15)' : 'rgba(14, 165, 233, 0.15)' }]}>
        <Text style={[styles.footerText, styles.centerText, { color: isDark ? '#64748B' : '#94A3B8' }]}>
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
    paddingVertical: 100,
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 56,
  },
  sectionTitle: {
    fontSize: 44,
    fontWeight: '700' as const,
    paddingHorizontal: 24,
    letterSpacing: -1,
    textAlign: 'center',
  },
  rtlText: {
    writingDirection: 'rtl' as const,
  },
  centerText: {
    textAlign: 'center',
  },
  formContainer: {
    width: '90%',
    maxWidth: 640,
    gap: 20,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
  },
  textAreaGroup: {
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    fontSize: 17,
    paddingVertical: 0,
    fontWeight: '400' as const,
  },
  inputRTL: {
    textAlign: 'right',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 20,
    borderRadius: 18,
    marginTop: 12,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  submitButtonWeb: {
    ...(Platform.OS === 'web' && {
      transition: 'all 0.3s ease',
    } as any),
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 18,
    borderWidth: 1.5,
    marginTop: 8,
  },
  whatsappButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
  footer: {
    marginTop: 120,
    paddingTop: 40,
    borderTopWidth: 1,
    width: '90%',
  },
  footerText: {
    fontSize: 15,
    textAlign: 'center',
  },
});
