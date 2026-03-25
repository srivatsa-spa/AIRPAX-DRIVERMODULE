import { apiClient } from './client';

export const paymentService = {
  recordPayment: (rideId: string, method: 'cash' | 'online', amount: number) =>
    apiClient.post(`/driver/ride/${rideId}/payment`, {
      method,
      amount,
    }),
};
