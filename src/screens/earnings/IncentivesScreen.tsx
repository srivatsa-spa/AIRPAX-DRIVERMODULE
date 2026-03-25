import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Info, Star, History } from 'lucide-react-native';
import { Typography } from '../../components';
import { SPACING, RADIUS } from '../../theme';

export const IncentivesScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <ArrowLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <Typography variant="h3" color="#0F172A" bold>My Incentives</Typography>
        <TouchableOpacity style={styles.iconButton}>
          <Info size={24} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Top Metrics Cards */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <View style={styles.metricValueRow}>
              <Typography variant="h3" bold color="#0F172A">4.8</Typography>
              <Star size={16} color="#F59E0B" fill="#F59E0B" style={styles.starIcon} />
            </View>
            <Typography variant="caption" color="#64748B" style={styles.metricLabel}>RATING</Typography>
          </View>

          <View style={styles.metricCard}>
            <Typography variant="h3" bold color="#0F172A">100%</Typography>
            <Typography variant="caption" color="#64748B" style={styles.metricLabel}>ACCEPTANCE</Typography>
          </View>

          <View style={styles.metricCard}>
            <Typography variant="h3" bold color="#0F172A">0%</Typography>
            <Typography variant="caption" color="#64748B" style={styles.metricLabel}>CANCELLATION</Typography>
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Typography variant="h3" bold color="#0F172A">Active Incentives</Typography>
          <View style={styles.badgeNeutral}>
            <Typography variant="caption" bold color="#64748B">3 AVAILABLE</Typography>
          </View>
        </View>

        {/* Card 1: Daily Target */}
        <View style={styles.incentiveCard}>
          <View style={styles.cardHeader}>
            <Typography variant="h3" bold color="#0F172A">Daily Target</Typography>
            <View style={styles.badgeYellow}>
              <Typography variant="caption" bold color="#D97706">₹200</Typography>
            </View>
          </View>
          <Typography variant="body" color="#64748B" style={styles.cardSubtitle}>
            Complete 10 rides to earn ₹200 bonus
          </Typography>
          
          <View style={styles.progressHeader}>
            <Typography variant="caption" bold color="#475569">Progress</Typography>
            <Typography variant="caption" bold color="#0F172A">8/10 rides</Typography>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, styles.bar80]} />
          </View>
        </View>

        {/* Card 2: Peak Hours Bonus */}
        <View style={styles.incentiveCard}>
          <View style={styles.cardHeader}>
            <View style={styles.rowAlign}>
              <Typography variant="h3" bold color="#0F172A">Peak Hours Bonus</Typography>
              <View style={[styles.badgeGreen, styles.ml8]}>
                <Typography variant="caption" bold color="#FFFFFF">ACTIVE</Typography>
              </View>
            </View>
          </View>
          
          <View style={styles.splitRow}>
            <Typography variant="body" color="#64748B" style={[styles.cardSubtitle, styles.flexSubtitle]}>
              Earn ₹30 extra per ride between 6PM – 10PM today
            </Typography>
            <View style={styles.bonusBox}>
              <Typography variant="h2" bold color="#10B981">+₹30</Typography>
              <Typography variant="caption" color="#10B981">per ride</Typography>
            </View>
          </View>
        </View>

        {/* Card 3: Weekly Loyalty Bonus */}
        <View style={styles.incentiveCard}>
          <View style={styles.cardHeader}>
            <Typography variant="h3" bold color="#0F172A">Weekly Loyalty Bonus</Typography>
            <View style={[styles.badgeBlue, styles.bgBlue]}>
              <Typography variant="caption" bold color="#FFFFFF">₹1,500</Typography>
            </View>
          </View>
          <Typography variant="body" color="#64748B" style={styles.cardSubtitle}>
            Complete 60 rides this week for ₹1,500 bonus
          </Typography>
          
          <View style={[styles.progressHeader, styles.justifyEnd]}>
            <Typography variant="caption" bold color="#64748B">27/60</Typography>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, styles.bar45]} />
          </View>
        </View>

        {/* Past Incentives Button */}
        <TouchableOpacity style={styles.pastIncentivesCard}>
          <View style={styles.iconCircle}>
            <History size={20} color="#0F172A" />
          </View>
          <View style={styles.pastTexts}>
            <Typography variant="body" bold color="#0F172A">View Past Incentives</Typography>
            <Typography variant="caption" color="#64748B">See your earnings history</Typography>
          </View>
          <Typography variant="h3" color="#94A3B8">›</Typography>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  iconButton: {
    padding: SPACING.xs,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricLabel: {
    marginTop: 4,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  badgeNeutral: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  incentiveCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeYellow: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  badgeGreen: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  badgeBlue: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  cardSubtitle: {
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bonusBox: {
    borderWidth: 1,
    borderColor: '#A7F3D0',
    backgroundColor: '#ECFDF5',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  pastIncentivesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  pastTexts: {
    flex: 1,
  },
  starIcon: {
    marginLeft: 4,
  },
  bar80: {
    width: '80%',
    backgroundColor: '#F59E0B',
  },
  ml8: {
    marginLeft: 8,
  },
  bgBlue: {
    backgroundColor: '#1E3A8A',
  },
  flexSubtitle: {
    flex: 1,
    marginRight: 16,
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  bar45: {
    width: '45%',
    backgroundColor: '#1E3A8A',
  },
});
