import {
  FlatList, Image, ImageBackground, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../../components/Container';
import styles from './styles';
import Images from '../../../components/Images';
import ResponsiveText from '../../../components/ResponsiveText';
import Colors, { DarkColors } from '../../../theme/colors';
import Button from '../../../components/Button';
import { GetAllMyitem, Getmyitemquery, Getofferbyid, RemoviitemMutation, clearApolloCache, useDeleteUserMutation, useGetMyNameQuery, } from '../../../Graphql/Graphql';
import {
  StackActions,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../../components/Responsiveui';
import FastImage from 'react-native-fast-image';
import { ContactUs, getAddressFromLatLng, getMyallItems } from '../../../Apis/Apis';
import CustomModal from '../../../components/CustomModal';
import { ChangeTheme, Savematchingitem, saveisFirstinstall } from '../../../redux/actions/userDataAction';
import { useDispatch, useSelector } from 'react-redux';
import { useApolloClient } from '@apollo/react-hooks';
import moment from 'moment/moment';
import { SuccessToast } from '../../../components/SuccessToast';
import Share from 'react-native-share';
import Clipboard from '@react-native-community/clipboard';
import { CheckTheme } from '../../../helper/global';
import { CloseIcon } from '../../../components/ReviewFloating';
import { GlobalStyles } from '../../../utils/globalStyles';
import { Fonts } from '../../../theme/Fonts';
import Spinner from '../../../components/Spinner';

export const ProfileItem = ({ title, value, onPress, arrow = false, isDarkTheme }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.rowview}>
      <ResponsiveText style={{ ...styles.titletxt, color: isDarkTheme ? `${Colors.white}80` : `${Colors.black}80`, }}>
        {title}
      </ResponsiveText>

      <ResponsiveText style={{ ...styles.title2text, color: isDarkTheme ? Colors.white : Colors.black }}>
        {value}
      </ResponsiveText>
      {arrow &&
        <Image source={Images.rightarrow} style={styles.rightarow} />
      }
    </TouchableOpacity>
  )
}
const Profile = props => {
  const dispatch = useDispatch();
  const [myitems, setmyitems] = useState([]);
  const [Itemmodal, setItemmodal] = useState(false);
  const [DeleteModal, setDeleteModal] = useState(false);
  const [ContactUsmodal, setContactUsmodal] = useState(false);
  const [ShareModal, SetShareModal] = useState(false);
  const [warningModal, setwarningModal] = useState(false);
  const [selectedItem, setselectedItem] = useState('');
  const [itemDeleteMessage, setitemDeleteMessage] = useState('');
  const [Location, setLocation] = useState('');
  const [Region, setRegion] = useState('');
  const [categorySpinner, setCategorySpinner] = useState(false);
  const [categoryType, setCategoryType] = useState(1);
  const [selectedGroup, setSelectedGroup] = useState('Item');
  const [filteredOffers, setFilteredOffers] = useState([]);

  const [archiveItem] = RemoviitemMutation();
  const checkSelectedTitle = useSelector(response => {
    return response?.userdataReducer.matchingItems;
  });
  const isDarkTheme = CheckTheme()
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [Title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, seterrorMessage] = useState('');
  function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }
  const Sharedata = () => {
    const message = `http://tinyurl.com/4s4mwk7t?${'switcheroo'}`;
    const options = {
      message: message,
    };


    SetShareModal(false),
      Share.open(options)
        .then((res) => {
          console.log(res);
          SetShareModal(false);
        })
        .catch((err) => {
          err && console.log(err);
          SetShareModal(false);

        })
        .finally(() => {
          SetShareModal(false);

        });
  };

  const ShareApp = () => {
    // const message = Platform.OS == 'ios' ? `https://apps.apple.com/us/app/switcheroo-llc/id6475202453` : `https://play.google.com/store/apps/details?id=com.switchero&pcampaignid=web_share`
    const message = `https://switcherooapp.com/`
    const options = {
      message: message,
      // Optionally you can add other sharing options here
    };


    Share.open(options)
      .then((res) => {
        console.log('Share response:', res);
      })
      .catch((err) => {
        // It's a good practice to check if err is not null before logging
        if (err) {
          console.log('Error sharing:', err);
        }
      })

  };

  // 

  const copyToClipboard = () => {
    Clipboard.setString(`http://tinyurl.com/4s4mwk7t?${'switcheroo'}`);
  };
  const ContactUssend = async () => {
    try {
      seterrorMessage('')
      if (!name) {
        seterrorMessage('Please enter your name')
      } else if (
        !email
      ) {
        seterrorMessage('Please enter your email address')

      }
      else if (
        !Title
      ) {
        seterrorMessage('Please enter your title')

      }
      else if (
        !message
      ) {
        seterrorMessage('Please enter your message')

      }
      else if (
        validateEmail(email) == false
      ) {
        seterrorMessage('Invalid email address')

      }
      else {

        const response = await ContactUs(Title, name, email, message)

        console.log('responseresponseresponse', response.data?.createUserContactUs);
        if (response.data?.createUserContactUs) {
          SuccessToast({
            title: 'Congratulation',
            text: `Thank you! We've received your message and will get back to you soon`,
          });
          setContactUsmodal(false)
          setTitle('')
          setName(''),
            setEmail(''),
            setMessage('')
        }

      }

    } catch (error) {
      console.log('errorerrorerror', error);
    }
  }


  const { getOfferagainstid, getoferloading, getoferdata, getofererror } =
    Getofferbyid({
      fetchPolicy: 'network-only',
    });
  const [deleteUserMutation] = useDeleteUserMutation();
  const handleRemoveItem = async (id, type) => {
    console.log('selectedItem?.id', selectedItem?.id);

    await getOfferagainstid({
      variables: {
        itemId: id,
      },
      fetchPolicy: 'no-cache',
    });
    console.log('getoferloading, getoferdata, getofererror', getoferdata);
    if (type == 'delete') {
      if (getoferdata?.allOffersByItemId.length > 0) {
        setitemDeleteMessage(
          '⚠️ Warning: Deleting this item will also delete any offers associated with it. Are you sure you want to proceed?',
        );
        setItemmodal(false), setwarningModal(true);
      } else {
        setitemDeleteMessage('Are you sure you want to delete this item?');
        setItemmodal(false), setwarningModal(true);
      }
    }
  };

  useEffect(() => {
    getMylistofitem()
  }, [useIsFocused()]);

  useEffect(() => {
    setCategorySpinner(true)
    setTimeout(() => {
      const filteredList = myitems?.filter(item =>
        categoryType === 1 ? item?.offeringId === 1 : item?.offeringId === 2
      );
      setFilteredOffers(filteredList);
      setCategorySpinner(false)
    }, 1000);
  }, [categoryType,myitems])

  const getMylistofitem = async () => {
    try {

      const response = await getMyallItems()

      // console.log('responseresponseresponseresponseresponse', JSON.stringify(response?.data?.me?.items))
      setmyitems(response?.data?.me?.items);



    } catch (error) {

    }
  }

  const {
    data: mydata,
    loading: myloading,
    error,
    refetch: refresshPmydata,
  } = useGetMyNameQuery({
    fetchPolicy: 'network-only',
  });

  let myPersnolData = mydata?.me;
  console.log('myPersnolDatamyPersnolData', myPersnolData);
  const handleDelete = async () => {
    try {
      const { data } = await deleteUserMutation({
        variables: {
          userId: myPersnolData?.id,
        },
      });
      console.log('data response', data); //
      setDeleteModal(false);
      dispatch(saveisFirstinstall(true));

      props.navigation.replace('AuthStack', {
        screen: 'Onboarding',
      });
    } catch (error) {
      console.log('error delete', error);
    }
  };

  useFocusEffect(() => {
    const fetchData = async () => {
      try {
        // Trigger a refetch of myItemsData

        await refresshPmydata();
      } catch (error) {
        // Handle errors...
      }
    };
    console.log('mydatamydatamydatamydata', mydata);

    fetchData();


  });
  const gap = wp(2);
  const RemoveItem = async id => {
    try {
      console.log('id====>?>?>?', id);
      if (id == checkSelectedTitle?.id) {
        dispatch(Savematchingitem(null));

      }


      const archiveItemResponse = await archiveItem({
        variables: {
          itemId: id,
        },
      });


      setTimeout(() => {
        getMylistofitem();
      }, 1000);

      console.log(
        'archiveItemResponsearchiveItemResponsearchiveItemResponse=-=-=-=',
        archiveItemResponse,
      );

      if (archiveItemResponse.data) {
        getMylistofitem();
        setItemmodal(false);
        setwarningModal(false);
      } else {
        getMylistofitem()
        setItemmodal(false);
        setwarningModal(false);
      }
    } catch (error) {
      console.log('errorerrorerror', error);
      setItemmodal(false);
      setwarningModal(false);
    }
  };
  useEffect(() => {
    getCurrentLocation();

  }, [useIsFocused(), myPersnolData]);

  const getCurrentLocation = async () => {
    if (
      myPersnolData != undefined &&
      myPersnolData?.latitude == null &&
      myPersnolData?.longitude == null
    ) {
      console.log('myPersnolData isnif', myPersnolData);
      Geolocation.getCurrentPosition(info => {
        setRegion({
          latitude: info.coords?.latitude,
          longitude: info.coords?.longitude,
        });

        getAddressFromLatLng(info.coords?.latitude, info.coords?.longitude)
          .then(address => setLocation(address))
          .catch(error => console.error(error.message));
      });
    } else {
      getAddressFromLatLng(myPersnolData?.latitude, myPersnolData?.longitude)
        .then(address => setLocation(address))
        .catch(error => console.error(error.message));
    }
  };

  const [tab, settab] = useState('Profile');
  const renderItem = ({ item, index }) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            setselectedItem(item),
              handleRemoveItem(item?.id, 'no'),
              setItemmodal(true);
          }}
          style={styles.imageview}>
          <FastImage
            style={styles.imagedesign}
            source={{
              uri: item?.mainImageUrl,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
      </>
    );
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}/${day}/${year}`;
  }
  // nightlight-round  MaterialIcons
  // day-sunny    Fontisto



  return (
    <Container style={styles.container}>
      <View style={styles.headerView}>
        <View style={styles.dotimg} />
        <ResponsiveText style={{ ...styles.headerText, color: isDarkTheme ? DarkColors.darkBlack : Colors.darkBlack, }}>
          {'My Account'}
        </ResponsiveText>
        <TouchableOpacity>

        </TouchableOpacity>
      </View>
      <View style={styles.tabrow}>
        <TouchableOpacity
          onPress={() => settab('Profile')}
          style={{
            ...styles.buttontext,
            borderColor:
              tab == 'Profile' ? Colors.btncolor : `${Colors.black}20`,
          }}>
          <ResponsiveText
            style={{
              ...styles.textcolor,
              color: tab == 'Profile' ? Colors.btncolor : isDarkTheme ? DarkColors?.graytext : Colors.graytext,
            }}>
            {'Profile'}
          </ResponsiveText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => settab('Made')}
          style={{
            ...styles.buttontext,
            borderColor:
              tab != 'Profile' ? Colors.btncolor : `${Colors.black}20`,
          }}>
          <ResponsiveText
            style={{
              ...styles.textcolor,
              color: tab != 'Profile' ? Colors.btncolor : isDarkTheme ? DarkColors?.graytext : Colors.graytext,
            }}>
            {'Settings'}
          </ResponsiveText>
        </TouchableOpacity>
      </View>

      {tab == 'Profile' ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: '20%' }}
          style={styles.reciveview}>
          <View style={styles.nametab}>
            {myPersnolData?.avatarUrl && (
              <View style={{ ...styles.profilemain, backgroundColor: isDarkTheme ? `${DarkColors.darkGray}20` : `${Colors.darkGray}20`, }}>
                <FastImage
                  style={styles.imagprofile}
                  source={{
                    uri: myPersnolData?.avatarUrl,
                    priority: FastImage.priority.high,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </View>
            )}
            <ResponsiveText style={{ ...styles.guesttxt, color: isDarkTheme ? DarkColors.black : Colors.black, }}>
              {myPersnolData?.firstName}
            </ResponsiveText>
            <ResponsiveText style={{ ...styles.since, color: isDarkTheme ? DarkColors.black : Colors.black, }}>
              {'Member Since:'}{' '}
              <ResponsiveText style={{ ...styles.sincedate, color: Colors.graytext, }}>
                {`${moment(
                  myPersnolData?.createdAt,
                ).fromNow()}`}
              </ResponsiveText>
            </ResponsiveText>
          </View>

          <View>
            <Button
              btnContainer={styles.editbtn}
              onPress={() =>
                props.navigation.navigate('EditProfile', {
                  myPersnolData,
                })
              }
              title={'Edit Profile'}
              titleStyle={styles.btntitle}
              // loading={loading}
              loadingColor={Colors.secondaryColor}
            />
            <View style={styles.seprator} />

            {/* <Button
        btnContainer={styles.locationbtn}
  
          onPress={()=>{
            handleNextPres()
           
        
        }}
        title={isCheckboxes?'Continue':'Update Item Location'}
          // loading={loading}
          loadingColor={Colors.secondaryColor}
        /> */}
          </View>

          <View style={styles.groupToggleContainer}>
            {['Item', 'Service'].map((group) => (
              <TouchableOpacity
                key={group}
                onPress={() => {
                  setSelectedGroup(group)
                  setCategoryType(group === 'Item' ? 1 : 2);
                }}
                style={{
                  ...styles.groupButton,
                  backgroundColor: selectedGroup === group ? Colors.secondaryColor : 'transparent',
                }}
              >
                <ResponsiveText
                  style={{
                    color: selectedGroup === group ? '#fff' : '#333',
                    fontSize: hp(1.8),
                    fontFamily: Fonts.Fontsmedeum,
                  }}
                >
                  {group}
                </ResponsiveText>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.itemview}>
            <ResponsiveText style={{ ...styles.headingtxt, color: isDarkTheme ? `${DarkColors.black}80` : `${Colors.black}80`, }}>
              {categoryType === 1 ? 'Your Items' : "Your Services"}
            </ResponsiveText>
            {categorySpinner ? <View style={{ marginTop: hp(12) }}>

              <Spinner loading={categorySpinner} />

            </View>
              : <View style={styles.mainflatlist}>
                <FlatList
                  data={filteredOffers}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => item.id}
                  numColumns={3}
                  // columnWrapperStyle={{justifyContent:'space-between'}}
                  // contentContainerStyle={{gap}}
                  columnWrapperStyle={{ gap }}
                />
              </View>}
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: '20%' }}
          style={styles.reciveview}>
          <View style={styles.headingview}>
            <ResponsiveText style={{ ...styles.headintxt, color: isDarkTheme ? `${Colors.white}80` : `${Colors.black}80` }}>
              {'Personal Information'}
            </ResponsiveText>
          </View>
          <ProfileItem title={'Full Name'} isDarkTheme={isDarkTheme} value={myPersnolData?.firstName + ' ' + myPersnolData?.lastName} onPress={() => props.navigation.navigate('SettingDetail', { fieldname: 'Full name', data: myPersnolData, })} arrow />
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('SettingDetail', {
                fieldname: 'Email',
                data: myPersnolData,
              })
            }
            style={styles.rowview}>
            <ResponsiveText style={{ ...styles.titletxt, color: isDarkTheme ? `${Colors.white}80` : `${Colors.black}80`, }}>

              {'Email'}</ResponsiveText>

            <ResponsiveText style={{ ...styles.title2text, color: isDarkTheme ? Colors.white : Colors.black }}>
              {myPersnolData?.email}
            </ResponsiveText>
            <Image source={Images.rightarrow} style={styles.rightarow} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('SettingDetail', {
                fieldname: 'Mobile',
                data: myPersnolData,
              })
            }
            style={styles.rowview}>
            <ResponsiveText style={{ ...styles.titletxt, color: isDarkTheme ? `${Colors.white}80` : `${Colors.black}80`, }}>

              {'Mobile'}</ResponsiveText>

            <ResponsiveText style={{ ...styles.title2text, color: isDarkTheme ? Colors.white : Colors.black }}>
              {myPersnolData?.mobile
                ? myPersnolData?.mobile
                : 'Not specified'}
            </ResponsiveText>
            <Image source={Images.rightarrow} style={styles.rightarow} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('SettingDetail', {
                fieldname: 'Gender',
                data: myPersnolData,
              })
            }
            style={styles.rowview}>
            <ResponsiveText style={{ ...styles.titletxt, color: isDarkTheme ? `${Colors.white}80` : `${Colors.black}80`, }}>

              {'Gender'}</ResponsiveText>

            <ResponsiveText style={{ ...styles.title2text, color: isDarkTheme ? Colors.white : Colors.black }}>

              {myPersnolData?.gender ? myPersnolData?.gender : 'Not specified'}
            </ResponsiveText>
            <Image source={Images.rightarrow} style={styles.rightarow} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('SettingDetail', {
                fieldname: 'Date of birth',
                data: myPersnolData,
              })
            }
            style={styles.rowview}>
            <ResponsiveText style={{ ...styles.titletxt, color: isDarkTheme ? `${Colors.white}80` : `${Colors.black}80`, }}>

              {'Date of Birth'}
            </ResponsiveText>

            <ResponsiveText style={{ ...styles.title2text, color: isDarkTheme ? Colors.white : Colors.black }}>

              {myPersnolData?.dateOfBirth
                ? formatDate(myPersnolData?.dateOfBirth)
                : 'Not specified'}
            </ResponsiveText>
            <Image source={Images.rightarrow} style={styles.rightarow} />
          </TouchableOpacity>

          <View style={styles.headingview}>
            <ResponsiveText style={{ ...styles.headintxt, color: isDarkTheme ? `${Colors.white}80` : `${Colors.black}80` }}>

              {'Distance Willing to Travel'}
            </ResponsiveText>
          </View>

          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('SettingDetail', {
                fieldname: 'Distance',
                data: myPersnolData,
              })
            }
            style={styles.rowview}>
            <ResponsiveText style={{ ...styles.titletxt, color: isDarkTheme ? `${Colors.white}80` : `${Colors.black}80`, }}>

              {'Distance'}
            </ResponsiveText>

            <ResponsiveText style={{ ...styles.title2text, color: isDarkTheme ? Colors.white : Colors.black }}>

              {`Up to ${mydata?.me?.distance ? mydata?.me?.distance : 0
                } Miles away`}
            </ResponsiveText>
            <Image source={Images.rightarrow} style={styles.rightarow} />
          </TouchableOpacity>

          <View style={styles.headingview}>
            <ResponsiveText style={{ ...styles.headintxt, color: isDarkTheme ? `${Colors.white}80` : `${Colors.black}80` }}>
              {'Current Location'}
            </ResponsiveText>
          </View>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('SettingDetail', {
                fieldname: 'Location',
                data: Location,
              })
            }
            style={styles.rowview}>
            <ResponsiveText style={{ ...styles.titletxt, color: isDarkTheme ? `${Colors.white}80` : `${Colors.black}80`, }}>

              {'Location'}
            </ResponsiveText>

            <ResponsiveText style={{ ...styles.title2text, color: isDarkTheme ? Colors.white : Colors.black }}>

              {Location}
            </ResponsiveText>
            <Image source={Images.rightarrow} style={styles.rightarow} />
          </TouchableOpacity>


          <View style={styles.headingview}>
            <ResponsiveText style={{ ...styles.headintxt, color: isDarkTheme ? `${Colors.white}80` : `${Colors.black}80` }}>
              {'Account Center'}
            </ResponsiveText>
          </View>


          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('Feedback')
            }
            style={styles.rowview}>
            <ResponsiveText style={{ ...styles.titletxt, color: isDarkTheme ? `${Colors.white}80` : `${Colors.black}80`, width: wp(35), }}>


              {'Feedback'}
            </ResponsiveText>

            <Image source={Images.rightarrow} style={styles.rightarow} />
          </TouchableOpacity>



          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('PrivacyPolicy', {
                fieldname: 'Location',
                data: myPersnolData,
              })
            }
            style={styles.rowview}>
            <ResponsiveText style={{ ...styles.titletxt, color: isDarkTheme ? `${Colors.white}80` : `${Colors.black}80`, width: wp(35), }}>


              {'Account Center'}
            </ResponsiveText>

            <Image source={Images.rightarrow} style={styles.rightarow} />
          </TouchableOpacity>



          {/* 
          <View style={styles.headingview}>
            <ResponsiveText style={{ ...styles.headintxt, color: isDarkTheme ? `${Colors.white}80` : `${Colors.black}80` }}>
              {'Preferences'}
            </ResponsiveText>
          </View>
          <TouchableOpacity
            onPress={() =>
              dispatch(ChangeTheme(!isDarkTheme))
            }
            style={styles.rowview}>
                            <ResponsiveText style={{ ...styles.titletxt, color: isDarkTheme ? `${Colors.white}80` : `${Colors.black}80`, }}>


              {'Dark mode'}
            </ResponsiveText>
            <TouchableOpacity onPress={() => dispatch(ChangeTheme(!isDarkTheme))}>

              <Image source={isDarkTheme ? Images.togolon : Images.togoloff} style={styles.togel} />
            </TouchableOpacity>
          </TouchableOpacity>
 */}





          <View style={styles.button}>
            <Button
              title={'Share'}
              titleStyle={{ color: Colors.white }}
              btnContainer={styles.contactUs}
              onPress={() => ShareApp()}
            // setContactUsmodal(true)
            />

            {/* <Button
              title={'Delete Account'}
              titleStyle={{ color: Colors.white }}
              btnContainer={styles.deletebtn}
              onPress={() => setDeleteModal(true)}
            /> */}
          </View>
        </ScrollView>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={Itemmodal}
        onRequestClose={() => {
          setItemmodal(false);
        }}>
        <TouchableWithoutFeedback onPress={() => setItemmodal(false)}>
          <View style={styles.modalContainer}>
            <View style={{ ...styles.modalContent, backgroundColor: isDarkTheme ? DarkColors.backgroundColor : Colors.backgroundColor, }}>
              {/* <TouchableOpacity style={styles.modlbtn} hitSlop={styles.hitslop} onPress={() => setItemmodal(false)}>
            <ResponsiveText style={styles.buttonTextcancel}>View Listing</ResponsiveText>
          </TouchableOpacity> */}

              <TouchableOpacity
                style={styles.modlbtn}
                hitSlop={styles.hitslop}
                onPress={() => {
                  setItemmodal(false),
                    props.navigation.navigate('MyItemDetail', {
                      item: selectedItem
                    })
                }}>
                <ResponsiveText style={{ ...styles.buttonTextcancel, color: isDarkTheme ? Colors.white : Colors.black }}>
                  View
                </ResponsiveText>
              </TouchableOpacity>


              <TouchableOpacity
                style={styles.modlbtn}
                hitSlop={styles.hitslop}
                onPress={() => {
                  setItemmodal(false),
                    SetShareModal(true)
                }}>
                <ResponsiveText style={{ ...styles.buttonTextcancel, color: isDarkTheme ? Colors.white : Colors.black }}>
                  Share Switcheroo
                </ResponsiveText>
              </TouchableOpacity>


              <TouchableOpacity
                style={styles.modlbtn}
                hitSlop={styles.hitslop}
                onPress={() => {
                  setItemmodal(false),
                    props.navigation.navigate('Edititem', {
                      item: selectedItem,
                    });
                }}>
                <ResponsiveText style={{ ...styles.buttonTextcancel, color: isDarkTheme ? Colors.white : Colors.black }}>

                  Edit Listing
                </ResponsiveText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modlbtn}
                hitSlop={styles.hitslop}
                onPress={() => {
                  handleRemoveItem(selectedItem?.id, 'delete');
                }}>
                <ResponsiveText style={{ ...styles.buttonTextcancel, color: isDarkTheme ? Colors.white : Colors.black }}>

                  Remove Listing
                </ResponsiveText>
              </TouchableOpacity>

              {/* <TouchableOpacity  onPress={()=>{props.navigation.navigate('UpdateItemLocation',{
            region:{
              latitude:selectedItem?.latitude,
              longitude:selectedItem?.longitude,
            },
            type:'view',
            myitems:[]

          }),setItemmodal(false)}}
           style={styles.modlbtn} hitSlop={styles.hitslop} >
            <ResponsiveText style={styles.buttonTextcancel}>View Location</ResponsiveText>
          </TouchableOpacity> */}

              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('UpdateItemLocation', {
                    itemId: selectedItem?.id,
                    region: {
                      latitude: selectedItem?.latitude,
                      longitude: selectedItem?.longitude,
                    },
                    userId: myPersnolData?.id,
                    filteredOffers,
                  }),
                    setItemmodal(false);
                }}
                style={styles.modlbtn}
                hitSlop={styles.hitslop}>
                <ResponsiveText style={styles.buttonTextcancel}>
                  Update Location
                </ResponsiveText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modlbtn}
                onPress={() => setItemmodal(false)}>
                <ResponsiveText style={styles.buttonTextcancel}>
                  Cancel
                </ResponsiveText>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <CustomModal
        modalVisible={warningModal}
        setModalVisible={setwarningModal}>
        <View style={styles.deletemodal}>
          <ResponsiveText style={styles.deletetxt}>
            {itemDeleteMessage}
          </ResponsiveText>
          <View style={styles.btnrow}>
            <Button
              title={'Yes'}
              btnContainer={styles.btn}
              onPress={() => RemoveItem(selectedItem.id)}
            />

            <Button
              title={'No'}
              btnContainer={styles.btnno}
              onPress={() => setwarningModal(false)}
            />
          </View>
        </View>
      </CustomModal>


      <CustomModal modalVisible={ContactUsmodal} setModalVisible={setContactUsmodal}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          {/* <TouchableOpacity onPress={() => setContactUsmodal(false)} style={{ padding: 10, alignSelf: 'flex-end', position: 'absolute', top: -wp(10), right: wp(-6) }}>
            <Image
              source={Images.close}
              style={{ width: wp(8), height: wp(8) }}
            />
          </TouchableOpacity> */}
          <CloseIcon style={{ padding: 10, alignSelf: 'flex-end', position: 'absolute', top: -wp(10), right: wp(-6), width: wp(8), height: wp(8) }} onPress={() => setContactUsmodal(false)} />
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={text => setName(text)}
            style={styles.input}
            placeholderTextColor={Colors.graytext}

          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
            keyboardType="email-address"
            placeholderTextColor={Colors.graytext}
          />
          <TextInput
            placeholder="Title"
            value={Title}
            onChangeText={text => setTitle(text)}
            style={styles.input}
            placeholderTextColor={Colors.graytext}
          />
          <TextInput
            placeholder="Message"
            value={message}
            onChangeText={text => setMessage(text)}
            style={[styles.input, { height: 200 }]} // Make the message input taller
            multiline={true}
            placeholderTextColor={Colors.graytext}

          />
          {errorMessage ? <ResponsiveText style={styles.erormesg}>
            {errorMessage}
          </ResponsiveText> : null}
          <Button title="Send"
            btnContainer={styles.contactUs}
            onPress={() => { ContactUssend() }} />
        </View>
      </CustomModal>


      <CustomModal modalVisible={DeleteModal} setModalVisible={setDeleteModal}>
        <View style={styles.deletemodal}>
          <ResponsiveText style={styles.deletetxt}>
            Are you sure you want to delete your account?
          </ResponsiveText>
          <View style={styles.btnrow}>
            <Button
              title={'Yes'}
              btnContainer={styles.btn}
              onPress={() => handleDelete()}
            />

            <Button
              title={'No'}
              btnContainer={styles.btnno}
              onPress={() => setDeleteModal(false)}
            />
          </View>
        </View>
      </CustomModal>



      <CustomModal
        modalVisible={ShareModal}
        setModalVisible={SetShareModal}
      >

        <View style={styles.mainview}>

          {/* <TouchableOpacity onPress={() => {
            SetShareModal(false)

          }}>
            <Image
              source={Images.close}
              style={{ width: wp(8), height: wp(8), alignSelf: 'flex-end', position: 'absolute', top: hp(-3.5), right: hp(-2) }}
            />
          </TouchableOpacity> */}
          <CloseIcon size={5} style={{ width: wp(6), height: wp(6), alignSelf: 'flex-end', position: 'absolute', top: hp(-3), right: hp(-1) }} onPress={() => SetShareModal(false)} />
          <View style={GlobalStyles().padding} />
          <TouchableOpacity onPress={() => { Sharedata() }} style={styles.rowviewmodal}>
            <ResponsiveText style={styles.textshare}>
              {'Share Item'}
            </ResponsiveText>
            <Image
              source={Images.Share}
              style={{ ...styles.shareimage, height: wp(4) }}
            />

          </TouchableOpacity>
          <TouchableOpacity onPress={() => { copyToClipboard(), SetShareModal(false) }} style={styles.rowviewmodal}>
            <ResponsiveText style={styles.textshare}>
              {'Copy Item'}
            </ResponsiveText>
            <Image
              source={Images.Copy}
              style={styles.shareimage}
            />

          </TouchableOpacity>

        </View>

      </CustomModal>
    </Container>
  );
};

export default Profile;
