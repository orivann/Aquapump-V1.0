import { useLanguage } from '@frontend/contexts/LanguageContext';
import { useTheme } from '@frontend/contexts/ThemeContext';
import { translations } from '@frontend/constants/translations';
import { MessageCircle, Send, X } from 'lucide-react-native';
import { useState, useRef, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';


interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot = memo(function Chatbot() {
  const { t, isRTL, language } = useLanguage();
  const { theme, themeMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: t(translations.chatbot.greeting),
    },
  ]);
  const toolkitUrl = process.env.EXPO_PUBLIC_TOOLKIT_URL ?? 'https://toolkit.rork.com';
  const apiKey = process.env.EXPO_PUBLIC_AI_CHAT_KEY ?? '';
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  const detectLanguage = useCallback(async (text: string) => {
    try {
      const res = await fetch(new URL('/agent/chat', toolkitUrl).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: `Detect the language of this text and respond with only 'en' or 'he': "${text}"` },
          ],
        }),
      });
      
      if (!res.ok) {
        console.error('Language detection failed:', res.status, res.statusText);
        return language;
      }
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Language detection error: Non-JSON response:', text);
        return language;
      }
      
      const data = await res.json();
      const detected = (data?.text ?? '').trim().toLowerCase();
      return detected === 'he' ? 'he' : 'en';
    } catch (error) {
      console.error('Language detection error:', error);
      return language;
    }
  }, [language, toolkitUrl, apiKey]);

  const toggleChat = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setIsOpen(false));
    }
  }, [isOpen, slideAnim]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    if (!apiKey) {
      console.warn('Missing EXPO_PUBLIC_AI_CHAT_KEY env var for chatbot auth');
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Chatbot is not configured. Missing API key.',
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const detectedLang = await detectLanguage(userMessage.content);
    const systemPrompt =
      detectedLang === 'he'
        ? 'אתה AquaBot, עוזר AI של חברת AquaPump. אתה עוזר ללקוחות עם שאלות על משאבות מים חכמות, מחירים, התקנה ותמיכה. תמיד ענה בעברית בצורה מקצועית וידידותית.'
        : 'You are AquaBot, an AI assistant for AquaPump company. You help customers with questions about smart water pumps, pricing, installation, and support. Always respond professionally and friendly in English.';

    try {
      const res = await fetch(new URL('/agent/chat', toolkitUrl).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: `${systemPrompt}\n\n${userMessage.content}` },
          ],
        }),
      });

      if (!res.ok) {
        console.error('Chatbot API error:', res.status, res.statusText);
        throw new Error(`API returned ${res.status}: ${res.statusText}`);
      }

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Chatbot error: Non-JSON response:', text);
        throw new Error('Invalid response format from API');
      }

      const data = await res.json();
      const text: string = (data?.text ?? data?.message ?? data?.content ?? '').toString();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text || (detectedLang === 'he' ? 'אין תגובה זמינה כרגע.' : 'No response available right now.'),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Chatbot error:', error);
      const errorMessageContent =
        error.message && error.message.includes('API returned')
          ? 'Sorry, the server is currently unavailable. Please try again later.'
          : 'Sorry, an unexpected error occurred. Please try again.';

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: detectedLang === 'he' ? 'מצטער, אירעה שגיאה. אנא נסה שוב.' : errorMessageContent,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, detectLanguage, toolkitUrl, apiKey]);

  return (
    <>
      <TouchableOpacity
        testID="chatbot-toggle"
        accessibilityRole="button"
        accessibilityLabel="Open chat"
        style={[styles.chatButton, isRTL && styles.chatButtonRTL, { backgroundColor: theme.colors.primary }]}
        onPress={toggleChat}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <MessageCircle size={28} color={themeMode === 'dark' ? theme.colors.light : theme.colors.dark} strokeWidth={2} />
        </Animated.View>
      </TouchableOpacity>

      {isOpen && (
        <Animated.View
          testID="chatbot-container"
          style={[
            styles.chatContainer,
            isRTL && styles.chatContainerRTL,
            { transform: [{ translateY: slideAnim }], backgroundColor: themeMode === 'dark' ? theme.colors.accent : '#FFFFFF' },
          ]}
        >
          <View style={[styles.chatHeader, { backgroundColor: themeMode === 'dark' ? theme.colors.secondary : '#F8FAFC', borderBottomColor: theme.colors.primary + '30' }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.botAvatar, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.botAvatarText}>💧</Text>
              </View>
              <Text style={[styles.chatTitle, { color: themeMode === 'dark' ? theme.colors.light : theme.colors.dark }]}>AquaBot</Text>
            </View>
            <TouchableOpacity testID="chatbot-close" accessibilityRole="button" accessibilityLabel="Close chat" onPress={toggleChat} style={styles.closeButton}>
              <X size={24} color={themeMode === 'dark' ? theme.colors.light : theme.colors.dark} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView testID="chatbot-messages" style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.role === 'user' ? [styles.userBubble, { backgroundColor: theme.colors.primary }] : [styles.assistantBubble, { backgroundColor: themeMode === 'dark' ? theme.colors.secondary : '#F1F5F9', borderColor: theme.colors.primary + '30' }],
                  isRTL && styles.messageBubbleRTL,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.role === 'user'
                      ? [styles.userText, { color: themeMode === 'dark' ? theme.colors.light : theme.colors.dark }]
                      : [styles.assistantText, { color: themeMode === 'dark' ? theme.colors.light : theme.colors.dark }],
                    isRTL && styles.rtlText,
                  ]}
                >
                  {message.content}
                </Text>
              </View>
            ))}
            {isLoading && (
              <View style={[styles.messageBubble, styles.assistantBubble]}>
                <Text style={[styles.loadingText, { color: theme.colors.gray }]}>...</Text>
              </View>
            )}
          </ScrollView>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            style={[styles.inputContainer, { backgroundColor: themeMode === 'dark' ? theme.colors.secondary : '#F8FAFC', borderTopColor: theme.colors.primary + '30' }]}
          >
            <TextInput
              testID="chatbot-input"
              style={[styles.input, isRTL && styles.inputRTL, { color: themeMode === 'dark' ? theme.colors.light : theme.colors.dark, backgroundColor: themeMode === 'dark' ? theme.colors.accent : '#FFFFFF', borderColor: theme.colors.primary + '30' }]}
              value={input}
              onChangeText={setInput}
              placeholder={t(translations.chatbot.placeholder)}
              placeholderTextColor={themeMode === 'dark' ? theme.colors.gray : '#94A3B8'}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              testID="chatbot-send"
              accessibilityRole="button"
              accessibilityLabel="Send message"
              style={[styles.sendButton, { backgroundColor: theme.colors.primary }, (!input.trim() || isLoading) && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!input.trim() || isLoading}
            >
              <Send size={20} color={themeMode === 'dark' ? theme.colors.light : theme.colors.dark} strokeWidth={2} />
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Animated.View>
      )}
    </>
  );
});

export default Chatbot;

const styles = StyleSheet.create({
  chatButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
    zIndex: 1000,
  },
  chatButtonRTL: {
    right: undefined,
    left: 30,
  },
  chatContainer: {
    position: 'absolute',
    bottom: 90,
    right: 24,
    width: 320,
    maxWidth: '88%',
    height: 440,
    borderRadius: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
    zIndex: 999,
    overflow: 'hidden',
  },
  chatContainerRTL: {
    right: undefined,
    left: 30,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botAvatarText: {
    fontSize: 20,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  closeButton: {
    padding: 4,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  messageBubbleRTL: {
    alignSelf: 'flex-start',
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
  },
  assistantText: {
  },
  rtlText: {
    textAlign: 'right',
  },
  loadingText: {
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    gap: 8,
  },
  input: {
    flex: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 15,
    maxHeight: 100,
    borderWidth: 1,
  },
  inputRTL: {
    textAlign: 'right',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});