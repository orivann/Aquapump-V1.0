import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { translations } from '@/constants/translations';
import { Download } from 'lucide-react-native';
import { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface ProductCardProps {
  name: string;
  description: string;
  delay: number;
  isRTL: boolean;
  color: string;
  scrollY: Animated.Value;
  theme: any;
}

function ProductCard({ name, description, delay, isRTL, color, scrollY, theme }: ProductCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const parallaxAnim = scrollY.interpolate({
    inputRange: [height * 1.5, height * 2.5],
    outputRange: [0, -30],
    extrapolate: 'clamp',
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, fadeAnim, translateYAnim]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.productCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: Animated.add(translateYAnim, parallaxAnim) }],
          backgroundColor: theme.colors.accent,
          borderColor: theme.colors.primary + '20',
        },
      ]}
    >
      <Animated.View
        style={[
          styles.productModel,
          { backgroundColor: color, transform: [{ rotate: rotation }] },
        ]}
      >
        <View style={styles.modelInner} />
      </Animated.View>

      <Text style={[styles.productName, isRTL && styles.rtlText, { color: theme.colors.light }]}>{name}</Text>
      <Text style={[styles.productDescription, isRTL && styles.rtlText, { color: theme.colors.gray }]}>
        {description}
      </Text>

      <TouchableOpacity style={[styles.specsButton, { borderColor: theme.colors.primary }]}>
        <Download size={20} color={theme.colors.primary} strokeWidth={2} />
        <Text style={[styles.specsButtonText, { color: theme.colors.primary }]}>
          {isRTL ? translations.products.viewSpecs.he : translations.products.viewSpecs.en}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function Products({ scrollY }: { scrollY: Animated.Value }) {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();

  const products = [
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
      color: theme.colors.chrome,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.secondary }]}>
      <Text style={[styles.sectionTitle, isRTL && styles.rtlText, { color: theme.colors.light }]}>
        {t(translations.products.title)}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsContainer}
        style={styles.scrollView}
      >
        {products.map((product, index) => (
          <ProductCard
            key={index}
            name={product.name}
            description={product.description}
            delay={index * 200}
            isRTL={isRTL}
            color={product.color}
            scrollY={scrollY}
            theme={theme}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    paddingVertical: 96,
  },
  sectionTitle: {
    fontSize: 40,
    fontWeight: '700' as const,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  rtlText: {
    textAlign: 'right',
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
    maxWidth: 380,
    borderRadius: 24,
    padding: 24,
    marginRight: 24,
    borderWidth: 1,
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  productModel: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  modelInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  productName: {
    fontSize: 26,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    marginBottom: 24,
  },
  specsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
  },
  specsButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
});