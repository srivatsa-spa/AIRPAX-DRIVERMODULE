import { apiClient } from './client';

export interface EarningsSummary {
  today: number;
  thisWeek: number;
  totalTrips: number;
  onlineHours: number;
}

export interface PayoutHistory {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
}

export const earningsService = {
  getSummary: () => 
    apiClient.get<EarningsSummary>('/driver/earnings/summary'),
    
  getHistory: () => 
    apiClient.get<PayoutHistory[]>('/driver/earnings/history'),

  requestPayout: (amount: number) =>
    apiClient.post('/driver/earnings/payout', { amount }),
};
