import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../screens/Splash/Splash';
import TabBarNav from './bottomtab';
import Login from '../screens/Login/Login';
import Signup from '../screens/Signup/Signup';
import Onboarding from '../screens/Onboarding/Onboarding';
import Detail from '../screens/BottomScreens/Detail/Detail';
import EditProfile from '../screens/BottomScreens/EditProfile/EditProfile';
import ForgotPassword from '../screens/ForgotPassword/ForgotPassword';
import OtpScreen from '../screens/OtpScreen/OtpScreen';
import Welcome from '../screens/Welcome/Welcome';
import Addprofile from '../screens/Addprofile/Addprofile';
import SettingDetail from '../screens/BottomScreens/SettingDetail/SettingDetail';
import ChangePassword from '../screens/ChangePassword/ChangePassword';
import Edititem from '../screens/BottomScreens/Edititem/Edititem';
import { UpdateItemLocation } from '../screens/BottomScreens/UpdateItemLocation/UpdateItemLocation';
import ItemDetail from '../screens/BottomScreens/ItemDetail/ItemDetail';
import MatchingSuccess from '../screens/BottomScreens/MatchinSuccess/MatchinSuccess';
import CHattscreen from '../screens/BottomScreens/Chattscreen/Chattscreen';
import ProductDetail from '../screens/BottomScreens/ProductDetail/ProductDetail';
import PrivacyPolicy from '../screens/BottomScreens/PrivacyPolicy/PrivacyPolicy';
import WebViewscreen from '../screens/BottomScreens/WebView/WebView';
import Feedback from '../screens/BottomScreens/Feedback/Feedback';
import MainTermsAndPolicy from '../screens/MainTermsAndPolicy';
import MyItemDetail from '../screens/BottomScreens/Profile/MyItemDetail';
import MatchedUserProfileScreen from '../screens/BottomScreens/Profile/MatchedUserProfileScreen';

const Stack = createNativeStackNavigator();

const MainStack = props => {
  return (
    <Stack.Navigator
      initialRouteName="TabBarNav"
      screenOptions={{ headerShown: false }}>

      <Stack.Screen name="TabBarNav" component={TabBarNav} />
      <Stack.Screen name="Detail" component={Detail} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="SettingDetail" component={SettingDetail} />
      <Stack.Screen name="Edititem" component={Edititem} />
      <Stack.Screen name="UpdateItemLocation" component={UpdateItemLocation} />
      <Stack.Screen name="ItemDetail" component={ItemDetail} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="MatchingSuccess" component={MatchingSuccess} />
      <Stack.Screen name="CHattscreen" component={CHattscreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="WebViewscreen" component={WebViewscreen} />
      <Stack.Screen name="Feedback" component={Feedback} />
      <Stack.Screen name="MainTermsAndPolicy" component={MainTermsAndPolicy} />
      <Stack.Screen name="MyItemDetail" component={MyItemDetail} />
      <Stack.Screen name="MatchedUserProfile" component={MatchedUserProfileScreen} />

    </Stack.Navigator>
  );
};

export default MainStack;
