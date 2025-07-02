import {
  Image,
  StyleSheet,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Container from '../../components/Container';
import styles from './styles';
import { SuccessToast } from '../../components/SuccessToast';
import { UpdateMobilenumber } from '../../Graphql/Graphql';
import { heightPercentageToDP as hp, widthPercentageToDP } from '../../components/Responsiveui';
import ResponsiveText from '../../components/ResponsiveText';
import Loader from '../../components/Loader';
import { getErrorString } from '../../helper/global';
import Colors from '../../theme/colors';
import PhoneNumberInput from '../../components/PhoneNumberInput';
import { ErrorToast } from '../../components/ErrorToast';
import Button from '../../components/Button';

const AddphoneNumber = props => {
  const [phonenumber, setphonenumber] = useState('');
  const [CountryCOde, setCountryCOde] = useState('1');
  const [ErrorMessage, setErrorMessage] = useState('');
  const [Loading, setLoading] = useState(false);
  const [updateUsermobilenumber] = UpdateMobilenumber();
  const HandlePhonenumber = async () => {
    try {
      if (phonenumber) {
        const phnRegex = /^\+?(\d{1,4})?\d{7,14}$/;
        if (!phnRegex.test(phonenumber)) {
          ErrorToast({
            title: 'Error',
            text: 'Mobile number is invalid',
          });
          return
        }
        setLoading(true)
        const Updateresponse = await updateUsermobilenumber({
          variables: {
            mobile: CountryCOde + phonenumber,
          },
        });

        if (Updateresponse) {
          SuccessToast({
            title: 'Done',
            text: 'Done',
          });

          setTimeout(() => {
            props?.navigation?.replace('Addprofile');

          }, 10);
          setLoading(false)

        }
      } else {
        alert('Please enter your phone number')
        setLoading(false)

        // props?.navigation?.replace('Addprofile');
      }
    } catch (error) {
      setLoading(false)
      setErrorMessage(getErrorString(error))

    } finally {
      setLoading(false)
    }
  };

  return (
    <Container style={styles.container}>
      <View style={{ flex: 1, paddingVertical: hp(10), padding: widthPercentageToDP(5) }}>
        <PhoneNumberInput
          countryCode={CountryCOde}
          setCountryCode={setCountryCOde}
          phoneNumber={phonenumber}
          setPhoneNumber={setphonenumber}
        />

        {/* <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: hp(3),
          }}
          onPress={() => HandlePhonenumber()}>
          <ResponsiveText style={styles.adphototxt}>
            {'Continue'}
          </ResponsiveText>
        </TouchableOpacity> */}

        <Button
          onPress={() => {
            HandlePhonenumber()
          }}
          title={'Continue'}
          titleStyle={styles.btntitle}
          // loading={loading}
          loadingColor={Colors.secondaryColor}
          btnContainer={{
            marginTop: hp(25),
          }}
        />

        <ResponsiveText style={{
          color: Colors.redcolor, fontSize: 12, textAlign: 'center'
        }}>
          {ErrorMessage}
        </ResponsiveText>
        <Loader
          loading={Loading}
        />
      </View>
      <View style={{ flex: 0.2, alignItems: 'flex-end', justifyContent: "flex-end" }}>
        <ResponsiveText style={{ marginRight: 20, fontSize: 16, color: 'black', }}>
          1/6
        </ResponsiveText>
        <View style={{ height: 20 }} />


      </View>
    </Container>
  );
};

export default AddphoneNumber;
