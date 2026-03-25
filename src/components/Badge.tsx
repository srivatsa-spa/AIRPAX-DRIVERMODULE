import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { COLORS, RADIUS, SPACING } from '../theme';

interface BadgeProps {
  status: 'online' | 'offline' | 'busy' | 'pending' | 'success';
  label?: string;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ status, label, style }) => {
  const getBadgeColors = () => {
    switch (status) {
      case 'online':
      case 'success':
        return { bg: `${COLORS.accent}20`, text: COLORS.accent };
      case 'offline':
        return { bg: `${COLORS.danger}20`, text: COLORS.danger };
      case 'busy':
      case 'pending':
        return { bg: `${COLORS.warning}20`, text: COLORS.warning };
      default:
        return { bg: COLORS.surfaceAlt, text: COLORS.textSecondary };
    }
  };

  const { bg, text } = getBadgeColors();

  return (
    <View style={[styles.container, { backgroundColor: bg }, style]}>
      <View style={[styles.dot, { backgroundColor: text }]} />
      <Typography variant="caption2" color={text} bold>
        {label || status.toUpperCase()}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.round,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: SPACING.xs,
  },
});
