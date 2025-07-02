import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../../components/Container';
import styles from './styles';
import Images from '../../../components/Images';
import ResponsiveText from '../../../components/ResponsiveText';
import Colors from '../../../theme/colors';
import SwipableListButton from '../../../components/SwipeAble';
import FastImage from 'react-native-fast-image';
import {
  AccetReciveOffer,
  DeleteMadeoffer,
  clearApolloCache,
} from '../../../Graphql/Graphql';
import { SuccessToast } from '../../../components/SuccessToast';
import { heightPercentageToDP as hp, widthPercentageToDP } from '../../../components/Responsiveui';
import { useApolloClient } from '@apollo/react-hooks';
import { useIsFocused } from '@react-navigation/native';
import { getMadeOffer, getReciveOffers, markNotificationAszero } from '../../../Apis/Apis';
import { useDispatch } from 'react-redux';
import { addNotificationcount } from '../../../redux/actions/userDataAction';
import { CheckTheme } from '../../../helper/global';
import { LoaderModal } from '../../../components/LoaderModal';
import { logEvent } from '../../../helper/EventsTracking';

const Listing = props => {
  const isDarkTheme = CheckTheme()

  const client = useApolloClient();
  const dispatch = useDispatch()


  const [allMadeOfer, setallMadeOfer] = useState([]);
  const [allReciveOffer, setallReciveOffer] = useState([]);
  const [isLoad, setIsLoad] = useState(false);
  const [deleteOfferMutation] = DeleteMadeoffer();
  const [acceptOffer] = AccetReciveOffer();

  useEffect(() => {

    getOffers()

    markNotificationAszero().then(Res => {
      console.log('respmmmmmmesssageee', Res);
      dispatch(addNotificationcount(0))


    })


  }, [useIsFocused()]);



  const getOffers = async () => {
    try {

      let response = await getMadeOffer()
      let recive = await getReciveOffers()


      if (recive?.data?.receivedOffers) {

        let array = []
        recive?.data?.receivedOffers.map((item) => {
          item.loading = false
          array.push(item)

        })


        const filteredOffers = array?.filter(item =>
          item?.sourceStatus == 0 || item?.targeteStatus == 0
        );


        setallReciveOffer(filteredOffers);
      }


      if (response?.data?.createdOffers) {

        let arra2 = []
        response?.data?.createdOffers.map((item) => {
          item.loading = false
          arra2.push(item)

        })
        setallMadeOfer(arra2);

      }

      console.log('responseresponseresponse maddddeee offer', response);


    } catch (error) {
      console.log('errorerror', error);

    }
  }
  const handleMadeDelte = async item => {
    try {
      setIsLoad(true)
      await deleteOfferMutation({
        variables: {
          id: item.id,
        },
      }).then(res => {
        clearApolloCache(client);
        getOffers();


        logEvent('MadeDelete', {
          delteid: item.id,
        })
        console.log('resssss de;eeeeee', res);
        // SuccessToast({
        //   title: 'Congratulation',
        //   text: 'Offer Deleted Successfully ',
        // });

        console.log(`Offer with ID ${item.id} deleted successfully!`);
      }).catch((error) => {
        clearApolloCache(client);
        getOffers();
        item.loadin = false
        console.error(`Error deleting offer: ${error.message}`);
      })
    } catch (error) {
      clearApolloCache(client);
      getOffers();
      item.loadin = false


      console.error(`Error deleting offer: ${error.message}`);
    }
    finally {
      setIsLoad(false)
    }
  };
  const handleRejectMutation = async item => {
    try {
      setIsLoad(true)
      await deleteOfferMutation({
        variables: {
          id: item.id,
        },
      }).then(res => {
        clearApolloCache(client);
        getOffers();

        logEvent('RejectOffer', {
          rejectId: item.id,
        })
      }).catch((error) => {
        clearApolloCache(client);
        getOffers();
      });
    } catch (error) {
      clearApolloCache(client);
      getOffers();
    }
    finally {
      setIsLoad(false)
    }
  };


  const handleAcceptMutation = async item => {

    try {
      setIsLoad(true)
      await acceptOffer({
        variables: {
          offerId: item.id,
        },
      }).then(res => {

        console.log('resresresres', res);
        clearApolloCache(client);
        getOffers();
      }).catch((error) => {
        console.log('errorerrorerrorerror', error);

      }).catch((error) => {
        console.log('errorerrorerrorerror', error);

        clearApolloCache(client);
        getOffers();

      });;
    } catch (error) {
      clearApolloCache(client);
      getOffers();
    }
    finally {
      setIsLoad(false)
    }
  };

  const MadeUI = ({ item, index }) => {


    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('ProductDetail', {
        item: item,
        from: 'made'
      })} style={styles.Madeuimain}>

        <View style={{ flexDirection: 'row', alignItems: "center" }}>
          <FastImage
            style={styles.uiImage}
            source={{
              uri: item?.targetItem?.mainImageUrl,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.textdiscreption}>
            <ResponsiveText numberOfLines={1} style={styles.titletext}>
              {item?.targetItem?.title}
            </ResponsiveText>

            <ResponsiveText numberOfLines={1} style={styles.descreption}>
              {item?.targetItem?.description}
            </ResponsiveText>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 5 }}>
          <ResponsiveText numberOfLines={1} style={styles.offerPriceText}>
            {`$${item?.cash}`}
          </ResponsiveText>
          <TouchableOpacity
            onPress={() => {

              handleMadeDelte(item)
            }}
            style={styles.deleteBtn}>
            {!item?.loadin ? <ResponsiveText style={styles.deleteBtntxt}>
              {'Delete'}
            </ResponsiveText> :

              <ActivityIndicator size="small" color={Colors.white}
                style={{ width: widthPercentageToDP(12) }} />
            }
          </TouchableOpacity>
        </View>

      </TouchableOpacity>
    );
  };

  const ReciveUi = ({ item, index }) => {



    // console.log('itemitemitem', item?.sourceStatus, item?.targeteStatus, item?.sourceStatus == 0 || item?.targeteStatus == 0);
    return (
      <>
        {(item?.sourceStatus == 0 || item?.targeteStatus == 0) ?
          <View style={styles.reciveMain}>

            <TouchableOpacity onPress={() => props.navigation.navigate('ProductDetail', {
              item: item,
              from: 'recive'
            })} style={styles.Madeuimain}>
              <View style={{ ...styles.Madeuimain, borderBottomWidth: 0 }}>
                <View style={styles.rowview}>
                  <FastImage
                    style={styles.uiImage}
                    source={{
                      uri: item?.targetItem?.mainImageUrl,
                      priority: FastImage.priority.high,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  <View style={styles.textdiscreption}>
                    <ResponsiveText numberOfLines={1} style={styles.titletext}>
                      {item?.targetItem?.title}
                    </ResponsiveText>

                    <ResponsiveText numberOfLines={1} style={styles.descreption}>
                      {item?.targetItem?.description}
                    </ResponsiveText>
                  </View>
                </View>

                <ResponsiveText style={styles.rate}>
                  ${item?.cash}
                </ResponsiveText>
              </View>
            </TouchableOpacity>

            <View style={styles.rowview2}>
              <TouchableOpacity
                onPress={() => handleAcceptMutation(item)}
                style={styles.acceptBtn}>
                <ResponsiveText style={styles.aceptreject}>
                  {'Accept'}
                </ResponsiveText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleRejectMutation(item)}
                style={styles.rejectBtn}>
                <ResponsiveText style={[styles.aceptreject,{color:"#FF6961"}]}>
                  {'Reject'}
                </ResponsiveText>
              </TouchableOpacity>
            </View>

          </View>



          : null}

      </>

    );
  };

  const [tab, settab] = useState('Recieve');

  return (
    <Container style={styles.container}>
      <LoaderModal loading={isLoad} />
      <View style={styles.headerView}>
        <View style={styles.dotimg} />
        <ResponsiveText style={styles.headerText}>
          {'Cash Offers'}
        </ResponsiveText>
        <TouchableOpacity>
          <View style={styles.dotimg} />
        </TouchableOpacity>
      </View>
      <View style={styles.tabrow}>
        <TouchableOpacity
          onPress={() => {
            settab('Recieve');

            getOffers();
          }}
          style={{
            ...styles.buttontext,
            borderColor:
              tab == 'Recieve' ? Colors.btncolor : `${Colors.black}20`,
          }}>
          <ResponsiveText
            style={{
              ...styles.textcolor,
              color: tab == 'Recieve' ? Colors.btncolor : Colors.graytext,
            }}>
            {'Received'}
          </ResponsiveText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            getOffers(), settab('Made');
          }}
          style={{
            ...styles.buttontext,
            borderColor:
              tab != 'Recieve' ? Colors.btncolor : `${Colors.black}20`,
          }}>
          <ResponsiveText
            style={{
              ...styles.textcolor,
              color: tab != 'Recieve' ? Colors.btncolor : Colors.graytext,
            }}>
            {'Made'}
          </ResponsiveText>
        </TouchableOpacity>
      </View>

      {tab == 'Recieve' ? (
        <ScrollView
          showsVerticalScrollIndicator={false}

          contentContainerStyle={{ paddingBottom: hp(10) }}
          style={styles.reciveview}>
          {allReciveOffer?.length > 0 ? (
            <FlatList
              data={allReciveOffer}
              renderItem={ReciveUi}
            />
          ) : (
            <View>

              <ResponsiveText style={styles.choosebtntxt}>
                {`You haven't received any offers yet.\n\nTry adding more items to increase your chances of receiving an offer!`}
              </ResponsiveText>

              <View style={styles.emptyView}>
                <Image
                  source={Images.Emptydata}
                  style={styles.emptyListStyle}
                  resizeMode='contain'
                />
              </View>
            </View>

          )}
        </ScrollView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp(10) }}
          style={styles.reciveview}>
          {allMadeOfer?.length > 0 ? (
            <FlatList data={allMadeOfer} renderItem={MadeUI} />
          ) : (
            <View>
              <ResponsiveText style={styles.choosebtntxt}>
                {`You haven't made any offers yet.\n \nTap the $ symbol to make an offer on items you like!`}
              </ResponsiveText>
              <View style={styles.emptyView}>
                <Image
                  source={Images.Emptydata}
                  style={styles.emptyListStyle}
                  resizeMode='contain'
                />
              </View>
            </View>

          )}
        </ScrollView>
      )}
    </Container>
  );
};

export default Listing;
