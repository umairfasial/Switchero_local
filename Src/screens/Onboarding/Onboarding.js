import { View, Text, Image, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import Container from '../../components/Container'
import styles from './styles'
import Images from '../../components/Images'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../components/Responsiveui'
import ResponsiveText from '../../components/ResponsiveText'
import Button from '../../components/Button'
import Colors from '../../theme/colors'
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { StackActions } from '@react-navigation/native'

const Onboarding = (props) => {



  const requestLocationPermission = async () => {
    try {
      const granted = await request(
        Platform.OS === 'ios' ?
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE :
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      );

      if (granted === RESULTS.GRANTED) {
        console.log('You can access the location');
        // Access the location here
        Geolocation.getCurrentPosition(
          (position) => {
            console.log('positionposition', position);
          },
          (error) => {
            console.log('errorerrorerrorerror', error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };


  useEffect(() => {
    requestLocationPermission()


  }

    , [])

  const [loading, setloading] = useState(false)
  return (
    <View style={styles.container}>
      <View style={styles.topView}>

      </View>
      <View style={styles.bottomView}>
        <Image
          source={Images.logoColor}
          resizeMode='contain'
          style={{ width: wp(60), height: wp(20), resizeMode: 'contain' }}
        />
        <View style={styles.toptextview}>
          {/* <ResponsiveText style={styles.foncolortop}>
            {'By creating an account or logging in, you agree to our Terms and Privacy Policy'}
          </ResponsiveText> */}

          <Button
            btnContainer={styles.btnstyle}
            onPress={() => props.navigation.navigate('Signup')}
            // onPress={() => props.navigation.dispatch(StackActions.replace('MainStack'))}


            title={'Create an account'}
            titleStyle={styles.btntitle}
            loading={loading}
            loadingColor={Colors.secondaryColor}

          />



          <TouchableOpacity onPress={() => props.navigation.navigate('Login')} style={styles.loginbtn}>
            <ResponsiveText style={styles.logintext}>
              {'Already have an account? Log in'}
            </ResponsiveText>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={styles.termsContainer}>
        <ResponsiveText style={styles.foncolortop}>
          {'By continuing, you agree to our '}
          <TouchableOpacity 
          onPress={()=>{
            props.navigation.navigate('TermsAndPolicy')
          }}
          >
            <ResponsiveText style={styles.linkTextStyle}>
              {'Terms of Service and Privacy Policy'}
            </ResponsiveText>
          </TouchableOpacity>

        </ResponsiveText>
      </View>

    </View>
  )
}

export default Onboarding