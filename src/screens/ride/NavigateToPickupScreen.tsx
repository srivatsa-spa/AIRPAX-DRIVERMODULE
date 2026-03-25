import React, { useState, useRef } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { CornerUpLeft, Navigation, Phone, MessageSquare, MapPin } from 'lucide-react-native';
import { Typography, Button, MapMarker } from '../../components';
import { SPACING, RADIUS, SHADOWS } from '../../theme';
import { useRideStore } from '../../store/useRideStore';
import { useLocation } from '../../hooks/useLocation';
import { rideService } from '../../api/rideService';

const GOOGLE_MAPS_API_KEY = "AIzaSyDKEBTCflJhmLKu_u5Yg35umBhwdqoa0Qg";

export const NavigateToPickupScreen = ({ navigation }: any) => {
  const { currentRide, setCurrentRide } = useRideStore();
  const { location } = useLocation();
  const mapRef = useRef<MapView>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleArrived = async () => {
    if (!currentRide) return;
    setIsLoading(true);
    try {
      await rideService.markArrived(currentRide.id);
      setCurrentRide({ ...currentRide, status: 'arrived' });
      navigation.replace('RideStart');
    } catch {
      Alert.alert('Error', 'Failed to update status.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentRide) return null;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location?.latitude || currentRide.pickup.latitude,
          longitude: location?.longitude || currentRide.pickup.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}
        showsUserLocation={false}
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

        {/* ETA Bubble attached directly to the destination */}
        <Marker coordinate={{ latitude: currentRide.pickup.latitude, longitude: currentRide.pickup.longitude }} anchor={{ x: 0.5, y: 1.5 }}>
          <View style={styles.etaBubble}>
            <Typography variant="caption" bold color="#0F172A">
              🕒 ETA 4 mins
            </Typography>
          </View>
        </Marker>

        {location && (
          <MapViewDirections
            origin={{ latitude: location.latitude, longitude: location.longitude }}
            destination={{ latitude: currentRide.pickup.latitude, longitude: currentRide.pickup.longitude }}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={5}
            strokeColor="#1E3A8A" // Dark strict blue route
            onReady={result => {
              mapRef.current?.fitToCoordinates(result.coordinates, {
                edgePadding: { top: 120, right: 50, bottom: 250, left: 50 },
                animated: true
              });
            }}
          />
        )}
      </MapView>

      {/* Floating Top Nav Card */}
      <SafeAreaView style={styles.topSafeArea} edges={['top']}>
        <View style={styles.navTopCard}>
          <View style={styles.turnIconBox}>
            <CornerUpLeft size={24} color="#FFFFFF" />
          </View>
          <View style={styles.navTextCol}>
            <Typography variant="h3" bold color="#0F172A">Turn Left in 200m</Typography>
            <Typography variant="caption" color="#64748B">DLF Phase 3 Road</Typography>
          </View>
          <Navigation size={24} color="#0F172A" />
        </View>
      </SafeAreaView>

      {/* Floating Bottom Card Overlays */}
      <View style={styles.bottomOverlayArea}>
        
        {/* FABs that sit right on top of the sheet */}
        <View style={styles.fabsRow}>
          <TouchableOpacity style={styles.fab}>
            <Phone size={24} color="#0F172A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.fab}>
            <MessageSquare size={24} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* The Action Sheet */}
        <View style={styles.bottomSheet}>
          <View style={styles.sheetHeader}>
            <View style={styles.sheetContentLeft}>
              <Typography variant="caption" bold color="#F59E0B" style={styles.eyebrow}>
                PICKUP LOCATION
              </Typography>
              <Typography variant="h2" bold color="#0F172A" style={styles.hubTitle}>
                {currentRide.pickup.address || 'Cyber Hub, DLF Phase 3'}
              </Typography>
              
              <View style={styles.distanceRow}>
                <MapPin size={14} color="#64748B" />
                <Typography variant="body" color="#64748B" style={{ marginLeft: 4 }}>
                  {currentRide.distance || '2.1'} km away
                </Typography>
              </View>
            </View>

            <View style={styles.sheetContentRight}>
              <Typography variant="h1" bold color="#0F172A">4 min</Typography>
              <Typography variant="caption" bold color="#94A3B8">ARRIVING</Typography>
            </View>
          </View>

          <Button 
            label="ARRIVED" 
            variant="primary"
            size="lg"
            loading={isLoading}
            disabled={isLoading}
            style={styles.arriveBtn}
            onPress={handleArrived}
          />
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
  etaBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F59E0B',
    borderRadius: RADIUS.round,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    ...SHADOWS.medium,
  },
  topSafeArea: {
    position: 'absolute',
    top: 0,
    width: '100%',
    padding: SPACING.md,
  },
  navTopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.heavy,
  },
  turnIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  navTextCol: {
    flex: 1,
  },
  bottomOverlayArea: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  fabsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.lg,
    marginBottom: -24, // Pull down to cleanly overlap the white sheet
    zIndex: 10, // Ensure FABs are above the sheet
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.md,
    ...SHADOWS.heavy,
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    paddingTop: SPACING.xxl + 8, // Make room for the overlapping FABs visually
    ...SHADOWS.heavy,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  sheetContentLeft: {
    flex: 1,
  },
  eyebrow: {
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  hubTitle: {
    marginBottom: 4,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetContentRight: {
    alignItems: 'flex-end',
  },
  arriveBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 30,
    width: '100%',
  },
});
