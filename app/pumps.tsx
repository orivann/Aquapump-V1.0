import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap, Droplet, Factory, Download, ArrowRight } from 'lucide-react-native';
import { Stack } from 'expo-router';

interface PumpModel {
  id: string;
  name: string;
  category: string;
  power: string;
  flow: string;
  pressure: string;
  efficiency: string;
  features: string[];
  price: string;
}

const pumpModels: PumpModel[] = [
  {
    id: '1',
    name: 'AquaPro 3000',
    category: 'Commercial',
    power: '3.0 kW',
    flow: '150 L/min',
    pressure: '8 bar',
    efficiency: '92%',
    features: [
      'IoT connectivity',
      'Variable speed drive',
      'Energy monitoring',
      'Remote diagnostics',
      'Stainless steel construction',
    ],
    price: '$2,499',
  },
  {
    id: '2',
    name: 'AquaHome Plus',
    category: 'Residential',
    power: '1.5 kW',
    flow: '80 L/min',
    pressure: '5 bar',
    efficiency: '88%',
    features: [
      'Quiet operation',
      'Compact design',
      'Smart pressure control',
      'Easy installation',
      'Energy efficient',
    ],
    price: '$899',
  },
  {
    id: '3',
    name: 'AquaIndustrial X',
    category: 'Industrial',
    power: '7.5 kW',
    flow: '300 L/min',
    pressure: '12 bar',
    efficiency: '94%',
    features: [
      'Heavy-duty construction',
      'High temperature resistant',
      'Advanced monitoring',
      'Redundant systems',
      'Extended warranty',
    ],
    price: '$5,999',
  },
  {
    id: '4',
    name: 'AquaPro 2000',
    category: 'Commercial',
    power: '2.2 kW',
    flow: '100 L/min',
    pressure: '6 bar',
    efficiency: '90%',
    features: [
      'Smart controls',
      'Energy saving mode',
      'Corrosion resistant',
      'Low maintenance',
      'Compact footprint',
    ],
    price: '$1,799',
  },
  {
    id: '5',
    name: 'AquaHome Eco',
    category: 'Residential',
    power: '1.1 kW',
    flow: '60 L/min',
    pressure: '4 bar',
    efficiency: '86%',
    features: [
      'Ultra quiet',
      'Budget friendly',
      'Reliable performance',
      'Easy maintenance',
      '5-year warranty',
    ],
    price: '$599',
  },
  {
    id: '6',
    name: 'AquaIndustrial Pro',
    category: 'Industrial',
    power: '11 kW',
    flow: '500 L/min',
    pressure: '15 bar',
    efficiency: '95%',
    features: [
      'Maximum performance',
      'Industrial grade',
      'Real-time analytics',
      'Predictive maintenance',
      'Custom configurations',
    ],
    price: '$9,999',
  },
];

export default function PumpsScreen() {
  const { theme, themeMode } = useTheme();
  const { isRTL } = useLanguage();
  const isDark = themeMode === 'dark';

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Commercial':
        return <Droplet size={24} color={theme.colors.primary} />;
      case 'Residential':
        return <Zap size={24} color={theme.colors.primary} />;
      case 'Industrial':
        return <Factory size={24} color={theme.colors.primary} />;
      default:
        return <Droplet size={24} color={theme.colors.primary} />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? theme.colors.dark : '#F8FAFC' }]} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: isDark ? theme.colors.secondary : '#FFFFFF' },
          headerTintColor: isDark ? theme.colors.light : '#1E40AF',
          headerTitleStyle: { fontWeight: '700' as const },
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? theme.colors.primary : '#1E40AF' }]}>
            {isRTL ? 'מגוון המשאבות שלנו' : 'Our Pump Models'}
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? theme.colors.textSecondary : '#475569' }]}>
            {isRTL
              ? 'בחר את המשאבה המושלמת לצרכים שלך'
              : 'Choose the perfect pump for your needs'}
          </Text>
        </View>

        <View style={styles.grid}>
          {pumpModels.map((pump) => (
            <View
              key={pump.id}
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? theme.colors.accent : '#FFFFFF',
                  borderColor: theme.colors.primary + '20',
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.categoryBadge, { backgroundColor: theme.colors.primary + '20' }]}>
                  {getCategoryIcon(pump.category)}
                  <Text style={[styles.categoryText, { color: theme.colors.primary }]}>
                    {pump.category}
                  </Text>
                </View>
                <Text style={[styles.price, { color: theme.colors.primary }]}>{pump.price}</Text>
              </View>

              <Text style={[styles.pumpName, { color: isDark ? theme.colors.light : '#1E40AF' }]}>
                {pump.name}
              </Text>

              <View style={styles.specs}>
                <View style={styles.specRow}>
                  <Text style={[styles.specLabel, { color: isDark ? theme.colors.textSecondary : '#64748B' }]}>
                    {isRTL ? 'הספק' : 'Power'}:
                  </Text>
                  <Text style={[styles.specValue, { color: isDark ? theme.colors.light : '#334155' }]}>
                    {pump.power}
                  </Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={[styles.specLabel, { color: isDark ? theme.colors.textSecondary : '#64748B' }]}>
                    {isRTL ? 'זרימה' : 'Flow'}:
                  </Text>
                  <Text style={[styles.specValue, { color: isDark ? theme.colors.light : '#334155' }]}>
                    {pump.flow}
                  </Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={[styles.specLabel, { color: isDark ? theme.colors.textSecondary : '#64748B' }]}>
                    {isRTL ? 'לחץ' : 'Pressure'}:
                  </Text>
                  <Text style={[styles.specValue, { color: isDark ? theme.colors.light : '#334155' }]}>
                    {pump.pressure}
                  </Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={[styles.specLabel, { color: isDark ? theme.colors.textSecondary : '#64748B' }]}>
                    {isRTL ? 'יעילות' : 'Efficiency'}:
                  </Text>
                  <Text style={[styles.specValue, { color: isDark ? theme.colors.light : '#334155' }]}>
                    {pump.efficiency}
                  </Text>
                </View>
              </View>

              <View style={styles.features}>
                <Text style={[styles.featuresTitle, { color: isDark ? theme.colors.light : '#1E40AF' }]}>
                  {isRTL ? 'תכונות עיקריות' : 'Key Features'}:
                </Text>
                {pump.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <ArrowRight size={16} color={theme.colors.primary} />
                    <Text style={[styles.featureText, { color: isDark ? theme.colors.textSecondary : '#475569' }]}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => console.log('Request quote for', pump.name)}
                >
                  <Text style={[styles.primaryButtonText, { color: '#FFFFFF' }]}>
                    {isRTL ? 'בקש הצעת מחיר' : 'Request Quote'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.secondaryButton, { borderColor: theme.colors.primary }]}
                  onPress={() => console.log('Download specs for', pump.name)}
                >
                  <Download size={18} color={theme.colors.primary} />
                  <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>
                    {isRTL ? 'מפרט טכני' : 'Specs'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
    padding: 20,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  grid: {
    gap: 20,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  price: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  pumpName: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginBottom: 16,
  },
  specs: {
    gap: 8,
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  features: {
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  featureText: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
});
