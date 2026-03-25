import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useRideStore } from '../store/useRideStore';
import { RideRequest } from '../api/rideService';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainNavigator';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const useRideEvents = () => {
  const { socket, isConnected } = useSocket();
  const { setIncomingRequest, clearRide, currentRide } = useRideStore();
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Handle incoming ride request
    socket.on('ride_request', (request: RideRequest) => {
      console.log('Incoming ride request:', request);
      setIncomingRequest(request);
      navigation.navigate('RideAssignment');
    });

    // Handle ride cancellation by rider
    socket.on('ride_cancelled', (data: { rideId: string }) => {
      console.log('Ride cancelled:', data);
      
      // If we are currently responding to this request or are on this ride
      if (currentRide?.id === data.rideId) {
        Alert.alert('Ride Cancelled', 'The rider has cancelled this ride.');
        clearRide();
        navigation.navigate('Dashboard');
      } else {
        // Might just be an assignment that was cancelled before we accepted
        setIncomingRequest(null);
        Alert.alert('Request Cancelled', 'The ride request has been cancelled by the rider.');
        navigation.navigate('Dashboard');
      }
    });

    return () => {
      socket.off('ride_request');
      socket.off('ride_cancelled');
    };
  }, [socket, isConnected, setIncomingRequest, clearRide, currentRide, navigation]);
};
