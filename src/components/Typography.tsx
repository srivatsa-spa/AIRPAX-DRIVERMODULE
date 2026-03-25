import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../theme';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'label' | 'caption' | 'caption2';
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  bold?: boolean;
}

export const Typography: React.FC<TypographyProps> = ({ 
  variant = 'body', 
  color = COLORS.textPrimary, 
  align = 'left', 
  bold, 
  style, 
  children, 
  ...props 
}) => {
  return (
    <Text 
      style={[
        TYPOGRAPHY[variant], 
        { color, textAlign: align }, 
        bold ? styles.bold : null,
        style
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  bold: {
    fontWeight: '700',
  },
});
