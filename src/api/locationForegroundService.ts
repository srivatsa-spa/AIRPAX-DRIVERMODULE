import notifee, { AndroidImportance } from '@notifee/react-native';

export const locationForegroundService = {
  start: async () => {
    const channelId = await notifee.createChannel({
      id: 'driver_location',
      name: 'Active Shift Location',
      importance: AndroidImportance.LOW,
    });

    await notifee.displayNotification({
      title: 'AIRPAX Driver is Online',
      body: 'Sharing your live location to find rides.',
      android: {
        channelId,
        asForegroundService: true,
        progress: {
          max: 0,
          current: 0,
          indeterminate: true,
        },
      },
    });
  },

  stop: async () => {
    await notifee.stopForegroundService();
  }
};
