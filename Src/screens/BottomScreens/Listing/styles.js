import { Platform, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Colors from '../../../theme/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../../components/Responsiveui';
import { Fonts } from '../../../theme/Fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: hp(Platform.OS == 'ios' ? 7 : 1.5),
    paddingBottom: 5,
    paddingHorizontal: wp(6),
  },
  titletext: {
    fontSize: 16,
    fontFamily: Fonts.FontssemiBold,
    color: Colors.black,
    width: wp(45),

  },
  offerPriceText: {
    fontSize: 14,
    fontFamily: Fonts.FontsBold,
    color: Colors.black,
    alignSelf:'center'
  },
  rowview: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowview2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  reciveMain: {
    marginTop: hp(2),
    // borderBottomWidth: 2,
    paddingBottom: hp(1),
    borderColor: `${Colors.graytext}`,
    // borderColor: `${Colors.graytext}30`,
    borderWidth:1,
    // elevation:8,
    // shadowOpacity:0.2,
    paddingHorizontal:8,
    borderRadius:10
  },
  textdiscreption: {
    marginLeft: 10,
  },
  descreption: {
    fontSize: 12,
    fontFamily: Fonts.Fontsmedeum,
    color: Colors.graytext,
    width: wp(45),
  },
  Madeuimain: {
    paddingVertical: 5,
    alignItems: 'center',
    flexDirection: 'row',
    // borderBottomWidth: 1,
    borderColor: `${Colors.graytext}30`,
    justifyContent: 'space-between',
  },
  deleteBtn: {
    backgroundColor: '#FF6961',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 18,
    borderRadius: 30

  },
  rejectBtn: {
    width: wp(30),
    borderRadius: 10,
    paddingVertical: 4,

    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor:'#FF6961',
    alignSelf:'center'
    // borderColor: '#b82c2c'
  },
  acceptBtn: {

    width: wp(30),
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: Colors.secondaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 2,
    borderColor: '#278c78'
  },
  deleteBtntxt: {
    fontSize: 14,
    color: Colors.white,
    alignContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: Fonts.Fontsmedeum

  },
  aceptreject: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: Fonts.Fontsmedeum
  },
  rate: {
    fontSize: 14,
    fontFamily: Fonts.Fontsmedeum,
    color: Colors.black,
    paddingHorizontal: wp(5)
  },
  uiImage: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(10),
  },
  headerText: {
    fontSize: 16,
    color: Colors.darkBlack,
    fontFamily: Fonts.FontsExtraBold
  },
  dotimg: {
    width: wp(1.5),
    height: wp(4),
  },
  choosebtntxt: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: hp(2),
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
  reciveview: {
    marginHorizontal: wp(3),
  },

  item: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#aa3e82',
  },
  txt: {
    color: '#fff',
    letterSpacing: 1,
  },
  btnContainer: {
    height: '100%',
    position: 'absolute',
    flexDirection: 'row',
  },
  btn: {
    height: '100%',
    width: wp(20),
    backgroundColor: '#FF6961',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(12),

  },
  emptyListStyle: {
    width: wp(65),
    height: wp(65),
  },
});

export default styles;
