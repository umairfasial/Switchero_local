

import { Image, Modal, StyleSheet, Text, TouchableOpacity, View, FlatList, RefreshControl, TouchableWithoutFeedback } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Container from '../../../components/Container'
import { styles } from './styles'
import Images from '../../../components/Images'
import ResponsiveText from '../../../components/ResponsiveText'
import { GetAllNotification, GetAllUnreadNotification, markNotificationAsRead } from '../../../Apis/Apis'
import { useIsFocused } from '@react-navigation/native'
import { heightPercentageToDP, widthPercentageToDP } from '../../../components/Responsiveui'
import Colors from '../../../theme/colors'
import { newEvents } from '../../../CustomEvents/CustomEvents'

const Notifications = (props) => {
    const [allNotifications, setAllNotifications] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const [showUnread, setShowUnread] = useState(false); // Default is showing unread notifications
    const [modalVisible, setModalVisible] = useState(false); // Control modal visibility
    const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh

    useEffect(() => {
        getNotification();
        getUnreadNotification();
    }, [useIsFocused()]);

    // useEffect to fetch unread notifications and mark them as read
    useEffect(() => {
        const fetchAndMarkNotifications = async () => {
            // First, get unread notifications
            getUnreadNotification();

            // Then, for each unread notification, mark as read
            for (const notification of unreadNotifications) {
                await markNotificationAsRead(notification?.id);  // Assuming each notification has an `id` property
            }

            // Optionally, refetch or refresh notifications state after marking as read
            // Fetch unread notifications again to reflect changes
            
            getUnreadNotification();
            getNotification();
            newEvents.emit('Notification', true)
            
        };

        fetchAndMarkNotifications();
    }, [useIsFocused()]); // This effect will run once when the component mounts

    const getNotification = async () => {
        try {
            const response = await GetAllNotification();
            console.log('All notifications:', response);
            setAllNotifications(response?.userSystemNotifications);
            setRefreshing(false)
        } catch (error) {
            console.log('All notifications error:', error);
            setRefreshing(false)
        }
    };

    const getUnreadNotification = async () => {
        try {
            const response = await GetAllUnreadNotification();
            setUnreadNotifications(response?.userUnReadSystemNotifications);
            console.log('Unread notifications:', response);
            setRefreshing(false)
        } catch (error) {
            console.log('Unread notifications error:', error);
            setRefreshing(false)
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            getNotification();
            getUnreadNotification();


        }, 1000);
    }, []);


    const handleNotification = async (item) => {

        const resp = await markNotificationAsRead(item?.id)


        let data = item?.data ? JSON.parse(item?.data) : null;

        console.log(`data appafda datadatadatadataf`, data);
        console.log(`data appafda datadatadatadataf itemmmmm`, item);
        console.log('respresprespresp', resp);


        if (item?.navigateTo == "NewCashOffer") {
            props.navigation.navigate('TabBarNav', {
                screen: 'Listing',

            })
        }


        else if (item?.navigateTo == "ConfirmationOfOfferCompletion" || item?.navigateTo == "NewMatchingOffer") {

            let data = item?.data ? JSON.parse(item?.data) : null;

            console.log(`data appafdaf`, item, data);

            if (data) {

                data.targetUser = [{
                    avatarUrl: data?.TargetItem?.CreatedByUser?.AvatarUrl,
                    createdAt: data?.TargetItem?.CreatedByUser?.CreatedAt,
                    firstName: data?.TargetItem?.CreatedByUser?.FirstName,
                    id: data?.TargetItem?.CreatedByUser?.Id,
                    lastName: data?.TargetItem?.CreatedByUser?.LastName,
                    username: data?.TargetItem?.CreatedByUser?.UserName,


                }]
                // Wrap TargetItem and SourceItem in arrays, ensuring they exist
                data.targetItem = [{

                    id: data.TargetItem?.Id,
                    createdByUserId: data.TargetItem?.CreatedByUserId,
                    description: data.TargetItem?.Description,
                    mainImageUrl: data.TargetItem?.MainImageUrl,
                    title: data.TargetItem?.Title,
                    updatedByUserId: data.TargetItem?.UpdatedByUserId,



                }]
                data.sourceItem = [{

                    id: data.SourceItem?.Id,
                    createdByUserId: data.SourceItem?.CreatedByUserId,
                    description: data.SourceItem?.Description,
                    mainImageUrl: data.SourceItem?.MainImageUrl,
                    title: data.SourceItem?.Title,
                    updatedByUserId: data.SourceItem?.UpdatedByUserId,



                }]


                // Create offer object with properties from data
                data.offer = {
                    cash: data?.Cash || 0,
                    confirmedBySourceUser: data?.ConfirmedBySourceUser || null,
                    confirmedByTargetUser: data?.ConfirmedByTargetUser || null,
                    createdAt: data?.CreatedAt || null,
                    createdByUserId: data?.CreatedByUserId || null,
                    id: data?.Id || null,
                    sourceItemId: data?.SourceItemId || null,
                    targetItemId: data?.TargetItemId || null,
                };
                data.cash = data?.Cash
                data.offerId = data?.Id

                console.log('data===-=-======>>>', data);

                props.navigation.navigate('CHattscreen', {
                    item: data
                })
                // Do something with the modified data
            }


            getNotification();
            getUnreadNotification();
            newEvents.emit('Notification', true)

        }

    }
    const getRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        const secondsInMinute = 60;
        const secondsInHour = secondsInMinute * 60;
        const secondsInDay = secondsInHour * 24;
        const secondsInMonth = secondsInDay * 30;
        const secondsInYear = secondsInDay * 365;

        if (diffInSeconds < secondsInMinute) {
            return 'Just now';
        } else if (diffInSeconds < secondsInHour) {
            const minutes = Math.floor(diffInSeconds / secondsInMinute);
            return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
        } else if (diffInSeconds < secondsInDay) {
            const hours = Math.floor(diffInSeconds / secondsInHour);
            return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
        } else if (diffInSeconds < secondsInMonth) {
            const days = Math.floor(diffInSeconds / secondsInDay);
            return days === 1 ? '1 day ago' : `${days} days ago`;
        } else if (diffInSeconds < secondsInYear) {
            const months = Math.floor(diffInSeconds / secondsInMonth);
            return months === 1 ? '1 month ago' : `${months} months ago`;
        } else {
            const years = Math.floor(diffInSeconds / secondsInYear);
            return years === 1 ? '1 year ago' : `${years} years ago`;
        }
    };


    const renderNotification = ({ item }) => {

        let data = item?.data ? JSON.parse(item?.data) : null;



        return (


            <TouchableOpacity onPress={() => {
                if (item?.type == "PROMOTIONAL") {
                    markNotificationAsRead(item?.id)
                    getNotification();
                    getUnreadNotification();
                    setTimeout(() => {

                        newEvents.emit('Notification', true)
                    }, 1000);


                }
                else {


                    handleNotification(item)
                }
            }} style={{ ...styles.notificationRow, backgroundColor: item?.isRead == false ? 'rgba(39, 140, 120, .3)' : Colors.backgroundColor }}>
                {item?.type == "PROMOTIONAL" ?

                    <Image
                        source={Images.switcherooround}
                        // source={Images.Adminlogo}
                        style={{ width: widthPercentageToDP(14), height: widthPercentageToDP(14), marginRight: 10 }}
                    />
                    :
                    (!data?.Cash || data?.Cash == 0 || data?.Cash == '') ?

                        <Image
                            source={Images.switcherooround}
                            style={{ width: widthPercentageToDP(14), height: widthPercentageToDP(14), marginRight: 10 }}
                        />

                        :
                        <Image
                            source={Images.DolorSign}
                            style={{ width: widthPercentageToDP(14), height: widthPercentageToDP(14), marginRight: 10 }}
                        />


                }

                <View>
                    <Text style={styles.notificationTitle}>{item.message}</Text>
                    <Text style={styles.notificationDate}>{getRelativeTime(item.createdAt)}</Text>
                </View>
                {/* {showUnread ? <TouchableOpacity onPress={() => markAsRead(item.id)}>
                <Image source={Images.verticaldot} style={styles.dot} />
            </TouchableOpacity> : null} */}
            </TouchableOpacity>
        )
    };

    return (
        <Container >
            <View style={styles.mainView}>
                <View style={styles.rowView}>
                    <View />

                    <ResponsiveText style={styles.title}>
                        Notifications
                    </ResponsiveText>
                    <TouchableOpacity
                        style={{ padding: 10, width: widthPercentageToDP(10) }}
                        onPress={() => setModalVisible(true)}>
                        <Image resizeMode="contain" source={Images.verticaldot} style={[styles.dot, { alignSelf: 'center' }]} />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={showUnread ? unreadNotifications : allNotifications}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: heightPercentageToDP(20) }}
                    renderItem={renderNotification}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyView}>
                            <Image
                                source={Images.EmptyNotification}
                                style={styles.emptynotification}
                            />
                            <ResponsiveText style={styles.textempty}>
                                {showUnread ? "No unread notifications." : "You don't have any notifications yet."}
                            </ResponsiveText>
                        </View>
                    )}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />

                <Modal
                    animationType="none"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}

                >
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <TouchableOpacity hitSlop={{ left: 60, right: 60, top: 30 }} onPress={() => { setShowUnread(false); setModalVisible(false); }}>
                                    <Text style={styles.modalText}>All</Text>
                                </TouchableOpacity>
                                <TouchableOpacity hitSlop={{ left: 60, right: 60, bottom: 30 }} onPress={() => { setShowUnread(true); setModalVisible(false); }}>
                                    <Text style={styles.modalText}>Unread</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        </Container>
    );
};

export default Notifications;
