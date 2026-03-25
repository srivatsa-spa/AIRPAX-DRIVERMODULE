import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from './Typography';
import { Card } from './Card';
import { COLORS, SPACING, RADIUS } from '../theme';

interface RideCardProps {
  riderName: string;
  rating: number;
  pickup: string;
  drop: string;
  distance: string;
  fare: string;
  category: string;
}

export const RideCard: React.FC<RideCardProps> = ({
  riderName,
  rating,
  pickup,
  drop,
  distance,
  fare,
  category,
}) => {
  return (
    <Card variant="outline" style={styles.container}>
      <View style={styles.header}>
        <View style={styles.riderInfo}>
          <View style={styles.avatarPlaceholder}>
            <Typography variant="body" color={COLORS.white} bold>
              {riderName.charAt(0)}
            </Typography>
          </View>
          <View>
            <Typography variant="label">{riderName}</Typography>
            <Typography variant="caption" color={COLORS.textSecondary}>
              ★ {rating.toFixed(1)} • {category}
            </Typography>
          </View>
        </View>
        <View style={styles.fareInfo}>
          <Typography variant="h3" color={COLORS.accent}>{fare}</Typography>
          <Typography variant="caption" color={COLORS.textSecondary}>{distance}</Typography>
        </View>
      </View>

      <View style={styles.locations}>
        <View style={styles.locationRow}>
          <View style={[styles.dot, { backgroundColor: COLORS.accent }]} />
          <Typography variant="body" style={styles.locationText} numberOfLines={1}>
            {pickup}
          </Typography>
        </View>
        <View style={styles.line} />
        <View style={styles.locationRow}>
          <View style={[styles.dot, styles.dropDot]} />
          <Typography variant="body" style={styles.locationText} numberOfLines={1}>
            {drop}
          </Typography>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  riderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  fareInfo: {
    alignItems: 'flex-end',
  },
  locations: {
    paddingLeft: SPACING.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dropDot: {
    backgroundColor: COLORS.danger,
    borderRadius: 0,
  },
  line: {
    width: 2,
    height: 20,
    backgroundColor: COLORS.border,
    marginLeft: 4,
    marginVertical: 4,
  },
});
