import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../../screens/Splash/Splash';
import Login from '../../screens/Login/Login';
import Signup from '../../screens/Signup/Signup';
import Onboarding from '../../screens/Onboarding/Onboarding';
import ForgotPassword from '../../screens/ForgotPassword/ForgotPassword';
import OtpScreen from '../../screens/OtpScreen/OtpScreen';
import Welcome from '../../screens/Welcome/Welcome';
import Addprofile from '../../screens/Addprofile/Addprofile';
import ChangePassword from '../../screens/ChangePassword/ChangePassword';
import AddphoneNumber from '../../screens/AddPhoneNumber/AddPhoneNumber';
import OtpForverifay from '../../screens/OtpForverifay/OtpForverifay';
import AddGender from '../../screens/AddGender/AddGender';
import AddDob from '../../screens/AddDOB/AddDOB';
import AddDistance from '../../screens/AddDistance/AddDistance';
import FavirotCategory from '../../screens/AddFaveriotCategory/FaviriotCategory';
import TermsAndPolicy from '../../screens/TermsAndPolicies/TermsAndPolicy';


const Stack = createNativeStackNavigator();

const AuthStack = props => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Addprofile" component={Addprofile} />
      <Stack.Screen name="AddphoneNumber" component={AddphoneNumber} />
      <Stack.Screen name="AddGender" component={AddGender} />
      <Stack.Screen name="AddDob" component={AddDob} />
      <Stack.Screen name="AddDistance" component={AddDistance} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="OtpForverifay" component={OtpForverifay} />
      <Stack.Screen name="FavirotCategory" component={FavirotCategory} />
      <Stack.Screen name="TermsAndPolicy" component={TermsAndPolicy} />

    </Stack.Navigator>
  );
};

export default AuthStack;
