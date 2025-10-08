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
import { StyleSheet, ScrollView, Animated, Dimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef, useCallback, memo } from 'react';

const { height } = Dimensions.get('window');

const MemoizedHero = memo(Hero);
const MemoizedTechnology = memo(Technology);
const MemoizedProducts = memo(Products);
const MemoizedAbout = memo(About);
const MemoizedContact = memo(Contact);
const MemoizedNavigation = memo(Navigation);
const MemoizedChatbot = memo(Chatbot);

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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.dark }]} edges={['top', 'bottom']}>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
      <MemoizedNavigation />
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <MemoizedHero scrollY={scrollY} onQuotePress={scrollToContact} />
        <MemoizedTechnology scrollY={scrollY} />
        <MemoizedProducts scrollY={scrollY} />
        <MemoizedAbout />
        <MemoizedContact />
      </ScrollView>

      <MemoizedChatbot />
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