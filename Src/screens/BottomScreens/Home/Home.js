import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Modal,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Container from '../../../components/Container';
import styles from './styles';
import Images from '../../../components/Images';
import ResponsiveText from '../../../components/ResponsiveText';
import Button from '../../../components/Button';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../../components/Responsiveui';
import Geolocation from '@react-native-community/geolocation';

import Colors from '../../../theme/colors';
import Swiper from 'react-native-deck-swiper';
import axios from 'axios';
import {
  Logoutacountmutaion,
  UpdateUserFcm,
  UsedismisCashoffer,
  clearApolloCache,
  useCreateCashOfferMutation,
  useCreateOfferMutation,
  useDismissItemMutation,
  useSendcashOffer,
} from '../../../Graphql/Graphql';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  SaveAllowSwipe,
  SaveItemuploded,
  Savematchingitem,
  saveShowAgainPopup,
  saveShowFirstPopupAgain,
  saveisFirstinstall,
} from '../../../redux/actions/userDataAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import CustomModal from '../../../components/CustomModal';
import TextInputcomp from '../../../components/TextInputcomp';
import ErrorModal from '../../../components/ErrorModal';
import { SuccessToast } from '../../../components/SuccessToast';
import { ErrorToast } from '../../../components/ErrorToast';
import {
  handleNavigation,
  notificationListener,
  requestUserPermission,
} from '../../../components/NotificationServices';
import { useApolloClient } from '@apollo/react-hooks';

