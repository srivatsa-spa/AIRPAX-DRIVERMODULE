import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import CircularProgress from 'react-native-circular-progress-indicator';
import { Navigation, Star } from 'lucide-react-native';
import { Typography, MapMarker } from '../../components';
import { SPACING, RADIUS, SHADOWS } from '../../theme';
import { useRideStore } from '../../store/useRideStore';
import { rideService } from '../../api/rideService';
import { useLocation } from '../../hooks/useLocation';
import { decodePolyline } from '../../utils/mapUtils';
import { Polyline } from 'react-native-maps';

export const RideAssignmentScreen = ({ navigation }: any) => {
  const { incomingRequest, setCurrentRide, setIncomingRequest } = useRideStore();
  const { location } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30); // Increased for testing
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);

  const fetchRoute = async (start: any, end: any) => {
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
    if (location && incomingRequest?.pickup) {
       fetchRoute(
         { latitude: location.latitude, longitude: location.longitude },
         { latitude: incomingRequest.pickup.latitude, longitude: incomingRequest.pickup.longitude }
       );
     }
  }, [incomingRequest?.id, location?.latitude, location?.longitude]);

  // Auto-accept countdown logic
  useEffect(() => {
    if (!incomingRequest) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleAccept();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown, incomingRequest]);

  const handleAccept = async () => {
    if (!incomingRequest || isLoading) return;
    setIsLoading(true);
    try {
      await rideService.acceptRide(incomingRequest.id);
      setCurrentRide({ ...incomingRequest, status: 'accepted' });
      setIncomingRequest(null);
      navigation.navigate('NavigateToPickup');
    } catch {
      Alert.alert('Error', 'Failed to accept ride.');
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!incomingRequest || isLoading) return;
    setIsLoading(true);
    try {
      await rideService.declineRide(incomingRequest.id);
      setIncomingRequest(null);
      navigation.goBack(); // Return to dashboard
    } catch {
      Alert.alert('Error', 'Failed to decline ride.');
      setIsLoading(false);
    }
  };

  if (!incomingRequest) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Typography color="#000">No active request</Typography>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Background Map */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: incomingRequest?.pickup?.latitude || 0,
          longitude: incomingRequest?.pickup?.longitude || 0,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}
        pitchEnabled={false}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        {location && (
          <MapMarker 
            type="driver" 
            heading={location.heading} 
            coordinate={{ latitude: location.latitude, longitude: location.longitude }} 
          />
        )}
        {incomingRequest?.pickup && (
          <MapMarker 
            type="pickup" 
            coordinate={{ latitude: incomingRequest.pickup.latitude, longitude: incomingRequest.pickup.longitude }}
          />
        )}
        {routeCoordinates.length > 0 && (
          <Polyline 
            coordinates={routeCoordinates}
            strokeColor={styles.goldLine.backgroundColor}
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Overlay Card Container */}
      <View style={styles.overlayContainer}>
        <View style={styles.card}>
          
          <Typography variant="h3" color="#0F172A" bold style={styles.cardTitle}>
            NEW RIDE ASSIGNED
          </Typography>
          <View style={styles.goldLine} />

          {/* Location Box */}
          <View style={styles.locationBox}>
            <View style={styles.locationContent}>
              <Typography variant="caption" bold color="#64748B" style={styles.eyebrow}>
                PICKUP LOCATION
              </Typography>
              <Typography variant="h2" bold color="#0F172A" style={styles.hubTitle}>
                {incomingRequest.pickup?.address || 'Pickup Point'}
              </Typography>
              <Typography variant="body" color="#475569">
                {incomingRequest.distance || '2.1'} KM away
              </Typography>
            </View>
            <View style={styles.navIconContainer}>
              <Navigation size={24} color="#0F172A" fill="#E2E8F0" />
            </View>
          </View>

          {/* Earnings Estimate */}
          <View style={styles.fareBox}>
            <View style={styles.fareHeader}>
              <Typography variant="caption" bold color="#64748B">EXPECTED EARNINGS</Typography>
              <Typography variant="h1" bold color="#10B981">₹{incomingRequest.fare?.total || 0}</Typography>
            </View>
            <View style={styles.fareDivider} />
            <View style={styles.fareBreakdown}>
               <Typography variant="caption" color="#94A3B8">Includes Distance + Time Fare</Typography>
            </View>
          </View>

          {/* Bonus Box */}
          <View style={styles.bonusBox}>
            <View style={styles.starCircle}>
              <Star size={16} color="#FFFFFF" fill="#FFFFFF" />
            </View>
            <View>
              <Typography variant="body" bold color="#0F172A">
                Peak Hour Bonus: ₹20
              </Typography>
              <Typography variant="caption" color="#64748B">
                +1 Ride towards Daily Goal
              </Typography>
            </View>
          </View>

          {/* Circular Countdown */}
          <View style={styles.countdownContainer}>
            <CircularProgress
              value={countdown}
              initialValue={3}
              radius={40}
              duration={1000}
              maxValue={3}
              clockwise={false}
              activeStrokeColor="#0F172A"
              inActiveStrokeColor="#E2E8F0"
              activeStrokeWidth={6}
              inActiveStrokeWidth={6}
              titleStyle={{ fontWeight: 'bold' }}
              valueSuffix=""
              progressFormatter={(value: number) => {
                'worklet';
                return Math.ceil(value).toString();
              }}
            />
            <Typography variant="body" color="#64748B" style={styles.autoAcceptText}>
              Auto accepting ride...
            </Typography>
          </View>

          {/* Decline Button */}
          <TouchableOpacity 
            style={styles.declineButton}
            onPress={handleDecline}
            disabled={isLoading}
          >
            <Typography variant="body" bold color="#0F172A">DECLINE</Typography>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: 'rgba(248, 250, 252, 0.4)', // Slight transparent wash
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.heavy,
  },
  cardTitle: {
    marginBottom: SPACING.xs,
  },
  goldLine: {
    width: 40,
    height: 3,
    backgroundColor: '#F59E0B',
    borderRadius: 2,
    marginBottom: SPACING.lg,
  },
  locationBox: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#F1F5F9',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationContent: {
    flex: 1,
  },
  eyebrow: {
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  hubTitle: {
    marginBottom: 4,
  },
  navIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bonusBox: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#FEF3C7', // Yellow background
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  starCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  countdownContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  autoAcceptText: {
    marginTop: SPACING.lg,
  },
  declineButton: {
    width: '100%',
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fareBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fareHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fareDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: SPACING.md,
  },
  fareBreakdown: {
    alignItems: 'center',
  },
});
