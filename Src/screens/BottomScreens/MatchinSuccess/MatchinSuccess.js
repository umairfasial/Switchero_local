import { Dimensions, FlatList, Image, ImageBackground, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Container from '../../../components/Container'
import styles from './styles'
import Images from '../../../components/Images'
import ResponsiveText from '../../../components/ResponsiveText'
import Colors from '../../../theme/colors'
import Button from '../../../components/Button'
import { heightPercentageToDP as hp } from '../../../components/Responsiveui'
import LottieView from 'lottie-react-native'
import Sound from 'react-native-sound';
import * as Animatable from 'react-native-animatable';
import ConfettiCannon from 'react-native-confetti-cannon';

const MatchingSuccess = (props) => {

  const { userImage, SwipeImage } = props?.route?.params

  useEffect(() => {
    // Create a new sound object
    const sound = new Sound('fireworks', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('Error loading sound', error);
        return;
      }

      // Play the sound
      sound?.play(() => {
        // Release the audio resources
        sound?.release();
      });
    });


  }, []);


  return (
    <ImageBackground
      source={Images.BackGroundDesing}
      style={styles.container}
    >


      <View style={styles.container}>

        <ConfettiCannon count={200} origin={{ x: -10, y: 1 }} />

        <View style={{ marginTop: hp(5) }} />
        <View style={styles.view}>



          <Animatable.View style={styles.ImageView}>

            <Animatable.Image
              animation='slideInLeft'
              delay={100}

              style={styles.ImageView}
              source={{ uri: userImage }}
            />

          </Animatable.View>




          <Animatable.View style={styles.ImageView2}>
            <Animatable.Image
              animation='slideInRight'
              delay={100}
              style={styles.ImageView2}
              source={{ uri: SwipeImage }}
            />
          </Animatable.View>

        </View>
        <View style={{ marginTop: hp(5) }} />


        <Animatable.Image
          animation='zoomInUp'
          delay={100}
          source={Images.itsAmatch}
          style={styles.itsmatch}
        />

        <Animatable.View
          animation='zoomInUp'

          delay={100}
        >

          <Button
            title={'Send Message'}
            titleStyle={styles.btntitle}
            btnContainer={styles.btnContainer2}
            onPress={() => props.navigation.navigate('TabBarNav', {
              screen: 'Message'
            })}
          />

          <Button
            title={'Keep on Playing'}
            btnContainer={styles.btnContainer}
            titleStyle={styles.btntitle}

            onPress={() => props.navigation.navigate('TabBarNav', {
              screen: 'Home'
            })}
          />
        </Animatable.View>
      </View>
    </ImageBackground>
  )
}

export default MatchingSuccess
