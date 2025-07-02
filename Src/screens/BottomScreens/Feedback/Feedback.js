import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Header from '../../../components/Header'
import DropdownSelection from '../../../components/DropDown'
import { Fonts } from '../../../theme/Fonts'
import Colors from '../../../theme/colors'
import { heightPercentageToDP, widthPercentageToDP } from '../../../components/Responsiveui'
import ImageCropPicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import { CreateFeedBack } from '../../../Apis/Apis'
import { SuccessToast } from '../../../components/SuccessToast'
import TextInputcomp from '../../../components/TextInputcomp'
import Button from '../../../components/Button'
import { ErrorToast } from '../../../components/ErrorToast'
const Feedback = (props) => {
    const typeData = [
        { label: 'Got an idea', value: 'Got an idea' },
        { label: 'I have an issue with the app', value: 'I have an issue with the app' },
        { label: 'Something else', value: 'Something else' }
    ];
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [type, setType] = useState({ label: 'Got an idea', value: 'Got an idea' });



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
                props.navigation.goBack()
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };
    return (
        <ScrollView style={{ ackgroundColor: '#fff' }} contentContainerStyle={styles.modalContent}>
            <Header title="Feedback" onPress={() => { props.navigation.goBack() }} />
            <View style={{ height: heightPercentageToDP(2) }} />
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
            <View style={{ height: heightPercentageToDP(2) }} />
            <Button title="Share feedback" loading={loading} btnContainer={{ ...styles.offerbtn, width: widthPercentageToDP(90) }} onPress={handleCreateFeedback} />
        </ScrollView>
    )
}

export default Feedback

const styles = StyleSheet.create({
    modalContent: {
        paddingTop: Platform.OS === 'ios' ? 60 : 20,
        padding: 20,
        rowGap: widthPercentageToDP(4),
        flexGrow: 1,
        paddingBottom: heightPercentageToDP(25)
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
        fontFamily: Fonts.Fontsmedeum,
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
        fontFamily: Fonts.Fontsregular,
        color: Colors.black,
        borderWidth: 1,
        borderColor: Colors.btncolor,
    },
    offerbtn: {
        // marginTop: heightPercentageToDP(4),
        width: '90%'
    },
})