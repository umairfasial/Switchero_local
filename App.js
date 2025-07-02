import React, { useEffect, useState } from 'react';
import Navigation from './Src/navigation/Navigation';
import { ApolloProvider } from '@apollo/react-hooks';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';

import { store } from './Src/redux/store';
import { Provider } from 'react-redux';
import { Alert, LogBox, Platform, StatusBar } from 'react-native';
import Toast, { BaseToast } from 'react-native-toast-message';
import { SuccessTeastModal } from './Src/components/SuccessToast';
import { newEvents } from './Src/CustomEvents/CustomEvents';
import { GRAPHQL_ENDPOINT } from './Src/Apis/Apis';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppEventsLogger } from 'react-native-fbsdk-next';
import Colors from './Src/theme/colors';
import { Fonts } from './Src/theme/Fonts';
import { heightPercentageToDP } from './Src/components/Responsiveui';
// Initialize Apollo Client
const hostUrl = GRAPHQL_ENDPOINT;
// const hostUrl = 'http://172.16.0.50:5002/';

const link = createHttpLink({
  uri: hostUrl,
  credentials: 'include',
});

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
});

LogBox.ignoreAllLogs()
const App = () => {

  const [ToastMoodal, setToastMoodal] = useState(false)
  const [ToastTitle, setToastTitle] = useState('')

  const toastConfig = {
    info: (props) => (
      <BaseToast
        {...props}
        // style={{ backgroundColor: Colors.secondaryColor , width: '90%'}}
        style={{
          borderLeftColor: Colors.secondaryColor,
          width: '90%',
          marginTop: Platform.OS === 'android' ? heightPercentageToDP(-3) : 0
        }}
        //contentContainerStyle={{ paddingHorizontal: 15, }}
        text1Style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}
        text2Style={{ fontSize: 14, fontFamily: Fonts.Fontsmedeum, color: 'black' }}
        text2NumberOfLines={2}
      />
    ),
  };

  useEffect(() => {
    AppEventsLogger.logEvent('Testing Event');
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ApolloProvider client={apolloClient}>

        <Provider store={store}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="white"
            translucent={false}
          />

          <Navigation />
          <Toast config={toastConfig} />
          <SuccessTeastModal
            modal={ToastMoodal}
            setModal={setToastMoodal}
            title={ToastTitle}
          />
        </Provider>
      </ApolloProvider>
    </GestureHandlerRootView>
  );
};

export default App;
