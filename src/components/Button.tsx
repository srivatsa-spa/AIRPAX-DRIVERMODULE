import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacityProps,
  ViewStyle,
  TextStyle
} from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  outline?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  variant = 'primary', 
  size = 'lg',
  loading, 
  outline, 
  style, 
  disabled, 
  ...props 
}) => {
  const getBackgroundColor = () => {
    if (outline) return 'transparent';
    if (disabled) return COLORS.border;
    switch (variant) {
      case 'secondary': return COLORS.black;
      case 'accent': return COLORS.accent;
      case 'danger': return COLORS.danger;
      default: return COLORS.primary;
    }
  };

  const getTextColor = () => {
    if (outline) {
      if (disabled) return COLORS.textSecondary;
      switch (variant) {
        case 'secondary': return COLORS.black;
        case 'accent': return COLORS.accent;
        case 'danger': return COLORS.danger;
        default: return COLORS.primary;
      }
    }
    return COLORS.white;
  };

  const getBorderColor = () => {
    if (disabled) return COLORS.border;
    switch (variant) {
      case 'secondary': return COLORS.black;
      case 'accent': return COLORS.accent;
      case 'danger': return COLORS.danger;
      default: return COLORS.primary;
    }
  };

  const getHeight = () => {
    switch (size) {
      case 'sm': return 36;
      case 'md': return 44;
      case 'lg': return 52;
      default: return 52;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm': return SPACING.md;
      case 'md': return SPACING.lg;
      case 'lg': return SPACING.xl;
      default: return SPACING.xl;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm': return TYPOGRAPHY.label.fontSize;
      case 'md': return TYPOGRAPHY.body.fontSize;
      case 'lg': return TYPOGRAPHY.h3.fontSize;
      default: return TYPOGRAPHY.h3.fontSize;
    }
  };

  const containerStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderColor: outline ? getBorderColor() : 'transparent',
    borderWidth: outline ? 1.5 : 0,
    opacity: disabled ? 0.7 : 1,
    height: getHeight(),
    paddingHorizontal: getPadding(),
  };

  const textStyle: TextStyle = {
    color: getTextColor(),
    fontSize: getFontSize(),
  };

  return (
    <TouchableOpacity 
      style={[styles.container, containerStyle, style]} 
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, textStyle]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    ...TYPOGRAPHY.label,
    fontWeight: '600',
  },
});
