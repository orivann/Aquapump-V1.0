import Hero from '@/components/Hero';
import About from '@/components/About';
import Technology from '@/components/Technology';
import Products from '@/components/Products';
import Contact from '@/components/Contact';
import Chatbot from '@/components/Chatbot';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef, useCallback } from 'react';

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const { isLoading: languageLoading } = useLanguage();
  const { theme, themeMode, isLoading: themeLoading } = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToContact = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: height * 3.5, animated: true });
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const y = event?.nativeEvent?.contentOffset?.y ?? 0;
        console.log('[HomeScreen] Scroll position:', y);
      },
    }
  );

  if (languageLoading || themeLoading) {
    return (
      <SafeAreaView style={[styles.loading, { backgroundColor: themeMode === 'dark' ? '#0A1929' : '#F8FAFC' }]} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.secondary }]} edges={['top', 'bottom']}>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: 72 }]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        testID="home-scroll"
      >
        <Hero scrollY={scrollY} onQuotePress={scrollToContact} />
        <Technology scrollY={scrollY} />
        <Products scrollY={scrollY} />
        <About />
        <Contact />
      </Animated.ScrollView>

      <Chatbot />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});