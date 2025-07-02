import { Alert, FlatList, Image, Modal, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Container from '../../../components/Container'
import styles from './styles'
import Images from '../../../components/Images'
import ResponsiveText from '../../../components/ResponsiveText'
import Colors from '../../../theme/colors'
import { heightPercentageToDP as hp, widthPercentageToDP, widthPercentageToDP as wp } from '../../../components/Responsiveui'
import { useIsFocused } from '@react-navigation/native'
import { ComplaintAgainstuser, getChatlist, markMesegecountzero, unMatchOffer } from '../../../Apis/Apis'
import moment from 'moment/moment';
import { useDispatch } from 'react-redux'
import { addmessageCount } from '../../../redux/actions/userDataAction'
import CustomModal from '../../../components/CustomModal'
import Button from '../../../components/Button'
import { SuccessToast } from '../../../components/SuccessToast'
import { CloseIcon } from '../../../components/ReviewFloating'
import { clearApolloCache } from '../../../Graphql/Graphql'
import { useApolloClient } from '@apollo/react-hooks';

const Message = (props) => {

  const [message, setmessages] = useState('')
  const [messageData, setmessageData] = useState()
  const [MessageDefaultList, setMessageDefaultList] = useState()
  const [SelectedItemData, setSelectedItemData] = useState('')
  const [reportUser, setreportUser] = useState(false)
  const [userRepotDetailModal, setuserRepotDetailModal] = useState(false);
  const [loading, setloading] = useState(false);
  const [Detail, setDetail] = useState('');
  const [title, settitle] = useState('');
  const dispatch = useDispatch()
  const [unmatchModal, setunmatchModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh
  const [filterOption, setFilterOption] = useState('recent'); // default filter
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const client = useApolloClient();
  // const getAllmesagelist = () => {
  //   // clearApolloCache(client);
  //   getChatlist().then(res => {
  //     console.log('getChatlistgetChatlist', res.data.chat);
  //     setmessageData(res.data.chat)
  //     setMessageDefaultList(res.data.chat)
  //     setRefreshing(false);
  //   }).catch(error => {
  //     console.log('errejrlkj', error);
  //     setRefreshing(false);
  //   })

  // }

  const getAllmesagelist = () => {
    // clearApolloCache(client);

    getChatlist().then(res => {
      //console.log('getChatlistgetChatlist', res.data.chat);

      // Sort the messages by createdAt in descending order (latest first)
      const sortedMessages = res?.data?.chat.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setmessageData(sortedMessages);
      setMessageDefaultList(sortedMessages);
      setRefreshing(false);
    }).catch(error => {
      console.log('Error:', error);
      setRefreshing(false);
    });
  }



  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getAllmesagelist()

    }, 1000);
  }, []);


  function searchItems(messageData, searchText) {

    if (!searchText.trim()) {
      setmessageData(MessageDefaultList);
      setmessages("");
      return MessageDefaultList;
    }

    const lowerCaseSearchText = searchText.toLowerCase();
    setmessages(searchText)
    const filteredItems = messageData.filter(item => {
      // Check if any targetItem's title matches the search text
      const isTargetItemMatch = item.targetItem && item.targetItem.some(target =>
        target.title.toLowerCase().includes(lowerCaseSearchText)
      );

      // Check if any targetUser's firstName matches the search text
      const isFirstNameMatch = item.targetUser && item.targetUser.some(user =>
        user.firstName.toLowerCase().includes(lowerCaseSearchText)
      );

      return isTargetItemMatch || isFirstNameMatch; // At least one condition must be true
    });

    console.log('filteredItemsfilteredItems', filteredItems);
    setmessageData(filteredItems.length > 0 ? filteredItems : MessageDefaultList)
    return filteredItems;
  }


  const MessageListCard = ({ item, index, props, setSelectedItemData, setreportUser }) => {
    const [showDot, setShowDot] = useState(!item?.messageReadAt || false)


    let isIamTargetUser = item?.sourceItem[0]?.id == item?.offer?.sourceItemId
    console.log('isIamTargetUserisIamTargetUser', isIamTargetUser);

    const [completeSwap, setCompleteSwap] = useState(
      item?.offer?.confirmedBySourceUser == true && item?.offer?.confirmedByTargetUser == true ? 'rgba(39, 140, 120, .3)' : isIamTargetUser && item?.offer?.confirmedByTargetUser ? 'rgba(219, 172, 59, .3)' :
        !isIamTargetUser && item?.offer?.confirmedBySourceUser == true ? 'rgba(219, 172, 59, .3)' :
          '#ffffff')
    return (
      <TouchableOpacity onPress={() => {
        setShowDot(false);
        props.navigation.navigate('CHattscreen', {
          item: item
        })
      }} style={[styles.mesageview,
      { backgroundColor: completeSwap }
      ]}>

        <View style={styles.imageView}>
          <TouchableOpacity
            hitSlop={styles.hitslop}
            // onPress={() => props.navigation.navigate('ProductDetail', {
            //   item: item,
            //   from: 'Message'
            // })}

            onPress={() => {
              props.navigation.navigate('ProductDetail', {
                item: item,
                from: 'Message'
              })
            }
            }
          >


            <Image
              source={{ uri: item?.cash ? item?.targetItem[0]?.mainImageUrl : item?.sourceItem[0]?.mainImageUrl }}
              style={styles.targetitem}
            />

          </TouchableOpacity>

          <View>

            <View style={styles.messagetext}>


              {item?.cash ?
                <ResponsiveText numberOfLines={1} style={{ ...styles.cashofercass }}>
                  ${item?.cash}
                </ResponsiveText>
                : null}
              {!item?.cash ?

                null
                :
                <Image style={styles.dolorsig}
                  source={Images.DolorSign}
                  resizeMode='contain'
                />
              }

              {!item?.cash ? <ResponsiveText numberOfLines={1} style={{ ...styles.targettitle, }}>
                {item?.targetItem[0]?.title}
              </ResponsiveText>
                :
                <ResponsiveText numberOfLines={1} style={{ ...styles.dolortarget, }}>
                  {item?.targetItem[0]?.title}
                </ResponsiveText>
              }

              {!item?.cash ?

                <Image style={{ ...styles.swapwith, }}
                  source={Images.matchSwap}
                />
                :
                null

              }


              {item?.cash ?
                null
                :

                <ResponsiveText numberOfLines={1} style={{ ...styles.sourcetitle }}>
                  {item?.sourceItem[0]?.title}
                </ResponsiveText>}



              {/* <ResponsiveText numberOfLines={1} style={styles.lastmessage}>
              {item?.messageText}
            </ResponsiveText> */}
            </View>


            <ResponsiveText style={styles.nametxt}>
              {`  ${item?.targetUser[0]?.firstName}`}
            </ResponsiveText>
          </View>

        </View>

        {showDot ? <View style={styles.dotes} /> : <View style={{
          width: wp(3),
          height: wp(3),
        }} />}
        <TouchableOpacity onPress={() => { setSelectedItemData(item), setreportUser(true) }} hitSlop={styles.hitslop}>
          <Image
            source={Images.verticaldot}
            style={styles.dotimg}
            resizeMode="contain"
          />
        </TouchableOpacity>
        {/* {!item?.messageReadAt && <View style={styles.badge} />} */}

      </TouchableOpacity>
    )
  }

  useEffect(() => {
    getAllmesagelist()
    markMesegecountzero().then(Res => {
      console.log('respmmmmmmesssageee', Res);
      dispatch(addmessageCount(0))


    })

  }, [useIsFocused()])

  const handleReportauser = async () => {

    try {

      if (!title) {
        Alert.alert('Field Required', 'Please write title of your report');
      }
      else if (!Detail) {

        Alert.alert('Field Required', 'Please write detail discreption of your report with reason');

      }
      else {

        setloading(true)

        console.log(SelectedItemData?.targetUser[0]?.id, 'SelectedItemDataSelectedItemData')

        let responsereport = await ComplaintAgainstuser(SelectedItemData?.targetUser[0]?.id, title, Detail)
        if (responsereport) {
          setloading(false)

          setreportUser(false), setuserRepotDetailModal(false)
          SuccessToast({
            title: 'Congratulation',
            text: `Your complaint has been registered. We're on it and will get back to you soon. Thank you for letting us know!`,
          });
        }
        setDetail('')
        settitle('')
        setloading(false)

        console.log('responsereportresponsereportresponsereport', responsereport);

      }





    } catch (error) {

    }
  }


  const unMatchCall = async () => {
    try {

      console.log('sender?.offerIdsender?.offerIdsender?.offerId', SelectedItemData);
      let response = await unMatchOffer(SelectedItemData?.offerId)


      setunmatchModal(false)

      getAllmesagelist()
      console.log('responseresponseresponse', response);
    } catch (error) {
      console.log('errorrrrr====>>>>', error);
    }
  }


  const applyFilter = (type) => {
    let sortedData = [...MessageDefaultList];

    switch (type) {
      case 'recent':
        sortedData?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        sortedData?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'high':
        sortedData?.sort((a, b) => {
          const priceA = a.cash ?? a.targetItem?.[0]?.askingPrice ?? 0;
          const priceB = b.cash ?? b.targetItem?.[0]?.askingPrice ?? 0;
          return priceB - priceA;
        });
        break;
      case 'low':
        sortedData?.sort((a, b) => {
          const priceA = a.cash ?? a.targetItem?.[0]?.askingPrice ?? 0;
          const priceB = b.cash ?? b.targetItem?.[0]?.askingPrice ?? 0;
          return priceA - priceB;
        });
        break;
      default:
        break;
    }

    setFilterOption(type);
    setmessageData(sortedData);
    setShowFilterMenu(false);
  };

  const renderItem = ({ item, index }) => {
    return (
      <MessageListCard item={item} index={index} props={props} setSelectedItemData={setSelectedItemData} setreportUser={setreportUser} key={index} />
    )
  }
  return (
    <Container style={styles.container}>
      <View style={styles.headerView}>

        <View style={styles.dotimg} />
        <ResponsiveText style={styles.headerText}>
          {'Matching'}
        </ResponsiveText>
        <TouchableOpacity>

          <View
            style={styles.dotimg}
          />

        </TouchableOpacity>


      </View>

      <View style={{ flexDirection: 'row', marginHorizontal: wp(6), }}>
        <View style={styles.inputview}>
          <TextInput
            value={message}
            onChangeText={(text) => { searchItems(messageData, text) }}
            style={styles.input}
            placeholder='Search conversations'
            placeholderTextColor={Colors.graytext}
          />
        </View>

        <TouchableOpacity onPress={() => setShowFilterMenu(!showFilterMenu)} style={styles.filterButton}>
          <Image source={require('../../../Images/filter_img.png')}
            style={[styles.filterIcon, { tintColor: showFilterMenu ? Colors.secondaryColor : Colors.graytext }]} />
        </TouchableOpacity>

      </View>

      {showFilterMenu && (
        <View style={styles.filterMenu}>
          <TouchableOpacity onPress={() => applyFilter('recent')}>
            <Text style={styles.filterItem}>Most Recent</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => applyFilter('oldest')}>
            <Text style={styles.filterItem}>Oldest First</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => applyFilter('high')}>
            <Text style={styles.filterItem}>Highest Value</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => applyFilter('low')}>
            <Text style={styles.filterItem}>Lowest Value</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.seprator} />


      {messageData?.length > 0 ? <FlatList
        data={messageData}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item?.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: hp(20) }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }


      />
        :
        <View style={styles.emptyView}>
          <Image
            source={Images.Emptydata}
            style={styles.emptyData}
          />
        </View>
      }




      <Modal
        animationType="slide"
        transparent={true}
        visible={reportUser}
        onRequestClose={() => {
          setreportUser(false);
        }}>
        <TouchableWithoutFeedback onPress={() => setreportUser(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>

              <TouchableOpacity
                style={styles.modlbtn}
                onPress={() => { setunmatchModal(true), setreportUser(false) }}>
                <ResponsiveText style={styles.buttonText}>
                  Unmatch
                </ResponsiveText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modlbtn}
                onPress={() => { setreportUser(false), setuserRepotDetailModal(true) }}>
                <ResponsiveText style={styles.buttonText}>
                  Report User
                </ResponsiveText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modlbtn}
                onPress={() => setreportUser(false)}>
                <ResponsiveText style={styles.buttonTextcancel}>
                  Cancel
                </ResponsiveText>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <CustomModal modalVisible={userRepotDetailModal} setModalVisible={setuserRepotDetailModal}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <CloseIcon onPress={() => setuserRepotDetailModal(false)} style={{ padding: 10, alignSelf: 'flex-end', position: 'absolute', top: -wp(5), right: wp(0), height: widthPercentageToDP(6), width: widthPercentageToDP(6) }} />
          <TextInput
            placeholder="Title of report"
            value={title}

            onChangeText={text => settitle(text)}
            style={{ ...styles.input2, marginTop: hp(2) }}
            placeholderTextColor={Colors.graytext}

          />

          <TextInput
            placeholder="write detail discreption of your report with reason"
            value={Detail}
            onChangeText={text => setDetail(text)}
            style={[styles.input2, { height: 200 }]} // Make the message input taller
            multiline={true}
            placeholderTextColor={Colors.graytext}

          />
          <Button title="Report this User"
            btnContainer={styles.contactUs}
            loading={loading}
            disabled={loading}
            onPress={() => handleReportauser()} />
        </View>
      </CustomModal>





      <CustomModal
        modalVisible={unmatchModal} setModalVisible={setunmatchModal}>

        <View style={styles.deletemodal}>
          <ResponsiveText style={styles.deletetxt}>
            Are you sure you want to unmatch this item?
          </ResponsiveText>
          <View style={styles.btnrow}>
            <Button
              title={'Yes'}
              btnContainer={styles.btn}
              onPress={() => unMatchCall()}
            />

            <Button
              title={'No'}
              btnContainer={styles.btnno}
              onPress={() => setunmatchModal(false)}
            />
          </View>

        </View>
      </CustomModal>
    </Container>
  )
}

export default Message
