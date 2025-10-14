import Hero from '@/components/Hero';
import About from '@/components/About';
import Technology from '@/components/Technology';
import Products from '@/components/Products';
import Contact from '@/components/Contact';

import Chatbot from '@/components/Chatbot';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, Animated, Dimensions, View } from 'react-native';
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

  if (languageLoading || themeLoading) {
    return (
      <SafeAreaView style={[styles.loading, { backgroundColor: '#0A1929' }]} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.secondary }]} edges={['top', 'bottom']}>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: 110 }]}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          try {
            const y = e?.nativeEvent?.contentOffset?.y ?? 0;
            console.log('[HomeScreen] onScroll y=', y);
            scrollY.setValue(y);
          } catch (err) {
            console.log('[HomeScreen] onScroll error', err);
          }
        }}
        onScrollBeginDrag={() => {}}
        onScrollEndDrag={() => {}}
        scrollEventThrottle={16}
        testID="home-scroll"
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    width: 50,
    height: 50,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});