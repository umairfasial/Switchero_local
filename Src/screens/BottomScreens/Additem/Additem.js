import { Alert, Image, BackHandler, Modal, Platform, ScrollView, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, FlatList, Text, } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Container from '../../../components/Container';
import styles from './styles';
import Images from '../../../components/Images';
import ResponsiveText from '../../../components/ResponsiveText';
import Colors from '../../../theme/colors';
import Button from '../../../components/Button';
import ImagePicker from 'react-native-image-crop-picker';
import uploadToS3 from '../../../components/Uploads3File';
import Geolocation from '@react-native-community/geolocation';
import { AddnewitemMutation } from '../../../Graphql/Graphql';
import { apiKey, createItem, getAddressFromLatLng, getCategoriesByOffering, getCategory } from '../../../Apis/Apis';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { SuccessToast } from '../../../components/SuccessToast';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../components/Responsiveui';
import { useDispatch } from 'react-redux';
import { SaveItemuploded, Savematchingitem } from '../../../redux/actions/userDataAction';
import DropdownPinker from '../../../components/DropdownPicker';
import { useIsFocused } from '@react-navigation/native';
import Dragable from '../../../components/Dragable';
import DraggableGrid from '../../../components/Dragable';
import CustomModal from '../../../components/CustomModal';

import Share from 'react-native-share';
import Clipboard from '@react-native-community/clipboard';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs'; // 
import { ErrorToast } from '../../../components/ErrorToast';
import { CheckTheme } from '../../../helper/global';
import { CloseIcon } from '../../../components/ReviewFloating';
import { GlobalStyles } from '../../../utils/globalStyles';
import { newEvents } from '../../../CustomEvents/CustomEvents';
import LottieView from 'lottie-react-native';

let defaultaray = [
  { id: 1, image: '', loading: false },
  { id: 2, image: '', loading: false },
  { id: 3, image: '', loading: false },
  { id: 4, image: '', loading: false },
  { id: 5, image: '', loading: false },
  { id: 6, image: '', loading: false },
];


