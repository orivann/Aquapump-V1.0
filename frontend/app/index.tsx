import { useRef, useCallback, lazy } from 'react';
import { StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/contexts/ThemeContext';
import Navigation from '@/components/Navigation';

const Hero = lazy(() => import('@/components/Hero'));
const About = lazy(() => import('@/components/About'));
const Technology = lazy(() => import('@/components/Technology'));
const Products = lazy(() => import('@/components/Products'));
const Contact = lazy(() => import('@/components/Contact'));
const Chatbot = lazy(() => import('@/components/Chatbot'));

const { height } = Dimensions.get('window');


export default function HomeScreen() {
  const { theme, themeMode } = useTheme();
  const { height } = Dimensions.get('window');
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToContact = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: height * 3.5, animated: true });
  }, [height]);

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.secondary }]} edges={['top', 'bottom']}>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
      <Navigation />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});