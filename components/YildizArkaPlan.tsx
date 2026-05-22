import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

function Yildiz({ gecikme, sol, ust, boyut }: { gecikme: number; sol: number; ust: number; boyut: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animasyon = Animated.loop(
      Animated.sequence([
        Animated.delay(gecikme),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.2,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.5,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    animasyon.start();
    return () => animasyon.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.yildiz,
        {
          left: sol,
          top: ust,
          width: boyut,
          height: boyut,
          opacity,
          transform: [{ scale }],
        },
      ]}
    />
  );
}

export default function YildizArkaPlan() {
  const yildizlar = useRef(
    Array.from({ length: 40 }, () => ({
      sol: Math.random() * width,
      ust: Math.random() * height,
      boyut: Math.random() * 3 + 1,
      gecikme: Math.random() * 3000,
    }))
  ).current;

  return (
    <View style={styles.container} pointerEvents="none">
      {yildizlar.map((y, i) => (
        <Yildiz key={i} {...y} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  yildiz: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 50,
  },
});