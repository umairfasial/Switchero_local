import {
  Image,
  StyleSheet,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Container from '../../../components/Container';
import Colors from '../../../theme/colors';
import styles from './styles';
import ResponsiveText from '../../../components/ResponsiveText';
import Images from '../../../components/Images';
import Button from '../../../components/Button';
import Slider from 'react-native-slider';
import { Fonts } from '../../../theme/Fonts';

import {
  UpdateDOB,
  UpdateDistance,
  UpdateGender,
  UpdateMobilenumber,
  UpdateUserLocat,
} from '../../../Graphql/Graphql';
import { SuccessToast } from '../../../components/SuccessToast';
import PhoneInput from 'react-native-phone-number-input';
import DateTimePicker from '@react-native-community/datetimepicker';
import { UserNameUpdate, apiKey, getAddressFromLatLng } from '../../../Apis/Apis';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import TextInputcomp from '../../../components/TextInputcomp';
import { heightPercentageToDP, widthPercentageToDP as wp } from '../../../components/Responsiveui';
import Geolocation from '@react-native-community/geolocation';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CheckTheme } from '../../../helper/global';
import { GlobalStyles } from '../../../utils/globalStyles';
import PhoneNumberInput from '../../../components/PhoneNumberInput';
import { ErrorToast } from '../../../components/ErrorToast';
import moment from 'moment';
const SettingDetail = props => {
  const isDarkTheme = CheckTheme()

  let data = props.route.params.data;
  let fieldname = props.route.params.fieldname;
  const [Distance, setDistance] = useState(data?.distance ? data?.distance : 0);
  const [selectedGender, setSelectedGender] = useState(data?.gender);
  const [phonenumber, setphonenumber] = useState(
    data?.mobile ? data?.mobile?.slice(-10) : '',
  );
  const [Locationname, setLocationname] = useState(data);
  const [Location, setLocation] = useState({});
  const [CountryCOde, setCountryCOde] = useState(
    data?.mobile ? data?.mobile?.slice(0, -10) : '1',
  );
  function isNumber(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
  }
  const phoneInput = useRef(null);
  const [updateUserDistance] = UpdateDistance();
  const [UpdateUsergender] = UpdateGender();
  const [UpdateDateofbirh] = UpdateDOB();
  const [updateUsermobilenumber] = UpdateMobilenumber();
  const [UpdateUserLocation] = UpdateUserLocat();
  // date
  const [date, setDate] = useState(new Date());
  const [dateToShow, setdateToShow] = useState();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [firstName, setfirstName] = useState(data?.firstName ?? '');
  const [lastName, setlastName] = useState(data?.lastName ?? '');
  const [Curentlocationname, setCurentlocationname] = useState();
  const [error, setError] = useState(null);
  const [isCode, setIsCode] = useState(false);
  const maxDate = moment().subtract(18, 'years').toDate();

  const handleDateChange = (event, currentDate) => {
    setShowDatePicker(false);
    // const currentDate = selectedDate
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    let formateddate = new Date(currentDate).toLocaleDateString(
      undefined,
      options,
    );
    setdateToShow(formateddate);
    setShowDatePicker(false);
    setDate(currentDate);
  };

  let genderaray = [
    {
      name: 'Male',
      id: 1,
    },
    {
      name: 'Female',
      id: 2,
    },
    {
      name: 'Others',
      id: 3,
    },
  ];


  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = new Date(date).toLocaleDateString('en-US', options);
    console.warn("A date has been picked: ", formattedDate);
    setdateToShow(formattedDate)
    setDate(date);
    setShowDatePicker(false);
  };
  useEffect(() => {
    getCurrentLocation()


    if (!data?.dateOfBirth) {
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      let formateddate = new Date(date).toLocaleDateString(undefined, options);
      setdateToShow(formateddate);
    } else {
      const dateParts = data?.dateOfBirth.split('-');
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10);
      const day = parseInt(dateParts[2], 10);



      const date = new Date(Date.UTC(year, month - 1, day));

      setDate(date);

      setdateToShow(`${month}/${day}/${year}`);
    }
  }, []);

  useEffect(() => {
    // Set a delay of 2 seconds (2000ms)
    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    // Cleanup the timeout when the component unmounts or re-renders
    return () => clearTimeout(timer);
  }, [error]);

  const getCurrentLocation = async () => {
    Geolocation.getCurrentPosition(info => {

      getAddressFromLatLng(info.coords?.latitude, info.coords?.longitude)
        .then(address => setCurentlocationname(address))
        .catch(error => console.error(error.message));
    });
  };





  const today = new Date();
  // const maxDate = new Date(
  //   today.getFullYear(),
  //   today.getMonth(),
  //   today.getDate(),
  // );

  //

  const HandleDistanceupdate = async () => {
    try {
      const Updateresponse = await updateUserDistance({
        variables: {
          distance: parseInt(Distance),
        },
      });
      if (Updateresponse?.data?.updateUserDistance) {
        SuccessToast({
          title: 'Congratulation',
          text: 'Distance updated successfully ',
        });
        props?.navigation?.goBack();
      }
    } catch (error) {
    }
  };

  const HandleUpdateLocation = async () => {
    try {
      const Updateresponse = await UpdateUserLocation({
        variables: {
          latitude: Location?.latitude,
          longitude: Location?.longitude,
        },
      });
      if (Updateresponse) {
        SuccessToast({
          title: 'Congratulation',
          text: 'Location updated successfully ',
        });
        props?.navigation?.goBack();
      }
    } catch (error) {
    }
  };

  const HandleGender = async () => {
    try {
      if (selectedGender) {
        const Updateresponse = await UpdateUsergender({
          variables: {
            gender: selectedGender,
          },
        });

        if (Updateresponse) {
          SuccessToast({
            title: 'Congratulation',
            text: 'Gender change successfully ',
          });
          props?.navigation?.goBack();
        }
      } else {
        props?.navigation?.goBack();
      }
    } catch (error) {
    }
  };

  const Handledob = async () => {
    try {
      if (data) {
        const Updateresponse = await UpdateDateofbirh({
          variables: {
            dateOfBirth: dateToShow.toString(),
          },
        });

        if (Updateresponse) {
          SuccessToast({
            title: 'Congratulation',
            text: 'Date of birth change successfully ',
          });
          props?.navigation?.goBack();
        }
      } else {
        props?.navigation?.goBack();
      }
    } catch (error) {
    }
  };

  const HandlePhonenumber = async () => {
    try {
      if (phonenumber) {
        const phnRegex = /^\+?(\d{1,4})?\d{7,14}$/;
        if (!phnRegex.test(phonenumber)) {
          setError('Mobile number is invalid.')
          ErrorToast({
            title: 'Error',
            text: 'Mobile number is invalid',
          });
          return
        }
        const Updateresponse = await updateUsermobilenumber({
          variables: {
            mobile: CountryCOde + phonenumber,
          },
        });
        if (Updateresponse) {
          setError(null)
          SuccessToast({
            title: 'Congratulation',
            text: 'Mobile number changed successfully ',
          });
          props?.navigation?.goBack();
        }
      } else {
        props?.navigation?.goBack();
      }
    } catch (error) {
    }
  };

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


  const handleUsernameUpdate = async () => {
    try {
      let response = UserNameUpdate(firstName ?? data?.firstName, lastName ?? data?.lastName)
      SuccessToast({
        title: 'Congratulation',
        text: 'Your name changed successfully ',
      });
      props?.navigation?.goBack();

    } catch (error) {
    }
  }
  return (
    <Container style={styles.container}>
      <View style={styles.headerView}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <ResponsiveText style={styles.headerText}>{'Cancel'}</ResponsiveText>
        </TouchableOpacity>
        <ResponsiveText style={styles.headerText}>
          {fieldname ? fieldname : ''}
        </ResponsiveText>
        <TouchableOpacity
          onPress={() =>
            fieldname == 'Distance'
              ? HandleDistanceupdate()
              : fieldname == 'Gender'
                ? HandleGender()
                : fieldname == 'Date of birth'
                  ? Handledob()
                  : fieldname == 'Mobile'
                    ? HandlePhonenumber()
                    : fieldname == 'Location'
                      ? HandleUpdateLocation()
                      : fieldname == 'Full name' ?
                        handleUsernameUpdate()
                        : props.navigation.goBack()
          }>
          <ResponsiveText
            style={{ ...styles.headerText, color: Colors.btncolor }}>
            {'Done'}
          </ResponsiveText>
        </TouchableOpacity>
      </View>
      {fieldname == 'Full name' && (
        <View style={styles.fulnameview}>
          <ResponsiveText style={styles.headingtxt}>
            {'First Name'}
          </ResponsiveText>

          <TextInputcomp
            //placeholder={'First Name'}
            value={firstName}
            onChangeText={setfirstName}
            maxLength={30}
          />
          {/* 
          <View style={styles.borderrow}>
            <ResponsiveText style={styles.titlectext}>
              {data?.firstName}
            </ResponsiveText>
            <Image source={Images.tickcheck} style={styles.tickcheckicon} />
          </View> */}

          <ResponsiveText style={{ ...styles.headingtxt, marginTop: 20 }}>
            {'Last Name'}
          </ResponsiveText>

          <TextInputcomp
            //placeholder={'Last Name'}
            value={lastName}
            onChangeText={setlastName}
            maxLength={30}
          />

          {/* <View style={styles.borderrow}>
            <ResponsiveText style={styles.titlectext}>
              {data?.lastName}
            </ResponsiveText>
            <Image source={Images.tickcheck} style={styles.tickcheckicon} />
          </View> */}

          <ResponsiveText style={styles.disc}>
            {'Only your first name will be displayed publicly.'}
          </ResponsiveText>
        </View>
      )}

      {fieldname == 'Email' && (
        <View style={styles.fulnameview}>
          <View style={styles.borderrow}>
            <ResponsiveText style={styles.emailtext}>
              {data?.email}
            </ResponsiveText>
            <Image source={Images.tickcheck} style={styles.tickcheckicon} />
          </View>

          <ResponsiveText style={styles.disc}>
            {'You can use your email address or mobile number to login.'}
          </ResponsiveText>
        </View>
      )}

      {fieldname == 'Location' && (
        <View style={styles.fulnameview}>
          <ResponsiveText style={styles.headingtxt}>
            {'Current Location'}
          </ResponsiveText>

          <View style={styles.borderrow2}>
            <View style={styles.locatinrow}>
              <Image source={Images.location} style={styles.location} />
              <ResponsiveText style={styles.titlectext2}>
                {Locationname}
              </ResponsiveText>
            </View>
            <Image
              source={Images.tick}
              style={styles.tick}
              resizeMode="contain"
            />
          </View>
          <Button
            onPress={() => {
              setModalVisible(true);
            }}
            btnContainer={{ marginTop: '10%' }}
            title={'Change your location'}
            titleStyle={styles.btntitle}
            // loading={loading}
            loadingColor={Colors.secondaryColor}
          />
        </View>
      )}

      {fieldname == 'Distance' && (
        <View style={styles.fulnameview}>
          <ResponsiveText style={styles.headingtxt}>
            {'Enter Distance'}
          </ResponsiveText>

          <View style={styles.textinputview}>
            <TextInput
              value={Distance > 0 ? Distance.toString() : Distance}
              onChangeText={number => {
                // number = number.replace(/[^0-9]/g, ' ');
                if (number >= 0 && number <= 250) { setDistance(number) }
                if (number.length == 0) {
                  setDistance('')
                }
                else if (number > 250) {
                  setDistance(250)
                }
              }}
              style={styles.input}
              keyboardType="number-pad"
              //placeholder="Enter distance"
              placeholderTextColor={Colors.darkGray}
            />
          </View>
          <View style={styles.slider}>
            <Slider
              value={Number(Distance)}
              onValueChange={newValue => setDistance(parseInt(newValue))}
              minimumTrackTintColor={Colors.primaryColor}
              maximumTrackTintColor={`${Colors.graytext}20`}
              minimumValue={0}
              maximumValue={250}
              thumbTintColor={Colors.primaryColor}
            />
          </View>
          <ResponsiveText style={styles.disc}>
            {`Show items up to `}
            <ResponsiveText
              style={{
                ...styles.disc,
                color: Colors.black,
                fontSize: 16,
                fontFamily: Fonts.FontsBold,
              }}>
              {`${Distance <= 0 ? 0 : parseInt(Distance)} Miles away`}
            </ResponsiveText>
          </ResponsiveText>
        </View>
      )}

      {fieldname == 'Mobile' && (
        <View style={styles.phonenumberinput}>
          {/* <PhoneInput
            ref={phoneInput}
            // defaultValue={phonenumber}
            defaultCode={isNumber(CountryCOde) ? 'US' : data?.mobile?.slice(0, 2) ?? 'US'}
            layout="first"
            onChangeText={text => {
              setphonenumber(text);
            }}
            value={(phonenumber+'').slice(0,10)}
            style={styles.phoneinput}
            onChangeFormattedText={text => {
              // setCountryCOde(text);
            }}
            onChangeCountry={code => {
              setCountryCOde(code?.callingCode[0]);
            }}

            containerStyle={styles.phoneinput}
            textContainerStyle={styles.phonetext}
            withShadow
            autoFocus={false}
          /> */}
          <PhoneNumberInput setCountryCode={setCountryCOde} countryCode={CountryCOde} setPhoneNumber={setphonenumber} phoneNumber={phonenumber} />
        { error && <ResponsiveText style={styles.errorText}>
            {error}
          </ResponsiveText>}
        </View>
      )}

      {fieldname == 'Date of birth' && (
        <View style={styles.ganderradio}>
          {Platform.OS == 'ios' ? (

            <DateTimePickerModal
              date={date}
              isVisible={showDatePicker}
              mode="date"
              onConfirm={handleConfirm}
              textColor={Colors.black}
              maximumDate={maxDate} // Only allow dates >= 18 years ago
              buttonTextColorIOS={Colors.btncolor}
              pickerContainerStyleIOS={{ backgroundColor: Colors.backgroundColor }}
              isDarkModeEnabled={false}
              customCancelButtonIOS={() => (
                <Button
                  title={'cancel'}
                  onPress={() => setShowDatePicker(false)}
                  btnContainer={{ backgroundColor: Colors.white }}
                  titleStyle={{ color: Colors.btncolor }}
                />
              )}
              onCancel={() => setShowDatePicker(false)}
            />
            // <DateTimePicker

            //   testID="dateTimePicker"
            //   value={date}
            //   mode="date"
            //   is24Hour={true}
            //   display=''
            //   onChange={handleDateChange}

            // />
          ) :
            showDatePicker ? <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              maximumDate={new Date()}
              is24Hour={true}
              display='inline'
              onChange={handleDateChange}
            /> : null}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateofb}>
            <ResponsiveText style={styles.dob}>
              {' '}
              Date: {dateToShow}
            </ResponsiveText>

            <Image source={Images.calander} style={styles.calandericon} />
          </TouchableOpacity>
        </View>
      )}

      {fieldname == 'Gender' && (
        <View style={styles.ganderradio}>
          <ResponsiveText style={styles.gender}>{'Choose your gender'}</ResponsiveText>
          {genderaray.map(item => (
            // <TouchableOpacity
            //   onPress={() => setSelectedGender(item.name)}
            //   style={styles.radiobtnrow}>
            //   {item.name == selectedGender ? (
            //     <View style={styles.checkdesign}>
            //       <View style={styles.checkfill} />
            //     </View>
            //   ) : (
            //     <View style={styles.uncheckradio} />
            //   )}
            //   <ResponsiveText style={styles.gendertxt}>
            //     {item?.name}
            //   </ResponsiveText>
            // </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedGender(item.name)}
              style={[styles.genderView, item.name == selectedGender && { borderColor: Colors.primaryColor, borderWidth: 5 }]}>
              <ResponsiveText style={styles.gendertxt}>
                {item?.name}
              </ResponsiveText>
              <Image source={item.name === 'Male' ? Images.male : item.name === 'Female' ? Images.female : Images.other} resizeMode='contain' style={{ width: wp(15), height: wp(15) }} />
            </TouchableOpacity>
          ))}
        </View>
      )}

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
              currentLocationLabel={Curentlocationname}
              onPress={onPress}
              onFail={error => { }}
              onNotFound={() => { }}
              minLength={2}
              autoFocus={true}
              fetchDetails={true}
              currentLocation={true}
              listViewDisplayed={true}
              styles={{
                textInputContainer: {
                  marginTop: Platform.OS == 'ios' ? heightPercentageToDP(4) : 2
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

    </Container>
  );
};

export default SettingDetail;
