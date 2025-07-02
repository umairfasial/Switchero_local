
import { Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../../../theme/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../../components/Responsiveui';
import { Fonts } from '../../../theme/Fonts';


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    lotianimation: {
        width: wp(120),
        height: hp(100),
        position: 'absolute'
    },
    view: {
        // flex: 1,
        alignItems: "center",
        justifyContent: "center"

    },
    textmatch: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: Fonts.FontsExtraBold,
        marginTop: hp(15)

    },
    itsmatch: {
        width: wp(72.715),
        height: wp(25.8825),
        marginTop: hp(4)
    },
    btnContainer2: {
        marginBottom: hp(1),
    },
    btntitle: {
        fontSize: 18,
        fontFamily: Fonts.FontsBold
    },
    btnContainer: {
        marginTop: hp(2),
        marginBottom: hp(2),

        backgroundColor: Colors.secondaryColor,
        borderColor: Colors.secondaryColor

    },
    succesLoti: {
        alignSelf: "center",
        justifyContent: 'center',
        width: wp(80),
        height: wp(80),
        alignItems: 'center'
    },
    succesLotiview: {
        flex: 1,
        alignSelf: "center",
        position: 'absolute',
        bottom: 0,
        marginBottom: hp(35)
    },
    // 
    rowView: {
        marginTop: hp(3),
        padding: 10,

        flexDirection: 'row',
        justifyContent: "space-between"

    },
    ImageView: {
        width: wp(30),
        height: wp(40),
        borderRadius: 15,
        marginHorizontal: 2,
        transform: [{
            rotate: '16deg'
        }, {
            scale: 1.6
        }]
    },
    ImageView2: {
        width: wp(30),
        height: wp(40),
        borderRadius: 15,
        marginRight: wp(15),

        marginHorizontal: 2,
        transform: [{
            rotate: '-19deg'
        }, {
            scale: 1.6
        }]
    },


    topView: {
        flex: 0.5, backgroundColor: Colors.secondaryColor, width: wp(110),
        transform: [{
            rotate: '-19deg'
        }, {
            scale: 1.6
        }]
    },

    bottomView: {

        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',

        height: hp(100),
        width: wp(100)
    }

})

export default styles;
