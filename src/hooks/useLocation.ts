import { useState, useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { useSocket } from '../context/SocketContext';
import { useAppStore } from '../store/useAppStore';

export const useLocation = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number; heading: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { socket, isConnected } = useSocket();
  const { isOnline, driver } = useAppStore();

  useEffect(() => {
    let watchId: number | null = null;

    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          ]);
          
          return (
            granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
          );
        } catch (err) {
          console.warn(err);
          return false;
        }
      }
      return true;
    };

    const startTracking = async () => {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        setError('Location permissions not granted');
        return;
      }

      watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, heading = 0 } = position.coords;
          setLocation({ latitude, longitude, heading: heading as number });
          setError(null);
        },
        (err) => {
          setError(err.message);
          console.error('[LOCATION ERROR]', err);
        },
        { 
          enableHighAccuracy: true, 
          distanceFilter: 5, 
          interval: 2000, 
          fastestInterval: 1000,
          // Android specific (if library supports them, safely added)
          forceRequestLocation: true,
          showLocationDialog: true,
        } as any
      );
    };

    startTracking();

    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []); // Only run once on mount

  // Separate effect for Socket emission to avoid restarting GPS watch
  useEffect(() => {
    if (isOnline && isConnected && socket && driver && location) {
      const driverId = (driver as any)?._id || (driver as any)?.id;
      socket.emit('update-location', {
        driverId,
        lat: location.latitude,
        lng: location.longitude,
      });
    }
  }, [location, isOnline, isConnected, socket, driver]);

  return { location, error };
};
