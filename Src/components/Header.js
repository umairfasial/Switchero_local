import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Platform } from 'react-native';
import ResponsiveText from './ResponsiveText';
import Images from './Images';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from './Responsiveui';
import Colors from '../theme/colors';
import { Fonts } from '../theme/Fonts';
import { CloseIcon } from './ReviewFloating';

const getRandomColor = () => {
  const colors = ['#F44336', '#E91E63', '#9C27B0', '#3F51B5', '#03A9F4', '#009688', '#4CAF50', '#FFC107', '#FF5722'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const Header = props => {

  const hasAvatar = props.targetUserProfile?.userProfileUrl;
  const firstLetter = props?.targetUserProfile?.firstName?.charAt(0)?.toUpperCase() || '?';
  const backgroundColor = getRandomColor();

  return (
    <>
      {props?.left == true ?
        <View style={styles.myPioneer}>
          <TouchableOpacity style={styles.notificationicon} hitSlop={{ left: 20, right: 20, bottom: 20, top: 20 }} onPress={props.onPress}>
            <Image source={Images.HeaderBackarow} style={styles.leftarrow2} />
          </TouchableOpacity>

          <ResponsiveText style={[styles.title, props.style]}>
            {props.title ? props.title : null}
          </ResponsiveText>
          <View style={styles.notificationicon} />

        </View>
        :
        <View style={styles.myPioneer}>
          {props.onLefticonPress ? <TouchableOpacity style={[styles.leftarrow, { width: wp(0) }]} onPress={props.onLefticonPress}>
            <Image source={Images.verticaldot} style={styles.dotimg} resizeMode="contain" />
          </TouchableOpacity> :
            <View style={styles.notificationicon} />
          }
          {props?.chat ?
            <View>

              <TouchableOpacity
                onPress={props.profilePress}
                style={{
                  flexDirection: 'row',
                  gap: 8,
                  marginBottom: hp(0.5)
                }}>

                {hasAvatar ? <Image source={{ uri: props.targetUserProfile?.userProfileUrl }} style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20
                }} /> : <View style={[styles.fallbackAvatar, { backgroundColor }]}>
                  <ResponsiveText style={styles.initial}>{firstLetter}</ResponsiveText>
                </View>

                }
                <ResponsiveText numberOfLines={1} style={{ ...styles.nameStyle, }}>
                  {props.targetUserProfile?.firstName}
                </ResponsiveText>

              </TouchableOpacity>

              <View style={{ backgroundColor: Colors.darkGray, height: 0.8, width: '100%', marginTop: 5, marginBottom: 8 }} />

              <TouchableOpacity
                onPress={props.onTitlePress}
                style={styles.messagetext}>

                <ResponsiveText numberOfLines={1} style={{ ...styles.targettitle, width: props.title?.targetItem[0]?.title?.toString().length >= 20 ? wp(25) : null }}>
                  {props.title?.targetItem[0]?.title}
                </ResponsiveText>


                {props.title?.sourceItem[0]?.title ? <Image style={[styles.swapwith, { tintColor: Colors.secondaryColor }]}
                  source={Images.matchSwap}
                // source={Images.switcherooround}
                />
                  :
                  <Image style={styles.swapwith}
                    source={Images.DolorSign}
                    resizeMode='contain'
                  />
                }

                {
                  props.title?.cash ? <ResponsiveText numberOfLines={1} style={{ ...styles.cash }}>
                    {`Cash Offer ($${props.title?.cash})`}
                  </ResponsiveText> :
                    <ResponsiveText numberOfLines={1} style={{ ...styles.sourcetitle, width: props.title?.sourceItem[0]?.title?.toString().length > 12 ? wp(26) : null }}>
                      {props.title?.sourceItem[0]?.title}
                    </ResponsiveText>
                }



              </TouchableOpacity>

            </View>
            :
            <ResponsiveText style={[styles.title, props.style]}>
              {props.title ? props.title : null}
            </ResponsiveText>
          }

          {/* <TouchableOpacity style={styles.leftarrow} onPress={props.onPress}>
            <Image source={Images.close} style={styles.leftarrow} />
          </TouchableOpacity> */}
          <CloseIcon style={{
            ...styles.leftarrow,
            top: props.chat ? hp(1.5) : 0
            // position: "relative"
          }} onPress={props.onPress} />
        </View>

      }

    </>
  );
};



