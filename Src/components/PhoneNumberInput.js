import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, Platform, View, TextInput, Text } from 'react-native';
import ResponsiveText from './ResponsiveText';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from './Responsiveui';
import Colors from '../theme/colors';
import CountryPicker, { Flag } from 'react-native-country-picker-modal';
import { GlobalStyles } from '../utils/globalStyles';
import { Fonts } from '../theme/Fonts';
const countryToEmojiFlag = (countryCode) => {
    // Convert the country code to uppercase, split into array of letters, map to regional indicators, and join back into a string
    return countryCode
        .toUpperCase()
        .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
};
const PhoneNumberInput = ({
    countryCode, setCountryCode, phoneNumber, setPhoneNumber
}) => {
    const [isCode, setIsCode] = useState(false)
    const [flag, setFlag] = useState('US');
    const onChangeNumber = (text) => {
        setPhoneNumber(text)
    }
    return (
        <View>
            <View style={[GlobalStyles().row, styles.inpView]}>
                <TouchableOpacity onPress={() => setIsCode(true)} style={styles.flagView} >
                    {/* <Text style={{ color: Colors.black, fontSize: 19 }}>{countryToEmojiFlag(flag)}</Text> */}
                    <Text style={styles.text}>+{countryCode}</Text>
                </TouchableOpacity>
                {/* <Text style={styles.text}>{countryCode}</Text> */}
                {/* <Flag countryCode={'US'}/> */}

                <TextInput
                    maxLength={11}
                    keyboardType='number-pad' value={phoneNumber}
                    onChangeText={(e) => { onChangeNumber(e?.replace(/[^0-9]/g, '')) }} 
                    placeholder='Enter your number'
                    placeholderTextColor={Colors.darkGray} style={styles.inp} />
            </View>
            {isCode &&
                <CountryPicker
                    //   countryCode={countryCode}
                    withFilter
                    withFlag={true}
                    withCountryNameButton={true}
                    withAlphaFilter
                    withCallingCode={true}
                    withEmoji={true}
                    onClose={() => setIsCode(false)}
                    onSelect={(country) => {
                        console.log('countrycountry', country);

                        setIsCode(false)
                        setCountryCode(country?.callingCode[0] || '1')
                        setFlag(country.cca2)
                    }}
                    visible
                />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    inp: {
        color: Colors.black,
        fontSize: 20,
        fontFamily: Fonts.Fontsmedeum, 
        width: wp(50),
        top:hp(0.5),
        flex:1,
        height:hp(10)
    },
    text: {
        fontSize: 20,
        color: Colors.black,
        fontFamily: Fonts.Fontsmedeum
    },
    flagView: {
        backgroundColor: Colors.primaryColor, 
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.20,
        shadowRadius: 4,
        elevation: 0.5,
        height: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        width: wp(18),
        borderRadius: wp(1.5)
    },
    inpView: {
        borderWidth: 1,
        borderColor: Colors.primaryColor,
        padding: wp(2),
        //paddingHorizontal: wp(2),
        columnGap: wp(3),
        height: hp(9),
        borderRadius: wp(2),
       
    },
});
export default PhoneNumberInput;
