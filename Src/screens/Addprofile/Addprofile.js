import { Image, StyleSheet, Modal, TextInput, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import Container from '../../components/Container'
import styles from './styles'
import Images from '../../components/Images'
import ResponsiveText from '../../components/ResponsiveText'
import Colors from '../../theme/colors'
import ImagePicker from 'react-native-image-crop-picker';
import { UpdateUserProfileMutation } from '../../Graphql/Graphql'
import uploadToS3 from '../../components/Uploads3File'
import Loader from '../../components/Loader'
import { StackActions } from '@react-navigation/native'
import ImageResizer from 'react-native-image-resizer';
import { saveisFirstinstall } from '../../redux/actions/userDataAction'
import { useDispatch } from 'react-redux'
import { getErrorString } from '../../helper/global'
import Button from '../../components/Button'

const Addprofile = (props) => {

  const dispatch = useDispatch();
  const [updateUserProfile, { loading }] = UpdateUserProfileMutation();
  const [profileImage, setprofileImage] = useState('')
  const [imageToUpload, setImageToUpload] = useState('')
  const [ImagePickermodal, setImagePickermodal] = useState(false)
  const [Loading, SetLoading] = useState(false)
  const [ErrorMessage, setErrorMessage] = useState('');

  useEffect(() => {

    dispatch(saveisFirstinstall(true));
  }, [])

  const selecFromgalery = async () => {
    try {

      ImagePicker.openPicker({
        width: 500,
        height: 500,
        mediaType: 'photo',
        cropping: true
      }).then(image => {

        setprofileImage(image?.path)
        setImageToUpload(image)
        // let blurb=''
        // handleUpdateProfile(image)
        setImagePickermodal(false)

      }).catch(error => {
        setImagePickermodal(false)

      });
    } catch (error) {
      setImagePickermodal(false)

    }

  }


  const selectFromcamera = () => {

    try {
      ImagePicker.openCamera({
        width: 500,
        height: 500,
        cropping: true,
        mediaType: 'photo'
      }).then(image => {

        ImageResizer.createResizedImage(image.path, 400, 400, 'JPEG', 80)
          .then(({ uri, size }) => {

            let img = { path: uri }
            setprofileImage(uri)
            setImageToUpload(img)
            //handleUpdateProfile(img)
            setImagePickermodal(false)
          })



      });
    } catch (error) {
      setImagePickermodal(false)

    }

  }


  const handleSkip = () => {
    props.navigation.dispatch(StackActions.replace('AddGender'))
  }


  const handleUpdateProfile = async (image) => {
    try {
      SetLoading(true)
      const result = await uploadToS3(image)
      if (result) {
        const response = await updateUserProfile({
          variables: {
            blurb: '',
            avatarUrl: result,
          },
        });

        if (response?.data?.updateUserProfile) {
          SetLoading(false)

          setTimeout(() => {
            props.navigation.dispatch(StackActions.replace('AddGender'))
          }, 2);
        }
      }
      else {
        SetLoading(false)
      }
    } catch (error) {
      SetLoading(false)
      setErrorMessage(getErrorString(error))
    }
  };
  return (
    <Container style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.headerView}>

          <ResponsiveText style={styles.headerText}>
            {'Add profile photo'}
          </ResponsiveText>

          <ResponsiveText style={styles.detailtxt}>
            {'Add a profile photo so fellow Switchers know who they are speaking to.'}
          </ResponsiveText>
          <View style={styles.seprator} />
        </View>
        <View style={styles.imageview}>
          <TouchableOpacity onPress={() => setImagePickermodal(true)} activeOpacity={0.5}>
            {profileImage == '' ? <Image
              source={Images.addProfilePic}
              resizeMode='contain'
              style={styles.profileimg}
            />
              :
              <Image
                source={{ uri: profileImage }}
                resizeMode='contain'
                style={styles.profileimgselecte}
              />
            }
          </TouchableOpacity>
          {/* {profileImage != '' ?
            <TouchableOpacity onPress={() => props.navigation.dispatch(StackActions.replace('AddGender'))}>
              <ResponsiveText style={styles.adphototxt}>
                {'Continue'}
              </ResponsiveText>
            </TouchableOpacity> : null} */}
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={ImagePickermodal}
          onRequestClose={() => {
            setImagePickermodal(false);
          }}
        >

          <TouchableWithoutFeedback onPress={() => setImagePickermodal(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>


                <TouchableOpacity style={styles.modlbtn} hitSlop={styles.hitslop} onPress={() => { selectFromcamera() }}>
                  <ResponsiveText style={styles.buttonTextcancel}>Take photo</ResponsiveText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modlbtn} onPress={() => selecFromgalery()}>
                  <ResponsiveText style={styles.buttonTextcancel}>Select from gallery</ResponsiveText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modlbtn} onPress={() => setImagePickermodal(false)}>
                  <ResponsiveText style={styles.buttonTextcancel}>Cancel</ResponsiveText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <ResponsiveText style={{
          color: Colors.redcolor, fontSize: 12, textAlign: 'center'
        }}>
          {ErrorMessage}
        </ResponsiveText>
        <Loader
          loading={Loading}
          title={'Image is uploading, please wait.'}
        />
      </View>

      {imageToUpload && <Button
        btnContainer={{}}
        onPress={() => {
          handleUpdateProfile(imageToUpload)
        }}
        title={'Continue'}
        titleStyle={styles.btntitle}
        loadingColor={Colors.secondaryColor}
      />}

      <Button
        btnContainer={{}}
        onPress={() => handleSkip()}
        title={'Skip'}
        titleStyle={styles.btntitle}
        loadingColor={Colors.secondaryColor}
      />

      <View style={{ flex: 0.2, alignItems: 'flex-end', justifyContent: "flex-end" }}>
        <ResponsiveText style={{ marginRight: 20, fontSize: 16, color: 'black', }}>
          2/6
        </ResponsiveText>
        <View style={{ height: 20 }} />

      </View>
    </Container>
  )
}

export default Addprofile
