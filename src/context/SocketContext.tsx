import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppStore } from '../store/useAppStore';

const SOCKET_URL = 'http://airpaxbe.spaplc.com';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Track both auth state and driver object
  const { token, isOnline, driver } = useAppStore();

  // Connect/disconnect based on login + online status
  useEffect(() => {
    if (!token || !isOnline) {
      setSocket(prev => {
        if (prev) prev.disconnect();
        return null;
      });
      setIsConnected(false);
      return;
    }

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
      
      // Join driver-specific room to receive private ride requests
      const driverObj = useAppStore.getState().driver as any;
      const driverId = driverObj?._id || driverObj?.id;
      if (driverId) {
        console.log('Joining driver room:', `driver:${driverId}`);
        newSocket.emit('join-driver', driverId);
      } else {
        console.warn('No driver ID at connect time — will join once driver is available');
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [token, isOnline]);

  // Re-emit join-driver whenever driver object becomes available (handles timing race:
  // socket connects before Zustand persist has hydrated the driver object from AsyncStorage)
  useEffect(() => {
    if (socket && isConnected && driver) {
      const driverId = (driver as any)?._id || (driver as any)?.id;
      if (driverId) {
        console.log('Re-joining driver room (driver hydrated):', `driver:${driverId}`);
        socket.emit('join-driver', driverId);
      }
    }
  }, [socket, isConnected, driver]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
