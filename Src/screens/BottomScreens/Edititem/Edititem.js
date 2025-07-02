import {
  ActivityIndicator,
  Alert,
  BackHandler,
  FlatList,
  Image,
  Modal,
  PermissionsAndroid,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../../components/Container';
import styles from './styles';
import Images from '../../../components/Images';
import ResponsiveText from '../../../components/ResponsiveText';
import Colors from '../../../theme/colors';
import Button from '../../../components/Button';
import ImagePicker from 'react-native-image-crop-picker';
import uploadToS3 from '../../../components/Uploads3File';
import Geolocation from '@react-native-community/geolocation';
import { UpdateItemMutation } from '../../../Graphql/Graphql';
import { heightPercentageToDP, heightPercentageToDP as hp } from '../../../components/Responsiveui';
import { apiKey, getAddressFromLatLng, getCategoriesByOffering, getCategory } from '../../../Apis/Apis';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { SuccessToast } from '../../../components/SuccessToast';
import DropdownPinker from '../../../components/DropdownPicker';
import DraggableGrid from '../../../components/Dragable';

import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs'; // 

const Edititem = props => {


  const [defaultaray, setdefaultaray] = useState([

    { id: 2, image: '', loading: false },
    { id: 3, image: '', loading: false },
    { id: 4, image: '', loading: false },
    { id: 5, image: '', loading: false },
    { id: 6, image: '', loading: false },
  ]);
  const [Array, setArray] = useState(defaultaray);
  let previousdata = props.route.params?.item;

  const [UpdateItem, { loading, error, data }] = UpdateItemMutation();
  const [title, settitle] = useState(
    previousdata?.title ? previousdata?.title : '',
  );
  const [value, setvalue] = useState(
    previousdata?.askingPrice ? previousdata?.askingPrice.toString() : '',
  );
  const [Discreption, setDiscreption] = useState(
    previousdata?.description ? previousdata?.description : '',
  );
  const [selecteditem, setselecteditem] = useState('');
  const [Loading, setLoading] = useState(false);
  const [Location, setLocation] = useState({
    latitude: previousdata?.latitude,
    longitude: previousdata?.longitude,
  });
  const [Imageindex, setImageindex] = useState(0);
  const [cashTogle, setcashTogle] = useState(previousdata?.isSwapOnly);
  const [Locationname, setLocationname] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setcategory] = useState(previousdata?.categories.length > 0 ? { label: previousdata?.categories[0], value: previousdata?.categories[0] } : '');
  const [ImagePickermodal, setImagePickermodal] = useState(false);
  const [Mainimageindex, setMainimageindex] = useState(0);
  const [SelectimageFormain, setSelectimageFormain] = useState(false);
  const [dropdownData, setDropdownData] = useState([])
  const [itemData, setitemData] = useState([])
  const buttonTitle = previousdata?.offeringId === 1 ? "Update Item" : "Update Service"
  const offerLabel = previousdata?.offeringId === 1 ? "item" : "service"
  const isItItem = previousdata?.offeringId === 1 ? true : false;


  useEffect(() => {
    // getCategory().then(res => {

    //   let array = []
    //   res.data?.categories.map(categry => {
    //     let object = { label: categry?.name, value: categry?.id }
    //     array.push(object)
    //   })
    //   setDropdownData(array)
    // }).catch(eror => {
    // })


    getCategoriesByOffering(previousdata?.offeringId).then(res => {
      if (previousdata?.offeringId === 1) {
        let array = []
        res.data?.categoriesByOffering.map(categry => {
          let object = { label: categry?.name, value: categry?.id }
          array.push(object)
        })
        setDropdownData(array)
      } else {
        let array = []
        res.data?.categoriesByOffering.forEach(category => {
          // Add all subcategories
          category?.subCategories.forEach(subCategory => {
            array.push({ label: subCategory?.name, value: subCategory?.id });
          });
        });

        setDropdownData(array);

      }
    }).catch(error => {
      console.log('Offer Category--->', error)
    });



    let object = {
      pathBase64: previousdata?.mainImageUrl,
      image: previousdata?.mainImageUrl
    };
    setitemData(prev => {
      if (prev.length < 10) {

        return [...prev, object];
      } else {

        return prev;
      }
    });
    for (
      let i = 0;
      i < Array.length && i < previousdata?.imageUrls.length;
      i++
    ) {


      setitemData(prev => {
        if (prev.length < 10) {
          let object = {
            pathBase64: previousdata?.imageUrls[i],
            image: previousdata?.imageUrls[i]
          };
          return [...prev, object];
        } else {

          return prev;
        }
      });




    }

    getAddressFromLatLng(previousdata?.latitude, previousdata?.longitude)
      .then(address => setLocationname(address))
      .catch(error => console.error(error.message));
    return () => {
      // Cleanup function: Reset the state when the component is unmounted
      setArray([])
      setImageindex(0)
      setdefaultaray([])

    }
  }, []);

  useEffect(() => {
    const backAction = () => {
      props.navigation.goBack();
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Clean up the event listener
  }, []);

  const onPress = (data, details) => {
    setModalVisible(false);

    setLocation({
      latitude: details?.geometry.location?.lat,
      longitude: details?.geometry.location?.lng,
    });
    getAddressFromLatLng(
      details?.geometry.location?.lat,
      details?.geometry.location?.lng,
    )
      .then(address => setLocationname(address))
      .catch(error => console.error(error.message));

    setLocationname(data?.description);
  };

  let titlemaxlength = 100;
  let discreptionemaxlength = 500;
  // const getCurrentLocation = async () => {
  //   Geolocation.getCurrentPosition(info => {

  //   });
  // };
  function extractUrlAndRemainingArray(urls, index) {
    if (index < 0 || index >= urls.length) {
      return null; // Index out of bounds
    }

    const selectedUrl = urls[index];
    const remainingUrls = [...urls.slice(0, index), ...urls.slice(index + 1)].map((url) => (url.toString()));
    return { selectedUrl, remainingUrls };
  }

  function capitalizeFirstLetter(string) {
    return string?.charAt(0)?.toUpperCase() + string?.slice(1);
  }

  const uploaditem = async () => {
    try {
      const pathBase64Array = itemData
        .filter(item => item.pathBase64)
        .map(item => item.pathBase64);
      if (itemData.length <= 0) {
        Alert.alert('Field Required', `Please select atleast one image`);
      } else if (!title) {
        Alert.alert('Field Required', `Please enter your ${offerLabel} title`);
      } else if (!value) {
        Alert.alert('Field Required', `Please enter your ${offerLabel} price`);
      } else if (!Discreption) {
        Alert.alert('Field Required', `Please enter your ${offerLabel} descreption`);
      }
      else if (!Location?.latitude || !Location?.longitude) {
        Alert.alert('Location Required', 'Please select your location using the search field to proceed.');
      }
      else if (!category?.value) {
        Alert.alert('Field Required', `Please select your ${offerLabel} category`);
      }

      else {






        setLoading(true);
        let trimmedValue = 0
        if (value.toString().includes('$')) {
          trimmedValue = value.slice(1);

        }
        else {
          trimmedValue = value
        }

        let selectedUrl = pathBase64Array.slice(0, 1)
        let remainingUrls = pathBase64Array.slice(1)

        const resultuploaditem = await UpdateItem({
          variables: {
            id: previousdata?.id,
            item: {
              askingPrice: parseFloat(trimmedValue),
              categories: [category?.label],
              description: Discreption,
              title: title,
              imageUrls: remainingUrls,
              mainImageUrl: selectedUrl[0],
              latitude: Location?.latitude,
              longitude: Location?.longitude,
              isSwapOnly: cashTogle,
              offeringId: previousdata?.offeringId
            },
          },
        });
        setLoading(false);

        if (resultuploaditem) {
          SuccessToast({
            title: 'Congratulation',
            text: `${capitalizeFirstLetter(offerLabel)} updated successfully `,
          });
          props.navigation.goBack();
        }
      }
    } catch (error) {
      Alert.alert(error?.message);
      setLoading(false);
    }
  };

  // const selecFromgalery = async () => {
  //   try {
  //     ImagePicker.openPicker({
  //       mediaType: 'photo',
  //       width: 300,
  //       height: 300,
  //       cropping: false,
  //       multiple: true,
  //       maxFiles: 10,
  //       includeBase64: true,
  //     })
  //       .then((images) => {
  //         setImagePickermodal(false);
  //         images.forEach((allimages, index) => {
  //           setitemData(prev => {
  //             if (prev.length < 10) {
  //               let object = {
  //                 pathBase64: allimages?.data,
  //                 image: allimages.path
  //               };
  //               return [...prev, object];
  //             } else {

  //               return prev;
  //             }
  //           });
  //         });

  //       })
  //       .catch((error) => {
  //         setImagePickermodal(false);
  //       });
  //   } catch (error) {
  //     setImagePickermodal(false);
  //   }
  // };



  // const selectFromcamera = item => {
  //   try {
  //     ImagePicker.openCamera({
  //       width: 300,
  //       height: 300,
  //       cropping: false,
  //       includeBase64: true,
  //       multiple: true

  //     }).then(image => {
  //       setImagePickermodal(false);

  //       setitemData(prev => {
  //         if (prev.length < 10) {
  //           let object = {
  //             pathBase64: image?.data,
  //             image: image.path
  //           };
  //           return [...prev, object];
  //         } else {

  //           return prev;
  //         }
  //       });
  //     }).catch((error) => {
  //       setImagePickermodal(false);

  //     });
  //   } catch (error) {
  //     setImagePickermodal(false);

  //   }
  // };





  const selectFromcamera = async () => {
    try {
      ImagePicker.openCamera({
        width: 600,
        height: 600,
        // cropping: true,
        includeBase64: false, // We'll handle base64 conversion after resizing
        mediaType: 'photo',
      }).then(image => {
        setImagePickermodal(false);
        // Resize image here before adding it to state
        ImageResizer.createResizedImage(image.path, 600, 600, 'JPEG', 100)
          .then(({ uri, size }) => {
            // If resized image is more than 500KB, reduce quality further
            if (size > 500000) {
              ImageResizer.createResizedImage(image.path, 500, 500, 'JPEG', 100)
                .then(resizedAgainImage => {
                  convertToBase64(resizedAgainImage.uri);
                })
                .catch((err) => {
                });
            } else {
              convertToBase64(uri);
            }
          })
          .catch((err) => {
          });
      }).catch((error) => {
        setImagePickermodal(false);
      });
    } catch (error) {
      setImagePickermodal(false);
    }
  };


  const selecFromgalery = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      width: 600,
      height: 600,
      cropping: false,
      multiple: true,
      maxFiles: 10,
      includeBase64: false, // Set to false because we'll handle base64 conversion after resizing
    })
      .then((images) => {
        setImagePickermodal(false);
        images.forEach((allimages, index) => {
          // Resize image here before adding it to state
          ImageResizer.createResizedImage(allimages.path, 600, 600, 'JPEG', 100)
            .then(({ uri, size }) => {

              // If resized image is more than 500KB, reduce quality further
              if (size > 500000) {
                ImageResizer.createResizedImage(allimages.path, 500, 500, 'JPEG', 100)
                  .then(resizedAgainImage => {
                    convertToBase64(resizedAgainImage.uri);
                  })
                  .catch((err) => {
                  });
              } else {
                convertToBase64(uri);
              }
            })
            .catch((err) => {
            });
        });
      })
      .catch((error) => {
        setImagePickermodal(false);
      });
  };

  const convertToBase64 = (imageUri) => {
    RNFS.readFile(imageUri, 'base64')
      .then(base64String => {
        // Here you get the base64String of the image
        // You can now add this base64 string to your state or process it further
        setitemData(prev => {
          if (prev.length < 10) {
            let object = {
              pathBase64: base64String,
              image: imageUri // This is the local file URI, you might want to keep it for reference
            };
            return [...prev, object];
          } else {
            return prev;
          }
        });
      })
      .catch(err => {
      });
  };

  const getFormattedNumberValue = () => {
    if (value.length > 0) {
      let cVal = value.replace(/[^0-9.]/g, ''); // Allow only digits and dot
      if (cVal.includes('.')) {
        return '$' + cVal; // Allow decimal values only when dot is entered
      } else {
        return '$' + cVal; // No decimal values when dot is not entered
      }
    }
  };

  const handleItemRemove = id => {
    const updatedArray = Array.filter(item => item.id !== id);

    // Add a new object at the end of the array
    updatedArray.push({ id: id, image: '', loading: false });
    setImageindex(Imageindex - 1);
    setArray(updatedArray);
  };

  return (
    <Container style={styles.container}>
      <View style={styles.headerView}>
        <View style={styles.dotimg} />
        <ResponsiveText style={styles.headerText}>
          {'Edit Listing'}
        </ResponsiveText>
        <TouchableOpacity>
          <View style={styles.dotimg} />
        </TouchableOpacity>
      </View>
      <ScrollView
        // style={{ backgroundColor: `${Colors.graytext}40` }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: heightPercentageToDP(4) }}
      >

        <View
          style={{ backgroundColor: `${Colors.graytext}40` }}
        >
          <View style={styles.dragmain}>
            <DraggableGrid
              data={itemData}
              setData={setitemData}

            />
          </View>

          {itemData.length < 6 && <TouchableOpacity onPress={() => {
            setImagePickermodal(true)
          }} style={styles.addphotoview}>
            <Image source={Images.addphoto} style={styles.addphoto} />
            <ResponsiveText style={styles.adphototxt}>
              {'Add Photo'}
            </ResponsiveText>
          </TouchableOpacity>}
        </View>
        <View style={[styles.imagemainview, { marginTop: hp(2) }]}>
          <ResponsiveText
            style={[styles.sellingvalue, {
              paddingLeft: hp(0),
              paddingVertical: hp(0),
              //marginTop: hp(0.5),
            }]}
          >
            {isItItem ? `What are you swapping?` : `What is your Service?`}
          </ResponsiveText>
        </View>

        <View style={styles.titleinput}>
          <TextInput
            value={title}
            onChangeText={text => {
              settitle(text);
            }}
            maxLength={100}
            style={styles.input}
            placeholderTextColor={'#4f4f4f'}
            multiline={true}
            placeholder={`Add a title for your ${isItItem ? 'item.' : 'service.'}`}
          />
          <View style={styles.Textlength}>
            <ResponsiveText style={styles.Titlelenthstyl}>
              {titlemaxlength - title.length}
            </ResponsiveText>
          </View>
        </View>

        <View style={styles.imagemainview}>
          <ResponsiveText
            style={[styles.sellingvalue, {
              paddingLeft: hp(0),
              paddingVertical: hp(0),
              //  marginTop: hp(2), 
            }]}
          >
            {isItItem ? `Value` : `Cost of Service`}
          </ResponsiveText>
        </View>


        {/* <ResponsiveText style={styles.sellingvalue}>Value</ResponsiveText> */}
        <View style={styles.Valueinput}>
          <TextInput
            value={getFormattedNumberValue()}
            onChangeText={text => {
              setvalue(text);
            }}
            style={{ ...styles.valueinput, height: hp(10) }}
            placeholderTextColor={'#4f4f4f'}
            keyboardType="decimal-pad"
            multiline={true}
            placeholder={isItItem ? `Give a fair value to your item. The more accurate it is, the more you will match.` :
              `Give a value to the your packaged service. Keep it simple.`}
          />
        </View>

        <View style={styles.imagemainview}>
          <ResponsiveText
            style={[styles.sellingvalue, {
              paddingLeft: hp(0),
              paddingVertical: hp(0),
              // marginTop: hp(2), 
            }]}
          >
            Description
          </ResponsiveText>
        </View>

        {/* <ResponsiveText style={styles.sellingvalue}>Description</ResponsiveText> */}
        <View style={styles.titleinput}>
          <TextInput
            value={Discreption}
            onChangeText={text => {
              setDiscreption(text);
            }}
            maxLength={500}
            scrollEnabled={false}
            style={{
              ...styles.input,
              //height: hp(12),
              textAlign: 'left',
              textAlignVertical: 'top',
            }}
            placeholderTextColor={'#4f4f4f'}
            multiline={true}
            placeholder={isItItem ? `Add a description of your item. The more descriptive you are, the higher your chances for a match!`
              : `Make a package for your service. 
Create a set of parameters for your service to be swapped as a set package with a definitive value. Ie: 2 hours of portrait family photography in a local park including 3 5X7” prints. 
`}
          />
          <View style={styles.Textlength}>
            <ResponsiveText style={styles.Titlelenthstyl}>
              {discreptionemaxlength - Discreption.length}
            </ResponsiveText>
          </View>
        </View>

        <View style={styles.imagemainview}>
          <ResponsiveText
            style={[styles.sellingvalue, {
              paddingLeft: hp(0),
              paddingVertical: hp(0),
              // marginTop: hp(2), 
            }]}
          >
            Category
          </ResponsiveText>
        </View>

        {/* <ResponsiveText style={styles.sellingvalue}>Category</ResponsiveText> */}
        <DropdownPinker

          setValue={setcategory}
          data={dropdownData}
          value={category}

        />

        <View style={styles.imagemainview}>
          <ResponsiveText
            style={[styles.sellingvalue, {
              paddingLeft: hp(0),
              paddingVertical: hp(0),
              // marginTop: hp(2), 
            }]}
          >
            Location
          </ResponsiveText>
        </View>

        {/* <ResponsiveText style={styles.sellingvalue}>Location</ResponsiveText> */}

        <View style={styles.Valueinput}>
          <TextInput
            value={Locationname}
            onChangeText={text => {
              setLocationname(text);
            }}
            onFocus={() => setModalVisible(true)}
            onPressIn={() => setModalVisible(true)}
            style={styles.valueinput}
            placeholderTextColor={'#4f4f4f'}
            placeholder="Location"
          />
        </View>
        <View style={styles.texttogle}>
          <ResponsiveText
            style={[styles.sellingvalue]}
          // style={styles.cashoffer}
          >
            Cash offers
          </ResponsiveText>
          <TouchableOpacity onPress={() => setcashTogle(!cashTogle)}>
            <Image
              source={cashTogle ? Images.togolon : Images.togoloff}
              style={styles.togolbtn}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.btnview,{marginTop: hp(5),}]}>
          <Button
            onPress={() => uploaditem()}
            title={buttonTitle}
            titleStyle={styles.btntitle}
            loading={Loading}
            loadingColor={Colors.secondaryColor}
          />
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={ImagePickermodal}
        onRequestClose={() => {
          setImagePickermodal(false);
        }}>
        <TouchableWithoutFeedback onPress={() => setImagePickermodal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>

              <TouchableOpacity
                style={styles.modlbtn}
                hitSlop={styles.hitslop}
                onPress={() => {
                  selectFromcamera();
                }}>
                <ResponsiveText style={styles.buttonTextcancel}>
                  Take photo
                </ResponsiveText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modlbtn}
                onPress={() => selecFromgalery()}>
                <ResponsiveText style={styles.buttonTextcancel}>
                  Select from gallery
                </ResponsiveText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modlbtn}
                onPress={() => setImagePickermodal(false)}>
                <ResponsiveText style={styles.buttonTextcancel}>
                  Cancel
                </ResponsiveText>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <GooglePlacesAutocomplete
              placeholder={'Search Location'}
              onPress={onPress}
              onFail={(error) => { }}
              onNotFound={() => { }}
              minLength={2}
              autoFocus={true}
              fetchDetails={true}
              currentLocation={true}
              listViewDisplayed={true}
              styles={{
                textInputContainer: {},
                textInput: {
                  color: '#5d5d5d',
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: Colors.btncolor,
                },
                predefinedPlacesDescription: {
                  color: Colors?.btncolor,
                },
                row: {
                  padding: 13,
                  height: 44,
                  flexDirection: 'row',
                },
                description: {
                  color: 'black',
                },
              }}
              predefinedPlacesAlwaysVisible={true}
              query={{
                key: apiKey,
                language: 'en',
              }}
              textInputProps={{
                placeholderTextColor: 'gray',
                color: 'black',
              }}
              GooglePlacesDetailsQuery={{
                fields: 'geometry',
              }}
            />
          </View>
        </View>
      </Modal>
    </Container>
  );
};

export default Edititem;
