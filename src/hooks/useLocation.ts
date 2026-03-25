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
          
          if (granted['android.permission.ACCESS_FINE_LOCATION'] !== PermissionsAndroid.RESULTS.GRANTED) {
            setError('Location permission denied');
            return false;
          }
        } catch (err) {
          console.warn(err);
          return false;
        }
      }
      return true;
    };

    const startTracking = async () => {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, heading = 0 } = position.coords;
          setLocation({ latitude, longitude, heading: heading as number });

          // Emit location cleanly over socket if driver is online
          if (isOnline && isConnected && socket && driver) {
            socket.emit('update_location', {
              driverId: driver.id,
              coordinates: [longitude, latitude], // GeoJSON standard is [lng, lat]
              heading,
              timestamp: new Date().toISOString()
            });
          }
        },
        (err) => {
          setError(err.message);
          console.error(err);
        },
        { enableHighAccuracy: true, distanceFilter: 10, interval: 3000, fastestInterval: 2000 }
      );
    };

    startTracking();

    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, [isOnline, isConnected, socket, driver]);

  return { location, error };
};
