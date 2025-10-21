// Web-only component for cursor trails
import { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';

export default function CursorTrail() {
  const trailRef = useRef<View>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleMouseMove = (e: MouseEvent) => {
      if (trailRef.current) {
        // Use web DOM manipulation for cursor trail
        const trail = document.createElement('div');
        trail.style.position = 'fixed';
        trail.style.left = `${e.clientX}px`;
        trail.style.top = `${e.clientY}px`;
        trail.style.width = '10px';
        trail.style.height = '10px';
        trail.style.borderRadius = '50%';
        trail.style.backgroundColor = '#00D4FF';
        trail.style.pointerEvents = 'none';
        trail.style.zIndex = '9999';
        document.body.appendChild(trail);

        setTimeout(() => {
          trail.remove();
        }, 500);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <View ref={trailRef} style={styles.trail} />;
}

const styles = StyleSheet.create({
  trail: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00D4FF',
  },
});