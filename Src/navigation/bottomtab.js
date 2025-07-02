import * as React from 'react';
import { Image, StyleSheet, Platform, View } from 'react-native';
import { iconPath } from '../../Src/Constants/Icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/BottomScreens/Home/Home';
import Profile from '../screens/BottomScreens/Profile/Profile';
import Images from '../components/Images';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../components/Responsiveui';
import Listing from '../screens/BottomScreens/Listing/Listing';
import Additem from '../screens/BottomScreens/Additem/Additem';
import Message from '../screens/BottomScreens/Message/Message';
import Colors, { DarkColors } from '../theme/colors';
import ResponsiveText from '../components/ResponsiveText';
import { Fonts } from '../theme/Fonts';
import { useSelector } from 'react-redux';
import { CheckTheme } from '../helper/global';
import Notifications from '../screens/BottomScreens/NotificationMain/Notifications';
import { getUnreadNotificationount } from '../Apis/Apis';
import { newEvents } from '../CustomEvents/CustomEvents';
import { useIsFocused } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();



function TabBarNav() {

  const [notificationCount, setnotificationCount] = React.useState(0)

  React.useEffect(() => {
    newEvents.on('Notification', function (text) {
      countNotification()
    })
    countNotification()
  }, [useIsFocused()])


  const countNotification = async () => {
    try {

      const response = await getUnreadNotificationount()

      setnotificationCount(response)

      console.log('response on useeffect', response);

    } catch (error) {
      console.log('response on useeffect', error);

    }
  }

  const state = useSelector(state => state.userdataReducer)
  const itemUploded = useSelector(state => state.userdataReducer?.itemuploded)
  // const [itemUploded, setitemUploded] = React.useState(true)
  const isDarkTheme = CheckTheme()

  return (
    <Tab.Navigator
      initialRouteName="Home"
      // initialRouteName="Notifications"

      screenOptions={{
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute', // Set the position to absolute
          bottom: 0, // Set the bottom position to 0
          height: Platform.OS == 'ios' ? 70 : 60,
          width: '100%', // Set the width to 100%
          backgroundColor: isDarkTheme ? DarkColors?.backgroundColor : '#D9D9D9',
          //backgroundColor: Colors.backgroundColor,
          alignItems: 'center',
          borderTopWidth: 0,
          elevation: 8,
          shadowOpacity: 0.2,
          shadowColor: Colors.secondaryColor
        },
      }}>

      <Tab.Screen
        name="Home"
        component={Home}
        listeners={{
          tabPress: e => {
            // Prevent default action

            if (itemUploded == false) {
              newEvents.emit('Upload', true)
            }


            itemUploded ? e.defaultPrevented : e.preventDefault()


          },
        }}
        options={{

          tabBarIcon: ({ focused }) =>
          (
            <Image
              source={Images.homeactive}

              style={{ ...styles.iconSize, tintColor: focused ? Colors.secondaryColor : `${Colors.black}` }}
              resizeMode={'contain'}
            />
          )
          // focused ? (
          //   <>
          //     {/* <View style={styles.topline} /> */}
          //     <Image
          //       source={Images.homeactive}
          //       tintColor={isDarkTheme ? Colors.white : Colors.black}
          //       style={{ ...styles.iconSizeactive, height: wp(5), tintColor: isDarkTheme ? Colors.white : `${Colors.black}` }}
          //       resizeMode={'contain'}
          //     />
          //   </>
          // ) : (
          //   <Image
          //     source={Images.homeactive}
          //     tintColor={isDarkTheme ? Colors.white : Colors.black}

          //     style={{ ...styles.iconSize, height: wp(5), tintColor: isDarkTheme ? Colors.white : `${Colors.black}` }}
          //     resizeMode={'contain'}
          //   />
          // ),
        }}
      />


      <Tab.Screen
        name="Listing"

        listeners={{

          tabPress: e => {

            if (itemUploded == false) {
              newEvents.emit('Upload', true)
            }
            // Prevent default action
            itemUploded ? e.defaultPrevented : e.preventDefault()


          },
        }}
        component={Listing}
        options={{
          tabBarIcon: ({ focused }) =>

          (
            <Image
              source={Images.listactive}

              style={{ ...styles.iconSize, tintColor: focused ? Colors.secondaryColor : `${Colors.black}` }}
              resizeMode={'contain'}
            />
          )
          // focused ? (
          //   <>
          //     <View style={styles.topline} />

          //     <Image
          //       source={Images.listactive}
          //       style={{ ...styles.iconSizeactive, tintColor: isDarkTheme ? Colors.white : `${Colors.black}` }}
          //       resizeMode={'contain'}
          //     />

          //   </>
          // ) : (
          //   <>
          //     <Image
          //       source={Images.listactive}
          //       style={{ ...styles.iconSize, tintColor: isDarkTheme ? Colors.white : `${Colors.black}` }}
          //       resizeMode={'contain'}
          //     />
          //     {/* {state.notificationCount > 0 ? <View style={styles.backgroundBadge}>
          //       <ResponsiveText style={styles.notification}>
          //         {state.notificationCount}
          //       </ResponsiveText>
          //     </View> : null} */}
          //   </>

          // ),

        }}
      />



      <Tab.Screen
        name="Additem"
        component={Additem}
        options={{
          tabBarIcon: ({ focused }) =>

          (
            <Image
              source={Images.additemactive}

              style={{ ...styles.iconSize, tintColor: focused ? Colors.secondaryColor : `${Colors.black}` }}
              resizeMode={'contain'}
            />
          )
          // focused ? (
          //   <>
          //     <View style={styles.topline} />
          //     <Image
          //       source={Images.additemactive}
          //       style={{ ...styles.iconSizeactive, tintColor: isDarkTheme ? Colors.white : `${Colors.black}` }}
          //       resizeMode={'contain'}
          //     />
          //   </>
          // ) : (
          //   <Image
          //     source={Images.additemactive}
          //     style={{ ...styles.iconSize, tintColor: isDarkTheme ? Colors.white : `${Colors.black}` }}
          //     resizeMode={'contain'}
          //   />
          // ),
        }}
      />



      <Tab.Screen
        name="Message"
        component={Message}
        listeners={{
          tabPress: e => {

            if (itemUploded == false) {
              newEvents.emit('Upload', true)
            }
            // Prevent default action
            itemUploded ? e.defaultPrevented : e.preventDefault()


          },
        }}
        options={{
          tabBarIcon: ({ focused }) =>
          (
            <Image
              source={Images.messageactive}

              style={{ ...styles.iconSize, tintColor: focused ? Colors.secondaryColor : `${Colors.black}` }}
              resizeMode={'contain'}
            />
          )
          // focused ? (
          //   <>
          //     <View style={styles.topline} />
          //     <Image
          //       source={Images.messageactive}
          //       style={{ ...styles.iconSizeactive, tintColor: isDarkTheme ? Colors.white : `${Colors.black}` }}
          //       resizeMode={'contain'}
          //     />

          //   </>
          // ) : (
          //   <>
          //     <Image
          //       source={Images.messageactive}
          //       style={{ ...styles.iconSize, tintColor: isDarkTheme ? Colors.white : `${Colors.black}` }}
          //       resizeMode={'contain'}
          //     />
          //     {state.messageCount > 0 ? <View style={styles.backgroundBadge}>
          //       <ResponsiveText style={styles.notification}>
          //         {state.messageCount}
          //       </ResponsiveText>
          //     </View> : null}
          //   </>
          // ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        listeners={{
          tabPress: e => {

            if (itemUploded == false) {
              newEvents.emit('Upload', true)
            }
            // Prevent default action
            itemUploded ? e.defaultPrevented : e.preventDefault()


          },
        }}
        options={{
          tabBarIcon: ({ focused }) =>
          (
            <Image
              source={Images.notification}

              style={{ ...styles.iconSize, tintColor: focused ? Colors.secondaryColor : `${Colors.black}` }}
              resizeMode={'contain'}
            />
          )
          // focused ? (
          //   <>
          //     <View style={styles.topline} />
          //     <Image
          //       source={Images.notification}
          //       style={{ ...styles.iconSizeactive, tintColor: isDarkTheme ? Colors.white : `${Colors.black}` }}
          //       resizeMode={'contain'}
          //     />

          //     {notificationCount > 0 ? <View style={styles.backgroundBadge}>
          //       <ResponsiveText style={styles.notification}>
          //         {notificationCount}
          //       </ResponsiveText>
          //     </View> : null}

          //   </>
          // ) : (
          //   <>
          //     <Image
          //       source={Images.notification}
          //       style={{ ...styles.iconSize, tintColor: isDarkTheme ? Colors.white : `${Colors.black}` }}
          //       resizeMode={'contain'}
          //     />
          //     {notificationCount > 0 ? <View style={styles.backgroundBadge}>
          //       <ResponsiveText style={styles.notification}>
          //         {notificationCount}
          //       </ResponsiveText>
          //     </View> : null}
          //   </>
          // ),
        }}
      />


      <Tab.Screen
        name="Profile"
        listeners={{
          tabPress: e => {

            if (itemUploded == false) {
              newEvents.emit('Upload', true)
            }
            // Prevent default action
            itemUploded ? e.defaultPrevented : e.preventDefault()


          },
        }}
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) =>
          (
            <Image
              source={Images.profileactive}

              style={{ ...styles.iconSize, tintColor: focused ? Colors.secondaryColor : `${Colors.black}` }}
              resizeMode={'contain'}
            />
          )
          // focused ? (
          //   <>
          //     <View style={styles.topline} />
          //     <Image
          //       source={Images.profileactive}
          //       style={{ ...styles.iconSizeactive, tintColor: isDarkTheme ? Colors.white : `${Colors.black}` }}
          //       resizeMode={'contain'}
          //     />
          //   </>
          // ) : (
          //   <Image
          //     source={Images.profileactive}
          //     style={{ ...styles.iconSize, tintColor: isDarkTheme ? Colors.white : `${Colors.black}` }}
          //     resizeMode={'contain'}
          //   />
          // ),
        }}
      />

    </Tab.Navigator>
  );
}

export default TabBarNav;

const styles = StyleSheet.create({
  iconSize: {
    width: wp(6),
    height: wp(6),
    top: Platform.OS == 'ios' ? 5 : 0,
    zIndex: 0

  },
  iconSizeactive: {
    width: wp(6),
    height: wp(6),
    tintColor: '#CB9A24',
    top: Platform.OS == 'ios' ? 5 : 0,
    zIndex: 0

  },
  topline: {
    borderTopWidth: 3,
    borderColor: '#CB9A24',
    width: wp(20),
    position: 'absolute',
    top: 0,
    // zIndex: 1
  },
  notification: {
    fontSize: 12,
    fontFamily: Fonts.Fontsmedeum,
    color: Colors.white,
    top: 2
  },
  backgroundBadge: {
    backgroundColor: '#FF6961',
    alignItems: "center",
    justifyContent: "center",
    position: 'absolute',
    padding: 2,
    width: wp(6.5),
    height: wp(6.5), borderRadius: wp(6),
    top: wp(1),
    right: wp(3)
  }


});
