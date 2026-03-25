import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabNavigator } from './MainTabNavigator';
import { 
  RideAssignmentScreen, 
  NavigateToPickupScreen, 
  RideStartScreen, 
  RideProgressScreen, 
  RideCompletedScreen 
} from '../screens/ride';
import { EarningsScreen } from '../screens/earnings';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { ShiftManagementScreen } from '../screens/shift/ShiftManagementScreen';
import { useRideEvents } from '../hooks/useRideEvents';

export type MainStackParamList = {
  Dashboard: undefined;
  RideAssignment: undefined;
  NavigateToPickup: undefined;
  RideStart: undefined;
  RideProgress: undefined;
  RideCompleted: undefined;
  Earnings: undefined;
  Profile: undefined;
  ShiftManagement: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator = () => {
  useRideEvents();
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={MainTabNavigator} />
      <Stack.Screen name="RideAssignment" component={RideAssignmentScreen} />
      <Stack.Screen name="NavigateToPickup" component={NavigateToPickupScreen} />
      <Stack.Screen name="RideStart" component={RideStartScreen} />
      <Stack.Screen name="RideProgress" component={RideProgressScreen} />
      <Stack.Screen name="RideCompleted" component={RideCompletedScreen} />
      <Stack.Screen name="Earnings" component={EarningsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ShiftManagement" component={ShiftManagementScreen} />
    </Stack.Navigator>
  );
};
