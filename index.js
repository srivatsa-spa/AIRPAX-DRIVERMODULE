/**
 * @format
 */

import { AppRegistry } from 'react-native';
import notifee from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';

notifee.registerForegroundService((notification) => {
  return new Promise(() => {
    // Keep the foreground service alive
  });
});

AppRegistry.registerComponent(appName, () => App);
