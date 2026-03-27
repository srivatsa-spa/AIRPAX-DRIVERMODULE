import { apiClient } from './client';

export interface Shift {
  id: string;
  driverId: string;
  status: 'active' | 'paused' | 'completed';
  startTime: string;
  endTime?: string;
  totalHours: number;
}

export const driverService = {
  getProfile: () => 
    apiClient.get('/driver/profile'),
    
  updateProfile: (data: any) => 
    apiClient.put('/driver/profile', data),

  startShift: () => 
    apiClient.post<Shift>('/driver/shift/start'),

  pauseShift: (shiftId: string) => 
    apiClient.post<Shift>(`/driver/shift/${shiftId}/pause`),

  resumeShift: (shiftId: string) => 
    apiClient.post<Shift>(`/driver/shift/${shiftId}/resume`),

  endShift: (shiftId: string) => 
    apiClient.post<Shift>(`/driver/shift/${shiftId}/end`),
    
  getShiftStatus: () =>
    apiClient.get<Shift | null>('/driver/shift/current'),

  updateStatus: (isOnline: boolean) =>
    apiClient.patch('/driver/status', { isOnline }),
};
