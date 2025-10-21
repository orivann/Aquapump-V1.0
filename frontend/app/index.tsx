import { lazy, Suspense, useRef, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@frontend/contexts/ThemeContext';
import Navigation from '@frontend/components/Navigation';

const Hero = lazy(() => import('@frontend/components/Hero'));
const About = lazy(() => import('@frontend/components/About'));
const Technology = lazy(() => import('@frontend/components/Technology'));
const Products = lazy(() => import('@frontend/components/Products'));
const Contact = lazy(() => import('@frontend/components/Contact'));
const Chatbot = lazy(() => import('@frontend/components/Chatbot'));

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const { theme, themeMode } = useTheme();
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
        <Suspense fallback={<LoadingComponent />}>
          <Hero scrollY={scrollY} onQuotePress={scrollToContact} />
        </Suspense>
        <Suspense fallback={<LoadingComponent />}>
          <Technology scrollY={scrollY} />
        </Suspense>
        <Suspense fallback={<LoadingComponent />}>
          <Products scrollY={scrollY} />
        </Suspense>
        <Suspense fallback={<LoadingComponent />}>
          <About />
        </Suspense>
        <Suspense fallback={<LoadingComponent />}>
          <Contact />
        </Suspense>
      </Animated.ScrollView>

      <Suspense fallback={null}>
        <Chatbot />
      </Suspense>
    </SafeAreaView>
  );
}

function LoadingComponent() {
  return (
    <View style={loadingStyles.container}>
      <ActivityIndicator size="large" color="#0EA5E9" />
    </View>
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

const loadingStyles = StyleSheet.create({
  container: {
    height: 200,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
});