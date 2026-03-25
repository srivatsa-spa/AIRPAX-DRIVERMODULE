import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';

export const notificationService = {
  requestUserPermission: async () => {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.warn('Push notification permissions denied by user.');
        return false;
      }
    }
    // Android 13+ requires explicit POST_NOTIFICATIONS permission request, but earlier versions don't
    // We'll handle full Native permissions manually if needed later, but Firebase generally 
    // prompts automatically on mount for FCM if configured tightly.
    return true;
  },

  getFCMToken: async () => {
    try {
      const token = await messaging().getToken();
      console.log('FCM Device Token:', token);
      return token;
    } catch {
      // Use console.log instead of console.error to prevent blocking Redbox in Dev Mode 
      // if the user hasn't added google-services.json yet.
      console.log('FCM token generation skipped (No Firebase config found yet).');
      return null;
    }
  },

  setupForegroundListeners: () => {
    // Handle foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived in FOREGROUND!', JSON.stringify(remoteMessage));
      if (remoteMessage.notification) {
        Alert.alert(
          remoteMessage.notification.title || 'Notification',
          remoteMessage.notification.body || 'You have a new message.'
        );
      }
    });
    return unsubscribe;
  }
};
