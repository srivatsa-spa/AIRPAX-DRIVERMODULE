import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography, Button, Card } from '../../components';
import { COLORS, SPACING, RADIUS } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import { driverService } from '../../api/driverService';

export const ProfileScreen = ({ navigation }: any) => {
  const { driver, setDriver } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = React.useCallback(async () => {
    try {
      const response = await driverService.getProfile();
      setDriver(response.data);
    } catch (e) {
      console.error('Failed to fetch profile', e);
    }
  }, [setDriver]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
          <Typography variant="h2" color={COLORS.white}>Driver Profile</Typography>
          <View style={styles.headerRight} />
        </View>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.accent]}
              tintColor={COLORS.accent}
            />
          }
        >
          {/* Main Profile Info */}
          <Card variant="elevated" style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <Typography variant="h1" color={COLORS.white}>
                  {driver?.name?.charAt(0) || 'D'}
                </Typography>
              </View>
            </View>
            
            <Typography variant="h2" align="center" style={styles.name}>
              {driver?.name || 'Driver Name'}
            </Typography>
            <View style={styles.ratingBadge}>
              <Typography variant="body" color={COLORS.accent} bold>
                ★ {driver?.rating || '4.9'}
              </Typography>
            </View>
            <Typography variant="caption" color={COLORS.textSecondary} align="center">
              250+ Rides Completed
            </Typography>
          </Card>

          {/* Vehicle Details */}
          <Typography variant="label" color={COLORS.textSecondary} style={styles.sectionTitle}>
            VEHICLE DETAILS
          </Typography>
          <Card variant="elevated" style={styles.detailsCard}>
            <View style={styles.infoRow}>
              <Typography variant="caption" color={COLORS.textSecondary}>Car Model</Typography>
              <Typography variant="body" color={COLORS.textPrimary}>
                {driver?.vehicle?.model || 'Maruti Suzuki Swift Dzire'}
              </Typography>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Typography variant="caption" color={COLORS.textSecondary}>Vehicle Number</Typography>
              <Typography variant="body" color={COLORS.textPrimary} bold>
                {driver?.vehicle?.plate || 'DL 10 AB 1234'}
              </Typography>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Typography variant="caption" color={COLORS.textSecondary}>Vehicle Color</Typography>
              <Typography variant="body" color={COLORS.textPrimary}>
                {driver?.vehicle?.color || 'White'}
              </Typography>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Typography variant="caption" color={COLORS.textSecondary}>Service Type</Typography>
              <Typography variant="body" color={COLORS.accent} bold>AIRPAX Prime</Typography>
            </View>
          </Card>

          {/* Documents Status */}
          <Typography variant="label" color={COLORS.textSecondary} style={styles.sectionTitle}>
            DOCUMENTS
          </Typography>
          <Card variant="elevated" style={styles.detailsCard}>
            <View style={styles.infoRow}>
              <Typography variant="body" color={COLORS.textPrimary}>Driving License</Typography>
              <Typography variant="caption" color={COLORS.accent} bold>VERIFIED ✓</Typography>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Typography variant="body" color={COLORS.textPrimary}>Vehicle RC</Typography>
              <Typography variant="caption" color={COLORS.accent} bold>VERIFIED ✓</Typography>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Typography variant="body" color={COLORS.textPrimary}>Insurance</Typography>
              <Typography variant="caption" color={COLORS.danger} bold>EXPIRES SOON !</Typography>
            </View>
          </Card>

          <Button 
            label="EDIT DETAILS" 
            variant="secondary"
            outline 
            size="lg"
            style={styles.editButton} 
            onPress={() => {}}
          />
          <View style={styles.bottomPadding} />
        </ScrollView>
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
  profileCard: {
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  avatarContainer: {
    marginBottom: SPACING.lg,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  name: {
    marginBottom: SPACING.xs,
  },
  ratingBadge: {
    backgroundColor: `${COLORS.accent}20`,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.round,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    marginBottom: SPACING.sm,
    letterSpacing: 1,
  },
  detailsCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: SPACING.xxl,
  },
  infoRow: {
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
  editButton: {
    marginBottom: SPACING.xl,
  },
  bottomPadding: {
    height: SPACING.xxxl,
  },
});