const Additem = props => {
  const isDarkTheme = CheckTheme()

  const dispatch = useDispatch();
  const [Array, setArray] = useState(defaultaray);
  const [modalVisible, setModalVisible] = useState(false);
  const [copyModal, setcopyModal] = useState(false);
  const [ModalVisibale, setModalVisibale] = useState(false);
  const [LocationAlertModal, setLocationAlertModal] = useState(false);
  const [imageUrl, setimageUrl] = useState('');
  const [CreateAccountModal, setCreateAccountModal] = useState(false);
  const [tabIndex, setTabIndex] = useState(1);
  const [expanded, setExpanded] = useState({});
  const [selectedSubCategory, setSelectedSubCategories] = useState({});
  const buttonTitle = tabIndex === 1 ? 'Post item' : "Post service"

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubCategoryClick = (categoryId, subCategory) => {
    setSelectedSubCategories(prev => ({
      ...prev,
      [categoryId]: subCategory,
    }));

    setExpanded((prev) => (prev ? 0 : prev));
  };


  useEffect(() => {


    newEvents.on('Upload', function (text) {
      setCreateAccountModal(true)

    })

    if (props.route.params?.Showmodal) {
      setModalVisibale(true)
    }

  }, [])

  useEffect(() => {
    const backAction = () => {
      // Optionally alert the user that back action is disabled.
      // Alert.alert("Hold on!", "Going back is not allowed.", [
      // { text: "OK" }
      // ]);
      return true; // Return true to prevent default behavior
    };

    // Add the back press event listener
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    // Clean up the event listener
    return () => backHandler.remove();
  }, []);

  const scrollRef = useRef(null)


  const onPress = (data, details) => {
    setModalVisible(false);

    const latitude = details?.geometry.location?.lat;
    const longitude = details?.geometry.location?.lng;

    setLocation({ latitude, longitude });

    getAddressFromLatLng(latitude, longitude)
      .then(cityZip => {
        setLocationname(cityZip); // Now correctly setting only "City, Zip" or just "City"
      })
      .catch(error => console.error(error.message));

    setLocationAlertModal(true);
  };


  // const onPress = (data, details) => {
  //   setModalVisible(false);

  //   setLocation({
  //     latitude: details?.geometry.location?.lat,
  //     longitude: details?.geometry.location?.lng,
  //   });
  //   getAddressFromLatLng(
  //     details?.geometry.location?.lat,
  //     details?.geometry.location?.lng,
  //   )
  //     .then(address => setLocationname(address))
  //     .catch(error => console.error(error.message));

  //   setLocationname(data?.description);
  //   setLocationAlertModal(true)

  // };

  const [CreateItem, { loading, error, data }] = AddnewitemMutation();
  const [title, settitle] = useState('');
  const [value, setvalue] = useState('');
  const [category, setcategory] = useState('');
  const [Discreption, setDiscreption] = useState('');
  const [selecteditem, setselecteditem] = useState('');
  const [Location, setLocation] = useState(0);
  const [Imageindex, setImageindex] = useState(0);
  const [cashTogle, setcashTogle] = useState(true);
  const [ImagePickermodal, setImagePickermodal] = useState(false);
  const [Locationname, setLocationname] = useState('');
  const [Loading, setLoading] = useState(false);
  const [Mainimageindex, setMainimageindex] = useState(0);
  const [presIndex, setpresIndex] = useState(0);
  const [SelectimageFormain, setSelectimageFormain] = useState(false);
  const [dropdownData, setDropdownData] = useState([])
  const [itemData, setitemData] = useState([])

  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleCategory = (id) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  const selectSubCategory = (sub) => {
    setSelectedItem(sub.name);
    setExpandedCategory(null); // Collapse after selection
  };


  useEffect(() => {
    setcategory('')
    // getCategory().then(res => {

    //   let array = []
    //   res.data?.categories.map(categry => {
    //     let object = { label: categry?.name, value: categry?.id }
    //     array.push(object)
    //   })
    //   setDropdownData(array)
    // }).catch(eror => {
    // })

    getCategoriesByOffering(tabIndex).then(res => {
      if (tabIndex === 1) {
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


    getCurrentLocation();
  }, [useIsFocused(), tabIndex]);
  let titlemaxlength = 100;
  let discreptionemaxlength = 500;
  const getCurrentLocation = async () => {
    Geolocation.getCurrentPosition(info => {
      setLocation(info.coords);
      getAddressFromLatLng(info.coords?.latitude, info.coords?.longitude)
        .then(address => setLocationname(address))
        .catch(error => console.error(error.message));
    });
  };




  const Sharedata = () => {
    const message = `http://tinyurl.com/4s4mwk7t?${'switcheroo'}`;
    const options = {
      message: message,
    };



    Share.open(options)
      .then((res) => {
        setcopyModal(false);

        setTimeout(() => {
          props.navigation.navigate('TabBarNav', {
            screen: 'Home',
          })
        }, 500);
      })
      .catch((err) => {
        setcopyModal(false);
        setTimeout(() => {
          props.navigation.navigate('TabBarNav', {
            screen: 'Home',
          })
        }, 500);

      })
      .finally(() => {
        setcopyModal(false);
        setTimeout(() => {
          props.navigation.navigate('TabBarNav', {
            screen: 'Home',
          })
        }, 500);
      });
  };


  const copyToClipboard = () => {
    Clipboard.setString(`http://tinyurl.com/4s4mwk7t?${'switcheroo'}`);
    setTimeout(() => {
      props.navigation.navigate('TabBarNav', {
        screen: 'Home',
      })
    }, 500);
  };

  const uploaditem = async () => {
    try {
      const pathBase64Array = itemData
        .filter(item => item.pathBase64)
        .map(item => item.pathBase64);
      if (itemData.length <= 0) {
        Alert.alert('Field Required', 'Please upload at least one image');
      } else if (!title) {
        Alert.alert('Title Required', 'Please enter your item title');
      }
      else if (!value) {
        Alert.alert('Value Required', 'Please enter your item price');
      }

      else if (!Discreption) {
        Alert.alert('Discreption Required', 'Please enter your item description');
      }
      else if (!Location?.latitude || !Location?.longitude) {
        Alert.alert('Location Required', 'Please select your location using the search field to proceed.');
      }

      else if (!category?.value) {
        Alert.alert('Category Required', 'Please select your item category');
      }

      else {


        let selectedUrl = pathBase64Array.slice(0, 1)
        let remainingUrls = pathBase64Array.slice(1)

        setLoading(true);


        let trimmedValue = 0
        if (value.toString().includes('$')) {
          trimmedValue = value.slice(1);

        }
        else {
          trimmedValue = value
        }


        let response = await createItem({
          askingPrice: parseFloat(trimmedValue),
          categories: [category?.label],
          description: Discreption,
          imageUrls: remainingUrls,
          isSwapOnly: cashTogle,
          latitude: Location?.latitude,
          longitude: Location?.longitude,
          mainImageUrl: selectedUrl[0],
          title: title,
          offeringId: tabIndex
        })

        if (response.data?.createItem) {
          dispatch(Savematchingitem(response.data?.createItem));
          dispatch(SaveItemuploded(true))
          SuccessToast({
            title: 'Congratulation',
            text: 'Item uploaded successfully ',
          });
          settitle('');
          setDiscreption('');
          setitemData([]);
          setvalue('');
          setImageindex(0);
          setLoading(false)
          setTimeout(() => {

            setcopyModal(true)
          }, 1000);
          // props.navigation.navigate('TabBarNav', {
          //   screen: 'Home',
          // });
        }
        else {
          setLoading(false);
          ErrorToast({
            title: 'Congratulation',
            text: response?.errors[0]?.message,
          });
        }


      }
    } catch (error) {
      setLoading(false);

      Alert.alert(error?.message);
    }
  };



  // const selectFromcamera = async (item) => {
  //   try {

  //     ImagePicker.openCamera({
  //       width: 300,
  //       height: 300,
  //       cropping: true,
  //       includeBase64: true,
  //       mediaType: 'photo'


  //     }).then(image => {
  //       setImagePickermodal(false);

  //       setitemData(prev => {
  //         if (prev.length < 10) {
  //           let object = {
  //             pathBase64: image.data,
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
        width: 700,
        height: 600,
        // cropping: true,
        includeBase64: false, // We'll handle base64 conversion after resizing
        mediaType: 'photo',
      }).then(image => {
        setImagePickermodal(false);
        // Resize image here before adding it to state
        ImageResizer.createResizedImage(image.path, 700, 600, 'JPEG', 80)
          .then(({ uri, size }) => {
            // If resized image is more than 500KB, reduce quality further
            if (size > 500000) {
              ImageResizer.createResizedImage(image.path, 500, 500, 'JPEG', 80)
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
      width: 700,
      height: 600,
      cropping: false,
      multiple: true,
      maxFiles: 6,
      includeBase64: false, // Set to false because we'll handle base64 conversion after resizing
    })
      .then((images) => {
        setImagePickermodal(false);
        images.slice(0, 6).forEach((allimages, index) => {
          // Resize image here before adding it to state
          ImageResizer.createResizedImage(allimages.path, 700, 600, 'JPEG', 80)
            .then(({ uri, size }) => {

              // If resized image is more than 500KB, reduce quality further
              if (size > 500000) {
                ImageResizer.createResizedImage(allimages.path, 500, 500, 'JPEG', 80)
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

  // const selecFromgalery = () => {
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
  //                 pathBase64: allimages.data,
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


  return (

    <Container style={styles.container}>
      <View style={styles.headerView}>
        <View style={styles.dotimg} />
        <ResponsiveText style={styles.headerText}>
          {'New Listing'}
        </ResponsiveText>
        <TouchableOpacity>
          <View style={styles.dotimg} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabrow}>
        <TouchableOpacity
          onPress={() => {
            setTabIndex(1);
          }}
          style={{
            ...styles.buttontext,
            borderColor:
              tabIndex == 1 ? Colors.btncolor : `${Colors.black}20`,
          }}>
          <ResponsiveText
            style={{
              ...styles.textcolor,
              color: tabIndex == 1 ? Colors.btncolor : Colors.graytext,
            }}>
            {'Item'}
          </ResponsiveText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setTabIndex(2);
          }}
          style={{
            ...styles.buttontext,
            borderColor:
              tabIndex != 1 ? Colors.btncolor : `${Colors.black}20`,
          }}>
          <ResponsiveText
            style={{
              ...styles.textcolor,
              color: tabIndex != 1 ? Colors.btncolor : Colors.graytext,
            }}>
            {'Service'}
          </ResponsiveText>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        nestedScrollEnabled


        //style={{ backgroundColor: `${Colors.graytext}40` }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: '20%', marginTop: hp(2) }}>

        <View
          style={{ backgroundColor: `${Colors.graytext}40` }}
        >
          <View style={styles.dragmain}>
            <DraggableGrid
              data={itemData}
              setData={setitemData}

            />
          </View>
          {/* <View style={{ height: hp(50) }}></View> */}

          {itemData.length < 6 ? <TouchableOpacity onPress={() => {
            setImagePickermodal(true)
          }} style={styles.addphotoview}>
            <Image source={Images.addphoto} style={styles.addphoto} />
            <ResponsiveText style={styles.adphototxt}>
              {'Add Photo'}
            </ResponsiveText>
          </TouchableOpacity> : null}


        </View>


        <View style={[styles.imagemainview, { marginTop: hp(2) }]}>

          {/* <FlatList
            data={Array}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={3}
            columnWrapperStyle={{ justifyContent: 'space-around' }}

          /> */}


          <ResponsiveText
            style={[styles.sellingvalue, {
              paddingLeft: hp(0),
              paddingVertical: hp(0),
              // marginTop: hp(2), 
            }]}
          // style={styles.sellingtxt}
          >
            {tabIndex === 1 ? `What are you swapping?` : `What is your Service?`}
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
            placeholderTextColor={'#9c9a9a'}
            multiline={true}
            placeholder={`Add a title for your ${tabIndex == 1 ? 'item.' : 'service.'}`}
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
              // marginTop: hp(2), 
            }]}
          >
            {tabIndex === 1 ? `Value` : `Cost of Service`}
          </ResponsiveText>
        </View>

        {/* <ResponsiveText style={styles.sellingvalue}>Value</ResponsiveText> */}

        <View style={styles.Valueinput}>
          <TextInput
            value={getFormattedNumberValue()}
            onChangeText={text => {
              if (text[text.length - 1] !== ".")
                setvalue(text);
            }}
            maxLength={12}
            style={{ ...styles.valueinput, 
              height: hp(10) 
            }}
            placeholderTextColor={'#9c9a9a'}
            keyboardType="decimal-pad"
            multiline={true}
            placeholder={tabIndex === 1 ? `Give a fair value to your item. The more accurate it is, the more you will match.` : `Give a value to the your packaged service. Keep it simple.`}
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
              //height: hp(15),
              textAlign: 'left',
              textAlignVertical: 'top',
            }}
            placeholderTextColor={'#9c9a9a'}
            multiline={true}
            placeholder={tabIndex === 1 ? `Add a description of your item. The more descriptive you are, the higher your chances for a match!`
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

        {
          <DropdownPinker

            setValue={setcategory}
            data={dropdownData}
            value={category}
            placeholder={'Select'}
          // scrollRef={scrollRef}

          />
        }



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
            // onFocus={() => setLocationAlertModal(true)}
            onPressIn={() => setModalVisible(true)}
            style={styles.valueinput}
            placeholderTextColor={'#9c9a9a'}
            placeholder="Location"
          />
        </View>
        <View style={styles.texttogle}>
          <ResponsiveText
            style={[styles.sellingvalue]}
          // style={styles.cashoffer}
          >Cash offers</ResponsiveText>
          <TouchableOpacity onPress={() => setcashTogle(!cashTogle)}>
            <Image
              source={cashTogle ? Images.togolon : Images.togoloff}
              style={styles.togolbtn}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.btnview}>
          <Button
            onPress={() => uploaditem()}
            title={buttonTitle}
            titleStyle={styles.btntitle}
            loading={Loading}
            disabled={Loading}
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
              {SelectimageFormain ? <TouchableOpacity
                style={styles.modlbtn}
                hitSlop={styles.hitslop}
                onPress={() => {
                  setMainimageindex(presIndex);
                  setImagePickermodal(false)


                }}>
                <ResponsiveText style={styles.buttonTextcancel}>
                  Make as Main Image
                </ResponsiveText>
              </TouchableOpacity> : null}
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
              minLength={2}
              autoFocus={true}
              fetchDetails={true}
              currentLocation={true} // Set this prop to true
              listViewDisplayed={true}
              currentLocationLabel={Locationname}
              styles={{
                textInputContainer: {

                  marginTop: Platform.OS == 'ios' ? hp(4) : 4
                },
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


      

      <CustomModal
        modalVisible={copyModal}
        animationType={'fade'}
        setModalVisible={setcopyModal}
      >
        <View style={styles.mainview}>
          <CloseIcon
            size={5}
            style={{
              width: wp(6),
              height: wp(6),
              alignSelf: 'flex-end',
              position: 'absolute',
              top: hp(-2.5),
              right: hp(-1.5),
            }}
            onPress={() => {
              setcopyModal(false);
              setTimeout(() => {
                props.navigation.navigate('TabBarNav', {
                  screen: 'Home',
                });
              }, 500);
            }}
          />

         <View>
         <LottieView
            source={require('../../../Lotianimations/test_done.json')}
            autoPlay
            loop={false}
            style={{width: wp(50), height: wp(40), alignSelf: 'center'}}
          />
         <ResponsiveText style={styles.title}>
            Congratulations!
          </ResponsiveText>
          <ResponsiveText style={styles.descriptionText}>
            Your item has been posted successfully! 🎉.
          </ResponsiveText>
         </View>

          {/* Share Button */}
          {/* <TouchableOpacity onPress={() => Sharedata()} style={styles.rowviewmodal}>
            <ResponsiveText style={styles.textshare}>Share Item</ResponsiveText>
            <Image source={Images.Share} style={{ ...styles.shareimage, height: wp(4), tintColor: Colors.secondaryColor }} />
          </TouchableOpacity> */}

          {/* Copy Button */}
          {/* <TouchableOpacity onPress={() => { copyToClipboard(); setcopyModal(false); }} style={styles.rowviewmodal}>
            <ResponsiveText style={styles.textshare}>Copy Item</ResponsiveText>
            <Image source={Images.Copy} style={styles.shareimage} />
          </TouchableOpacity> */}
        </View>
      </CustomModal>





      {/* Modal first time show */}

      <CustomModal
        modalVisible={ModalVisibale}
        setModalVisible={setModalVisibale}
      // height={hp(30)}

      >
        <View style={styles.textOffer}>
          {/* <TouchableOpacity style={styles.crosbtn} hitSlop={styles.hitslop} onPress={() => setModalVisibale(false)}>
            <Image

              source={Images.close}
              style={styles.closeBUtton}
            />
          </TouchableOpacity> */}
          {/* <CloseIcon style={{ ...styles.crosbtn, ...styles.closeBUtton }} onPress={() => setModalVisibale(false)} /> */}

          <ResponsiveText style={styles.texxxx}>
            You're almost there!
          </ResponsiveText>

          <ResponsiveText style={styles.subText}>
            {/* You are almost there. Add  your first listing in under a minute and start swapping */}
            You're almost there! The last step is to upload an item, and we'll show you something worth swapping it for!

            {/* <ResponsiveText>
              {' '}
            </ResponsiveText>
            <Image
              source={Images.additeminactive}
              style={styles.btnimg}
            />
            <ResponsiveText>
              {' '}
            </ResponsiveText>
            and add one. */}
          </ResponsiveText>





          <Button
            title={'Continue'}
            btnContainer={styles.offerbtn}
            onPress={() => setModalVisibale(false)}
          />

          {/* <View style={{ height: hp(2) }} /> */}
        </View>
      </CustomModal>
      <CustomModal
        modalVisible={LocationAlertModal}
        setModalVisible={setLocationAlertModal}
      // height={hp(30)}

      >
        <View style={styles.textOffer}>
          {/* <TouchableOpacity style={styles.crosbtn} hitSlop={styles.hitslop} onPress={() => { setLocationAlertModal(false) }}>
            <Image

              source={Images.close}
              style={styles.closeBUtton}
            />
          </TouchableOpacity> */}
          <CloseIcon style={{ ...styles.crosbtn, ...styles.closeBUtton }} onPress={() => setLocationAlertModal(false)} />


          <ResponsiveText style={[styles.subText, { marginTop: hp(4) }]}>
            You have chosen an address, and for security reasons, we are selecting somewhere nearby for your privacy.

            {/* <ResponsiveText>
              {' '}
            </ResponsiveText>
            <Image
              source={Images.additeminactive}
              style={styles.btnimg}
            />
            <ResponsiveText>
              {' '}
            </ResponsiveText>
            and add one. */}
          </ResponsiveText>





          <Button
            title={'Continue'}
            btnContainer={styles.offerbtn}
            onPress={() => { setLocationAlertModal(false) }}
          />

          {/* <View style={{ height: hp(2) }} /> */}
        </View>
      </CustomModal>




      <CustomModal
        modalVisible={CreateAccountModal}
        setModalVisible={setCreateAccountModal}
      // height={hp(30)}

      >
        <View style={styles.textOffer}>
          {/* <TouchableOpacity style={styles.crosbtn} hitSlop={styles.hitslop} onPress={() => handleAccountModal()}>
            <Image

              source={Images.close}
              style={styles.closeBUtton}
            />
          </TouchableOpacity> */}
          {/* <CloseIcon style={{ ...styles.crosbtn, ...styles.closeBUtton }} onPress={() => handleAccountModal()} /> */}


          {/* <ResponsiveText style={styles.texxxx}>
            Great! You have successfully created an account. To continue swapping upload an item. It only takes a second.
          </ResponsiveText>*/}
          <ResponsiveText style={styles.texxxx}>
            You're almost there!
          </ResponsiveText>
          <ResponsiveText style={styles.subText}>
            You're almost there! The last step is to upload an item, and we'll show you something worth swapping it for!

          </ResponsiveText>





          <Button
            title={'Continue'}
            btnContainer={styles.offerbtn}
            onPress={() => setCreateAccountModal(false)}
          />



          {/* <View style={{ height: hp(2) }} /> */}
        </View>
      </CustomModal>

    </Container>
  );
};

export default Additem;
