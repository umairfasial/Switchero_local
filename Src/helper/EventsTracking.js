// analytics.js
import analytics from '@react-native-firebase/analytics';
import { AppEventsLogger } from 'react-native-fbsdk-next';


// General event logging function
export const logEvent = async (eventName, params = {}) => {
    try {
        await analytics().logEvent(eventName, params);
        console.log(`Event logged: ${eventName}`, params);

        AppEventsLogger.logEvent(eventName, params);
        console.log(`Facebook Event logged: ${eventName}`, params);
    } catch (error) {
        console.error('Error logging event:', error);
    }
};



// Example function for logging login events
export const logLoginEvent = async (method) => {
    await logEvent('login', {
        method: method,
    });
};

