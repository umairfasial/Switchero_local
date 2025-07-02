import {
    checkNotifications,
    requestNotifications,
    PERMISSIONS,
    RESULTS,
    openSettings,
} from "react-native-permissions";
export const requestNotificationPermission = async () => {
    try {
        // Check the current notification permission status
        const { status } = await checkNotifications();
        if (status === RESULTS.GRANTED) {
        } else {
            const { status: newStatus } = await requestNotifications(['alert', 'sound', 'badge']);
            if (newStatus === RESULTS.BLOCKED) {
                openSettings();
            } else if (newStatus === RESULTS.DENIED) {
            } else if (newStatus === RESULTS.GRANTED) {
            }
        }
    } catch (error) {
        console.error("Error requesting notification permission:", error);
    }
};