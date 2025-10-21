import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface WaveBottomProps {
  color?: string;
}

export default function WaveBottom({ color = '#F8FAFC' }: WaveBottomProps) {
  return (
    <View style={styles.container}>
      <Svg
        width={width}
        height={120}
        viewBox={`0 0 ${width} 120`}
        preserveAspectRatio="none"
      >
        <Path
          d={`M0,60 Q${width / 4},20 ${width / 2},60 T${width},60 L${width},120 L0,120 Z`}
          fill={color}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
});
