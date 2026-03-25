import { apiClient } from './client';

export const authService = {
  sendOTP: (phone: string) =>
    apiClient.post('/auth/send-otp', { phone, role: 'driver' }),

  verifyOTP: (phone: string, otp: string) =>
    apiClient.post<{ token: string; driver: any }>('/auth/verify-otp', {
      phone,
      otp,
    }),

  updateFCMToken: (fcmToken: string) => 
    apiClient.post('/driver/fcm-token', { fcmToken }),
};
