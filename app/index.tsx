import Hero from '@/components/Hero';
import About from '@/components/About';
import Technology from '@/components/Technology';
import Products from '@/components/Products';
import Contact from '@/components/Contact';
import Navigation from '@/components/Navigation';
import Chatbot from '@/components/Chatbot';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef, useMemo } from 'react';

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const { isLoading: languageLoading } = useLanguage();
  const { theme, themeMode, isLoading: themeLoading } = useTheme();
  const scrollY = useMemo(() => new Animated.Value(0), []);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToContact = () => {
    scrollViewRef.current?.scrollTo({ y: height * 3.5, animated: true });
  };

  if (languageLoading || themeLoading) {
    return (
      <SafeAreaView style={[styles.loading, { backgroundColor: theme.colors.dark }]} edges={['top', 'bottom']} />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.dark }]} edges={['top', 'bottom']}>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
      <Navigation />
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={32}
      >
        <Hero scrollY={scrollY} onQuotePress={scrollToContact} />
        <Technology scrollY={scrollY} />
        <Products scrollY={scrollY} />
        <About />
        <Contact />
      </ScrollView>

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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});