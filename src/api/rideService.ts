import { apiClient } from './client';

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface RideRequest {
  id: string;
  riderId: string;
  pickup: Location;
  dropoff: Location;
  fare: number;
  distance: number;
  duration: number;
  status: 'pending' | 'accepted' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
  riderName?: string;
  riderRating?: number;
}

export const rideService = {
  acceptRide: (rideId: string) => 
    apiClient.post(`/driver/ride/${rideId}/accept`),
    
  declineRide: (rideId: string) => 
    apiClient.post(`/driver/ride/${rideId}/decline`),

  markArrived: (rideId: string) => 
    apiClient.post(`/driver/ride/${rideId}/arrived`),

  startRide: (rideId: string, otp: string) => 
    apiClient.post(`/driver/ride/${rideId}/start`, { otp }),

  completeRide: (rideId: string) => 
    apiClient.post(`/driver/ride/${rideId}/complete`),
    
  getCurrentRide: () =>
    apiClient.get<RideRequest | null>('/driver/ride/current'),
};
