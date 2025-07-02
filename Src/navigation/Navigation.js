import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import MainStack from './mainstack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './authStack';
import FloatingIcon from '../components/ReviewFloating';
import { newEvents } from '../CustomEvents/CustomEvents';


const { Navigator, Screen } = createNativeStackNavigator()
const Navigation = () => {


  const [Feddback, setFeddback] = React.useState(false)
  React.useEffect(() => {

    newEvents.on('FeedBack', function (text) {
      setFeddback(text)
    })
  }, [])
  const linking = {
    prefixes: ['switcheroo://']
  };


  return (
    <NavigationContainer
      linking={linking}
    >
      <Navigator screenOptions={{ headerShown: false }} >
        <Screen name={'AuthStack'} component={AuthStack} />
        <Screen name={'MainStack'} component={MainStack} />
      </Navigator>
      {Feddback ? <FloatingIcon /> : null}
      {/* <FloatingIcon /> */}
    </NavigationContainer>
  );
};

export default Navigation;
