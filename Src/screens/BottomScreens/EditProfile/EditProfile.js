import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import Container from '../../../components/Container'
import styles from './styles'
import Images from '../../../components/Images'
import ResponsiveText from '../../../components/ResponsiveText'
import Colors from '../../../theme/colors'
import { UpdateUserProfileMutation } from '../../../Graphql/Graphql'
import ImagePicker from 'react-native-image-crop-picker';
import uploadToS3 from '../../../components/Uploads3File'
import Loader from '../../../components/Loader'
import { SuccessToast } from '../../../components/SuccessToast'
import ImageResizer from 'react-native-image-resizer';

const EditProfile = (props) => {
  let myPersnolData = props.route.params.myPersnolData
  const [Discreption, setDiscreption] = useState(myPersnolData?.blurb)
  const [updateUserProfile, { loading }] = UpdateUserProfileMutation();
  const [profileImage, setprofileImage] = useState(myPersnolData?.avatarUrl ? myPersnolData?.avatarUrl : '')
  const [ImagePickermodal, setImagePickermodal] = useState(false)
  const [Loading, SetLoading] = useState(false)
  let discreptionemaxlength = 500


  // const selecFromgalery = async () => {
  //   try {

  //     ImagePicker.openPicker({
  //       width: 500,
  //       height: 500,
  //       cropping: false
  //     }).then(image => {

  //       setprofileImage(image?.path)

  //       // let blurb=''
  //       handleUpdateProfile(image)
  //       setImagePickermodal(false)

  //     }).catch(error => {
  //       setImagePickermodal(false)

  //     });
  //   } catch (error) {
  //     setImagePickermodal(false)

  //   }

  // }


  const selecFromgalery = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      width: 300,
      height: 300,
      cropping: false,
      includeBase64: false,
    })
      .then((image) => {

        ImageResizer.createResizedImage(image.path, 400, 400, 'JPEG', 80)
          .then(({ uri, size }) => {
            // // let blurb=''
            let img = { path: uri }
            setprofileImage(image?.path)
            handleUpdateProfile(img)
            setImagePickermodal(false)
          })


      })
      .catch((error) => {
        setImagePickermodal(false);
      });
  };


  const selectFromcamera = () => {
    try {
      ImagePicker.openCamera({
        width: 500,
        height: 500,
        cropping: false,
        mediaType: 'photo'

      }).then(image => {

        ImageResizer.createResizedImage(image.path, 400, 400, 'JPEG', 80)
          .then(({ uri, size }) => {
            // // let blurb=''
            let img = { path: uri }
            setprofileImage(image?.path)
            handleUpdateProfile(img)
            setImagePickermodal(false)
          })




      }).catch(err => {
      });
    } catch (error) {
      setImagePickermodal(false)

    }

  }

  const handleSupmit = async () => {
    try {
      const response = await updateUserProfile({
        variables: {
          blurb: Discreption,
          avatarUrl: profileImage,
        },
      });

      if (response?.data?.updateUserProfile) {
        SetLoading(false)
        SuccessToast({
          title: 'Congratulation',
          text: 'Profile updated successfully '
        })
        props.navigation.goBack()
      }

    } catch (error) {

    }
  }


  const handleUpdateProfile = async (image) => {
    try {
      SetLoading(true)
      const result = await uploadToS3(image)
      if (result) {

        setprofileImage(result)
        SetLoading(false)
      }


      else {
        alert('some thing wrong please try again later')
        SetLoading(false)

      }
    } catch (error) {
      SetLoading(false)

      console.error('Error updating profile:', error);
    }
  };
  return (
    <Container style={styles.container}>
      <View style={styles.headerView}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>

          <ResponsiveText style={styles.headerText}>
            {'Cancel'}
          </ResponsiveText>

        </TouchableOpacity>
        <ResponsiveText style={styles.headerText}>
          {'Edit Profile'}
        </ResponsiveText>
        <TouchableOpacity onPress={() => handleSupmit()}>

          <ResponsiveText style={{ ...styles.headerText, color: Colors.btncolor }}>
            {'Done'}
          </ResponsiveText>

        </TouchableOpacity>


      </View>

      <View style={styles.seprator} />


      <View style={styles.imageview}>
        {profileImage ?

          <TouchableOpacity style={{ ...styles.profileView, borderRadius: 200 }} onPress={() => setImagePickermodal(true)} activeOpacity={0.9}>
            <Image
              source={{ uri: profileImage }}
              resizeMode='cover'
              style={{ ...styles.profileimg, borderRadius: 2000 }}
            />
            <ResponsiveText style={styles.adphototxt}>
              {profileImage ? 'Edit a photo' : 'Add a photo'}
            </ResponsiveText>
          </TouchableOpacity>
          :
          <TouchableOpacity onPress={() => setImagePickermodal(true)} activeOpacity={0.9}>
            <Image
              source={Images.addProfilePic}
              resizeMode='contain'
              style={styles.profileimg}
            />
            <ResponsiveText style={styles.adphototxt}>
              {profileImage ? 'Edit a photo' : 'Add a photo'}
            </ResponsiveText>
          </TouchableOpacity>
        }


      </View>
      <View style={styles.textview}>
        <ResponsiveText>
          {'Information'}
        </ResponsiveText>
      </View>

      <View style={styles.titleinput}>
        <TextInput
          value={Discreption}
          onChangeText={(text) => { setDiscreption(text) }}
          maxLength={500}
          style={styles.input}
          multiline={true}
          placeholder='Add a description.'
          placeholderTextColor={Colors.black}

        />
        <View style={styles.Textlength}>
          <ResponsiveText style={styles.Titlelenthstyl}>
            {Discreption ? discreptionemaxlength - Discreption?.length : discreptionemaxlength}

          </ResponsiveText>
        </View>
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
      <Loader
        loading={Loading}
        title={'Image is uploading please wait...'}
      />
    </Container>
  )
}

export default EditProfile
