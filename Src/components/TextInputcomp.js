import { StyleSheet, Image, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from './Responsiveui'
import Images from './Images'

const TextInputcomp = (props) => {
  const [color, setcolor] = useState('#F2F2F2')
  const [bordercolor, setbordercolor] = useState('#F2F2F2')
  const [passwordShow, setpasswordShow] = useState(true)

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};

const borderColor = props?.error 
    ? '#EB5757' 
    : props?.type === 'email' && props?.value?.length > 0 
        ? (isValidEmail(props?.value) ? '#30B69C' : '#EB5757') 
        : props?.value?.length > 0 
            ? '#30B69C' 
            : bordercolor;

const backgroundColor = props?.error 
    ? 'rgba(235, 87, 87, 0.05)' 
    : props?.type === 'email' && props?.value?.length > 0 
        ? (isValidEmail(props?.value) ? 'rgba(48, 182, 156, 0.05)' : 'rgba(235, 87, 87, 0.05)') 
        : props?.value?.length > 0 
            ? 'rgba(48, 182, 156, 0.05)' 
            : color;

  return (
    <View>
      <View style={{
        ...styles.inputview
        ,
        borderColor: borderColor,
        backgroundColor: backgroundColor


      }}>
        <TextInput

          autoCapitalize='none'
          placeholder={props.placeholder}
          value={props.value}
          editable={props.editable ? props.editable : true}
          maxLength={props.maxLength}
          onChangeText={props.onChangeText}
          onFocus={() => { setbordercolor('#EEBE4C'), setcolor('#FFFFFF') }}
          textAlign={props?.textAlign}
          cursorColor={'#DBAC3B'}
          keyboardType={props.keyboardType ? props.keyboardType : "default"}
          placeholderTextColor={props.placeholderTextColor ? props.placeholderTextColor : "#828282"}
          secureTextEntry={props.secureTextEntry && passwordShow ? true : false}
          style={{ height: hp(5.8), width: props?.width ? props?.width : props.righticon ? wp(72) : wp(80), paddingLeft: 10, color: '#007B63' }}
        />
        {props.righticon &&
          <TouchableOpacity onPress={() => (setpasswordShow(!passwordShow))}>
            <Image source={passwordShow ? Images.passhide : Images.passshow} style={{ width: wp(6), height: wp(6) }} resizeMode={"contain"}></Image>
          </TouchableOpacity>
        }
      </View>

    </View>
  )
}

export default TextInputcomp

const styles = StyleSheet.create({
  inputview: {
    borderWidth: 1,
    // marginTop: 16,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 5
  }
})
