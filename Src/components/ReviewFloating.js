import React, { useState } from 'react';
import { Alert, Dimensions, Image, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Header from './Header';
import DropdownSelection from './DropDown';
import { CreateFeedBack } from '../Apis/Apis';
import { SuccessToast } from './SuccessToast';
import Images from './Images';
import Colors from '../theme/colors';
import ImageCropPicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import { heightPercentageToDP, widthPercentageToDP } from './Responsiveui';
import { Fonts } from '../theme/Fonts';
import Button from './Button';
import { GlobalStyles } from '../utils/globalStyles';
import { ErrorToast } from './ErrorToast';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CIRCLE_SIZE = widthPercentageToDP(17);
export const CloseIcon = ({ onPress, style, size = 6 }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.closeButtonSmall, style, {
            width: widthPercentageToDP(size + 1),
            height: widthPercentageToDP(size + 1),
        }]}>
            <Image source={Images.close} onPress={() => setuserRepotDetailModal(false)} tintColor={Colors.primaryColor} style={{ ...styles.closeIcon, width: widthPercentageToDP(size), height: widthPercentageToDP(size) }} />
        </TouchableOpacity>
    )
}
const FloatingIcon = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [type, setType] = useState({ label: 'Got an idea', value: 'Got an idea' });
    const [isButtonVisible, setButtonVisible] = useState(true);
    const pressed = useSharedValue(false);
    const offsetX = useSharedValue((CIRCLE_SIZE - 10));
    const offsetY = useSharedValue(Platform.OS === 'ios' ? heightPercentageToDP(11.5) : heightPercentageToDP(7.5));
    const translationX = useSharedValue((CIRCLE_SIZE - 10));
    const translationY = useSharedValue(Platform.OS === 'ios' ? heightPercentageToDP(11.5) : heightPercentageToDP(7.5));
    const shadowStyles = GlobalStyles().shadow;
    const [lastPosition, setLastPosition] = useState({
        translationX: 0,
        translationY: 0,
        offsetX: 0,
        offsetY: 0,
    })
    const pan = Gesture.Pan()
        .onBegin(() => {
            pressed.value = true;
        })
        .onChange((event) => {
            const nextX = event.translationX + offsetX.value;
            const nextY = event.translationY + offsetY.value;

            translationX.value = Math.max(0, Math.min(nextX, SCREEN_WIDTH));
            translationY.value = Math.max(0, Math.min(nextY, SCREEN_HEIGHT));
        })
        .onEnd(() => {
            offsetX.value = translationX.value;
            offsetY.value = translationY.value;
            pressed.value = false;
        });

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translationX.value },
                { translateY: translationY.value },
                { scale: withTiming(pressed.value ? 1 : 1) }, // This doesn't really change the scale
            ],
            backgroundColor: isExpanded ? Colors.transparent : Colors.primaryColor,
            ...shadowStyles,
        };
    }, [translationX.value, translationY.value, pressed.value, isExpanded]);
    const handleCreateFeedback = async () => {
        try {
            if (description?.trim() === "") {
                ErrorToast({
                    text: 'Please add description',
                })
                return
            }
            setLoading(true);
            const object = {
                status: 'PENDING',
                description: description || '',
                title: type?.value || '',
                attachments: [profileImage?.pathBase64]
            };

            const response = await CreateFeedBack(object);
            if (response.data?.createFeedback) {
                SuccessToast({
                    title: 'Congratulations',
                    text: 'Feedback submitted successfully',
                });
                closeModal();
                setButtonVisible(false);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };
    const openModal = () => {
        setModalVisible(true);
    };
    const closeModal = () => {
        setModalVisible(false);
    };
    const typeData = [
        { label: 'Got an idea', value: 'Got an idea' },
        { label: 'I have an issue with the app', value: 'I have an issue with the app' },
        { label: 'Something else', value: 'Something else' }
    ];
    const toggleExpand = () => {
        adjustAnimation(!isExpanded)
        setIsExpanded(!isExpanded);
    }
    const convertToBase64 = (imageUri) => {
        RNFS.readFile(imageUri, 'base64')
            .then(base64String => {
                setProfileImage({
                    pathBase64: base64String,
                    image: imageUri,
                });
            })
            .catch(err => { });
    };
    const selectFromGallery = () => {
        ImageCropPicker.openPicker({
            mediaType: 'photo',
            width: 700,
            height: 600,
            cropping: false,
            multiple: false,
            maxFiles: 10,
            includeBase64: false,
        })
            .then(image => {
                ImageResizer.createResizedImage(image.path, 700, 600, 'JPEG', 80)
                    .then(({ uri, size }) => {
                        if (size > 500000) {
                            ImageResizer.createResizedImage(image.path, 500, 500, 'JPEG', 80)
                                .then(resizedAgainImage => convertToBase64(resizedAgainImage.uri))
                                .catch(err => { });
                        } else {
                            convertToBase64(uri);
                        }
                    });
            })
            .catch(err => { });
    };
    const adjustAnimation = (isExpanded) => {
        if (isExpanded) {
            setLastPosition({
                translationX: translationX.value,
                translationY: translationY.value,
                offsetX: offsetX.value,
                offsetY: offsetY.value,
            })
            if (offsetX.value < 150) {
                offsetX.value = 200;
                translationX.value = 200;
            }
            if (offsetX.value > 300) {
                offsetX.value = 200;
                translationX.value = 200;
            }
            if (offsetY.value < 100) {
                offsetY.value = 150;
                translationY.value = 150;
            }

            if (offsetX.value < 150 && offsetY.value < 100) {
                offsetX.value = 200;
                offsetY.value = 150;
                translationX.value = 200;
                translationY.value = 150;
            }

        } else {
            translationX.value = lastPosition.translationX;
            translationY.value = lastPosition.translationY;
            offsetX.value = lastPosition.offsetX;
            offsetY.value = lastPosition.offsetY;
        }
    };
    return !isButtonVisible ? <></> : (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.container}>
                <GestureDetector gesture={pan}>
                    <Animated.View style={[styles.circle, animatedStyles]} >
                        <TouchableOpacity onPress={toggleExpand} style={styles.button}>
                            {isExpanded ? (
                                <View style={{
                                    ...styles.feedbackView,
                                    borderRadius: isExpanded ? 15 : 100
                                }}>
                                    <Text style={styles.expandText}>Got an idea to share or had an issue with the app? We'd love to hear from you.</Text>
                                    <Button title="Share feedback" btnContainer={styles.offerbtn} onPress={openModal} />
                                    <CloseIcon size={4} onPress={() => setButtonVisible(false)} style={{ margin: widthPercentageToDP(2) }} />
                                </View>
                            ) : (
                                // <Text style={styles.buttonText}>F</Text>
                                <Image source={Images.feedback} style={styles.buttonText} />
                            )}
                            <CloseIcon size={3} onPress={() => setButtonVisible(false)} />
                        </TouchableOpacity>
                    </Animated.View>
                </GestureDetector>
                <Modal visible={isModalVisible} onRequestClose={closeModal} animationType="slide">
                    <View style={styles.modalContent}>
                        <Header title="Feedback" onPress={() => { closeModal(); }} />
                        <View style={GlobalStyles().padding} />
                        <DropdownSelection setValue={setType} data={typeData} value={type} placeholder="Title" />
                        <TextInput
                            placeholder="Please write your feedback or issue here"
                            value={description}
                            onChangeText={setDescription}
                            style={[styles.input, { height: 200 }]}
                            multiline={true}
                            placeholderTextColor="#999"
                        />
                        <TouchableOpacity onPress={selectFromGallery} style={styles.attachmentMain}>
                            {profileImage?.image ? (
                                <Image source={{ uri: profileImage?.image }} style={styles.image} />
                            ) : (
                                <Text style={styles.attachment}>Add Attachment</Text>
                            )}
                        </TouchableOpacity>
                        <Button title="Share feedback" loading={loading} btnContainer={{ ...styles.offerbtn, width: widthPercentageToDP(90) }} onPress={handleCreateFeedback} />
                    </View>
                </Modal>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        // top:-SCREEN_HEIGHT/2.3,
        // top:50,right:50,
        // top:-30,
        zIndex: 10,
        // backgroundColor:"red"
    },
    circle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: 50,
        backgroundColor: '#B58DF1',
    },
    feedbackButton: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        backgroundColor: Colors.darkBlack
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    buttonText: { width: 55, height: 55, marginLeft: 5 },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: widthPercentageToDP(4),
        height: widthPercentageToDP(4),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        backgroundColor: Colors.secondaryColor,
        zIndex: -3
    },
    closeButtonSmall: {
        position: 'absolute',
        top: 0,
        right: 2,
        width: widthPercentageToDP(4),
        height: widthPercentageToDP(4),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        backgroundColor: Colors.secondaryColor,
    },
    offerbtn: {
        // marginTop: heightPercentageToDP(4),
        width: '90%', marginTop: heightPercentageToDP(2), height: heightPercentageToDP(6)
    },
    expandText: {
        color: Colors.black,
        marginTop: 10,
        textAlign: 'center',
        maxWidth: widthPercentageToDP(70),
        fontSize: 14,
        fontFamily: Fonts.FontsBold,
    },
    closeIcon: {
        width: widthPercentageToDP(4),
        height: widthPercentageToDP(4),
    },
    modalContent: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 60 : 20,
        padding: 20,
        backgroundColor: '#fff',
        rowGap: widthPercentageToDP(4),
    },
    attachmentMain: {
        width: widthPercentageToDP(90),
        height: heightPercentageToDP(25),
        borderColor: Colors.btncolor,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderStyle: 'dashed',
        marginTop: 10,
    },
    attachment: {
        color: Colors.black,
        fontSize: 12,
        fontFamily: Fonts.FontsSemiBold,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    input: {
        backgroundColor: Colors.white,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 8,
        marginTop: 10,
        textAlignVertical: 'top',
        fontFamily: Fonts.FontsRegular,
        color: Colors.black,
        borderWidth: 1,
        borderColor: Colors.btncolor,
    },
    feedbackView: {
        width: widthPercentageToDP(75), height: heightPercentageToDP(24), backgroundColor: "white", padding: widthPercentageToDP(4), borderRadius: 6, rowGap: 15, zIndex: 5,
        shadowColor: Colors.primaryColor,
        ...GlobalStyles().shadow,
    },
});
export default FloatingIcon;