import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { translations } from '@/constants/translations';
import { Download } from 'lucide-react-native';
import { memo, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface ProductCardProps {
  name: string;
  description: string;
  isRTL: boolean;
  color: string;
  theme: any;
  themeMode: 'light' | 'dark';
  index: number;
}

const ProductCard = memo(function ProductCard({ name, description, isRTL, color, theme, themeMode, index }: ProductCardProps) {
  const isDark = themeMode === 'dark';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        delay: index * 250,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 45,
        friction: 8,
        delay: index * 250,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: index * 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  return (
    <Animated.View
      style={[
        styles.productCard,
        {
          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : '#FFFFFF',
          borderColor: isDark ? 'rgba(34, 211, 238, 0.25)' : 'rgba(14, 165, 233, 0.2)',
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
        Platform.OS === 'web' && styles.productCardWeb,
      ]}
    >
      <View
        style={[
          styles.productModel,
          { backgroundColor: color },
        ]}
      >
        <View style={[styles.modelInner, { borderColor: 'rgba(255, 255, 255, 0.5)' }]} />
      </View>

      <Text style={[styles.productName, isRTL && styles.rtlText, { color: isDark ? '#F0F9FF' : '#1E40AF' }]}>
        {name}
      </Text>
      <Text style={[styles.productDescription, isRTL && styles.rtlText, { color: isDark ? '#CBD5E1' : '#64748B' }]}>
        {description}
      </Text>

      <TouchableOpacity
        style={[
          styles.specsButton,
          {
            borderColor: theme.colors.primary,
            backgroundColor: isDark ? 'rgba(34, 211, 238, 0.15)' : 'rgba(14, 165, 233, 0.08)',
          },
        ]}
        activeOpacity={0.8}
      >
        <Download size={20} color={theme.colors.primary} strokeWidth={2} />
        <Text style={[styles.specsButtonText, { color: theme.colors.primary }]}>
          {isRTL ? translations.products.viewSpecs.he : translations.products.viewSpecs.en}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

interface ProductsProps {
  scrollY: Animated.Value;
}

const Products = memo(function Products({ scrollY }: ProductsProps) {
  const { t, isRTL } = useLanguage();
  const { theme, themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  const titleFadeAnim = useRef(new Animated.Value(1)).current;

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

  const products = useMemo(() => [
    {
      name: t(translations.products.aquaPro.name),
      description: t(translations.products.aquaPro.description),
      color: theme.colors.primary,
    },
    {
      name: t(translations.products.aquaHome.name),
      description: t(translations.products.aquaHome.description),
      color: '#0066FF',
    },
    {
      name: t(translations.products.aquaIndustrial.name),
      description: t(translations.products.aquaIndustrial.description),
      color: '#6366F1',
    },
  ], [theme.colors.primary, t]);

  const parallaxY = scrollY.interpolate({
    inputRange: [height * 1.5, height * 2.5],
    outputRange: [50, -50],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#1A1F2E' : '#FFFFFF',
          transform: [{ translateY: parallaxY }],
        },
      ]}
    >
      <Animated.View style={[styles.titleContainer, { opacity: titleFadeAnim }]}>
        <Text 
          accessibilityRole="header"
          style={[styles.sectionTitle, isRTL && styles.rtlText, { color: isDark ? '#38BDF8' : '#1E40AF' }]}>
          {t(translations.products.title)}
        </Text>
      </Animated.View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsContainer}
        style={styles.scrollView}
        decelerationRate="fast"
        snapToInterval={width * 0.85 + 24}
        snapToAlignment="start"
      >
        {products.map((product, index) => (
          <ProductCard
            key={index}
            name={product.name}
            description={product.description}
            isRTL={isRTL}
            color={product.color}
            theme={theme}
            themeMode={themeMode}
            index={index}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
});

export default Products;

const styles = StyleSheet.create({
  container: {
    width: width,
    paddingVertical: 100,
    alignItems: 'center',
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 48,
  },
  sectionTitle: {
    fontSize: 44,
    fontWeight: '700' as const,
    textAlign: 'center',
    paddingHorizontal: 24,
    letterSpacing: -1,
  },
  rtlText: {
    writingDirection: 'rtl' as const,
  },
  scrollView: {
    width: '100%',
  },
  productsContainer: {
    paddingHorizontal: 24,
    gap: 24,
  },
  productCard: {
    width: width * 0.85,
    maxWidth: 400,
    borderRadius: 28,
    padding: 28,
    marginRight: 24,
    borderWidth: 1,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 12,
  },
  productCardWeb: {
    ...(Platform.OS === 'web' && {
      transition: 'all 0.3s ease',
    } as any),
  },
  productModel: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    marginBottom: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  modelInner: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 3,
  },
  productName: {
    fontSize: 28,
    fontWeight: '700' as const,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  productDescription: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 28,
    marginBottom: 28,
  },
  specsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  specsButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
});
