import React from 'react';
import { SafeAreaView, Image, Dimensions, StatusBar, View, Platform } from 'react-native';
import Colors, { DarkColors } from '../theme/colors';
import { CheckTheme } from '../helper/global';
import { heightPercentageToDP } from './Responsiveui';


function Container(props) {
  const isDarkTheme = CheckTheme()

  return (
    <View style={[styles.container, props.style, { backgroundColor: isDarkTheme ? DarkColors.backgroundColor : Colors.backgroundColor }]}>
      {props.children}
    </View>
  );
}
const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor
  },
};
export default Container;
