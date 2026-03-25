import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { Typography, Button, BottomSheet, MapMarker, RideCard } from '../../components';
import { COLORS, SPACING } from '../../theme';
import { useRideStore } from '../../store/useRideStore';
import { rideService } from '../../api/rideService';
import { useLocation } from '../../hooks/useLocation';

export const NavigateToPickupScreen = ({ navigation }: any) => {
  const { currentRide, updateRideStatus } = useRideStore();
  const { location } = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleArrived = async () => {
    if (!currentRide) return;
    setIsLoading(true);
    try {
      await rideService.markArrived(currentRide.id);
      updateRideStatus('arrived');
      navigation.navigate('RideStart');
    } catch (e) {
      Alert.alert('Error', 'Failed to update ride status.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentRide) return null;

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: currentRide.pickup.latitude,
          longitude: currentRide.pickup.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}
      >
        {location && (
          <MapMarker 
            type="driver" 
            heading={location.heading} 
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
          />
        )}
        <MapMarker 
          type="pickup" 
          coordinate={{ latitude: currentRide.pickup.latitude, longitude: currentRide.pickup.longitude }}
        />
        
        {location && (
          <Polyline 
            coordinates={[
              { latitude: location.latitude, longitude: location.longitude },
              { latitude: currentRide.pickup.latitude, longitude: currentRide.pickup.longitude }
            ]}
            strokeColor={COLORS.accent}
            strokeWidth={4}
            geodesic={true}
          />
        )}
      </MapView>

      <BottomSheet isVisible={true} onClose={() => {}} height="auto">
        <View style={styles.sheetContent}>
          <View style={styles.etaHeader}>
            <View>
              <Typography variant="h2">{currentRide.duration} min</Typography>
              <Typography variant="caption" color={COLORS.textSecondary}>{currentRide.distance} km away</Typography>
            </View>
            <View style={styles.badge}>
              <Typography variant="caption" color={COLORS.white} bold>NAVIGATING</Typography>
            </View>
          </View>

          <RideCard
            riderName={currentRide.riderName || 'Rider'}
            rating={currentRide.riderRating || 4.9}
            pickup={currentRide.pickup.address || 'User Location'}
            drop={currentRide.dropoff.address || 'Destination'}
            distance={`${currentRide.distance} KM`}
            fare={`₹${currentRide.fare}`}
            category="Mini"
          />

          <View style={styles.actionRow}>
            <Button 
              label="CALL RIDER" 
              variant="secondary" 
              outline 
              style={styles.flex1}
              onPress={() => {}}
            />
            <Button 
              label="ARRIVED" 
              variant="accent" 
              loading={isLoading}
              disabled={isLoading}
              style={[styles.flex1, styles.marginLeft]}
              onPress={handleArrived}
            />
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContent: {
    paddingTop: SPACING.md,
  },
  etaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 100,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: SPACING.xxl,
  },
  flex1: {
    flex: 1,
  },
  marginLeft: {
    marginLeft: SPACING.md,
  },
});
