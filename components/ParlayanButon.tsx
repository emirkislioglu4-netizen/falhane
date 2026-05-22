import { useEffect, useRef } from 'react';
import { Animated, Easing, TouchableOpacity } from 'react-native';

export default function ParlayanButon({ 
  children, 
  onPress,
  style,
  parlamaRengi = '#7F77DD',
}: { 
  children: React.ReactNode; 
  onPress?: () => void;
  style?: any;
  parlamaRengi?: string;
}) {
  const parlama = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animasyon = Animated.loop(
      Animated.sequence([
        Animated.timing(parlama, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(parlama, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );
    animasyon.start();
    return () => animasyon.stop();
  }, []);

  const basildiginda = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const golgeYayilim = parlama.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 20],
  });

  const golgeOpacity = parlama.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={{
        shadowColor: parlamaRengi,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: golgeYayilim,
        shadowOpacity: golgeOpacity,
        elevation: 10,
        transform: [{ scale }],
      }}
    >
      <TouchableOpacity
        style={style}
        onPress={() => {
          basildiginda();
          onPress?.();
        }}
        activeOpacity={0.85}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}