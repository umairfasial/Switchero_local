
import { Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../../../theme/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../../components/Responsiveui';
import { Fonts } from '../../../theme/Fonts';


export const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    hitslop: { top: 10, bottom: 10, right: 10, left: 10 },
    btn: {
        width: wp(38),
        backgroundColor: Colors.secondaryColor,
        borderColor: Colors.secondaryColor,
    },
    btnno: {
        width: wp(38),
        backgroundColor: Colors.graytext,
        borderColor: Colors.graytext,
    },
    deletemodal: {
        alignItems: "center",
        justifyContent: 'center'
    },
    btnrow: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        marginTop: hp(4),
        width: wp(80)
    },
    deletetxt: {
        fontSize: 18,
        color: Colors.black,
        fontFamily: Fonts.FontsBold,
        textAlign: "center"
    },
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: hp(Platform.OS == 'ios' ? 7 : 1.5),
        paddingBottom: 5,
        paddingHorizontal: wp(6)
    },
    headerText: {
        fontSize: 16,
        color: Colors.darkBlack,
        fontFamily: Fonts.FontsExtraBold

    },
    contactUs: {
        marginTop: hp(2),
        width: wp(45),
        height: hp(5)
    },
    input2: {
        width: wp(80),
        height: 40,
        borderColor: Colors.btncolor,
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        verticalAlign: 'top',
        color: Colors.black
    },
    dotimg: {
        width: wp(1.5),
        height: wp(4)
    },
    dotes: {
        backgroundColor: Colors.grentext,
        width: wp(3),
        height: wp(3),
        borderRadius: wp(3),
        right: 4
    },

    inputview: {
        //padding: 2,
        paddingLeft:8,
        //marginHorizontal: wp(6),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `${Colors.graytext}40`,
        marginTop: hp(1),
        borderRadius: 5
    },
    input: {
        height: hp(6),
        width: wp(80),
        color: Colors.black
    },
    seprator: {
        borderBottomWidth: 1,
        borderColor: `${Colors.black}20`,
        marginTop: hp(2)
    },
    mesageview: {
        paddingHorizontal: wp(6),
        paddingVertical: wp(3),

        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        borderColor: `${Colors.black}20`,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        paddingRight: wp(10)
    },
    imageView: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'center'
    },
    profileimg: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(10)
    },
    targetitem: {
        width: wp(13),
        height: wp(13),
        borderRadius: wp(10),
        // marginTop: hp(1)


    },
    nametxt: {
        fontSize: 14,
        fontFamily: Fonts.Fontsmedeum,
        color: Colors.darkGray,
        // backgroundColor: "red",
        // width: wp(32)
    },
    sourcetitle: {
        fontSize: 14,
        fontFamily: Fonts.Fontsmedeum,
        color: Colors.black,
        // backgroundColor: "red",
        maxWidth: wp(32)
    },
    targettitle: {
        fontSize: 14,
        fontFamily: Fonts.Fontsmedeum,
        color: Colors.black,
        // backgroundColor: "yellow",
        maxWidth: wp(32)
    },
    cash: {
        fontSize: 15,
        fontFamily: Fonts.FontssemiBold,
        color: Colors.btncolor,
        // backgroundColor: "red",
        width: wp(26)
    },

    cashofercass: {
        fontSize: 14,
        fontFamily: Fonts.Fontsmedeum,
        color: Colors.black,
        maxWidth: wp(55),
        marginTop: 2
    },

    dolortarget: {
        fontSize: 14,
        fontFamily: Fonts.Fontsmedeum,
        color: Colors.black,
        // backgroundColor: "yellow",
        maxWidth: wp(55)
    },
    swapwith: {
        width: wp(4.5),
        height: wp(4.5),
        marginHorizontal: wp(1),
        tintColor: Colors.secondaryColor

    },
    dolorsig: {
        width: wp(4),
        height: wp(4),
        marginHorizontal: wp(1),
        marginBottom: 2

    },
    lastmessage: {
        fontSize: 14,
        fontFamily: Fonts.Fontsregular,
        color: Colors.graytext
    },
    messagetext: {
        marginLeft: wp(2),
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: wp(75),
        flexDirection: 'row',
        // alignItems: 'center',
        // backgroundColor: 'red',
        alignContent: 'center'
    },
    badge: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: Colors.btncolor,
        left: 4,
        alignSelf: "center"

    },

    // Modallll

    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modalContent: {
        backgroundColor: 'white',
        width: wp(100),
        padding: 20,
        alignItems: 'flex-start',

    },
    modlbtn: {
        width: wp(100),
        paddingVertical: 10
    },
    buttonText: {
        fontSize: 16,
        color: '#FF6961',
        fontFamily: Fonts.FontssemiBold


    },
    buttonTextcancel: {
        fontSize: 16,
        color: Colors.black,
        fontFamily: Fonts.FontssemiBold

    },
    emptyData: {
        width: wp(80),
        height: wp(80)
    },
    emptyView: {
        alignItems: "center",
        justifyContent: "center",
        flex: 0.8
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(4),
        marginBottom: hp(1),
    },

    filterButton: {
        marginLeft: wp(1),
        padding: wp(2),
        //backgroundColor: Colors.secondaryColor,
        borderRadius: wp(2),
        alignSelf: 'center',
        marginTop:hp(0.5)
    },

    filterIcon: {
        width: wp(5),
        height: wp(5),
    },

    filterMenu: {
        backgroundColor: '#fff',
        marginHorizontal: wp(4),
        padding: wp(2),
        borderRadius: wp(2),
        elevation: 3,
        shadowColor: '#000', // required for iOS
        shadowOffset: { width: 0, height: 2 }, // creates bottom shadow
        shadowOpacity: 0.1, // subtle shadow
        shadowRadius: 4, // smoothness/spread
        zIndex: 99,
        marginTop:hp(2)
    },

    filterItem: {
        paddingVertical: hp(1),
        fontSize: wp(3.5),
        fontFamily:Fonts.FontssemiBold,
        color: Colors.black,
    }

})

export default styles;
