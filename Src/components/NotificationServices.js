import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

export async function requestUserPermission() {
  try {

    PushNotification.checkPermissions((permissions) => {
      if (!permissions.alert && !permissions.badge && !permissions.sound) {
        // Notifications are disabled

        // Linking.openSettings();

      }
    });
    const authStatus = await messaging().requestPermission()
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      let res = getfcmToken();
      return res
    } else {
      // requestUserPermission()
    }
  } catch (error) {
  }
  PushNotification.localNotification({
    title: 'remoteMessage.notification.title',
    message: ' remoteMessage.notification.body',
    channelId: "switcheroo",

  })
}


const getfcmToken = async () => {

  try {

    const fcmToken = await messaging().getToken();
    if (fcmToken) {




      return fcmToken;
    }
  } catch (error) {
  }
};



export const handleNavigation = async (navigation,remoteMessage) => {
  try {
      if (remoteMessage?.data?.IsMatch == 'true') {
        navigation.navigate('MatchingSuccess', {
          userImage: remoteMessage.data?.SourceItemImage,
          SwipeImage: remoteMessage.data?.TargetItemImage
        });
      }
      else if (remoteMessage?.data?.NavigateTo == "NewCashOffer") {
        navigation.navigate('TabBarNav', {
          screen: 'Listing',

        })

      } else if (remoteMessage?.data?.NavigateTo == "OfferAccepted") {
        navigation.navigate('TabBarNav', {
          screen: 'Message',

        })
      }

  } catch (error) {
    console.error('Error in notificationListener:', error);
  }
};
