import {
  Alert,
  BackHandler,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  FlatList,
  TextInput,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Container from '../../../components/Container';
import styles from './styles';
import Images from '../../../components/Images';
import ResponsiveText from '../../../components/ResponsiveText';
import Colors from '../../../theme/colors';
import Button from '../../../components/Button';
import Swiper from 'react-native-deck-swiper';
import CustomModal from '../../../components/CustomModal';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../components/Responsiveui';
import TextInputcomp from '../../../components/TextInputcomp';
import Header from '../../../components/Header';
import { SuccessToast } from '../../../components/SuccessToast';
import { ErrorToast } from '../../../components/ErrorToast';
import { useCreateCashOfferMutation } from '../../../Graphql/Graphql';
import { SendCashOffer, getAddressFromLatLng, reportAnitem } from '../../../Apis/Apis';
import Carousel from 'react-native-snap-carousel';
import { CheckTheme } from '../../../helper/global';
import { CloseIcon } from '../../../components/ReviewFloating';
import { useSelector } from 'react-redux';


const { width } = Dimensions.get('window');

const ItemDetail = props => {
  const isDarkTheme = CheckTheme()

  let previousdata = props?.route?.params?.item
  let sourceItemId = props?.route?.params?.sourceItemId
  let refrence = props?.route?.params?.refrence
  let selectedItem = props?.route?.params?.selectedItem
  let allowSwiprRight = props?.route?.params?.allowSwiprRight
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);


  console.log('selectedItemselectedItemselectedItem', allowSwiprRight);

  const [createCashOffer] = useCreateCashOfferMutation();
  const swiperRef = useRef(null);

  const [swiperData, setswiperData] = useState([previousdata?.mainImageUrl, ...previousdata.imageUrls])
  const [cardIndex, setcardIndex] = useState(0)
  const [Cashoffermodal, setCashoffermodal] = useState(false);
  const [ReportItem, setReportItem] = useState(false);
  const [ItemRepotDetailModal, setItemRepotDetailModal] = useState(false);
  const [cahsValue, setcahsValue] = useState();
  const [Location, setLocation] = useState('');
  const [Detail, setDetail] = useState('');
  const [title, settitle] = useState('');
  const [loading, serloading] = useState(false);
  useEffect(() => {

    getAddressFromLatLng(previousdata?.latitude, previousdata?.longitude)
      .then(address => setLocation(address))
      .catch(error => console.error(error.message));

  }, [])

  useEffect(() => {
    const backAction = () => {
      props.navigation.goBack();
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Clean up the event listener
  }, []);


  const reportItemHandle = async () => {

    // 

    if (!title) {
      Alert.alert('Field Required', 'Please write title of your report');
    }
    else if (!Detail) {

      Alert.alert('Field Required', 'Please write detail discreption of your report with reason');

    }
    else {
      serloading(true)
      const response = await reportAnitem(previousdata?.id, title, Detail)
      console.log('responseresponseresponse offfffffff report', response);
      if (response?.data.createItemComplaint) {
        setDetail(''),
          settitle('')
        serloading(false)

        setItemRepotDetailModal(false)
        setReportItem(false)
        SuccessToast({
          title: 'Congratulation',
          text: `Your complaint has been registered. We're on it and will get back to you soon. Thank you for letting us know!`,
        });
      }


    }

  }



  const Giveoffer = async () => {

    try {
      if (cahsValue) {

        if (selectedItem?.id == '$') {
          const response = await SendCashOffer(previousdata.id, parseInt(cahsValue))
          console.log('responseresponseresponse acccc', response);

          if (response?.data?.createCashOffer)
            // SuccessToast({
            //   title: 'Congratulation',
            //   text: 'Cash offer sent',
            // });
            setCashoffermodal(false);

          props?.route?.params?.GetItemForCashFilter()
          setcahsValue('');
        }
        else {

          createCashOffer({
            variables: {
              sourceItemId: selectedItem?.id,
              targetItemId: previousdata.id,
              cash: parseInt(cahsValue),
              sourceStatus: 1,
              targeteStatus: 1,
            },
          })
            .then(res => {

              setcahsValue('');
              console.log('createOfferResponse', res);
              if (res?.data?.createOffer?.targeteStatus == 1) {
                props.navigation.navigate('MatchingSuccess');
                setCashoffermodal(false);
              } else {
                // SuccessToast({
                //   title: 'Congratulation',
                //   text: 'Cash offer sent',
                // });
                props.navigation.navigate('TabBarNav', {
                  screen: 'Home'
                })
              }
              setCashoffermodal(false);

            })
            .catch(error => {
              setcahsValue('');

              console.log(
                'error from creating offer',
                error,
                'mesage erroro',
                error.graphQLErrors[0].message,
              );

              setCashoffermodal(false);

              // ErrorToast({
              //   title: 'Congratulation',
              //   text: error.graphQLErrors[0].message,
              // });
            });
        }
      }
      else {

      }
    } catch (error) {
      console.log('errorerror', error);
    }
  };
  const handleAccept = (item, type) => {
    try {

      console.log('item', item, '\nitemid==', sourceItemId);
      if (type == 'dismiss') {
        refrence?.swipeLeft()
        props.navigation.navigate('TabBarNav', {
          screen: 'Home'
        })

      }

      else {
        refrence?.swipeRight()
        props.navigation.navigate('TabBarNav', {
          screen: 'Home'
        })

      }




    } catch (error) {
      console.log('errorerror', error);
    }

  }


  const renderItem = ({ item, index }) => (
    <View style={[styles.imagesContainer,{width}]}>
      <ImageBackground
        key={index}
        resizeMode="cover"
        style={styles.backgroundImg}
        source={{ uri: item }}
      >
        <View style={styles.totalview}>
          <ResponsiveText style={styles.totalCount}>
            {`${index + 1}/${swiperData?.length}`}

          </ResponsiveText>
        </View>

        {previousdata?.isSwapOnly && previousdata?.hasCashOffer !== true ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setCashoffermodal(true)}
            hitSlop={styles.hitslop}
            style={styles.dolorSign}
          >
            <ResponsiveText style={styles.dolorsigntxt}>
              {'$'}
            </ResponsiveText>
          </TouchableOpacity>
        ) : null}

        <View style={styles.rowView}>
          {allowSwiprRight ? (
            <TouchableOpacity onPress={() => handleAccept(previousdata, 'dismiss')}>
              <Image source={Images.swipeCircleCross} style={styles.crossIcon} />
            </TouchableOpacity>
          ) : (
            <View style={styles.crossIcon} />
          )}

          <ResponsiveText numberOfLines={2} style={styles.text}>
            {previousdata?.title}
          </ResponsiveText>

          {!props?.route?.params?.SwapRight && allowSwiprRight ? (
            <TouchableOpacity onPress={() => handleAccept(previousdata, 'accept')}>
              <Image source={Images.swipeCircleTick} style={styles.tickIcon} />
            </TouchableOpacity>
          ) : (
            <View style={styles.tickIcon} />
          )}
        </View>
      </ImageBackground>
    </View>
  );

  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index); // Update current index when item changes
    }
  }).current;



  return (
    <Container style={styles.container}>
      <View style={styles.headerView}>
        <Header
          title={'Details'}
          onPress={() => props.navigation.goBack()}
          onLefticonPress={() => setReportItem(true)} />

      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: hp(10) }}>

        <FlatList
          ref={flatListRef}
          data={swiperData}
          renderItem={renderItem}
          horizontal={true}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          snapToInterval={width}  // Snaps to each item when scrolling
          decelerationRate="fast"  // Smooth scrolling behavior
          onScroll={({ nativeEvent }) => {
            const contentOffsetX = nativeEvent.contentOffset.x;
            const index = Math.floor(contentOffsetX / width);
            setCurrentIndex(index); // Track the scroll position
          }}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,  // Item is considered visible when 50% of it is on screen
          }}
        />

        {/* this carousel is commented because of scrolling issue instead custom swiper is used */}

        {/* <View style={styles.swiperview}>


          <Carousel
            data={swiperData}
            layout={'default'}
            renderItem={({ item, index }) => (
              <ImageBackground
                key={index}
                resizeMode='cover'
                style={styles.backgroundImg}
                source={{ uri: item }}>

                {previousdata?.isSwapOnly && previousdata?.hasCashOffer != true ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setCashoffermodal(true);
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
                  {allowSwiprRight == true ? <TouchableOpacity onPress={() => handleAccept(previousdata, 'dismiss')}>
                    <Image source={Images.swipeCircleCross} style={styles.crossIcon} />
                  </TouchableOpacity>
                    : <View style={styles.crossIcon} />}
                  <ResponsiveText numberOfLines={2} style={styles.text}>{previousdata?.title}
                  </ResponsiveText>

                  {!props?.route?.params?.SwapRight && allowSwiprRight == true ? <TouchableOpacity onPress={() => handleAccept(previousdata, 'accept')}>
                    <Image source={Images.swipeCircleTick} style={styles.tickIcon} />
                  </TouchableOpacity> :

                    <View style={styles.tickIcon} />}
                </View>

              </ImageBackground>
            )}
            sliderWidth={wp(100)}
            itemWidth={wp(95)}

          />
        </View> */}

        <View style={styles.headingView}>
          <ResponsiveText style={styles.textt}>
            {'Description:'}
          </ResponsiveText>
        </View>
        <View style={styles.secondview}>

          <ResponsiveText style={styles.textt2}>
            {previousdata?.description}
          </ResponsiveText>
        </View>
        {/* <View style={styles.headingView}>
          <ResponsiveText style={styles.textt}>
            {'Value:'}
          </ResponsiveText>
        </View> */}
        {/* <View style={styles.secondview}>

          <ResponsiveText style={styles.textt}>
            $ {previousdata?.askingPrice}
          </ResponsiveText>
        </View> */}


        <View style={styles.headingView}>
          <ResponsiveText style={styles.textt}>
            {'Location:'}
          </ResponsiveText>
        </View>
        <View style={styles.secondview}>

          <ResponsiveText style={styles.textt2}>
            {Location}
          </ResponsiveText>
        </View>




        <CustomModal
          modalVisible={Cashoffermodal}
          setModalVisible={setCashoffermodal}>
          <View style={styles.textOffer}>
            {/* <TouchableOpacity style={styles.crosbtn} onPress={() => setCashoffermodal(false)}>
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

      </ScrollView>





      <Modal
        animationType="slide"
        transparent={true}
        visible={ReportItem}
        onRequestClose={() => {
          setReportItem(false);
        }}>
        <TouchableWithoutFeedback onPress={() => setReportItem(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modlbtn}
                hitSlop={styles.hitslop}
                onPress={() => { setReportItem(false), setItemRepotDetailModal(true) }}>
                <ResponsiveText style={styles.buttonText}>
                  Report Item
                </ResponsiveText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modlbtn}
                onPress={() => setReportItem(false)}>
                <ResponsiveText style={styles.buttonTextcancel}>
                  Cancel
                </ResponsiveText>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>






      <CustomModal modalVisible={ItemRepotDetailModal} setModalVisible={setItemRepotDetailModal}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          {/* <TouchableOpacity onPress={() => setItemRepotDetailModal(false)} style={{ padding: 10, alignSelf: 'flex-end', position: 'absolute', top: -wp(9), right: wp(-5) }}>
            <Image
              source={Images.close}
              style={{ width: wp(8), height: wp(8) }}
            />
          </TouchableOpacity> */}
          <CloseIcon style={{ ...styles.crosbtn, ...styles.closeBUtton }} onPress={() => setItemRepotDetailModal(false)} />
          <TextInput
            placeholder="Title of report"
            value={title}
            onChangeText={text => settitle(text)}
            style={{ ...styles.input, marginTop: hp(2) }}

            placeholderTextColor={Colors.graytext}

          />

          <TextInput
            placeholder="write detail discreption of your report with reason"
            value={Detail}
            onChangeText={text => setDetail(text)}
            style={[styles.input, { height: 200 }]} // Make the message input taller
            multiline={true}
            placeholderTextColor={Colors.graytext}

          />
          <Button title="Report this item"
            btnContainer={{ ...styles.contactUs, marginTop: 0 }}
            loading={loading}
            disabled={loading}
            onPress={() => reportItemHandle()} />
        </View>
      </CustomModal>
    </Container>
  );
};

export default ItemDetail;
