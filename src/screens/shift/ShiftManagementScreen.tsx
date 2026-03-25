import React, { useState } from 'react';
import { StyleSheet, View, Switch, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography, Button, Card, Badge } from '../../components';
import { COLORS, SPACING } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import { driverService } from '../../api/driverService';

export const ShiftManagementScreen = ({ navigation }: any) => {
  const { isOnline, setOnline, activeShift, setActiveShift } = useAppStore();
  const [autoAccept, setAutoAccept] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleShift = async (value: boolean) => {
    setIsLoading(true);
    try {
      if (value) {
        // Going online
        const response = await driverService.startShift();
        setActiveShift(response.data);
        setOnline(true);
      } else {
        // Going offline
        if (activeShift?.id) {
          await driverService.endShift(activeShift.id);
        }
        setActiveShift(null);
        setOnline(false);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to update shift status. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.flex}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Typography variant="body" color={COLORS.accent}>← Back</Typography>
          </TouchableOpacity>
          <Typography variant="h2" color={COLORS.white}>Shift Settings</Typography>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.content}>
          {/* Main Duty Toggle */}
          <Card variant="elevated" style={styles.statusCard}>
            <View style={styles.statusRow}>
              <View style={styles.flex1}>
                <Typography variant="h3" style={styles.cardTitle}>Duty Status</Typography>
                <Typography variant="body" color={COLORS.textSecondary}>
                  {isOnline ? 'You are receiving ride requests' : 'You are currently offline'}
                </Typography>
              </View>
              <View style={styles.switchContainer}>
                <Badge 
                  status={isOnline ? 'online' : 'offline'} 
                  label="" 
                  style={styles.badge}
                />
                <Switch
                  value={isOnline}
                  onValueChange={toggleShift}
                  disabled={isLoading}
                  trackColor={{ false: COLORS.border, true: `${COLORS.accent}50` }}
                  thumbColor={isOnline ? COLORS.accent : COLORS.white}
                  ios_backgroundColor={COLORS.border}
                />
              </View>
            </View>
          </Card>

          {/* Stats Grid */}
          <Typography variant="label" color={COLORS.textSecondary} style={styles.sectionTitle}>
            TODAY'S SHIFT
          </Typography>
          <View style={styles.statsGrid}>
            <Card variant="elevated" style={styles.statBox}>
              <Typography variant="caption" color={COLORS.textSecondary} style={styles.statLabel}>Online Time</Typography>
              <Typography variant="h2" color={COLORS.accent}>4h 23m</Typography>
            </Card>
            <Card variant="elevated" style={styles.statBox}>
              <Typography variant="caption" color={COLORS.textSecondary} style={styles.statLabel}>Total Rides</Typography>
              <Typography variant="h2" color={COLORS.accent}>6</Typography>
            </Card>
          </View>

          {/* Preferences */}
          <Typography variant="label" color={COLORS.textSecondary} style={styles.sectionTitle}>
            PREFERENCES
          </Typography>
          <Card variant="elevated" style={styles.preferencesCard}>
            <View style={styles.preferenceRow}>
              <Typography variant="body" color={COLORS.textPrimary}>Auto-Accept Rides</Typography>
              <Switch 
                value={autoAccept} 
                onValueChange={setAutoAccept}
                trackColor={{ false: COLORS.border, true: COLORS.accent }} 
                thumbColor={COLORS.white}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.preferenceRow}>
              <Typography variant="body" color={COLORS.textPrimary}>Night Shift Mode</Typography>
              <Switch 
                value={nightMode} 
                onValueChange={setNightMode}
                trackColor={{ false: COLORS.border, true: COLORS.accent }} 
                thumbColor={COLORS.white}
              />
            </View>
          </Card>

          <Button 
            label={isOnline ? "GO OFFLINE" : "START SHIFT"} 
            variant={isOnline ? "danger" : "accent"}
            size="lg"
            disabled={isLoading}
            loading={isLoading}
            onPress={() => {
              toggleShift(!isOnline).then(() => {
                if (!isOnline) { // note: isOnline here is the closure's state before the toggle
                  navigation.replace('Dashboard');
                }
              });
            }}
            style={styles.mainButton}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 60,
  },
  headerRight: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  statusCard: {
    padding: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  cardTitle: {
    marginBottom: SPACING.xs,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    marginRight: SPACING.sm,
  },
  sectionTitle: {
    marginBottom: SPACING.sm,
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xxl,
  },
  statBox: {
    flex: 0.48,
    padding: SPACING.lg,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  statLabel: {
    marginBottom: SPACING.sm,
  },
  preferencesCard: {
    padding: 0,
    overflow: 'hidden',
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.lg,
  },
  mainButton: {
    marginTop: 'auto',
    marginBottom: SPACING.xl,
  },
});
