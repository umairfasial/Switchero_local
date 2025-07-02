/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-url-polyfill/auto';
import messaging from '@react-native-firebase/messaging';
import { Settings } from 'react-native-fbsdk-next';

// Initialize the Facebook SDK
Settings.initializeSDK();

navigator.geolocation = require('@react-native-community/geolocation');

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('remoteMessage--->',remoteMessage)
});
AppRegistry.registerComponent(appName, () => App);
