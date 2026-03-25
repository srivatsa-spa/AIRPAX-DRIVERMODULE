import { create } from 'zustand';
import { RideRequest } from '../api/rideService';

interface RideState {
  currentRide: RideRequest | null;
  incomingRequest: RideRequest | null;
  setCurrentRide: (ride: RideRequest | null) => void;
  setIncomingRequest: (request: RideRequest | null) => void;
  updateRideStatus: (status: RideRequest['status']) => void;
  clearRide: () => void;
}

export const useRideStore = create<RideState>()(
  (set) => ({
    currentRide: null,
    incomingRequest: null,
    setCurrentRide: (ride) => set({ currentRide: ride }),
    setIncomingRequest: (request) => set({ incomingRequest: request }),
    updateRideStatus: (status) => set((state) => ({
      currentRide: state.currentRide ? { ...state.currentRide, status } : null
    })),
    clearRide: () => set({ currentRide: null, incomingRequest: null }),
  })
);
