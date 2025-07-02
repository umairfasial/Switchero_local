
import { Platform, StyleSheet, Text, View } from 'react-native'
import Colors from '../../../theme/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../../components/Responsiveui';
import { Fonts } from '../../../theme/Fonts';


export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  checkbox: {
    width: wp(5),
    height: wp(5),

  },
  butonRowView: {
    padding: wp(2),
    borderWidth: 1,
    borderColor: '#BBBBBB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: wp(75),
    marginTop: hp(1),
    borderRadius: 5
  },
  labletext: {
    fontSize: 14,
    fontFamily: Fonts.Fontsmedeum,
    color: Colors.black
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: hp(Platform.OS == 'ios' ? 7 : 1.5),
    backgroundColor: '#FFFFFF',
    paddingBottom: 5,
    paddingHorizontal: wp(6)
  },
  dolorsigntxt: {
    fontSize: 25,
    fontFamily: Fonts.FontsBold,
    color: Colors.white,
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
    // backgroundColor:'#FF6961',
    marginTop: Platform.OS == 'android' ? 2 : 0

  },
  dolorsigntxtblure: {
    fontSize: 25,
    fontFamily: Fonts.FontsBold,
    color: `${Colors.white}80`,
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
    // backgroundColor:'#FF6961',
    marginTop: Platform.OS == 'android' ? 2 : 0

  },
  dolorSign: {

    width: wp(13),
    height: wp(13),
    backgroundColor: Colors.primaryColor,
    alignSelf: 'flex-end',
    right: wp(3),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
    borderRadius: wp(11),

  },


  dolorSigndisable: {
    borderWidth: 3,
    borderColor: Colors.btncolor,

    width: wp(13),
    height: wp(13),
    backgroundColor: `${Colors.primaryColor}90`,
    alignSelf: 'flex-end',
    right: wp(3),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
    borderRadius: wp(11)
  },
  logoimg: {
    width: wp(40),
    height: hp(6)
  },
  dotimg: {
    width: wp(1.5),
    height: wp(4)
  },
  choosebtnview: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    verticalAlign: 'middle',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingVertical: wp(2),
    borderColor: `${Colors.black}20`,
    backgroundColor: `${Colors.white}80`,
    flexDirection: "row",
    marginHorizontal: wp(3),
    // backgroundColor: 'red',
    paddingVertical: hp(1)


  },
  rowButton: {

    width: wp(30),
    height: hp(4.5),
  },
  showfirstbuton: {
    backgroundColor: Colors.secondaryColor,
   // borderColor: '#278c78',
    width: wp(35),
    height: hp(4.6),
    borderRadius: 100,
    alignItems:'center',
    justifyContent:'center'
  },
  showFirstText: {

    color: Colors.white,
    fontSize: 14,
    fontFamily: Fonts.FontsBold,
    // width: wp(30),
    alignSelf: 'center',
    

  },
  imagebtn: {

    width: wp(30),
    height: wp(9)
  },
  imgebtnview: {
    alignItems: "center",
    justifyContent: "center",
    width: wp(30),
  },
  choosebtntxt: {
    color: Colors.btncolor,
    fontSize: 15,
    fontFamily: Fonts.FontsBold,
    // width: wp(30),
    alignSelf: 'center',




  },
  texttitleview: {
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: 'green'
    width: wp(30),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 22,
    // backgroundColor: 'rgba(0, 0, 0, 0.1)'
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: wp(5),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modltxt: {
    color: `${Colors.black}`,
    fontWeight: '600',
    fontSize: 15
  },
  selectedItemText: {
    color: `${Colors.black}`,
    fontWeight: '600',
    fontSize: 13,
    marginTop: hp(1),
    width: wp(35)
    // bottom:hp(10),
    // left:wp(11),
    // position:'absolute'
  },
  imageview: {
    width: wp(30),
    height: hp(25),
    marginTop: hp(2),
    marginRight: wp(4),
    borderWidth: 2,
    // borderColor: Colors.graytext,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: "center"
  },
  imagedesign: {
    width: wp(29),
    height: hp(24.5),
    backgroundColor: Colors.graytext,
    // borderColor: Colors.graytext,
    borderRadius: 5,
    // borderWidth: 1,
  },
  dolorimagedesign: {
    width: wp(15),
    height: wp(15),
    backgroundColor: Colors.graytext,
    borderColor: Colors.graytext,
    borderRadius: 5,
    alignSelf: 'center'
  },
  backgroundImg: {
    width: wp(96),
    height: hp(Platform.OS == 'ios' ? 70 : 74),
    borderRadius: 20,
    alignSelf: 'center',
    overflow: 'hidden',

    // marginBottom: hp(2),
    justifyContent: 'flex-end',
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(3),
    marginBottom: hp(Platform.OS == 'ios' ? 3 : 3),
    flexWrap: 'wrap'

  },
  tickIcon: {
    width: wp(13),
    height: wp(13),
  },
  crossIcon: {
    width: wp(16),
    height: wp(16),

  },

  text: {
    color: Colors.white,
    fontSize: 20,
    textAlign: 'left',
    fontFamily: Fonts.FontssemiBold,
  },
  titleView: {
    backgroundColor: 'rgba(0,0,0,.2)',
    padding: wp(1),
    paddingHorizontal: wp(4),
    borderRadius: wp(1),
    width: wp(58),
  },
  textOffer: {
    alignItems: "center",
    // height: hp(80),
    // justifyContent: "center",
    // backgroundColor: "#FF6961 "
  },
  categoryselect: {
    alignItems: "center",
    height: hp(80),
    // justifyContent: "center",
    // backgroundColor: "#FF6961 "
  },
  cashtext: {
    fontSize: 18,
    fontFamily: Fonts.FontssemiBold,
    color: Colors.black,
  },
  cashModalText: {
    fontSize: 16,
    fontFamily: Fonts.FontssemiBold,
    color: Colors.black,
    textAlign:'center'
  },
  categoryMain: {
    marginTop: hp(1),
    // backgroundColor: 'red'

  },
  crosbtn: {

    // alignItems: "center",
    position: 'absolute',

    right: -wp(2),
    alignSelf: 'flex-end',
    top: -wp(5),
  },
  otherCloseBtn: {

    // alignItems: "center",
    position: 'absolute',

    right: -wp(1),
    alignSelf: 'flex-end',
    top: -wp(2),

  },
  closeBUtton: {
    width: wp(8),
    height: wp(8),

  },
  texxxx: {
    fontSize: 16,
    fontFamily: Fonts.FontsBold,
    marginTop: hp(4),
    color: Colors.black,
    textAlign: "center"
  },
  btnimg: {
    width: wp(5),
    height: wp(5),

  },
  TextInput: {
    width: wp(70),
    borderWidth: 1,
    borderColor: Colors.graytext,
    paddingHorizontal: 10,
    marginTop: hp(2)

  },
  offerbtn: {
    width: wp(73),
    marginTop: hp(4)
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainerfirst: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: wp(100),
    padding: 20,
    alignItems: 'flex-start',
  },

  modalContentfirst: {
    backgroundColor: Colors.backgroundColor,
    padding: 20,
    alignItems: 'flex-start',
    height: hp(100),
    width: wp(100)
  },
  houseruleImage: {

    width: wp(40),
    height: wp(8),
    alignSelf: "center",
    marginVertical: hp(2)

  },
  welcomtxt: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.FontsExtraBold,
    marginTop: hp(4)

  },
  topview: {
    marginTop: Platform.OS == 'ios' ? hp(3.5) : 0,
    flex: 0.98,
    width: wp(90)

  },
  ruletext: {
    fontSize: 14,
    color: Colors.darkGray,
    fontFamily: Fonts.Fontsmedeum,
    //marginTop: hp(1)
  },
  headingText: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: Fonts.FontsBold,
    marginTop: hp(1)
  },
  ruletext2: {
    fontSize: 14,
    color: Colors.darkGray,
    fontFamily: Fonts.Fontsmedeum,
    marginTop: hp(1)
  },
  agretxt: {
    fontSize: 16,
    color: Colors.btncolor,
    fontFamily: Fonts.Fontsmedeum,
  },
  buttonText: {
    fontSize: 18,
    color: '#FF6961',
    fontFamily: Fonts.FontssemiBold

  },
  buttonTextcancel: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: Fonts.FontssemiBold


  },
  hitslop: { top: 50, bottom: 50, right: 50, left: 50 },
  modlbtn: {
    width: wp(100),
    paddingVertical: 10
  },
  emptyView: {
    alignItems: 'center',
    marginHorizontal: wp(5),
    marginTop: hp(6),

  },
  title: {
    fontSize: 16,
  },
  emtyimg: {
    width: wp(70),
    height: hp(40),
    marginTop: hp(6)
  },
  agreebtn: {
    borderWidth: 1,
    borderColor: Colors.btncolor,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    marginTop: hp(2),
    width: wp(90),
    alignSelf: 'center'

  },
  textstore: {

    fontSize: 16,
    fontFamily: Fonts.FontsBold,
    marginTop: hp(2),
    color: Colors.black,
    textAlign: "center"
  },
  remembertext: {
    color: Colors.btncolor,
    fontSize: 12,
    fontFamily: Fonts.Fontsregular,
    marginTop: hp(0.3)
  },
  remembermemain: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'flex-start',
    marginTop: hp(0.5)
  },
  checkbox: {
    width: wp(5),
    height: wp(5),
    marginRight: wp(0.2)
  },
  groupToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:hp(2.5),
    gap: 5, 
    marginBottom: hp(1.4)
  },
  
  groupButton: {
    width:'47%',
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
})

export default styles;
