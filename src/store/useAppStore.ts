import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Shift, driverService } from '../api/driverService';

interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicle: { model: string; plate: string; color: string };
}

interface AppState {
  driver: Driver | null;
  token: string | null;
  isOnline: boolean;
  activeShift: Shift | null;
  setDriver: (driver: Driver) => void;
  setToken: (token: string) => void;
  setOnline: (isOnline: boolean) => void;
  setActiveShift: (shift: Shift | null) => void;
  setAuth: (token: string, driver: Driver) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      driver: null,
      token: null,
      isOnline: false,
      activeShift: null,
      setDriver: (driver) => set({ driver }),
      setToken: (token) => set({ token }),
      setOnline: async (isOnline) => {
        try {
          await driverService.updateStatus(isOnline);
          set({ isOnline });
        } catch (error) {
          console.error('Failed to update online status:', error);
          // Still update local state for UI responsiveness, 
          // or you might want to show an alert
          set({ isOnline }); 
        }
      },
      setActiveShift: (shift) => set({ activeShift: shift }),
      setAuth: (token, driver) => set({ token, driver }),
      logout: () => set({ driver: null, token: null, isOnline: false, activeShift: null }),
    }),
    { 
      name: 'driver-store', 
      storage: createJSONStorage(() => AsyncStorage) 
    }
  )
);
