import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Typography, Button, BottomSheet, MapMarker, Input } from '../../components';
import { COLORS, SPACING } from '../../theme';
import { useRideStore } from '../../store/useRideStore';
import { rideService } from '../../api/rideService';
import { useLocation } from '../../hooks/useLocation';

export const RideStartScreen = ({ navigation }: any) => {
  const [pin, setPin] = useState('');
  const { currentRide, updateRideStatus } = useRideStore();
  const { location } = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartRide = async () => {
    if (pin.length !== 4) return;
    if (!currentRide) return;

    setIsLoading(true);
    try {
      await rideService.startRide(currentRide.id, pin);
      updateRideStatus('in_progress');
      navigation.navigate('RideProgress');
    } catch (e) {
      Alert.alert('Error', 'Invalid PIN or network error. Please verify with the rider.');
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
          latitude: currentRide.pickup?.latitude || 0,
          longitude: currentRide.pickup?.longitude || 0,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}
      >
        {currentRide.pickup && (
          <MapMarker 
            type="pickup"
             coordinate={{ latitude: currentRide.pickup.latitude, longitude: currentRide.pickup.longitude }}
          />
        )}
        {location && (
          <MapMarker 
            type="driver" 
            heading={location.heading} 
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
          />
        )}
      </MapView>

      <BottomSheet isVisible={true} onClose={() => {}} height="auto">
        <View style={styles.sheetContent}>
          <Typography variant="h2" style={styles.title}>You have Arrived</Typography>
          <Typography variant="body" color={COLORS.textSecondary} style={styles.subtitle}>
            Please wait for {currentRide.riderName || 'Rider'} or call them if needed.
          </Typography>

          <View style={styles.pinContainer}>
            <Typography variant="label" style={styles.pinLabel}>Enter START PIN</Typography>
            <Input
              placeholder="0000"
              keyboardType="number-pad"
              maxLength={4}
              value={pin}
              onChangeText={setPin}
              style={styles.pinInput}
            />
          </View>

          <Button 
            label="START RIDE" 
            variant="accent"
            size="lg"
            loading={isLoading}
            disabled={pin.length !== 4 || isLoading}
            onPress={handleStartRide} 
          />
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary, // Dark map behind
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContent: {
    paddingTop: SPACING.lg,
  },
  title: {
    marginBottom: SPACING.xs,
  },
  subtitle: {
    marginBottom: SPACING.xl,
  },
  pinContainer: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  pinLabel: {
    marginBottom: SPACING.md,
  },
  pinInput: {
    fontSize: 24,
    letterSpacing: 8,
    textAlign: 'center',
    width: 150,
  },
});
