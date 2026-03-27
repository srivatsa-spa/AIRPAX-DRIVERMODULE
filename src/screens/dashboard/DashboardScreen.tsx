import React from 'react';
import { StyleSheet, View, TouchableOpacity, Switch, Platform } from 'react-native';
import { LocateFixed } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useQuery } from '@tanstack/react-query';
import { Typography, Button, Card, Badge, MapMarker } from '../../components';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import { useLocation } from '../../hooks/useLocation';
import { earningsService } from '../../api/earningsService';
import { useRideStore } from '../../store/useRideStore';

const GOOGLE_MAPS_API_KEY = "AIzaSyDKEBTCflJhmLKu_u5Yg35umBhwdqoa0Qg";

export const DashboardScreen = ({ navigation }: any) => {
  const mapRef = React.useRef<MapView>(null);
  const { driver, isOnline, setOnline } = useAppStore();
  const { location } = useLocation();
  const { currentRide } = useRideStore();
  const [isInitialCentered, setIsInitialCentered] = React.useState(false);

  const { data: summary } = useQuery({
    queryKey: ['earningsSummary'],
    queryFn: async () => {
      const { data } = await earningsService.getSummary();
      return data;
    },
    enabled: !!driver, // Only fetch if logged in
  });

  const getDestination = () => {
    if (!currentRide) return null;
    if (['accepted', 'arrived'].includes(currentRide.status)) return currentRide.pickup;
    if (currentRide.status === 'in_progress') return currentRide.dropoff;
    return null;
  };

  const activeDestination = getDestination();

  React.useEffect(() => {
    if (location && !isInitialCentered && !activeDestination) {
      mapRef.current?.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
      setIsInitialCentered(true);
    }
  }, [location, isInitialCentered, activeDestination]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
         style={styles.map}
         scrollEnabled={true}
         zoomEnabled={true}
         rotateEnabled={true}
         pitchEnabled={true}
         initialRegion={location ? {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        } : {
          latitude: 28.4595, // Default/fallback
          longitude: 77.0726,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}

      >
        {isOnline && location && (
          <MapMarker 
            type="driver" 
            heading={location.heading} 
            coordinate={{ latitude: location.latitude, longitude: location.longitude }} 
          />
        )}
        
        {activeDestination && (
          <MapMarker 
            type={currentRide?.status === 'in_progress' ? 'drop' : 'pickup'}
            coordinate={{ latitude: activeDestination.latitude, longitude: activeDestination.longitude }} 
          />
        )}

        {isOnline && location && activeDestination && (
          <MapViewDirections
            origin={{ latitude: location.latitude, longitude: location.longitude }}
            destination={{ latitude: activeDestination.latitude, longitude: activeDestination.longitude }}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={4}
            strokeColor={COLORS.primary}
            onReady={result => {
              mapRef.current?.fitToCoordinates(result.coordinates, {
                edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
                animated: true
              });
            }}
          />
        )}
      </MapView>

      {!location && isOnline && (
        <View style={styles.loadingOverlay}>
          <Card variant="elevated" style={styles.loadingCard}>
            <Typography variant="body" bold color={COLORS.primary}>
              Finding your location...
            </Typography>
            <Typography variant="caption" color={COLORS.textSecondary}>
              Please ensure GPS is enabled
            </Typography>
          </Card>
        </View>
      )}

      <SafeAreaView style={styles.overlay} edges={['top']} pointerEvents="box-none">
        {/* TOP BAR */}
        <Card variant="elevated" style={styles.topBar}>
          <TouchableOpacity
            style={styles.profileSection}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={styles.avatar}>
              <Typography variant="body" color={COLORS.white} bold>
                {driver?.name?.charAt(0) || 'D'}
              </Typography>
            </View>
            <View>
              <Typography variant="label">{driver?.name || 'Driver Name'}</Typography>
              <Typography variant="caption" color={COLORS.textSecondary}>
                ★ {driver?.rating || 'New'} • {driver?.vehicle?.model || 'Vehicle'}
              </Typography>
            </View>
          </TouchableOpacity>
        </Card>

        {/* CURRENT LOCATION BUTTON */}
        {!activeDestination && location && (
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={() => {
              mapRef.current?.animateToRegion({
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }, 1000);
            }}
          >
            <LocateFixed size={24} color={COLORS.primary} strokeWidth={2.5} />
          </TouchableOpacity>
        )}

        {/* BOTTOM SECTION */}
        <View style={styles.bottomSection}>
          <View style={styles.toggleContainer}>
            <View style={styles.toggleRow}>
              <Badge 
                status={isOnline ? 'online' : 'offline'} 
                label={isOnline ? "YOU'RE ONLINE" : "OFFLINE"} 
              />
              <Switch
                trackColor={{ false: COLORS.border, true: `${COLORS.accent}40` }}
                thumbColor={isOnline ? COLORS.accent : COLORS.white}
                ios_backgroundColor={COLORS.border}
                onValueChange={setOnline}
                value={isOnline}
                style={styles.switch}
              />
            </View>
          </View>

          <Card variant="glass" style={styles.actionCard}>
            <View style={styles.statsRow}>
              <View>
                <Typography variant="caption" color={COLORS.white} style={styles.opacity70}>
                  Today's Earnings
                </Typography>
                <Typography variant="h2" color={COLORS.white}>₹{summary?.today || 0}</Typography>
              </View>
              <View style={styles.alignRight}>
                <Typography variant="caption" color={COLORS.white} style={styles.opacity70}>
                  Rides Completed
                </Typography>
                <Typography variant="h2" color={COLORS.white}>{summary?.totalTrips || 0}</Typography>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <Button 
                label={isOnline ? "PAUSE SHIFT" : "FIND RIDES"} 
                variant={isOnline ? "secondary" : "accent"} 
                style={styles.flex1}
                onPress={() => navigation.navigate('RideAssignment')}
              />
            </View>

            <TouchableOpacity 
              style={styles.earningsLink}
              onPress={() => navigation.navigate('Earnings')}
            >
              <Typography variant="label" color={COLORS.accent} align="center">
                View Weekly Summary
              </Typography>
            </TouchableOpacity>
          </Card>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  topBar: {
    padding: SPACING.sm,
    borderRadius: RADIUS.round,
    marginBottom: 0, // override Card default
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xs,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  bottomSection: {
    // container for toggle and card
  },
  toggleContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.round,
    padding: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    alignSelf: 'center',
    ...SHADOWS.medium,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 200,
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  actionCard: {
    marginBottom: 0,
    backgroundColor: COLORS.mapOverlay,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  opacity70: {
    opacity: 0.7,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  flex1: {
    flex: 1,
  },
  earningsLink: {
    marginTop: SPACING.lg,
    paddingVertical: SPACING.xs,
  },
  locationButton: {
    position: 'absolute',
    top: 100, // Below top bar
    right: SPACING.md,
    backgroundColor: COLORS.white,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
    zIndex: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  loadingCard: {
    padding: SPACING.lg,
    alignItems: 'center',
    borderRadius: RADIUS.lg,
  },
});
