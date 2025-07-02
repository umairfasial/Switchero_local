import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import Container from '../../../components/Container';
import styles from './styles';
import Header, { HeaderleftImage } from '../../../components/Header';
import { Alert, Modal, View, TouchableWithoutFeedback, TouchableOpacity, TextInput, Image, Platform, Text, ActivityIndicator, BackHandler } from 'react-native';
import Button from '../../../components/Button';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../components/Responsiveui';
import ResponsiveText from '../../../components/ResponsiveText';
import CustomModal from '../../../components/CustomModal';
import { ComplaintAgainstuser, GRAPHQL_ENDPOINT, confirmOffer, createMessage, getallchMessages, markmessageasread, unMatchOffer } from '../../../Apis/Apis';
import { useGetMyNameQuery } from '../../../Graphql/Graphql';
import moment from 'moment/moment';

import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import Colors from '../../../theme/colors';
import { SuccessToast } from '../../../components/SuccessToast';
import Images from '../../../components/Images';
import { CloseIcon } from '../../../components/ReviewFloating';
import { useSelector } from 'react-redux';


const CHattscreen = (props) => {
    let sender = props.route.params.item;
    const [Detail, setDetail] = useState('');
    const [title, settitle] = useState('');
    const [reportUser, setreportUser] = useState(false)
    const [Loading, setLoading] = useState(false)
    const loggedInUserId = useSelector(response => {
        return response?.userdataReducer.totalScore;
      });

    const [defaultMessageshow, setdefaultMessageshow] = useState(false)
    const [userRepotDetailModal, setuserRepotDetailModal] = useState(false);
    const [DisableBtn, setDisableBtn] = useState(sender?.offer?.confirmedBySourceUser == true && sender?.offer?.confirmedByTargetUser == true);

    let isIamTargetUser = sender?.sourceItem[0]?.id == sender?.offer?.sourceItemId


    const targetUser = {
        firstName: sender?.targetUser[0]?.firstName,
        userProfileUrl: sender?.targetUser[0]?.avatarUrl,
        userId: sender?.targetUser[0]?.id
    }

    const [completeSwap, setCompleteSwap] = useState(
        sender?.offer?.confirmedBySourceUser == true && sender?.offer?.confirmedByTargetUser == true ? '#30B69C' : isIamTargetUser && sender?.offer?.confirmedByTargetUser ? '#DBAC3B' :
            !isIamTargetUser && sender?.offer?.confirmedBySourceUser == true ? '#DBAC3B' :
                '#BDBDBD')

    useEffect(() => {
        const backAction = () => {
            props.navigation.goBack();
            return true; // Prevent default back action
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        if (sender?.sourceItem[0]?.id == sender?.offer?.sourceItemId && sender?.offer?.confirmedByTargetUser == true) {
            setDisableBtn(true)
        }

    }, [])

    const handleReportauser = async () => {

        try {

            if (!title) {
                Alert.alert('Field Required', 'Please write title of your report');
            }
            else if (!Detail) {

                Alert.alert('Field Required', 'Please write detail discreption of your report with reason');

            }
            else {



                let responsereport = await ComplaintAgainstuser(sender?.targetUser[0]?.id, title, Detail)
                if (responsereport) {
                    setreportUser(false), setuserRepotDetailModal(false)
                    setDetail('')
                    settitle('')
                    SuccessToast({
                        title: 'Congratulation',
                        text: `Your complaint has been registered. We're on it and will get back to you soon. Thank you for letting us know!`,
                    });
                }



            }





        } catch (error) {

        }
    }

    const unMatchCall = async () => {
        try {

            let response = await unMatchOffer(sender?.offerId)
            setunmatchModal(false)
            props.navigation.navigate('TabBarNav', {
                screen: 'Message'
            })

        } catch (error) {
        }
    }

    console.log('sendersender', sender);


    const [messages, setMessages] = useState([]);
    const connection = new HubConnectionBuilder()
        .withUrl(`${GRAPHQL_ENDPOINT}/chatHub`, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets
        })

        .build();
    useEffect(() => {
        // Start the connection
        const startConnection = async () => {
            try {
                connection.start()
                    .then(() => {
                        connection.on('ReceiveMessage', (message) => {

                            console.log('messagemessagemessage------>', sender, message);
                            if (sender?.offerId == message?.offerId) {
                                const formateMessage = {
                                    _id: message.id,
                                    text: message.messageText,
                                    createdAt: moment(message.createdAt).toDate(),
                                    user: {
                                        _id: message.createdByUserId,
                                        // name: message.targetUser[0]?.firstName || 'Unknown', // Adjust according to your data
                                        // avatar: message.targetUser[0]?.avatarUrl,
                                    },
                                    // Other properties you might need
                                }

                                setMessages((previousMessages) =>
                                    GiftedChat.append(previousMessages, formateMessage)
                                );

                            }


                            // Handle received messages here
                        });
                    })
                    .catch(err => { });
                // await connection.start();

            } catch (err) {
            }
        };

        startConnection();

        return () => {
            connection.stop()
                .then(() => { })
                .catch(err => console.error('SignalR Disconnection Error: ', err));
        };
    }, []);

    const [unmatchModal, setunmatchModal] = useState(false);

    const {
        data: mydata,
        loading: myloading,
        error,
        refetch: refresshPmydata,
    } = useGetMyNameQuery({
        fetchPolicy: 'network-only',
    });
    //console.log('check data---->',mydata)
    let myid = mydata?.me.id;

    useEffect(() => {
        markmessageasread(sender?.offerId)
        if (mydata) {
            getListofmessages()
        }
        // messaging().onMessage(async remoteMessage => {

        //     getListofmessages()
        // })
    }, [mydata]);


    const getListofmessages = () => {
        // getallchMessages(sender?.offerId).then(res => {
        //     const formattedMessages = res.data.messages.map(msg => ({
        //         _id: msg.id,
        //         text: msg.messageText,
        //         createdAt: moment(msg.createdAt).toDate(),
        //         user: {
        //             _id: msg.createdByUserId,
        //             name: msg.targetUser[0]?.firstName || 'Unknown', // Adjust according to your data
        //             avatar: msg.targetUser[0]?.avatarUrl,
        //         },
        //         // Other properties you might need
        //     }));

        //     formattedMessages.sort((a, b) => b.createdAt - a.createdAt);

        //     console.log('formattedMessagesformattedMessages', formattedMessages);


        //     setMessages(formattedMessages)
        //     if (formattedMessages?.length <= 0) { setdefaultMessageshow(true) } else {
        //         setdefaultMessageshow(false)
        //     }
        // }).catch(
        //     eror => {
        //     }
        // )

        getallchMessages(sender?.offerId)
            .then(res => {
                const formattedMessages = res.data.messages.map(msg => {
                    // Ensure the message and user information is formatted correctly
                    const formattedMessage = {
                        _id: msg.id,
                        text: msg.messageText,
                        createdAt: moment(msg.createdAt).toDate(),  // Format createdAt properly
                        user: {
                            _id: msg.createdByUserId,  // Ensure the sender's user ID is correctly assigned
                            name: msg.targetUser && msg.targetUser[0]?.firstName
                                ? msg.targetUser[0].firstName
                                : 'Unknown',  // Fallback to 'Unknown' if no name is provided
                            avatar: msg.targetUser && msg.targetUser[0]?.avatarUrl
                                ? msg.targetUser[0].avatarUrl
                                : '',  // Fallback to empty string if no avatar is provided
                        },
                    };

                    return formattedMessage;
                });

                // Sort messages by creation date, descending order
                formattedMessages.sort((a, b) => b.createdAt - a.createdAt);

                console.log('Formatted Messages:', formattedMessages);

                // Set the formatted messages to state
                setMessages(formattedMessages);

                // Handle the default message state
                if (formattedMessages.length <= 0) {
                    setdefaultMessageshow(true);
                } else {
                    setdefaultMessageshow(false);
                }
            })
            .catch(error => {
                console.error('Error fetching messages:', error);
            });

    }

    const onSend = (newMessages) => {
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, newMessages)
        );

        createMessage(newMessages[0].text, sender?.offerId, sender.cash).then(res => {
            // getListofmessages()
        }).catch(erorr => {
        })
    };

    const renderDefaultMessage = () => {
        if (messages.length === 0 && defaultMessageshow) {
            return (
                <View style={{
                    alignItems: 'center', marginTop: 20,
                    alignSelf: 'center', position: 'absolute',
                    backgroundColor: "#097de3", bottom: hp(12),
                    borderRadius: 20, padding: 15, marginHorizontal: 4
                }}>
                    <ResponsiveText style={{ color: '#fff', fontSize: 16 }}>
                        Amazing, you've made a match. Be the first to set up a safe place to meet.
                    </ResponsiveText>
                </View>
            );
        }
        return null;
    };
    const onCompleteSwipe = () => {
        // confirm

        console.log('complete confirm offerrrr', sender, sender?.offerId);
        setLoading(true)
        confirmOffer(sender?.offer?.id).then(res => {

            console.log('sendersendersendersender', res?.data?.confirmOffer


            )
            setLoading(false)

            if (res?.data?.confirmOffer?.confirmedBySourceUser == true && res?.data?.confirmOffer?.confirmedByTargetUser == true) {
                setCompleteSwap('#30B69C')
                setDisableBtn(true)

            }
            else if (res?.data?.confirmOffer?.confirmedBySourceUser == '' && res?.data?.confirmOffer?.confirmedByTargetUser == '') {
                setCompleteSwap('#BDBDBD')
            }

            else {

                setCompleteSwap('#DBAC3B')
            }

        }).catch(
            eror => {

                setLoading(false)

                console.log("eror", eror)

            }
        )

    }
    return (
        <Container style={styles.container}>
            <View style={styles.headerView}>
                {/* <HeaderleftImage title={sender?.targetItem[0]?.title}
                    onPress={() => props.navigation.goBack()}
                    onUnmatchPress={() => setunmatchModal(true)}
                /> */}
                <Header
                    title={sender}
                    profilePress={() => {
                        props.navigation.navigate('MatchedUserProfile', {
                            userId: targetUser?.userId
                        })
                    }}
                    targetUserProfile={targetUser}
                    onTitlePress={() => {
                        props.navigation.navigate('ProductDetail', {
                            item: sender,
                            from: 'Message'
                        })
                    }}
                    onPress={() => props.navigation.goBack()}
                    chat={true}
                    onLefticonPress={() => setreportUser(true)} />

                {sender.cash ? null : <TouchableOpacity disabled={Loading ? Loading : DisableBtn} onPress={onCompleteSwipe} style={[styles.completeView, { backgroundColor: completeSwap }]}>
                    {Loading ?
                        <ActivityIndicator size="small" color={Colors.white} />

                        : <Text style={[styles.completeTxt, { color: Colors.white }]}>Complete Swap</Text>}
                </TouchableOpacity>}
            </View>

            {renderDefaultMessage()}

            <GiftedChat
                messages={messages}
                onSend={(messages) => onSend(messages)}
                user={{
                    _id: mydata?.me.id,
                }}
                messagesContainerStyle={{ paddingBottom: 20 }}

                renderAvatar={null}

                textInputProps={{
                    style: {
                        color: 'black',
                        flex: 1,
                        // width: wp(80),
                        marginBottom: Platform.OS == 'ios' ? 10 : 0,
                        paddingHorizontal: 10,
                        maxHeight: hp(25),
                    }
                }}
                bottomOffset={Platform.OS == 'ios' ? 30 : 0}

            />
            {Platform.OS == 'ios' ? <View style={{ height: hp(3) }} /> : null}
            {/* <Button
                title="Unmatch"
                btnContainer={{ marginTop: hp(2), }}
                onPress={() => { setunmatchModal(true) }}
            /> */}

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

                    {/* <TouchableOpacity onPress={() => setuserRepotDetailModal(false)} style={{ padding: 10, alignSelf: 'flex-end', position: 'absolute', top: -wp(9), right: wp(-5) }}>
                        <Image
                            source={Images.close}
                            style={{ width: wp(8), height: wp(8) }}
                        />

                    </TouchableOpacity> */}
                    <CloseIcon style={{ padding: 10, alignSelf: 'flex-end', position: 'absolute', top: -wp(9), right: wp(-5), width: wp(8), height: wp(8) }} onPress={() => setuserRepotDetailModal(false)} />
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
                    <Button title="Report this user"
                        btnContainer={styles.contactUs}
                        onPress={() => handleReportauser()} />
                </View>
            </CustomModal>
        </Container>
    );
};

export default CHattscreen;
