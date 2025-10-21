import { useRef, useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function WaterRipple({ trigger }: { trigger: boolean }) {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (trigger) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        scaleAnim.setValue(0);
        opacityAnim.setValue(1);
      });
    }
  }, [trigger, scaleAnim, opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.ripple,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
          backgroundColor: theme.colors.primary + '40',
          borderColor: theme.colors.primary,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  ripple: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
  },
});