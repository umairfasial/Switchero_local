import { ImageBackground, ScrollView, StyleSheet, View, Platform, FlatList, Dimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Container from '../../../components/Container';
import ResponsiveText from '../../../components/ResponsiveText';
import Colors from '../../../theme/colors';
import Button from '../../../components/Button';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../components/Responsiveui';
import Header from '../../../components/Header';
import { getAddressFromLatLng, reportAnitem } from '../../../Apis/Apis';
import Carousel from 'react-native-snap-carousel';
import { Fonts } from '../../../theme/Fonts';
const { width } = Dimensions.get('window');

const MyItemDetail = props => {
    let previousdata = props?.route?.params?.item
    const [swiperData, setswiperData] = useState(previousdata && [previousdata?.mainImageUrl, ...previousdata?.imageUrls])
    const [Location, setLocation] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const headerTitle = previousdata?.offeringId === 1 ? "My Item Detail" : "My Service Detail"

    useEffect(() => {

        if (previousdata) {
            getAddressFromLatLng(previousdata?.latitude, previousdata?.longitude)
                .then(address => setLocation(address))
                .catch(error => console.error(error.message));
        }

    }, [])

    const handleViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems && viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index); // Update current index when item changes
        }
    }).current;


    return (
        <Container style={styles.container}>
            <View style={styles.headerView}>
                <Header title={headerTitle} onPress={() => props.navigation.goBack()} />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: hp(10) }}>

                <FlatList
                    ref={flatListRef}
                    data={swiperData}
                    //renderItem={renderItem}
                    renderItem={({ item, index }) => (
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
                    )}
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
                        {previousdata?.title}
                    </ResponsiveText>
                </View>

                <View style={styles.headingView}>
                    <ResponsiveText style={styles.textt}>
                        {'Discription:'}
                    </ResponsiveText>
                </View>
                <View style={styles.secondview}>

                    <ResponsiveText style={styles.textt2}>
                        {previousdata?.description}
                    </ResponsiveText>
                </View>

                {previousdata?.askingPrice > 0 && <View style={styles.headingView}>
                    <ResponsiveText style={styles.textt}>
                        Cash Offer:
                    </ResponsiveText>
                </View>}

                {previousdata?.askingPrice > 0 && <View style={styles.secondview}>

                    <ResponsiveText style={styles.textt2}>
                        {`$${previousdata?.askingPrice || 0}`}
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

            </ScrollView>

        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerView: {
        paddingTop: hp(Platform.OS == 'ios' ? 5.5 : -1),

        paddingBottom: hp(1),
        paddingHorizontal: wp(2)
    },
    totalview: {
        alignItems: 'flex-end',
        marginBottom: hp(2),
        marginHorizontal: wp(3),
    },
    totalCount: {
        backgroundColor: `${Colors.darkGray}60`,
        padding: wp(1.5),
        paddingHorizontal: wp(3.5),
        fontSize: 16,
        fontFamily: Fonts.FontssemiBold,
        color: Colors.btncolor,
        borderRadius: 4,
    },
    headerText: {
        fontSize: 16,
        color: Colors.darkBlack,
        fontFamily: Fonts.FontsExtraBold

    },
    textOffer: {
        alignItems: "center",
        justifyContent: "center"
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
        backgroundColor: Colors.btncolor,
        alignSelf: 'flex-end',
        right: wp(3),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp(2),
        borderRadius: wp(11)
    },
    hitslop: { top: 50, bottom: 50, right: 50, left: 50 },
    offerbtn: {
        width: wp(73),
        marginTop: hp(4)
    },

    dolorSigndisable: {

        width: wp(13),
        height: wp(13),
        backgroundColor: `${Colors.btncolor}90`,
        alignSelf: 'flex-end',
        right: wp(3),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp(2),
        borderRadius: wp(11)
    },
    cashtext: {
        fontSize: 18,
        fontFamily: Fonts.FontssemiBold,
        color: Colors.black
    },
    closeBUtton: {
        width: wp(8),
        height: wp(8),
        position: 'absolute',
        right: -wp(10),
        alignSelf: 'flex-end',
        bottom: -5,
        left: wp(35)
    },
    dotimg: {
        width: wp(1.5),
        height: wp(4)
    },
    backgroundImg: {
        width: wp(96),
        height: hp(50),
        borderRadius: 20,
        alignSelf: 'center',
        overflow: 'hidden',
        // marginTop: hp(2),
        justifyContent: 'flex-end',
    },
    rowView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(3),
        // backgroundColor: "red",
        alignSelf: "center",
        marginBottom: hp(Platform.OS == 'ios' ? 3 : 1)
    },
    rowViewbutton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    },
    secondview: {
        marginTop: hp(2),
        paddingHorizontal: wp(4),

    },
    textt: {
        fontSize: 16,
        color: '#4f4f4f',
        width: wp(60),
        fontFamily: Fonts.FontsBlack

    },
    textt2: {
        fontSize: 16,
        color: '#4f4f4f',
        width: wp(60),

    },
    headingView: {
        marginTop: hp(2),
        backgroundColor: `${Colors.graytext}60`,
        width: wp(100),
        paddingHorizontal: wp(4),
        paddingVertical: wp(2)

    },
    swiperview: {
        width: wp(96),
        height: hp(50),

    },
    input: {
        width: wp(80),
        height: 40,
        borderColor: Colors.btncolor,
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        verticalAlign: 'top',
        color: Colors.black
    },
    contactUs: {
        marginTop: hp(2),
        width: wp(45),
        height: hp(5)
    },

    contactUs2: {
        marginTop: hp(2),
        width: wp(65),
        height: hp(5)
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modalContent: {
        backgroundColor: 'white',
        width: wp(100),
        padding: 20,
        alignItems: 'flex-start',

    },
    modlbtn: {
        width: wp(100),
        paddingVertical: 10
    },
    buttonText: {
        fontSize: 16,
        color: '#FF6961',

    },
    buttonTextcancel: {
        fontSize: 16,
        color: Colors.black,
    },



})

export default MyItemDetail;
