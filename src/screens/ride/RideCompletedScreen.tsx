import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Check, TrendingUp, CircleDollarSign } from 'lucide-react-native';
import { Typography, Button } from '../../components';
import { SPACING, RADIUS } from '../../theme';
import { useRideStore } from '../../store/useRideStore';

export const RideCompletedScreen = ({ navigation }: any) => {
  const { clearRide, currentRide } = useRideStore();

  const handleFinish = () => {
    clearRide();
    navigation.navigate('Dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleFinish}>
          <ArrowLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <Typography variant="h3" color="#0F172A" bold>Trip Summary</Typography>
        <View style={{ width: 24 }} /> {/* Spacer to center the title */}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Success Badge */}
        <View style={styles.badgeContainer}>
          <View style={styles.checkCircle}>
            <Check size={48} color="#10B981" strokeWidth={3} />
          </View>
          <Typography variant="h1" color="#0F172A" style={styles.title}>
            Payment Received
          </Typography>
          <Typography variant="body" color="#64748B" style={styles.subtitle}>
            Trip payment successfully confirmed.
          </Typography>
        </View>

        {/* Fare Breakdown Card */}
        <View style={styles.card}>
          <Typography variant="caption" bold color="#64748B" style={{ marginBottom: 12 }}>
            FARE BREAKDOWN
          </Typography>
          <View style={styles.fareRow}>
             <Typography variant="body" color="#475569">Base Fare</Typography>
             <Typography variant="body" bold color="#0F172A">₹{currentRide?.fare?.baseFare || 0}</Typography>
          </View>
          <View style={styles.fareRow}>
             <Typography variant="body" color="#475569">Distance Fare</Typography>
             <Typography variant="body" bold color="#0F172A">₹{currentRide?.fare?.distanceFare || 0}</Typography>
          </View>
          <View style={styles.fareRow}>
             <Typography variant="body" color="#475569">Time Fare</Typography>
             <Typography variant="body" bold color="#0F172A">₹{currentRide?.fare?.waitingFare || 0}</Typography>
          </View>
          <View style={styles.rowDivider} />
          <View style={styles.fareRow}>
             <Typography variant="h3" bold color="#0F172A">Total Earning</Typography>
             <Typography variant="h3" bold color="#10B981">₹{currentRide?.fare?.total || 0}</Typography>
          </View>
        </View>

        {/* Goal Progress Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TrendingUp size={20} color="#0F172A" />
              <Typography variant="h3" bold color="#0F172A" style={{ marginLeft: 8 }}>
                Goal Progress
              </Typography>
            </View>
            <Typography variant="h3" bold color="#1E3A8A">80%</Typography>
          </View>
          
          <Typography variant="body" color="#475569" style={styles.progressText}>
            8 / 10 rides completed today
          </Typography>
          
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '80%', backgroundColor: '#F59E0B' }]} />
          </View>
        </View>

        {/* Upsell Card */}
        <View style={styles.upsellCard}>
          <View style={styles.coinCircle}>
            <CircleDollarSign size={20} color="#FFFFFF" fill="#F59E0B" />
          </View>
          <View style={styles.upsellText}>
            <Typography variant="caption" bold color="#1E3A8A">
              Almost there!
            </Typography>
            <Typography variant="body" color="#475569" style={{ marginTop: 2 }}>
              Complete 2 more rides to earn <Typography variant="body" color="#1E3A8A" bold>₹200</Typography> bonus
            </Typography>
          </View>
        </View>

      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <Button 
          label="GO TO DASHBOARD" 
          variant="primary"
          size="lg"
          style={styles.actionBtn}
          onPress={handleFinish}
        />
        <TouchableOpacity style={styles.linkButton}>
          <Typography variant="body" bold color="#0F172A">
            View incentive details ›
          </Typography>
        </TouchableOpacity>
      </View>
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
  },
  backButton: {
    padding: SPACING.xs,
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxxl,
    alignItems: 'center',
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl * 1.5,
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D1FAE5', // Light green wash
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  progressText: {
    marginBottom: SPACING.lg,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  upsellCard: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#F1F5F9', // Light gray background
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  coinCircle: {
    marginRight: SPACING.md,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  upsellText: {
    flex: 1,
  },
  footer: {
    padding: SPACING.xxl,
    alignItems: 'center',
  },
  actionBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 30,
    width: '100%',
    marginBottom: SPACING.lg,
  },
  linkButton: {
    paddingVertical: SPACING.xs,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
});