export const HeaderleftImage = props => {
  return (
    <>


      <View style={styles.myPioneer}>
        <TouchableOpacity onPress={props.onUnmatchPress} style={styles.btnleft}>
          <ResponsiveText style={{ color: '#fff', fontSize: 12 }}>
            {'Unmatch'}
          </ResponsiveText>
        </TouchableOpacity>

        <ResponsiveText style={{ ...styles.title, ...props.style }}>
          {props.title ? props.title : null}
        </ResponsiveText>
        {/* <TouchableOpacity onPress={props.onPress}>
          <Image source={Images.close} style={styles.leftarrow} />
        </TouchableOpacity> */}
        <CloseIcon style={{ ...styles.leftarrow }} onPress={props.onPress} />
      </View>



    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  rowview: {
    flexDirection: 'row',
    alignItems: "center"
  },
  myPioneer: {
    flexDirection: 'row',
    // marginTop: 10,
    alignItems: 'center',

    //justifyContent: 'space-between',
    borderWidth: 0,
    paddingHorizontal: wp(3),
    // backgroundColor: 'yellow',
    verticalAlign: 'middle',
    marginTop: Platform.OS == 'ios' ? wp(2) : wp(6),
    gap: wp(10)
  },
  dotimg: {
    width: wp(2),
    height: wp(4),
    verticalAlign: 'center',
    alignSelf: 'baseline'
  },
  btnleft: {
    backgroundColor: Colors.btncolor,
    padding: 10,
    borderRadius: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 18,
    color: Colors.darkBlack,
    fontFamily: Fonts.FontsExtraBold,
    textAlign: 'center'
  },
  notificationicon: {
    // bottom: 2,
    padding: wp(3),
    // backgroundColor: "yellow",
    // backgroundColor: 'blue',

  },
  leftarrow: {
    // tintColor:Colors.black,
    width: wp(8),
    height: wp(8),
    alignSelf: 'center',
    // backgroundColor: '#FF6961',
    alignItems: "center",
    justifyContent: "center"
  },
  leftarrow2: {
    // tintColor:Colors.black,
    width: wp(6),
    height: wp(6),
  },
  notification: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    padding: 7,
    borderRadius: 5,
    bottom: 3,
  },
  messagetext: {
    alignItems: 'center',
    justifyContent: "center",
    // width: wp(75),
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: "center",
    marginBottom:8,
  },
  targettitle: {
    // fontSize: 16,
    fontSize: 14,
    fontFamily: Fonts.FontssemiBold,
    color: Colors.black,
    // backgroundColor: "yellow",
    width: wp(20)
  },
  nameStyle: {
    fontSize: 14,
    fontFamily: Fonts.Fontsmedeum,
    color: Colors.black,
    alignSelf: 'center'
    // backgroundColor: "yellow",
    //width: wp(20)
  },
  swapwith: {
    width: wp(4.5),
    height: wp(4.5),
    marginHorizontal: wp(1),
  },
  sourcetitle: {
    // fontSize: 16,
    // fontFamily: Fonts.FontsBold,
    fontSize: 14,
    fontFamily: Fonts.FontssemiBold,
    color: Colors.black,
    // backgroundColor: "red",

  },
  cash: {
    fontSize: 14,
    fontFamily: Fonts.FontssemiBold,
    color: Colors.black,
  },
  fallbackAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initial: {
    color: 'white',
    fontSize: hp(2),
    fontWeight: Fonts.FontsBold
  },
});
