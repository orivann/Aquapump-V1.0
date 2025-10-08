import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { translations } from '@/constants/translations';
import { Download } from 'lucide-react-native';
import { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const { width } = Dimensions.get('window');

interface ProductCardProps {
  name: string;
  description: string;
  isRTL: boolean;
  color: string;
  theme: any;
  themeMode: 'light' | 'dark';
}

const ProductCard = memo(function ProductCard({ name, description, isRTL, color, theme, themeMode }: ProductCardProps) {
  const isDark = themeMode === 'dark';
  return (
    <View
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${name}: ${description}`}
      style={[
        styles.productCard,
        {
          backgroundColor: isDark ? theme.colors.accent : '#FFFFFF',
          borderColor: theme.colors.primary + '20',
        },
      ]}
    >
      <View
        style={[
          styles.productModel,
          { backgroundColor: color },
        ]}
      >
        <View style={styles.modelInner} />
      </View>

      <Text style={[styles.productName, isRTL && styles.rtlText, { color: isDark ? theme.colors.light : '#0F172A' }]}>{name}</Text>
      <Text style={[styles.productDescription, isRTL && styles.rtlText, { color: isDark ? theme.colors.gray : '#475569' }]}>
        {description}
      </Text>

      <TouchableOpacity 
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`View specifications for ${name}`}
        style={[styles.specsButton, { borderColor: theme.colors.primary }]}>
        <Download size={20} color={theme.colors.primary} strokeWidth={2} />
        <Text style={[styles.specsButtonText, { color: theme.colors.primary }]}>
          {isRTL ? translations.products.viewSpecs.he : translations.products.viewSpecs.en}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

export default function Products({ scrollY }: { scrollY: Animated.Value }) {
  const { t, isRTL } = useLanguage();
  const { theme, themeMode } = useTheme();
  const isDark = themeMode === 'dark';

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
    <View style={[styles.container, { backgroundColor: isDark ? theme.colors.secondary : '#F8FAFC' }]}>
      <Text 
        accessibilityRole="header"
        style={[styles.sectionTitle, isRTL && styles.rtlText, { color: isDark ? theme.colors.light : '#1E40AF' }]}>
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
            isRTL={isRTL}
            color={product.color}
            theme={theme}
            themeMode={themeMode}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    paddingVertical: 64,
  },
  sectionTitle: {
    fontSize: 32,
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