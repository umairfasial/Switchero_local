import {
    Alert,
    Dimensions,
    Image,
    ImageBackground,
    Modal,
    ScrollView,
    TextInput,
    FlatList,
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
import { AccetReciveOffer, DeleteMadeoffer, clearApolloCache, useCreateCashOfferMutation } from '../../../Graphql/Graphql';
import { getAddressFromLatLng, reportAnitem } from '../../../Apis/Apis';
import { useApolloClient } from '@apollo/react-hooks';
import Carousel from 'react-native-snap-carousel';
import { CloseIcon } from '../../../components/ReviewFloating';
const { width } = Dimensions.get('window');

const ProductDetail = props => {
    let previousdata = props?.route?.params?.item
    const [swiperData, setswiperData] = useState(previousdata?.sourceItem[0] ? [previousdata?.sourceItem[0].mainImageUrl, ...previousdata?.sourceItem[0].imageUrls] : previousdata?.targetItem[0] ? [previousdata?.targetItem[0].mainImageUrl, ...previousdata?.targetItem[0].imageUrls] : [previousdata?.sourceItem?.mainImageUrl, ...previousdata?.sourceItem?.imageUrls])
    const [deleteOfferMutation] = DeleteMadeoffer();
    const [acceptOffer] = AccetReciveOffer();
    const client = useApolloClient();

    const [ReportItem, setReportItem] = useState(false);
    const [loading, serloading] = useState(false);

    const [Location, setLocation] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const [ItemRepotDetailModal, setItemRepotDetailModal] = useState(false);
    const [CounterOfferModal, setCounterOfferModal] = useState(false);
    const [Detail, setDetail] = useState('');
    const [title, settitle] = useState('');
    const [counterOfferValue, setcounterOfferValue] = useState('');
    useEffect(() => {

        if (previousdata?.sourceItem[0]) {
            getAddressFromLatLng(previousdata?.sourceItem[0]?.latitude, previousdata?.sourceItem[0]?.longitude)
                .then(address => setLocation(address))
                .catch(error => console.error(error.message));
        }

        else if (previousdata?.targetItem[0]) {
            getAddressFromLatLng(previousdata?.targetItem[0]?.latitude, previousdata?.targetItem[0]?.longitude)
                .then(address => setLocation(address))
                .catch(error => console.error(error.message));
        }
        else {
            getAddressFromLatLng(previousdata?.sourceItem?.latitude, previousdata?.sourceItem?.longitude)
                .then(address => setLocation(address))
                .catch(error => console.error(error.message));
        }


    }, [])


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
            const response = await reportAnitem(previousdata?.sourceItem[0] ? previousdata?.sourceItem[0].id : previousdata?.sourceItem.id, title, Detail)
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

    const handleAcceptMutation = async item => {


        try {
            acceptOffer({
                variables: {
                    offerId: item.id,
                },
            }).then(res => {
                clearApolloCache(client);

                clearApolloCache(client);
                props.navigation.goBack()
                SuccessToast({
                    title: 'Congratulation',
                    text: 'Offer Accepted Successfully ',
                });

            });
        } catch (error) {
            console.error(`Error deleting offer: ${error.message}`);
        }
    };


    const handleMadeDelte = async item => {
        try {
            deleteOfferMutation({
                variables: {
                    id: item.id,
                },
            }).then(res => {
                clearApolloCache(client);
                props.navigation.goBack()


                SuccessToast({
                    title: 'Congratulation',
                    text: 'Offer Deleted Successfully',
                });

            });
        } catch (error) {
            console.error(`Error deleting offer: ${error.message}`);
        }
    };

    const handleRejectMutation = async item => {
        try {
            deleteOfferMutation({
                variables: {
                    id: item.id,
                },
            }).then(res => {
                clearApolloCache(client);
                props.navigation.goBack()

                SuccessToast({
                    title: 'Congratulation',
                    text: 'Offer Rejected Successfully ',
                });

            });
        } catch (error) {
            console.error(`Error deleting offer: ${error.message}`);
        }
    };

    const handleViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems && viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index); // Update current index when item changes
        }
    }).current;


    const renderItem = ({ item, index }) => (
        <View style={{ width, justifyContent: 'center', alignItems: 'center' }}>
            <ImageBackground resizeMode='cover' style={styles.backgroundImg}
                source={{ uri: item }}>

                <View style={styles.totalview}>
                    <ResponsiveText style={styles.totalCount}>
                        {`${index + 1}/${swiperData?.length}`}

                    </ResponsiveText>
                </View>

            </ImageBackground>
        </View>
    );

    return (
        <Container style={styles.container}>
            <View style={styles.headerView}>
                {/* {props?.route?.params?.from != 'recive' ? <Header title={'Detail'} onPress={() => props.navigation.goBack()}

                    onLefticonPress={() => setReportItem(true)} />
                    : */}
                <Header title={'Detail'} onPress={() => props.navigation.goBack()} />


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

                {/* <View style={styles.swiperview}>
                    <Carousel

                        data={swiperData}
                        enableSnap={true}
                        activeSlideAlignment={'center'}

                        // layout={'stack'} layoutCardOffset={`2`}
                        renderItem={({ item, index }) => (
                            <ImageBackground resizeMode='cover' style={styles.backgroundImg}
                                source={{ uri: item }}>



                                <View style={styles.totalview}>
                                    <ResponsiveText style={styles.totalCount}>
                                        {`${index + 1}/${swiperData?.length}`}

                                    </ResponsiveText>
                                </View>

                            </ImageBackground>
                        )}
                        sliderWidth={wp(100)}
                        itemWidth={wp(95)}
                    />

                </View> */}


                <View style={styles.headingView}>
                    <ResponsiveText style={styles.textt}>
                        {'Title:'}
                    </ResponsiveText>
                </View>

                <View style={styles.secondview}>

                    <ResponsiveText numberOfLines={2} style={styles.textt2}>
                        {previousdata?.sourceItem[0] ? previousdata?.sourceItem[0].title : previousdata?.targetItem[0] ? previousdata?.targetItem[0]?.title : previousdata?.sourceItem?.title}
                    </ResponsiveText>
                </View>




                <View style={styles.headingView}>
                    <ResponsiveText style={styles.textt}>
                        {'Discription:'}
                    </ResponsiveText>
                </View>
                <View style={styles.secondview}>

                    <ResponsiveText style={styles.textt2}>
                        {previousdata?.sourceItem[0] ? previousdata?.sourceItem[0].description : previousdata?.targetItem[0] ? previousdata?.targetItem[0]?.description : previousdata?.sourceItem?.description}


                    </ResponsiveText>
                </View>



                {/* <View style={styles.headingView}>
                    <ResponsiveText style={styles.textt}>
                        {'Value:'}
                    </ResponsiveText>
                </View> */}


                {/* <View style={styles.secondview}>

                    <ResponsiveText style={styles.textt}>
                        ${previousdata?.sourceItem[0] ? previousdata?.sourceItem[0].askingPrice : previousdata?.sourceItem?.askingPrice}

                    </ResponsiveText>
                </View> */}

                {previousdata?.cash && <View style={styles.headingView}>
                    <ResponsiveText style={styles.textt}>
                        {'Cash Offer:'}
                    </ResponsiveText>
                </View>}


                {previousdata?.cash && <View style={styles.secondview}>

                    <ResponsiveText style={styles.textt2}>
                        ${previousdata?.cash}
                    </ResponsiveText>
                </View>

                }


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

                {/* {props?.route?.params?.from == 'recive' && 
                <Button
                    title={'Accept'}
                    onPress={() => handleAcceptMutation(previousdata)}
                    titleStyle={{}}
                    btnContainer={{
                        backgroundColor: Colors.secondaryColor,
                        marginTop: hp(3),
                        borderColor: '#278c78',
                    }}

                />
                } */}
                {props?.route?.params?.from == 'made' &&
                    <Button
                        title={'Delete Offer'}
                        onPress={() => handleMadeDelte(previousdata)}
                        titleStyle={{}}
                        btnContainer={{ backgroundColor: "#FF6961", marginTop: hp(6), borderColor: '#b82c2c', }}

                    />}

                {props?.route?.params?.from == 'recive' && <View style={{ ...styles.rowView, width: wp(94) }}>

                    {/* <Button
                        title={'Counter Offer'}
                        onPress={() => setCounterOfferModal(true)}
                        titleStyle={{}}
                        btnContainer={{
                            width: wp(43),
                            marginTop: hp(3),
                        }}

                    /> */}
                    <Button
                        title={'Accept'}
                        onPress={() => handleAcceptMutation(previousdata)}
                        titleStyle={{}}
                        btnContainer={{
                            backgroundColor: Colors.secondaryColor,
                            // marginTop: hp(2),
                            width: wp(43),
                            borderColor: '#278c78',
                        }}

                    />


                    <Button
                        title={'Reject'}
                        onPress={() => handleRejectMutation(previousdata)}
                        titleStyle={{}}
                        btnContainer={{
                            backgroundColor: "#FF6961",
                            borderColor: '#b82c2c',

                            // marginTop: hp(2),
                            width: wp(43)
                        }}

                    />
                </View>}



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
                                onPress={() => { setItemRepotDetailModal(true), setReportItem(false) }}>
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
                    <CloseIcon style={{ padding: 10, alignSelf: 'flex-end', position: 'absolute', top: -wp(9), right: wp(-5), width: wp(8), height: wp(8) }} onPress={() => setItemRepotDetailModal(false)} />
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
                        loading={loading}
                        disabled={loading}
                        btnContainer={{ ...styles.contactUs, marginTop: 0 }}
                        onPress={() => { reportItemHandle() }} />
                </View>
            </CustomModal>



            <CustomModal modalVisible={CounterOfferModal} setModalVisible={setCounterOfferModal}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    {/* <TouchableOpacity onPress={() => setCounterOfferModal(false)} style={{ padding: 10, alignSelf: 'flex-end', position: 'absolute', top: -wp(11), right: wp(-5) }}>
                        <Image
                            source={Images.close}
                            style={{ width: wp(8), height: wp(8) }}
                        />

                    </TouchableOpacity> */}
                    <CloseIcon style={{ padding: 10, alignSelf: 'flex-end', position: 'absolute', top: -wp(9), right: wp(-5), width: wp(8), height: wp(8) }} onPress={() => setCounterOfferModal(false)} />
                    <TextInput
                        placeholder="Enter counter offer $ value"
                        value={counterOfferValue}
                        onChangeText={text => setcounterOfferValue(text)}
                        style={styles.input}
                        placeholderTextColor={Colors.graytext}
                    />

                    <Button title="Send a Counter Offer"
                        btnContainer={styles.contactUs2}
                        onPress={() => { setCounterOfferModal(false) }} />
                </View>
            </CustomModal>
        </Container>
    );
};

export default ProductDetail;
