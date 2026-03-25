import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore } from './src/store/useAppStore';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { MainNavigator } from './src/navigation/MainNavigator';
import { SocketProvider } from './src/context/SocketContext';

const queryClient = new QueryClient();

const App = () => {
  const { token, driver } = useAppStore();
  
  console.log('App Rendering. Auth State ->', { hasToken: !!token, hasDriver: !!driver });

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <NavigationContainer>
            {token && driver ? <MainNavigator /> : <AuthNavigator />}
          </NavigationContainer>
        </SocketProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

export default App;
