/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, Award, TrendingUp, User } from 'lucide-react-native';
import { DashboardScreen } from '../screens/dashboard';
import { IncentivesScreen } from '../screens/earnings/IncentivesScreen';
import { PerformanceScreen } from '../screens/performance/PerformanceScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { COLORS } from '../theme';

export type MainTabParamList = {
  DashboardTab: undefined;
  IncentivesTab: undefined;
  PerformanceTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        }
      }}
    >
      <Tab.Screen 
        name="DashboardTab" 
        component={DashboardScreen} 
        options={{
          tabBarLabel: 'DASHBOARD',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
        }}
      />
      <Tab.Screen 
        name="IncentivesTab" 
        component={IncentivesScreen} 
        options={{
          tabBarLabel: 'INCENTIVES',
          tabBarIcon: ({ color, size }) => <Award color={color} size={size} />,
        }}
      />
      <Tab.Screen 
        name="PerformanceTab" 
        component={PerformanceScreen} 
        options={{
          tabBarLabel: 'PERFORMANCE',
          tabBarIcon: ({ color, size }) => <TrendingUp color={color} size={size} />,
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'PROFILE',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};