import { GRAPHQL_ENDPOINT, SendCashOffer, fetchLatestAppVersion, getCategoriesByOffering, getCategory, getMyallItems, getSwipeInfo } from '../../../Apis/Apis';
import VideoPlayer from '../../../components/VideoPlayer';
import { CheckTheme } from '../../../helper/global';
import { newEvents } from '../../../CustomEvents/CustomEvents';
import { requestNotificationPermission } from '../../../utils/common';
import { CloseIcon } from '../../../components/ReviewFloating';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { logEvent } from '../../../helper/EventsTracking';
import { isLocationEnabled, promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import Spinner from '../../../components/Spinner';
import { Fonts } from '../../../theme/Fonts';

const Home = props => {
  const isDarkTheme = CheckTheme()

  const client = useApolloClient();
  const dispatch = useDispatch();
  const swiperRef = useRef(null);
  const checkSelectedTitle = useSelector(response => {
    return response?.userdataReducer.matchingItems;
  });

  const favCategory = useSelector(response => {
    return response?.userdataReducer.favCategory;
  });
  const ifFirstinstall = useSelector(response => {
    return response?.userdataReducer.firstinstall;
  });

  const dontShowAgain = useSelector(response => {
    return response?.userdataReducer.dontShowAgain;
  });

  const dontShowFirstAgain = useSelector(response => {
    return response?.userdataReducer.dontShowFirstAgain;
  });


  // const allowSwiprRight = useSelector(response => {
  //   return response?.userdataReducer.allowSwiprRight;
  // });



  const [chosemodal, setchosemodal] = useState(false);
  const [logoutModal, setlogoutModal] = useState(false);
  const [isFirstinstall, setisFirstinstall] = useState(false);
  const [allowSwiprRight, setallowSwiprRight] = useState(true);
  const [NewStoreUpdate, setNewStoreUpdate] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);


  const [VideoStart, setVideoStart] = useState(false);

  const [selectedItem, setselectedItem] = useState(
    checkSelectedTitle ? checkSelectedTitle : {
    },
  );
  const [swiperIndex, setSwiperIndex] = useState(0);
  const [swipeData, setSwipeData] = useState([]);
  const [myItemData, setmyItemData] = useState([]);
  const [selectedCategary, setselectedCategary] = useState([favCategory ?? '']);
  const [categoryData, setcategoryData] = useState([]);
  const [itemforcashOffer, setitemforcashOffer] = useState({});
  const [queryExecuted, setQueryExecuted] = useState(false);
  const [Cashoffermodal, setCashoffermodal] = useState(false);
  const [showSwitchWithModal, setShowSwitchWithModal] = useState(false);
  const [showFirstModal, setShowFirstWithModal] = useState(false);
  const [showSwipesEndModal, setShowSwipesEndModal] = useState(false);
  const [cashOfferModal, setCashOfferModal] = useState(false);
  const [ModalFirstItem, setModalFirstItem] = useState(false);
  const [locationEnablerModal, setLocationEnablerModal] = useState(false);
  const [isSwitchWithShow, setSwitchWithShow] = useState(false);
  const [isShowFirstCheck, setShowFirstCheck] = useState(false);
  const [CreateAccountModal, setCreateAccountModal] = useState(false);
  const [cashModalVisible, setCashModalVisible] = useState(false);
  const [cahsValue, setcahsValue] = useState();
  const [errorModal, seterrorModal] = useState(false);
  const [CheckCashoffer, setCheckCashoffer] = useState(false);
  const [isCashOffer, setIsCashOffer] = useState(false);
  const [cateGaryModal, setcateGaryModal] = useState(false);
  const [SwapRight, setSwapRight] = useState(false);
  const [errorMessage, seterrorMessage] = useState('');
  const [CurrentLatitude, setCurrentLatitude] = useState('');
  const [CurrentLongitude, setCurrentLongitude] = useState('');
  const [loading, setLoading] = useState(Array(swipeData.length).fill(false));
  const [spinner, setSpinner] = useState(false);
  const [categorySpinner, setCategorySpinner] = useState(false);
  const [signOut] = Logoutacountmutaion();

  const [RemaningSwip, setRemaningSwip] = useState(false);
  const [SwipeMessage, setSwipeMessage] = useState('');
  const [isOnlySwipeRight, setSwipeRight] = useState(false);
  const [categoryType, setCategoryType] = useState(1);
  const [selectedGroup, setSelectedGroup] = useState('Item');

  const handleAddCategory = (label) => {
    const labelIndex = selectedCategary.indexOf(label);

    if (labelIndex === -1) {
      // Label doesn't exist, add it
      setselectedCategary([...selectedCategary, label]);
    } else {
      // Label exists, remove it
      const updatedLabels = [...selectedCategary];
      updatedLabels.splice(labelIndex, 1);
      setselectedCategary(updatedLabels);
    }


  };

  useEffect(() => {
    setSpinner(true);
    setTimeout(() => {
      setSpinner(false);
    }, 2000);
  }, []);



  useEffect(() => {
    checkVersion()
  }, [])
  const checkVersion = async () => {
    try {
      const response = await fetchLatestAppVersion()


      if (Platform.OS == 'ios') {
        console.log('vvvvverrr response?.iOSVersion', response?.iOSVersion);



        if (response?.iOSVersion >= 5) {
          setNewStoreUpdate(true)
        }
      }
      else {
        console.log('vvvvverrr response?.androidVersion', response?.androidVersion);
        console.log('vvvvverrr response?.iOSVersion', response?.iOSVersion);


        if (response?.androidVersion >= 6) {
          setNewStoreUpdate(true)

        }
      }
      console.log('responseresponse-=-=-=-=????', response);

    } catch (error) {
      console.log('responseresponse-=-=-=-=????', error);

    }
  }

  const [createOffer] = useCreateOfferMutation();
  const [createCashOffer] = useCreateCashOfferMutation();
  const [sendCashoffer] = useSendcashOffer();
  const [dismissItem] = useDismissItemMutation();
  const [dismissCashitem] = UsedismisCashoffer();
  const [updateFcm] = UpdateUserFcm();


  async function handleGPSEnabled() {
    if (Platform.OS === 'android') {
      try {
        const enableResult = await promptForEnableLocationIfNeeded();
        console.log('enableResult', enableResult);
        setLocationEnabled(true)
        setLocationEnablerModal(false)
        // The user has accepted to enable the location services
        // data can be :
        //  - "already-enabled" if the location services has been already enabled
        //  - "enabled" if user has clicked on OK button in the popup
      } catch (error) {
        if (error) {
          console.error('location error-->', error.message);
          setLocationEnablerModal(true)
          //handleGPSEnabled();
        }
      }
    }

    else if (Platform.OS === 'ios') {
      // Check both LOCATION_WHEN_IN_USE and LOCATION_ALWAYS permissions at the same time
      const whenInUseStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      const alwaysStatus = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);

      // Handle cases where either permission is denied or blocked
      if (
        whenInUseStatus === RESULTS.DENIED || whenInUseStatus === RESULTS.BLOCKED ||
        alwaysStatus === RESULTS.DENIED || alwaysStatus === RESULTS.BLOCKED
      ) {
        // Request LOCATION_WHEN_IN_USE permission first
        const whenInUseRequestStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        // If LOCATION_WHEN_IN_USE is denied or blocked, request LOCATION_ALWAYS permission
        if (whenInUseRequestStatus === RESULTS.DENIED || whenInUseRequestStatus === RESULTS.BLOCKED) {
          const alwaysRequestStatus = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
          if (alwaysRequestStatus === RESULTS.GRANTED) {
            setLocationEnabled(true);
            setLocationEnablerModal(false);
          }
          else {

            Alert.alert(
              'Location Services Disabled',
              'Please enable location services in the settings.',
              [
                {
                  text: 'Open Settings',
                  onPress: () => Linking.openURL('app-settings://'),
                },
                {
                  text: 'Cancel',
                  onPress: () => {
                    setLocationEnablerModal(true);
                  },
                },
              ]
            );
          }
        }
        else {
          setLocationEnabled(true);
          setLocationEnablerModal(false);
        }
      } else {
        setLocationEnabled(true);
        setLocationEnablerModal(false);
      }
    }
  }


  async function handleCheckLocation() {
    if (Platform.OS === 'android') {
      const checkEnabled = await isLocationEnabled();
      console.log('checkEnabled', checkEnabled)

      if (!checkEnabled) {
        // Show an alert prompting the user to enable location
        // handleGPSEnabled();
        setLocationEnablerModal(true)
      } else {
        console.log("Location is already enabled");
      }
    }

    else if (Platform.OS === 'ios') {
      // Check both LOCATION_WHEN_IN_USE and LOCATION_ALWAYS permissions
      // const whenInUseStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      // const alwaysStatus = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);

      // if (
      //   whenInUseStatus === RESULTS.DENIED || whenInUseStatus === RESULTS.BLOCKED ||
      //   alwaysStatus === RESULTS.DENIED || alwaysStatus === RESULTS.BLOCKED
      // ) {
      //   console.log('Hellllllloooooo')
      //   setLocationEnablerModal(true);
      // } else {
      //   console.log('Location is already enabled');
      //   setLocationEnablerModal(false);
      // }

      Geolocation.getCurrentPosition(
        (position) => {
          console.log('ios location permission granted', position);
          setLocationEnablerModal(false);
        },
        (error) => {
          setLocationEnablerModal(true);
          console.log('ios location error---->', error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );



    }
  }

  useEffect(() => {
    handleCheckLocation();
  }, [])


  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage?.data)
      handleNavigation(props.navigation, remoteMessage)
      // onDisplayNotification(remoteMessage.notification, remoteMessage.data);
    });

    // Handle notification press
    // const unsubscribeNotification = notifee.onForegroundEvent(({ type, detail }) => {
    //   if (type === EventType.PRESS) {
    // Handle notification press
    // handleNotification({}, detail.notification.data?.data)
    // }
    // });

    return () => {
      unsubscribe();
      // unsubscribeNotification();
    };
  }, []);

  useEffect(() => {
    requestNotificationPermission()
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      handleNavigation(props.navigation, remoteMessage)
      // handleNotification(remoteMessage)
    });
  }, [])
  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          handleNavigation(props.navigation, remoteMessage)
        }
      });
  }, [])
  useEffect(() => {
    getCurrentLocation()
    // getCategory().then(res => {

    //   let array = []
    //   res.data?.categories.map(categry => {
    //     let object = { label: categry?.name, value: categry?.id }
    //     array.push(object)
    //   })
    //   setcategoryData(array)
    // }).catch(eror => {
    // })
    console.log('categorySpinner', categorySpinner)
    getCategoriesByOffering(categoryType).then(res => {
      
      if (categoryType === 1) {
        let array = []
        res.data?.categoriesByOffering.map(categry => {
          let object = { label: categry?.name, value: categry?.id }
          array.push(object)
        })
        setcategoryData(array)
        setCategorySpinner(false);
      } else {
        let array = []
        res.data?.categoriesByOffering.forEach(category => {
          // Add all subcategories
          category?.subCategories.forEach(subCategory => {
            array.push({ label: subCategory?.name, value: subCategory?.id });
          });
        });

        setcategoryData(array)
        setCategorySpinner(false);

      }
    }).catch(error => {
      console.log('Offer Category--->', error)
      setCategorySpinner(false);
    });

    requestNotificationPermission()

    // notificationListener(props);
    requestUserPermission().then(res => {

      console.log('fcmmmmm', res);

      updateFcm({
        variables: {
          fcmtoken: res,
        },
      })
        .then(res => {
        })
        .catch(error => {
        });
    });
    if (ifFirstinstall) {
      setisFirstinstall(true);


    }



  }, [ifFirstinstall, SwapRight, categoryType]);

  const itemUploded = useSelector(state => state.userdataReducer?.itemuploded)
  const GotoStore = async () => {
    try {
      const appStoreUrl = 'https://apps.apple.com/us/app/id6475202453';
      const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.switchero';

      const url = Platform.OS === 'ios' ? appStoreUrl : playStoreUrl;

      // Open the store link
      Linking.openURL(url)

    } catch (error) {

    }
  }

  useEffect(() => {

    newEvents.emit('FeedBack', true)


    // getMyallItems().then(response => {



    //   if (response?.data?.me?.items.length == 0) {
    //     // setModalFirstItem(true)


    //   }
    //   else {

    //     setSwapRight(true)
    //   }

    // })

  }, [])

  const getCurrentLocation = async () => {

    Geolocation.getCurrentPosition(info => {

      setCurrentLatitude(info.coords?.latitude)
      setCurrentLongitude(info.coords?.longitude)

    })
  }

  const handleAccountModal = () => {
    dispatch(SaveItemuploded(false))
    setCreateAccountModal(false)
    setTimeout(() => {
      props.navigation.replace('TabBarNav', {
        screen: 'Additem',
        params: {
          Showmodal: false,
        },
      })
    }, 100);

  }
  const OnSkipPress = async () => {

    const response = await getMyallItems()

    if (response?.data?.me?.items.length == 0) {
      setModalFirstItem(true)
      dispatch(SaveItemuploded(false))

      props.navigation.replace('TabBarNav', {
        screen: 'Additem',
        params: {
          Showmodal: true,
        },
      })
    } else {
      dispatch(SaveItemuploded(true))

    }

  }

  useEffect(() => {
    checkSipeInfo()

    getMylistofitem()
    setselectedItem(checkSelectedTitle)

    // if (checkSelectedTitle?.id == '$') {
    //   setSwapRight(myItemData.length > 0 ? true : false)
    //   GetItemForCashFilter(myItemData)
    // } else if (checkSelectedTitle?.id != '$') {
    //   GetItemsFilter(checkSelectedTitle);
    //   setSwapRight(false)

    // }


    if (checkSelectedTitle?.id == '' || checkSelectedTitle?.id == null || checkSelectedTitle?.id == undefined || checkSelectedTitle?.id == '$') {
      setselectedItem({
        id: '$',
        title: 'Cash'
      })
    }

    setCheckCashoffer(false);
  }, [useIsFocused(), locationEnabled]);

  const checkSipeInfo = async () => {
    try {

      const response = await getSwipeInfo()

      console.log('responseresponseresponse', response?.swipeInfo);
      if (response?.swipeInfo?.remainingSwipes == 0) {
        setallowSwiprRight(false)
      }


    } catch (error) {
      console.log('errorerror', error);

    }
  }

  const getMylistofitem = async () => {
    try {
      const response = await getMyallItems()
      if (response?.data?.me?.items?.length <= 0) {
        if (itemUploded == false) {
          props.navigation.replace('TabBarNav', {
            screen: 'Additem',
            params: {
              Showmodal: false,
            },
          })
        }
      }



      setmyItemData(response?.data?.me);
      if (checkSelectedTitle?.id == '' || checkSelectedTitle?.id == null || checkSelectedTitle?.id == undefined || checkSelectedTitle?.id == '$') {
        // setSwapRight(response?.data?.me?.items?.lenth > 0 ? true : false)
        GetItemForCashFilter(response?.data?.me)
      }
      else {
        GetItemsFilter(checkSelectedTitle);
        // setSwapRight(false)

      }

    } catch (error) {
    }
  }

  const logoutPress = async () => {
    await signOut();
    setlogoutModal(false);
    await AsyncStorage.clear();
    newEvents.emit('FeedBack', false)


    setSwipeData([]);
    clearApolloCache(client);
    dispatch(SaveAllowSwipe(true));
    dispatch(saveisFirstinstall(true));
    dispatch(saveShowAgainPopup(false));
    dispatch(saveShowFirstPopupAgain(false));
    props.navigation.replace('AuthStack', {
      screen: 'Onboarding',
    });
  };

  // fetch all match data with my selected item

  const handleSwipeRight = (item) => {
    try {
      if (selectedItem?.id == '$') {
        if (myItemData?.items.length > 0) {
          // notginhhhnhnhnhnhnnhnhnhnnhn
        }
        else {
          setCreateAccountModal(true)

        }
      }
      else {

        if (cahsValue) {

          console.log('nothinngggg')
        }
        else {
          createOffer({
            variables: {
              sourceItemId: selectedItem?.id,
              targetItemId: item?.id,
              sourceStatus: 1,
              targeteStatus: 1,
            },
          })
            .then(res => {

              //console.log('resresresresres swipesInfo', res?.data?.createOffer?.swipesInfo);
              if (res?.data?.createOffer?.swipesInfo?.message) {
                setSwipeMessage(res?.data?.createOffer?.swipesInfo?.message)
                setRemaningSwip(true)
              }

              if (res?.data?.createOffer?.swipesInfo?.remainingSwipes == 0) {
                // dispatch(SaveAllowSwipe(false));
                setSwapRight(false)
                setallowSwiprRight(false)
              }
              checkSipeInfo()
              console.log('testing match--->', res?.data);
              if (res?.data?.createOffer?.targeteStatus === 1) {

                props.navigation.navigate('MatchingSuccess',
                  {
                    userImage: selectedItem?.mainImageUrl,
                    SwipeImage: item?.mainImageUrl
                  });

                logEvent('MatchingSuccess', {
                  userImage: selectedItem?.mainImageUrl,
                  SwipeImage: item?.mainImageUrl
                })
              } else {
                // SuccessToast({
                //   title: 'Congratulation',
                //   text: 'Request sent successfully',
                // });
              }
            })
            .catch(error => {
              console.log('error on swipe', error);
              dispatch(SaveAllowSwipe(false));
              setSwapRight(false)

              // ErrorToast({
              //   title: 'Congratulation',
              //   text: error?.graphQLErrors[0].message,
              // });
            });
        }

      }


    } catch (error) {
    }
  };

  const HandleSwipeLeft = item => {

    try {
      if (selectedItem?.id == '$') {
        dismissCashitem({
          variables: {
            targetItemId: item.id,
          },
        })
          .then(res => {
            if (res) {
              checkSipeInfo()
              // SuccessToast({
              //   title: 'Congratulation',
              //   text: 'Dissmiss item',
              // });
            }
          })
          .catch(error => {
            checkSipeInfo()
          });
      } else {

        checkSipeInfo()
        dismissItem({
          variables: {
            sourceItemId: selectedItem?.id,
            targetItemId: item.id,
          },
        })
          .then(res => {

            if (res) {
              // SuccessToast({
              //   title: 'Congratulation',
              //   text: 'Dissmiss item',
              // });

            }
          })
          .catch(error => {


            ErrorToast({
              title: 'Congratulation',
              text: error.graphQLErrors[0].message,
            });

          });
      }


    } catch (error) {
    }
  };

  const Giveoffer = async () => {

    try {
      console.log('selectedItem', selectedItem);

      if (selectedItem?.id == '$') {
        try {

          sendCashoffer({
            variables: {

              targetItemId: itemforcashOffer.id,
              cash: parseInt(cahsValue),
              targeteStatus: 1,
            },
          })
            .then(response => {

              if (response?.data?.createOffer)
                // SuccessToast({
                //   title: 'Congratulation',
                //   text: 'Cash offer sent',
                // });

                setCashoffermodal(false);
              setSwapRight(myItemData?.items.length > 0 ? true : false)
              GetItemForCashFilter(myItemData)
              setcahsValue('');

              logEvent('CahOfferSend', {
                targetItemId: itemforcashOffer.id,
                cahsValue: cahsValue
              })

            }).catch((error) => {

              setcahsValue('');

              setCashoffermodal(false);

              ErrorToast({
                title: 'Congratulation',
                text: error.graphQLErrors[0].message
              });

            })
          // const response = await SendCashOffer(itemforcashOffer.id, parseInt(cahsValue))

        } catch (error) {
        }

      }

      else {
        if (cahsValue) {

          console.log('cahsValuecahsValue', cahsValue);

          seterrorModal(false);
          seterrorMessage('');
          createCashOffer({
            variables: {
              sourceItemId: selectedItem?.id,
              targetItemId: itemforcashOffer.id,
              cash: parseInt(cahsValue),
              sourceStatus: 1,
              targeteStatus: 1,
            },
          })
            .then(res => {
              console.log('resresres', res);

              if (swiperRef.current) {
                swiperRef.current.swipeRight();
              }
              setcahsValue('');
              GetItemsFilter(checkSelectedTitle);
              // if (res?.data?.createOffer?.targeteStatus == 1) {
              //   props.navigation.navigate('MatchingSuccess');
              //   setCashoffermodal(false);
              // } else {
              // SuccessToast({
              //   title: 'Congratulation',
              //   text: 'Cash offer sent',
              // });
              // }
              setCashoffermodal(false);

              setTimeout(() => {
                setCheckCashoffer(false);
              }, 300);
              logEvent('CahOfferSend', {
                targetItemId: itemforcashOffer.id,
                cahsValue: cahsValue
              })
            })
            .catch(error => {
              setcahsValue('');

              setCashoffermodal(false);

              ErrorToast({
                title: 'Congratulation',
                text: error.graphQLErrors[0].message,
              });
            });
        } else {
          seterrorModal(true);
          seterrorMessage('Please Enter Value');
        }
      }

    } catch (error) {
      setCheckCashoffer(false);
    }
  };

  const handleShowAgain = () => {
    setShowSwitchWithModal(false)
    setchosemodal(!chosemodal);
    if (isSwitchWithShow) {
      dispatch(saveShowAgainPopup(true));
    } else {
      dispatch(saveShowAgainPopup(false));
    }

  }

  const handleShowFirstAgain = () => {
    setShowFirstWithModal(false)
    setcateGaryModal(!cateGaryModal);
    if (isShowFirstCheck) {
      dispatch(saveShowFirstPopupAgain(true));
    } else {
      dispatch(saveShowFirstPopupAgain(false));
    }

  }

  const GetItemsFilter = async itemid => {
    try {
      // clearApolloCache(client);
      if (itemid?.id != '$') {
        const query = `
    query GetMyItemFeed(
      $amount: Decimal
      $itemId: Uuid!
      $categories: [String!]
      $limit: Int!
      $cursor: String
      $distance: Decimal
      $latitude: Decimal
      $longitude: Decimal
      $inMiles: Boolean
    ) {
      items(
        amount: $amount
        itemId: $itemId
        categories: $categories
        cursor: $cursor
        limit: $limit
        distance: $distance
        latitude: $latitude
        longitude: $longitude
        inMiles: $inMiles
      ) {
        cursor
        data {
          id
          mainImageUrl
          description
          title
           imageUrls
          askingPrice
          longitude
          latitude
          hasCashOffer
          isSwapOnly
          categories
        }
        hasNextPage
        totalCount
      }
    }
  `;
        Geolocation.getCurrentPosition((info) => {
          let reversedArray = selectedCategary.reverse();

          const variables = {
            limit: 100,
            itemId: itemid?.id,
            amount: itemid?.askingPrice ? itemid?.askingPrice : 0,
            distance: myItemData?.distance ? myItemData?.distance : 100,
            latitude: itemid?.latitude ?? info.coords?.latitude,
            longitude: itemid?.longitude ?? info.coords?.longitude,
            inMiles: true,
            categories: reversedArray
          };

          console.log('itemid===>>>>]n\n', itemid, '\n*******\nvariables<<<\n', variables, '\*************\n');

          axios
            .post(GRAPHQL_ENDPOINT, { query, variables })
            .then(response => {
              if (response) {

                setSwipeData(response.data?.data?.items?.data ?? []);
              }

              console.log('responseresponse all item filter GetItemsFilter', response);

              if (response.data?.data?.items?.data) {
                setSwapRight(false)

              }
            }).catch(error => {

              // console.log('errorerrorerror', error);

            });
        })
      } else {
        // setSwipeData([])
      }

    } catch (error) {
    }
  };
  const GetItemForCashFilter = async (dataItem) => {
    try {
      // clearApolloCache(client);
      const quercash = `query(
      $distance: Decimal!
      $inMiles: Boolean!
      $latitude: Decimal!
      $longitude: Decimal!
      $limit: Int!
    ){
      cashItems(
        distance: $distance
        inMiles: $inMiles
        latitude: $latitude
        longitude: $longitude
        limit: $limit
      ){
        data{
          id
          mainImageUrl
          description
          title
          imageUrls
          askingPrice
          longitude
          latitude
          isSwapOnly
          categories
        }
        totalCount
        hasNextPage
      }
    }`;
      Geolocation.getCurrentPosition((info) => {
        // Assuming myItemData and CurrentLatitude/CurrentLongitude are defined elsewhere
        const variables = {
          limit: 500,
          distance: dataItem?.distance ? dataItem?.distance : myItemData?.distance ? myItemData?.distance : 100,
          inMiles: true,
          latitude: dataItem?.latitude ? dataItem?.latitude : myItemData?.latitude ?? info.coords?.latitude,
          longitude: dataItem?.longitude ? dataItem?.longitude : myItemData?.longitude ?? info.coords?.longitude
        };

        axios.post(GRAPHQL_ENDPOINT, { query: quercash, variables })
          .then(response => {
            if (response?.data?.data?.cashItems?.data) {
              setSwipeData(response?.data?.data?.cashItems?.data);
              console.log('responseresponseresponse', response);
            }
            else {
              // if (!itemUploded) {

              //   setModalFirstItem(true)
              // }
            }

            setSwapRight(dataItem?.items.length > 0 ? true : myItemData?.items.length > 0 ? true : false)

          })
          .catch(error => {
            console.log('errorerror', error);

          });

      })
    } catch (error) {
    }

  };

  // const renderItem = ({ item, index }) => {
  //   return (
  //     <View>
  //       <TouchableOpacity
  //         onPress={() => {
  //           if (selectedItem?.id == item.id) {
  //             setselectedItem('');
  //             dispatch(Savematchingitem(''));
  //             setSwipeData([]);
  //             setCheckCashoffer(false);
  //           } else {
  //             setselectedItem(item);
  //           }
  //         }}
  //         style={{
  //           ...styles.imageview,
  //           borderColor:
  //             selectedItem?.id == item?.id ? Colors.btncolor : Colors.white,
  //         }}>
  //         <FastImage
  //           style={{
  //             ...styles.imagedesign,
  //             borderColor:
  //               selectedItem?.id == item.id ? Colors.btncolor : Colors.white,
  //           }}
  //           source={{
  //             uri: item?.mainImageUrl,
  //             priority: FastImage.priority.high,
  //           }}
  //           resizeMode={FastImage.resizeMode.cover}
  //         />
  //       </TouchableOpacity>

  //       <ResponsiveText style={styles.selectedItemText}>
  //         {`${selectedItem?.title}`}
  //       </ResponsiveText>
  //     </View>

  //   );
  // };

  //console.log('length ------>>>>>>', swipeData)

  const renderItem = ({ item, index }) => {
    const isSelected = selectedItem?.id === item.id;

    return (
      <View style={{}}>
        <TouchableOpacity
          onPress={() => {
            if (isSelected) {
              setselectedItem('');
              dispatch(Savematchingitem(''));
              setSwipeData([]);
              setCheckCashoffer(false);
            } else {
              setselectedItem(item);
            }
          }}
          style={{
            ...styles.imageview,
            borderColor: isSelected ? Colors.btncolor : Colors.white,
          }}>
          <FastImage
            style={{
              ...styles.imagedesign,
              borderColor: isSelected ? Colors.btncolor : Colors.white,
            }}
            source={{
              uri: item?.mainImageUrl,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>

        {isSelected && (
          <ResponsiveText
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={styles.selectedItemText}>
            {selectedItem?.title}
          </ResponsiveText>
        )}
      </View>
    );
  };

  const onSwiping = (x, y) => {

    if (x > 0) {
      console.log('Swiping Right');
      if (selectedItem?.id === "$") {
        Toast.show({
          type: 'info', // 'success', 'error', 'info'
          // text1: 'Hello!',
          text2: 'You can not swipe right on the item if a Cash Offer is selected.',
          visibilityTime: 1000,
        });
        // setCashOfferModal(true)
        return
      }
    }

    if (!allowSwiprRight) {
      setShowSwipesEndModal(true)
    }

  };


  const renderFooterComponent = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (selectedItem?.id == '$') {
            setselectedItem('')
          } else {
            setselectedItem({
              id: '$',
              title: 'Cash'
            });
          }
        }}
        style={{
          ...styles.imageview,
          borderColor:
            selectedItem?.id == '$' ? Colors.btncolor : Colors.graytext,
        }}>
        <FastImage
          style={{
            ...styles.dolorimagedesign, backgroundColor: "transparent",
            borderColor:
              selectedItem?.id == '$' ? Colors.btncolor : Colors.graytext,
          }}
          source={Images.DolorSign}
          resizeMode={FastImage.resizeMode.contain}
        />
      </TouchableOpacity>
    )
  }

  const overlayLabels = {
    left: {
      title: 'NAH',
      style: {
        label: {
          backgroundColor: '#FF696150',
          borderColor: '#FF696150',
          color: '#FF6961',
          borderWidth: 1,
          fontSize: 30,
          width: wp(25),
          textAlign: 'center'

        },
        wrapper: {
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          marginTop: 20,
          marginLeft: -20
        }
      }
    },
    right: {
      title: 'YEAH',
      style: {
        label: {
          // Define the styles for the "Yeah" label
          backgroundColor: '#278c7850',
          borderColor: '#278c7850',
          color: '#278c78',
          borderWidth: 1,
          fontSize: 30,
          width: wp(30),
          textAlign: 'center'

        },
        wrapper: {
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          marginTop: 20,
          marginLeft: 20,
        }
      }
    }
  };

  if (spinner) {
    return <Spinner loading={spinner} />;
  }

  return (
    <Container style={styles.container}>
      {VideoStart ?
        <VideoPlayer
          setVideoStart={setVideoStart}
          OnSkipPress={() => OnSkipPress()}
        /> :
        <>
          <View style={styles.headerView}>
            <View style={styles.dotimg} />
            <Image
              source={Images.logoBranding}
              style={styles.logoimg}
              resizeMode="contain"
            />
            <TouchableOpacity
              hitSlop={styles.hitslop}
              onPress={() => setlogoutModal(true)}>
              <Image
                source={Images.verticaldot}
                style={styles.dotimg}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.choosebtnview}>


            {/* <Button

          title={"Switch With"}
          btnContainer={styles.rowButton}
          titleStyle={{ marginTop: 3 }}
          onPress={() => {
            setchosemodal(!chosemodal);
          }}
        /> */}
            <TouchableOpacity style={styles.imgebtnview} onPress={() => {
              if (!dontShowAgain) {
                setShowSwitchWithModal(true)
              } else {
                setchosemodal(!chosemodal);
              }
            }}>
              <Image

                source={Images.SwitchWith}
                style={styles.imagebtn}
              />
            </TouchableOpacity>

            <View style={styles.texttitleview}>
              <ResponsiveText numberOfLines={1} style={styles.choosebtntxt}>
                {selectedItem?.title ? selectedItem?.title : ' '}
              </ResponsiveText>
            </View>

            <TouchableOpacity style={styles.imgebtnview} onPress={() => {
              if (!dontShowFirstAgain) {
                setShowFirstWithModal(true)
              } else {
                setcateGaryModal(!cateGaryModal);
              }

            }}>
              <Image

                source={Images.showFirst}
                style={styles.imagebtn}
              />
            </TouchableOpacity>
            {/* <Button

          title={"Show First"}
          btnContainer={styles.showfirstbuton}
          titleStyle={{ marginTop: 3 }}

          onPress={() => {
            setcateGaryModal(!cateGaryModal);
          }}
        /> */}

          </View>
          {/*  */}
          <View style={{ flex: 1 }}>
            {swipeData?.length > 0 && swiperIndex < swipeData?.length ?

              <>
                <Swiper
                  key={swipeData[0]?.id}
                  ref={swiperRef}
                  cards={swipeData}
                  renderCard={(item, index) => {
                    if (!item?.mainImageUrl)
                      return null
                    return (
                      <View>
                        {item?.mainImageUrl ?
                          <TouchableOpacity
                            style={{ backgroundColor: 'transparent' }}
                            activeOpacity={1}
                            onPress={() =>
                            {
                              props.navigation.navigate('ItemDetail', {
                                item: item,
                                sourceItemId: selectedItem,
                                refrence: swiperRef?.current,
                                selectedItem: selectedItem,
                                SwapRight,
                                allowSwiprRight: allowSwiprRight,
                                GetItemForCashFilter: GetItemForCashFilter

                              })

                            }
                             
                            }>
                            <View style={{ position: 'relative' }}>

                              <FastImage
                                style={styles.backgroundImg}
                                source={{
                                  uri: item?.mainImageUrl,
                                  priority: FastImage.priority.high,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                                onLoadStart={() => setLoading((prev) => ({ ...prev, [index]: true }))}
                                onLoadEnd={() => setLoading((prev) => ({ ...prev, [index]: false }))}
                              >
                                {/* <ImageBackground
                        activeOpacity={0.8}
                        resizeMode="cover"
                        style={styles.backgroundImg}
                        
                        source={{ uri: item?.mainImageUrl }}> */}

                                {item?.isSwapOnly && item?.hasCashOffer != true ? (
                                  <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                      setitemforcashOffer(item),
                                        setCashoffermodal(true);
                                      setCheckCashoffer(true);
                                    }}
                                    hitSlop={styles.hitslop}
                                    style={styles.dolorSign}>
                                    <ResponsiveText style={styles.dolorsigntxt}>
                                      {'$'}
                                    </ResponsiveText>
                                  </TouchableOpacity>
                                ) : (
                                  null
                                )}

                                <View style={styles.rowView}>
                                  {allowSwiprRight == true ? <TouchableOpacity
                                    onPress={() => {
                                      if (swiperRef.current) {
                                        swiperRef.current.swipeLeft();
                                      }
                                    }}>
                                    <Image
                                      source={Images.swipeCircleCross}
                                      style={styles.crossIcon}
                                    />
                                  </TouchableOpacity> : null}
                                  <View style={styles.titleView}>
                                    <ResponsiveText numberOfLines={2} style={styles.text}>
                                      {(item?.title)?.trim()}
                                    </ResponsiveText>
                                  </View>
                                  {allowSwiprRight == true && SwapRight == false ? <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                      if (swiperRef.current) {
                                        swiperRef.current.swipeRight();
                                      }
                                    }}>
                                    <Image
                                      source={Images.swipeCircleTick}
                                      style={styles.tickIcon}
                                    />
                                  </TouchableOpacity> :

                                    <View style={styles.tickIcon} />
                                  }
                                </View>
                                {/* </ImageBackground> */}
                              </FastImage>

                              {loading[index] && (
                                <View style={{
                                  position: 'absolute',
                                  top: '50%', // Center vertically
                                  left: '50%', // Center horizontally
                                  transform: [{ translateX: -15 }, { translateY: -15 }], // Adjust to center
                                  zIndex: 1
                                }}>
                                  <ActivityIndicator size="large" color={Colors.primaryColor} />
                                </View>
                              )}

                            </View>




                          </TouchableOpacity>
                          : null
                        }
                      </View>
                    );
                  }}
                  onSwiped={cardIndex => {
                    setSwiperIndex(cardIndex);
                    if (cardIndex == swipeData?.length - 1) {
                      setSwiperIndex(0);
                      clearApolloCache(client);

                      setSwipeData([]);
                    }
                  }}

                  onSwipedAll={() => {
                    setSwipeData([]);
                    getMylistofitem()
                    // GetItemsFilter(selectedItem);
                  }}
                  onSwiping={onSwiping}
                  // onSwiping={(x, y) => onSwiping(x, y)}
                  cardIndex={swiperIndex}
                  cardVerticalMargin={0}
                  cardHorizontalMargin={0}
                  backgroundColor={'#fff'}
                  stackSeparation={0}
                  disableTopSwipe
                  disableBottomSwipe
                  disableRightSwipe={allowSwiprRight == false ? true : SwapRight}
                  disableLeftSwipe={allowSwiprRight == false ? true : false}
                  swipeBackCard
                  showSecondCard={true}
                  verticalSwipe={false}
                  overlayLabels={overlayLabels}
                  overlayOpacityHorizontalThreshold={wp(-15)}
                  stackSize={4}
                  onSwipedLeft={(index, item) => {
                    HandleSwipeLeft(item)
                  }}
                  onSwipedRight={(index, item) => {
                    handleSwipeRight(item)

                  }}
                />
              </>
              : (
                <View style={styles.emptyView}>
                  <ResponsiveText style={styles.title}>
                    {"There's nothing here!"}
                  </ResponsiveText>
                  <ResponsiveText>
                    {selectedItem == ''
                      ? 'Select your item to see results.'
                      : 'No more items here. Try changing your filter options to see more results.'}
                  </ResponsiveText>

                  <Image source={Images.emptyitem} style={styles.emtyimg} />
                </View>
              )}
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={chosemodal}
            onRequestClose={() => {
              setchosemodal(!chosemodal);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {/* <TouchableOpacity onPress={() => setchosemodal(false)} style={{ padding: 10, alignSelf: 'flex-end', position: 'absolute', top: -wp(2), right: wp(-2) }}>
                  <Image
                    source={Images.close}
                    style={{ width: wp(8), height: wp(8) }}
                  />

                </TouchableOpacity> */}
                <CloseIcon style={{ ...styles.otherCloseBtn, ...styles.closeBUtton }} onPress={() => setchosemodal(false)} />
                <ResponsiveText style={styles.modltxt}>
                  {`Select an item you'd like to swap`}
                </ResponsiveText>
                <FlatList
                  horizontal={true}
                  data={myItemData?.items}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => item.id}
                  showsHorizontalScrollIndicator={false}
                  ListHeaderComponent={renderFooterComponent}

                />

                {/* <ResponsiveText style={styles.selectedItemText}>
                  {`${selectedItem?.title}`}
                </ResponsiveText> */}

                <Button
                  //
                  onPress={() => {

                    if (selectedItem?.id) {
                      if (selectedItem?.id == '$') {
                        setCashModalVisible(true)
                        setSwapRight(myItemData?.items.length > 0 ? true : false)
                        GetItemForCashFilter()
                        dispatch(Savematchingitem(selectedItem)),
                          setchosemodal(false),
                          setQueryExecuted(false)
                        setSwiperIndex(0),
                          swiperRef.current
                            ? swiperRef.current.jumpToCardIndex(0)
                            : null;
                      }
                      else {
                        setSwapRight(false)
                        dispatch(Savematchingitem(selectedItem)),
                          setchosemodal(false),
                          setQueryExecuted(false),
                          GetItemsFilter(selectedItem);
                        setSwiperIndex(0),
                          swiperRef.current
                            ? swiperRef.current.jumpToCardIndex(0)
                            : null;
                      }
                    }

                  }}
                  title={'Continue'}
                  btnContainer={{
                    marginTop: hp(5),
                    width: wp(82),
                    opacity: selectedItem == '' ? 0.5 : 1,
                  }}
                  titleStyle={styles.btntitle}
                  // loading={loading}
                  loadingColor={Colors.secondaryColor}
                />
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={logoutModal}
            onRequestClose={() => {
              setlogoutModal(false);
            }}>
            <TouchableWithoutFeedback onPress={() => setlogoutModal(false)}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <TouchableOpacity
                    style={styles.modlbtn}
                    hitSlop={styles.hitslop}
                    onPress={() => logoutPress()}>
                    <ResponsiveText style={styles.buttonText}>
                      Sign Out
                    </ResponsiveText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modlbtn}
                    onPress={() => {
                      setlogoutModal(false)
                      props.navigation.navigate('Feedback')
                    }}>
                    <ResponsiveText style={styles.buttonTextcancel}>
                      Share Feedback
                    </ResponsiveText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modlbtn}
                    onPress={() => setlogoutModal(false)}>
                    <ResponsiveText style={styles.buttonTextcancel}>
                      Cancel
                    </ResponsiveText>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* is first install modal */}

          <Modal
            animationType="slide"
            transparent={true}
            visible={isFirstinstall}
            onRequestClose={() => {
              setisFirstinstall(false);
              dispatch(saveisFirstinstall(false));
            }}>
            <View style={styles.modalContainerfirst}>
              <View style={styles.modalContentfirst}>
                <View style={styles.topview}>
                  <Image
                    source={Images.logoBranding}
                    style={styles.houseruleImage}
                    resizeMode='contain'
                  />

                  <ResponsiveText style={styles.welcomtxt}>
                    Welcome to Switcheroo
                  </ResponsiveText>
                  <ResponsiveText style={styles.ruletext}>
                    Please Follow the House Rules
                  </ResponsiveText>

                  <ResponsiveText style={styles.headingText}>
                    Stay Safe
                  </ResponsiveText>

                  <ResponsiveText style={styles.ruletext}>
                    Prioritize your safety; exercise caution while sharing personal
                    information.
                  </ResponsiveText>
                  <ResponsiveText style={styles.headingText}>
                    Be Genuine
                  </ResponsiveText>

                  <ResponsiveText style={styles.ruletext}>
                    Swap with integrity and authenticity.
                  </ResponsiveText>
                  <ResponsiveText style={styles.headingText}>
                    Be Nice
                  </ResponsiveText>

                  <ResponsiveText style={styles.ruletext}>
                    Foster a friendly and positive community.
                  </ResponsiveText>
                  <ResponsiveText style={styles.headingText}>
                    Report Bad Behaviour
                  </ResponsiveText>
                  <ResponsiveText style={styles.ruletext}>
                    Help maintain a respectful environment by reporting any
                    inappropriate conduct.
                  </ResponsiveText>
                </View>
                {/* <TouchableOpacity
                  onPress={() => {
                    setVideoStart(true),
                      dispatch(saveisFirstinstall(false)), setisFirstinstall(false);
                  }}
                  style={styles.agreebtn}>
                  <ResponsiveText style={styles.agretxt}>Agree</ResponsiveText>
                </TouchableOpacity> */}

                <Button
                  onPress={() => {
                    setVideoStart(true),
                      dispatch(saveisFirstinstall(false)), setisFirstinstall(false);
                  }}
                  title={'Agree and Proceed'}
                  titleStyle={styles.btntitle}
                  // loading={loading}
                  loadingColor={Colors.secondaryColor}
                  btnContainer={{
                    marginTop: hp(2),
                  }}
                />


              </View>
            </View>
          </Modal>

          <CustomModal
            modalVisible={Cashoffermodal}
            setModalVisible={setCashoffermodal}
            height={hp(30)}

          >
            <View style={styles.textOffer}>
              {/* <TouchableOpacity style={styles.crosbtn} hitSlop={styles.hitslop} onPress={() => setCashoffermodal(false)}>
                <Image

                  source={Images.close}
                  style={styles.closeBUtton}
                />
              </TouchableOpacity> */}
              <CloseIcon style={{ ...styles.crosbtn, ...styles.closeBUtton }} onPress={() => setCashoffermodal(false)} />
              <ResponsiveText style={styles.cashtext}>
                Give Cash Offer
              </ResponsiveText>
              <TextInputcomp
                placeholder={'$ Enter your offer value'}
                value={cahsValue}
                onChangeText={(text) => {
                  setcahsValue(text)
                }}
                width={wp(70)}
                keyboardType="number-pad"
              />

              <Button
                title={'Give offer'}
                btnContainer={styles.offerbtn}
                onPress={() => Giveoffer()}
              />
            </View>
          </CustomModal>

          {/* category Modal show first */}
          <CustomModal
            modalVisible={cateGaryModal}
            setModalVisible={setcateGaryModal}>
            <View style={styles.categoryselect}>
              {/* <TouchableOpacity style={styles.crosbtn} hitSlop={styles.hitslop} onPress={() => setcateGaryModal(false)}>
                <Image

                  source={Images.close}
                  style={styles.closeBUtton}
                />
              </TouchableOpacity> */}
              <CloseIcon style={{ ...styles.crosbtn, ...styles.closeBUtton }} onPress={() => setcateGaryModal(false)} />
              <ResponsiveText style={styles.cashtext}>
                Select Category
              </ResponsiveText>

              <View style={styles.groupToggleContainer}>
                {['Item', 'Service'].map((group) => (
                  <TouchableOpacity
                    key={group}
                    onPress={() => {
                      setCategorySpinner(true);
                      setSelectedGroup(group)
                      setCategoryType(group === 'Item' ? 1 : 2);
                    }}
                    disabled={selectedGroup === group}
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

              {
              
              categorySpinner ? <Spinner loading={categorySpinner} /> : <>
                <ScrollView showsVerticalScrollIndicator={false}>


                  <View style={styles.categoryMain}>

                    {categoryData.map((item => {

                      return (
                        <TouchableOpacity onPress={() => handleAddCategory(item.label)}
                          style={{
                            ...styles.butonRowView,
                            borderColor: selectedCategary?.includes(item.label) ? Colors.btncolor : '#BBBBBB',
                            backgroundColor: selectedCategary?.includes(item.label) ? 'rgba(207, 160, 47, 0.05)' : Colors.backgroundColor

                          }}>

                          <ResponsiveText style={styles.labletext}>
                            {item.label}
                          </ResponsiveText>

                          <Image
                            source={selectedCategary?.includes(item.label) ? Images.activeCheck : Images.unactivecheck}
                            style={styles.checkbox}

                          />

                        </TouchableOpacity>
                      )
                    }))}

                  </View>

                </ScrollView>

                <Button
                  title={'Done'}
                  btnContainer={{ ...styles.offerbtn, marginTop: hp(1.5), marginBottom: hp(3), }}

                  onPress={() => { GetItemsFilter(selectedItem), setcateGaryModal(false) }}
                /></>}


            </View>
          </CustomModal>


          {errorModal && (
            <ErrorModal
              modalVisible={errorModal}
              setModalVisible={seterrorModal}
              errorMessage={errorMessage}
            />
          )}

        </>


      }



      <CustomModal
        modalVisible={ModalFirstItem}
        setModalVisible={setModalFirstItem}
      // height={hp(30)}

      >
        <View style={styles.textOffer}>
          {/* <TouchableOpacity style={styles.crosbtn} hitSlop={styles.hitslop} onPress={() => setModalFirstItem(false)}>
            <Image

              source={Images.close}
              style={styles.closeBUtton}
            />
          </TouchableOpacity> */}
          <CloseIcon style={{ ...styles.crosbtn, ...styles.closeBUtton }} onPress={() => setModalFirstItem(false)} />


          <ResponsiveText style={styles.texxxx}>
            You are currently swapping items for cash, to swap with an item of your own, press

            <ResponsiveText>
              {' '}
            </ResponsiveText>
            <Image
              source={Images.additeminactive}
              style={styles.btnimg}
            />
            <ResponsiveText>
              {' '}
            </ResponsiveText>
            and add one.
          </ResponsiveText>





          <Button
            title={'Ok'}
            btnContainer={styles.offerbtn}
            onPress={() => setModalFirstItem(false)}
          />



          <View style={{ height: hp(2) }} />
        </View>
      </CustomModal>




      <CustomModal
        modalVisible={CreateAccountModal}
        setModalVisible={setCreateAccountModal}
      // height={hp(30)}

      >
        <View style={styles.textOffer}>
          {/* <TouchableOpacity style={styles.crosbtn} hitSlop={styles.hitslop} onPress={() => handleAccountModal()}>
            <Image

              source={Images.close}
              style={styles.closeBUtton}
            />
          </TouchableOpacity> */}
          {/* <CloseIcon style={{ ...styles.crosbtn, ...styles.closeBUtton }} onPress={() => handleAccountModal()} /> */}


          {/* <ResponsiveText style={styles.texxxx}>
            Great! You have successfully created an account. To continue swapping upload an item. It only takes a second.
          </ResponsiveText>*/}
          <ResponsiveText style={styles.texxxx}>
            You're almost there! The last step is to upload an item, and we'll show you something worth swapping it for!

          </ResponsiveText>





          <Button
            title={'Ok'}
            btnContainer={styles.offerbtn}
            onPress={() => handleAccountModal()}
          />



          <View style={{ height: hp(2) }} />
        </View>
      </CustomModal>

      {/* cash modal */}

      <CustomModal
        modalVisible={cashModalVisible}
        setModalVisible={setCashModalVisible}
      // height={hp(30)}
      >
        <View style={styles.textOffer}>
          <ResponsiveText style={[styles.texxxx, { marginTop: hp(0), }]}>
            You are now swapping with cash which means you can only make offers to buy the items. To start swapping upload an item or choose one you have already uploaded.
          </ResponsiveText>
          <Button
            title={'Ok'}
            btnContainer={styles.offerbtn}
            onPress={() => {
              setCashModalVisible(false)
            }}
          />
        </View>
      </CustomModal>


      <CustomModal
        modalVisible={RemaningSwip}
        setModalVisible={setRemaningSwip}
      // height={hp(30)}

      >
        <View style={styles.textOffer}>
          {/* <TouchableOpacity style={styles.crosbtn} hitSlop={styles.hitslop} onPress={() => handleAccountModal()}>
            <Image

              source={Images.close}
              style={styles.closeBUtton}
            />
          </TouchableOpacity> */}
          {/* <CloseIcon style={{ ...styles.crosbtn, ...styles.closeBUtton }} onPress={() => setRemaningSwip(false)} /> */}


          <ResponsiveText style={styles.texxxx}>
            {SwipeMessage}
          </ResponsiveText>





          <Button
            title={'Ok'}
            btnContainer={styles.offerbtn}
            onPress={() => setRemaningSwip(false)}
          />



          <View style={{ height: hp(2) }} />
        </View>
      </CustomModal>

      <CustomModal
        modalVisible={NewStoreUpdate}
        setModalVisible={setNewStoreUpdate}
      // height={hp(30)}

      >
        <View style={styles.textOffer}>

          <Image
            source={Images.Newupdate}
            style={{ width: wp(20), height: wp(20) }}
          />
          <ResponsiveText style={styles.textstore}>
            A new version of Switcheroo is ready for you with exciting features, performance improvements, and bug fixes. Update now to get the best experience!
          </ResponsiveText>
          <Button
            title={'Update'}
            btnContainer={styles.offerbtn}
            onPress={() => GotoStore()}
          />


        </View>

      </CustomModal>

      {/* switch with modal  */}

      <CustomModal
        modalVisible={showSwitchWithModal}
        setModalVisible={setShowSwitchWithModal}
      //height={hp(24)}

      >
        <View style={{}}>
          <CloseIcon style={{ ...styles.crosbtn, ...styles.closeBUtton, ...{ right: Platform.OS === 'android' ? -wp(4) : -wp(3), } }} onPress={() => {
            setShowSwitchWithModal(false)
            setchosemodal(!chosemodal);
          }} />
          <ResponsiveText style={[styles.cashtext, { marginTop: hp(2) }]}>
            This is for selecting the item you want to swap for something else.
          </ResponsiveText>

          <TouchableOpacity style={styles.remembermemain} activeOpacity={0.8} onPress={() => setSwitchWithShow(!isSwitchWithShow)}>
            <Image
              source={isSwitchWithShow ? Images.checkbox : Images.uncheckbox}
              style={styles.checkbox}
            />
            <ResponsiveText style={styles.remembertext}>
              {`Don't show again`}
            </ResponsiveText>
          </TouchableOpacity>

          <Button
            title={'OK'}
            btnContainer={[styles.offerbtn, { marginTop: hp(2) }]}
            onPress={() => handleShowAgain()}
          />
        </View>
      </CustomModal>


      <CustomModal
        modalVisible={showFirstModal}
        setModalVisible={setShowFirstWithModal}
      // height={hp(27)}

      >
        <View style={{}}>
          <CloseIcon style={{ ...styles.crosbtn, ...styles.closeBUtton }} onPress={() => {
            setShowFirstWithModal(false)
            setcateGaryModal(!cateGaryModal);
          }} />
          <ResponsiveText style={[styles.cashtext, { marginTop: hp(2) }]}>
            Choose the category (or categories!) of items you'd like to see first.
          </ResponsiveText>

          <TouchableOpacity style={styles.remembermemain} activeOpacity={0.8} onPress={() => setShowFirstCheck(!isShowFirstCheck)}>
            <Image
              source={isShowFirstCheck ? Images.checkbox : Images.uncheckbox}
              style={styles.checkbox}
            />
            <ResponsiveText style={styles.remembertext}>
              {`Don't show again`}
            </ResponsiveText>
          </TouchableOpacity>

          <Button
            title={'OK'}
            btnContainer={[styles.offerbtn, { marginTop: hp(2) }]}
            onPress={() => handleShowFirstAgain()}
          />
        </View>
      </CustomModal>


      <CustomModal
        modalVisible={showSwipesEndModal}
        setModalVisible={setShowSwipesEndModal}
        height={hp(30)}

      >
        <View style={{}}>
          <CloseIcon style={{ ...styles.crosbtn, ...styles.closeBUtton }} onPress={() => {
            setShowSwipesEndModal(false)
          }} />
          <ResponsiveText style={[styles.cashtext, { marginTop: hp(2) }]}>
            You are out of swipes for the day, come back tomorrow.
          </ResponsiveText>

          <Button
            title={'OK'}
            btnContainer={[styles.offerbtn]}
            onPress={() => {
              setShowSwipesEndModal(false)
            }}
          />
        </View>
      </CustomModal>

      <CustomModal
        modalVisible={cashOfferModal}
        setModalVisible={setCashOfferModal}
        height={hp(23.5)}

      >
        <View style={{}}>
          <CloseIcon style={{ ...styles.crosbtn, ...styles.closeBUtton }} onPress={() => {
            setCashOfferModal(false)
          }} />
          <ResponsiveText style={[styles.cashModalText, { marginTop: hp(2) }]}>
            You cannot swipe right on the item if a Cash Offer is selected.
          </ResponsiveText>

          <Button
            title={'OK'}
            btnContainer={[styles.offerbtn]}
            onPress={() => {
              setCashOfferModal(false)
            }}
          />
        </View>
      </CustomModal>

      {/* location enabler Modal */}

      <CustomModal
        modalVisible={locationEnablerModal}
      //setModalVisible={setLocationEnablerModal}
      // height={hp(30)}

      >
        <View style={styles.textOffer}>

          <ResponsiveText style={styles.texxxx}>
            Location Disabled! To proceed, please enable your location services.
          </ResponsiveText>

          <Button
            title={'Enable'}
            btnContainer={styles.offerbtn}
            onPress={() => {
              setLocationEnablerModal(false)
              handleGPSEnabled();
            }}
          />

          <View style={{ height: hp(2) }} />
        </View>
      </CustomModal>


    </Container>
  );
};

export default Home;
