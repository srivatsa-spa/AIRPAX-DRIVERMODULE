import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../theme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'flat' | 'outline' | 'glass';
  elevation?: 'light' | 'medium' | 'heavy';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'elevated', 
  elevation = 'medium',
  style, 
  ...props 
}) => {
  if (variant === 'glass') {
    return (
      <View style={[styles.container, styles.glassContainer, style]} {...props}>
        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(26, 26, 46, 0.8)' }]}
        />
        <View style={styles.glassContent}>
          {children}
        </View>
      </View>
    );
  }

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'flat':
        return { backgroundColor: COLORS.surfaceAlt };
      case 'outline':
        return { 
          backgroundColor: COLORS.white, 
          borderWidth: 1, 
          borderColor: COLORS.border 
        };
      case 'elevated':
      default:
        return { 
          backgroundColor: COLORS.white,
          ...SHADOWS[elevation]
        };
    }
  };

  return (
    <View style={[styles.container, getVariantStyle(), style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  glassContainer: {
    backgroundColor: 'rgba(26, 26, 46, 0.4)', // transparent primary
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
  },
  glassContent: {
    padding: SPACING.lg,
  },
});
