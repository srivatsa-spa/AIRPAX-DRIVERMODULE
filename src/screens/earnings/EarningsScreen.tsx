import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Typography, Card, Button } from '../../components';
import { COLORS, SPACING, RADIUS } from '../../theme';
import { earningsService } from '../../api/earningsService';

export const EarningsScreen = ({ navigation }: any) => {
  const queryClient = useQueryClient();
  const [period, setPeriod] = useState<'today' | 'week'>('today');

  const { 
    data: summary, 
    isLoading: isSummaryLoading, 
    refetch: refetchSummary,
    isRefetching: isSummaryRefetching 
  } = useQuery({
    queryKey: ['earningsSummary'],
    queryFn: async () => {
      const { data } = await earningsService.getSummary();
      return data;
    }
  });

  const { 
    data: history, 
    isLoading: isHistoryLoading, 
    refetch: refetchHistory,
    isRefetching: isHistoryRefetching
  } = useQuery({
    queryKey: ['earningsHistory'],
    queryFn: async () => {
      const { data } = await earningsService.getHistory();
      return data;
    }
  });

  const payoutMutation = useMutation({
    mutationFn: (amount: number) => earningsService.requestPayout(amount),
    onSuccess: () => {
      Alert.alert('Success', 'Payout requested successfully. It will be processed shortly.');
      queryClient.invalidateQueries({ queryKey: ['earningsHistory'] });
      queryClient.invalidateQueries({ queryKey: ['earningsSummary'] });
    },
    onError: () => {
      Alert.alert('Error', 'Failed to request payout. Try again later.');
    }
  });

  const handleRefresh = React.useCallback(() => {
    refetchSummary();
    refetchHistory();
  }, [refetchSummary, refetchHistory]);

  const isLoading = isSummaryLoading || isHistoryLoading;
  const isRefreshing = isSummaryRefetching || isHistoryRefetching;

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
          <Typography variant="h2" color={COLORS.white}>Your Earnings</Typography>
          <View style={styles.headerRight} />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.accent}
              colors={[COLORS.accent]}
            />
          }
        >
          {isLoading && !isRefreshing ? (
            <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: SPACING.xxxl }} />
          ) : (
            <>
              {/* Main Summary */}
              <Card variant="elevated" style={styles.summaryCard}>
                <View style={styles.periodSelector}>
                  <TouchableOpacity onPress={() => setPeriod('today')} style={[styles.periodTab, period === 'today' && styles.periodTabActive]}>
                    <Typography variant="label" color={period === 'today' ? COLORS.white : COLORS.textSecondary}>TODAY</Typography>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setPeriod('week')} style={[styles.periodTab, period === 'week' && styles.periodTabActive]}>
                    <Typography variant="label" color={period === 'week' ? COLORS.white : COLORS.textSecondary}>THIS WEEK</Typography>
                  </TouchableOpacity>
                </View>
                
                <Typography variant="caption" color={COLORS.textSecondary} align="center">
                  {period === 'today' ? "Today's Earnings" : "This Week's Earnings"}
                </Typography>
                <Typography variant="h1" align="center" style={styles.mainAmount}>
                  ₹{summary ? (period === 'today' ? summary.today : summary.thisWeek) : 0}
                </Typography>

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Typography variant="h2" color={COLORS.textPrimary}>{summary?.totalTrips || 0}</Typography>
                    <Typography variant="caption" color={COLORS.textSecondary}>TRIPS</Typography>
                  </View>
                  <View style={styles.dividerVertical} />
                  <View style={styles.statItem}>
                    <Typography variant="h2" color={COLORS.textPrimary}>{summary?.onlineHours || 0}h</Typography>
                    <Typography variant="caption" color={COLORS.textSecondary}>ONLINE</Typography>
                  </View>
                </View>
              </Card>

              <Typography variant="label" color={COLORS.textSecondary} style={styles.sectionTitle}>
                RECENT PAYOUTS
              </Typography>
              
              <Card variant="elevated" style={[styles.activityCard, (!history || history.length === 0) && { padding: SPACING.lg, alignItems: 'center'}]}>
                {!history || history.length === 0 ? (
                  <Typography variant="body" color={COLORS.textSecondary}>No recent payouts found.</Typography>
                ) : (
                  history.slice(0, 5).map((item, index) => (
                    <React.Fragment key={item.id}>
                      <View style={styles.rideRow}>
                        <View style={styles.rideIcon}>
                          <Typography color={COLORS.primary}>₹</Typography>
                        </View>
                        <View style={styles.rideDetails}>
                          <Typography variant="body" color={COLORS.textPrimary} bold>
                            Payout to Bank
                          </Typography>
                          <Typography variant="caption" color={COLORS.textSecondary}>
                            {new Date(item.date).toLocaleDateString()} • {item.status.toUpperCase()}
                          </Typography>
                        </View>
                        <Typography variant="h3" color={COLORS.accent}>₹{item.amount}</Typography>
                      </View>
                      {index < history.length - 1 && <View style={styles.dividerHorizontal} />}
                    </React.Fragment>
                  ))
                )}
              </Card>

              <Button 
                label="REQUEST PAYOUT" 
                variant="accent"
                size="lg"
                loading={payoutMutation.isPending}
                disabled={!summary || summary.thisWeek < 100 || payoutMutation.isPending}
                onPress={() => {
                  if (summary?.thisWeek) {
                    payoutMutation.mutate(summary.thisWeek);
                  }
                }} 
                style={styles.withdrawButton}
              />
              <Typography variant="caption" color={COLORS.textSecondary} align="center" style={{marginTop: SPACING.xs}}>
                Minimum payout: ₹100
              </Typography>
            </>
          )}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary, // Dark theme
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
    padding: SPACING.lg,
  },
  summaryCard: {
    padding: SPACING.xl,
    paddingTop: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.round,
    padding: 2,
    marginBottom: SPACING.xl,
    width: '100%',
    justifyContent: 'space-evenly',
  },
  periodTab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: RADIUS.round,
  },
  periodTabActive: {
    backgroundColor: COLORS.primary,
  },
  mainAmount: {
    fontSize: 48,
    marginVertical: SPACING.sm,
    color: COLORS.accent,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  dividerVertical: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
    letterSpacing: 1,
  },
  activityCard: {
    padding: 0,
    marginBottom: SPACING.xxl,
    overflow: 'hidden',
  },
  rideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  rideIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  rideDetails: {
    flex: 1,
  },
  dividerHorizontal: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.lg,
  },
  withdrawButton: {
    marginTop: SPACING.md,
  },
  bottomPadding: {
    height: SPACING.xxxl,
  },
});
