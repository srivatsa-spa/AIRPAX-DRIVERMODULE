import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withTiming, 
  Easing,
  runOnJS
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { Typography } from './Typography';
import { COLORS } from '../theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface TimerRingProps {
  durationSeconds: number;
  size?: number;
  onComplete?: () => void;
}

export const TimerRing: React.FC<TimerRingProps> = ({ 
  durationSeconds, 
  size = 120,
  onComplete
}) => {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const progress = useSharedValue(1);

  useEffect(() => {
    // Start circle animation
    progress.value = withTiming(0, {
      duration: durationSeconds * 1000,
      easing: Easing.linear,
    });

    // Handle text countdown
    let current = durationSeconds;
    const interval = setInterval(() => {
      current -= 1;
      if (current >= 0) {
        setTimeLeft(current);
      }
      if (current === 0) {
        clearInterval(interval);
        if (onComplete) {
          runOnJS(onComplete)();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [durationSeconds, progress, onComplete]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const getColor = () => {
    if (timeLeft > durationSeconds * 0.5) return COLORS.accent;
    if (timeLeft > durationSeconds * 0.2) return COLORS.warning;
    return COLORS.danger;
  };

  return (
    <View style={[{ width: size, height: size }, styles.container]}>
      <Svg width={size} height={size}>
        {/* Background Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.border}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress Ring */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Typography variant="h1" color={getColor()}>
          {timeLeft}
        </Typography>
        <Typography variant="caption" color={COLORS.textSecondary}>
          sec
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
