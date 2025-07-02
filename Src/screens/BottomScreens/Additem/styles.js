
import { Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../../../theme/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../../components/Responsiveui';
import { Fonts } from '../../../theme/Fonts';


export const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mainview: {
        width: wp(80),
       // height: hp(20),
        justifyContent: 'center'
    },
    rowviewmodal: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: hp(2),
        top: hp(3)

    },
    textshare: {
        fontSize: 14,
        fontFamily: Fonts.Fontsmedeum,
        color: Colors.black
    },
    shareimage: {
        width: wp(5),
        height: wp(5),
        tintColor: Colors.primaryColor
    },
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: hp(Platform.OS == 'ios' ? 5.5 : 1.5),

        paddingBottom: 5,
        paddingHorizontal: wp(6)
    },
    dragmain: {
        // backgroundColor: 'red',
        // width: wp(90)
        // flex: 1,
        // marginTop: hp(2),
        // height: hp(50),
        // backgroundColor: 'black',
        // zIndex: 10
    },
    headerText: {
        fontSize: 16,
        color: Colors.darkBlack,
        fontFamily: Fonts.FontsExtraBold

    },

    title: {
        fontSize: 16,
        color: Colors.darkBlack,
        fontFamily: Fonts.FontssemiBold,
        textAlign: 'center',
       // marginTop: hp(8)
    },
    descriptionText: {
        fontSize: 14,
        color: Colors.darkBlack,
        fontFamily: Fonts.Fontsmedeum,
        textAlign: 'center',
        marginTop: hp(1)
    },
    dotimg: {
        width: wp(1.5),
        height: wp(4)
    },
    imagemainview: {
        backgroundColor: `${Colors.graytext}40`,
        paddingHorizontal: wp(4),
        //paddingBottom: hp(2)
        justifyContent: 'center',
        height: hp(6)
    },
    imageview: {
        height: wp(40),
        width: wp(25),
        backgroundColor: `${Colors.white}`,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: hp(2),
        justifyContent: "center"
    },
    closeimg: {
        width: wp(7),
        height: wp(7),
    },
    crossimage: {
        width: wp(6), height: wp(6),
        // backgroundColor:'#FF6961',
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        zIndex: 1,
        top: 5,
        alignSelf: 'flex-end',
        right: 5
    },
    image: {
        height: wp(40),
        width: wp(25),
        borderRadius: 5,
    },
    imageAddviewtouchable: {
        height: wp(40),
        width: wp(25),
        borderRadius: 5,
        alignItems: 'center',
        marginTop: hp(2),
        justifyContent: "center"
    },
    rowview: {
        flexDirection: 'row',
        backgroundColor: "#FF6961 ",
        alignItems: "center",
        justifyContent: "space-between"
    },
    imageAddview: {
        height: wp(40),
        width: wp(25),
        backgroundColor: `${Colors.white}60`,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: hp(2),
    },
    sellingtxt: {
        marginTop: hp(2),
        fontSize: 14,
        fontWeight: "bold",
        color: '#4f4f4f'
    },
    titleinput: {
        paddingHorizontal: wp(4),
        paddingVertical: wp(2),
        backgroundColor: Colors.white,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    input: {
        width: wp(85),
       // height: hp(8),
        color: Colors.darkGray,
        textAlign: 'left',

    },
    Titlelenthstyl: {
        color: Colors.graytext,
        fontSize: 14,
        bottom: 0,

    },
    Textlength: {
        alignItems: 'flex-end',
        height: hp(8),
        justifyContent: 'flex-end'
    },

    sellingvalue: {
        fontFamily: Fonts.FontsBold,
        paddingLeft: hp(2),
        fontSize: 14,
        //paddingVertical: hp(1.8),
        color: '#4f4f4f'
    },
    cashoffer: {
        fontWeight: '700',
        paddingLeft: hp(2),
        paddingVertical: hp(1.8),
        color: '#4f4f4f'
    },
    Valueinput: {
        paddingHorizontal: wp(4),
        paddingVertical: wp(2),
        backgroundColor: Colors.white,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    valueinput: {
        width: wp(90),
        height: hp(6),
        color: Colors.darkGray,
        textAlign: 'left',
    },
    description: {
        paddingHorizontal: wp(4),
        paddingVertical: wp(2),
        backgroundColor: Colors.white,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'

    },
    texttogle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        paddingRight: wp(3),
        backgroundColor: `${Colors.graytext}40`,
        height: hp(6)
    },
    togolbtn: {
        width: wp(15),
        height: wp(8)
    }
    ,
    btnview: {
        marginTop: hp(3),
        alignItems: "center",
        marginBottom: hp(2),

    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        backgroundColor: 'white',
        width: wp(100),
        padding: 20,
        alignItems: 'flex-start',
    },

    buttonText: {
        fontSize: 16,
        color: '#FF6961',

    },
    buttonTextcancel: {
        fontSize: 16,
        color: Colors.black,
        fontFamily: Fonts.FontsBold

    },
    hitslop: { top: 10, bottom: 12, right: 12, left: 12 },
    modlbtn: {
        width: wp(100),
        paddingVertical: 10
    },
    addphoto: {
        width: wp(10),
        height: wp(10),
        marginTop: hp(2)
    },
    addphotoview: {
        alignItems: "center"
    },
    adphototxt: {
        color: Colors.graytext,
        marginTop: hp(0.2),
        fontSize: 14,
        fontWeight: '500'

    },
    centeredView: {
        flex: 1,
        alignItems: 'center'
    },
    modalView: {
        width: wp(100),
        height: hp(100),
        backgroundColor: 'white',
        padding: 35,
        // alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    textOffer: {
        alignItems: "center",
        // height: hp(80),
        // justifyContent: "center",
        // backgroundColor: "#FF6961 "
    },

    crosbtn: {

        // alignItems: "center",
        position: 'absolute',

        right: -wp(2),
        alignSelf: 'flex-end',
        top: -wp(5),
    },
    closeBUtton: {
        width: wp(8),
        height: wp(8),

    },
    texxxx: {
        fontSize: 16,
        fontFamily: Fonts.FontsBold,
        //marginTop: hp(4),
        color: Colors.black,
        textAlign: "center"
    },
    subText: {
        fontSize: 14,
        fontFamily: Fonts.Fontsmedeum,
        marginTop: hp(1),
        color: Colors.black,
        textAlign: "center"
    },
    btnimg: {
        width: wp(5),
        height: wp(5),

    },
    offerbtn: {
        width: wp(73),
        marginTop: hp(4)
    },


    tabrow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    buttontext: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 3,
        borderColor: Colors.btncolor,
        width: wp(50),
    },
    textcolor: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        color: Colors.graytext,
    },
    categoryContainer: {
        marginBottom: 10,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    categoryHeader: {
        flexDirection: 'row',
        //backgroundColor: '#f4f4f4',
        padding: 10,
        //borderRadius: 5,
    },
    categoryText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subCategoryText: {
        fontSize: 14,
        fontFamily: Fonts.Fontsmedeum,
        color: Colors.black,
        paddingLeft: 10,
        marginTop: hp(2),
        marginBottom: hp(0.5)
    },
    serviceDropdown: {

        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 4,
        shadowOpacity: 0.2,
        marginBottom: hp(1)
    },
    selectedSubCat: {
        fontFamily: Fonts.Fontsmedeum,
        paddingLeft: hp(1.5),
        fontSize: 14,
        color: Colors.darkGray
    },
})

export default styles;
