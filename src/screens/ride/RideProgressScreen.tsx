import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { Typography, Button, BottomSheet, MapMarker } from '../../components';
import { COLORS, SPACING } from '../../theme';
import { useRideStore } from '../../store/useRideStore';
import { rideService } from '../../api/rideService';
import { useLocation } from '../../hooks/useLocation';
import { decodePolyline } from '../../utils/mapUtils';
import { useEffect } from 'react';

export const RideProgressScreen = ({ navigation }: any) => {
  const { currentRide, updateRideStatus } = useRideStore();
  const { location } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);

  const fetchRoute = async (start: any, end: any) => {
    // Replace YOUR_API_KEY with real key (consistent with Rider App)
    const API_KEY = 'GOOGLE_MAPS_API_KEY';
    if (API_KEY === 'GOOGLE_MAPS_API_KEY') {
       setRouteCoordinates([start, end]);
       return;
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start.latitude},${start.longitude}&destination=${end.latitude},${end.longitude}&key=${API_KEY}`;
      const response = await fetch(url);
      const json = await response.json();
      if (json.routes.length > 0) {
        const points = json.routes[0].overview_polyline.points;
        const coords = decodePolyline(points);
        setRouteCoordinates(coords);
      }
    } catch (error) {
       console.error('Route Fetch Error:', error);
       setRouteCoordinates([start, end]); 
    }
  };

  useEffect(() => {
    if (location && currentRide) {
      fetchRoute(
        { latitude: location.latitude, longitude: location.longitude },
        { latitude: currentRide.dropoff?.latitude || 0, longitude: currentRide.dropoff?.longitude || 0 }
      );
    }
  }, [location?.latitude, location?.longitude]);

  const handleEndRide = async () => {
    if (!currentRide) return;
    setIsLoading(true);
    try {
      await rideService.completeRide(currentRide.id);
      updateRideStatus('completed');
      
      // Navigate to completed screen to show fare summary
      navigation.navigate('RideCompleted');
    } catch (e) {
      Alert.alert('Error', 'Failed to end ride. Please ensure you have an active network connection.');
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
          latitude: currentRide.dropoff?.latitude || 0,
          longitude: currentRide.dropoff?.longitude || 0,
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
        {currentRide.dropoff && (
          <MapMarker 
            type="drop" 
            coordinate={{ latitude: currentRide.dropoff.latitude, longitude: currentRide.dropoff.longitude }}
          />
        )}
        
        {routeCoordinates.length > 0 && (
          <Polyline 
            coordinates={routeCoordinates}
            strokeColor={COLORS.accent}
            strokeWidth={4}
          />
        )}
      </MapView>

      <BottomSheet isVisible={true} onClose={() => {}} height="auto">
        <View style={styles.sheetContent}>
          <View style={styles.header}>
            <View style={styles.pulseIndicator} />
            <Typography variant="caption" color={COLORS.accent} bold>
              ON GOING RIDE
            </Typography>
          </View>

          <View style={styles.row}>
            <View>
              <Typography variant="h1">{currentRide.duration} min</Typography>
              <Typography variant="body" color={COLORS.textSecondary}>{currentRide.distance} km remaining</Typography>
            </View>
            <View style={styles.alignRight}>
              <Typography variant="h2">₹{currentRide.fare?.total || 0}</Typography>
              <Typography variant="caption" color={COLORS.textSecondary}>Est. Fare</Typography>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.destinationRow}>
            <View style={[styles.dot, styles.dropDot]} />
            <View>
              <Typography variant="label">Dropping at</Typography>
              <Typography variant="body" color={COLORS.textSecondary}>
                {currentRide.dropoff?.address || 'Destination'}
              </Typography>
            </View>
          </View>

          <View style={styles.actionRow}>
            <Button 
              label="SOS" 
              variant="danger" 
              outline 
              style={styles.flex1}
              onPress={() => {}}
            />
            <Button 
              label="END RIDE" 
              variant="accent" 
              loading={isLoading}
              disabled={isLoading}
              style={[styles.flex1, styles.marginLeft]}
              onPress={handleEndRide}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  pulseIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.xxxl,
  },
  dot: {
    width: 12,
    height: 12,
    marginTop: 4,
    marginRight: SPACING.md,
  },
  dropDot: {
    backgroundColor: COLORS.danger,
    borderRadius: 0,
  },
  actionRow: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  marginLeft: {
    marginLeft: SPACING.md,
  },
});
