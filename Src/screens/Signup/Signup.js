import {
  Image,
  ScrollView,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/Container';
import Header from '../../components/Header';
import styles from './styles';
import Images from '../../components/Images';
import TextInputcomp from '../../components/TextInputcomp';
import Button from '../../components/Button';
import Colors from '../../theme/colors';
import ResponsiveText from '../../components/ResponsiveText';
import { useSignupMutation } from '../../Graphql/Graphql';
import ErrorModal from '../../components/ErrorModal';
import { Savematchingitem, saveUserCradential, SaveUserId } from '../../redux/actions/userDataAction';
import { useDispatch } from 'react-redux';
import { AppEventsLogger } from 'react-native-fbsdk-next';
import { heightPercentageToDP } from '../../components/Responsiveui';
import { getErrorString } from '../../helper/global';

const Signup = props => {

  const [signupMutation, { loading, error, data }] = useSignupMutation();
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [emailaddress, setemailaddress] = useState('');
  const [password, setpassword] = useState('');
  const [confirmpassword, setconfirmpassword] = useState('');
  const [confirmpasvalidation, setconfirmpasvalidation] = useState(false);
  const [passvalidation, setpassvalidation] = useState(false);
  const [errorModal, seterrorModal] = useState(false);
  const [errorMessage, seterrorMessage] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const dispatch = useDispatch();


  useEffect(() => {
    const timer = setTimeout(() => {
      setGeneralError('')
    }, 300000); // 5 minutes in milliseconds
    return () => clearTimeout(timer);
  }, [generalError]);

  const validate = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (!FirstName) {
      newErrors.firstName = 'Please enter your first name.';
    }
    if (!LastName) {
      newErrors.lastName = 'Please enter your last name.';
    }
    if (!emailaddress) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/\S+@\S+\.\S+/.test(emailaddress)) {
      newErrors.email = 'Email is invalid';
    }
    if (!password) {
      newErrors.password = 'Please enter your password.';
    }
    if (!confirmpassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    }

    if (password != confirmpassword) {
      newErrors.confirmPassword = 'The passwords you entered do not match.';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleChange = (name, value) => {

    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };



    if (value.trim() === '') {

      if (name === "firstName") {
        newErrors.firstName = 'Please enter your first name.';
      }
      else if (name === "lastName") {
        newErrors.lastName = 'Please enter your last name.';
      }
      else if (name === "email") {
        newErrors.email = 'Please enter your email address.';
      }
      else if (name === "password") {
        newErrors.password = 'Please enter your password.';
      }
      else if (name === "confirmPassword") {
        newErrors.confirmPassword = 'Please confirm your password.';
      }

      setErrors(newErrors);
    } else {
      setErrors({ ...errors, [name]: '' }); // Clear error if input is not empty
    }
  };


  const onSignup = async () => {
    seterrorModal(false);
    seterrorMessage(``);

    // if (emailaddress === '') {
    //   seterrorModal(true);
    //   seterrorMessage(`Please enter your email address`);
    // } else if (password === '') {
    //   seterrorModal(true);
    //   seterrorMessage(`Please enter your password`);
    // } else if (confirmpassword === '') {
    //   seterrorModal(true);
    //   seterrorMessage(`Please confirm your password`);
    // } else if (confirmpassword !== password) {
    //   seterrorModal(true);
    //   seterrorMessage(`Passwords do not match`);
    // } else if (FirstName === '') {
    //   seterrorModal(true);
    //   seterrorMessage('Please enter your first name');
    // } else if (LastName === '') {
    //   seterrorModal(true);
    //   seterrorMessage('Please enter your last name');
    // } 

    if (validate()) {
      try {
        const result = await signupMutation({
          variables: {
            user: {
              email: emailaddress.trim(),
              firstName: FirstName,
              lastName: LastName,
            },
            password: password.trim(),
          },
        });
        dispatch(Savematchingitem(null));
        dispatch(SaveUserId(''))


        const objectdata = {
          email: '',
          password: '',
        }


        dispatch(saveUserCradential(objectdata));

        if (result?.data) {
          AppEventsLogger.logEvent('User Registered');
          props.navigation.navigate('OtpScreen', {
            email: emailaddress.trim(),
            password: password.trim(),
            mode: 'create',
            registerUser: result?.data?.registerUser,
          });
        }
      } catch (error) {
        if (error?.message.toString().includes('is already taken')) {
          // seterrorModal(true);
          // seterrorMessage(`The email ${emailaddress} is already registered`);
          setErrors({ ...errors, ["email"]: `The email ${emailaddress} is already registered` });
        } else if (error?.message.toString().includes('Passwords must be at least 6 characters.')) {
          setErrors({ ...errors, ["password"]: `Passwords must be at least 6 characters long, contain at least one digit ('0'-'9'), and include at least one uppercase letter ('A'-'Z')` });
          // seterrorModal(true);
          // seterrorMessage(`Passwords must be at least 6 characters long, contain at least one digit ('0'-'9'), and include at least one uppercase letter ('A'-'Z')`);
        } else if (error?.message.toString().includes('invalid')) {
          // seterrorModal(true);
          // seterrorMessage(`The email address ${emailaddress} is invalid`);
          setErrors({ ...errors, ["email"]: `The email address ${emailaddress} is invalid` });
        } else {
          // seterrorModal(true);
          // seterrorMessage(error?.message.toString());
          setGeneralError(getErrorString(error))
        }
      }
    }
  };

  function validatePassword(value, input) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;


    let res = passwordRegex.test(value);


    if (input == 'password') {
      setpassvalidation(!res)
    } else {
      if (password != value) {
        setconfirmpasvalidation(true)
      }
      else {

        setconfirmpasvalidation(!res)
      }
    }
  }

  return (
    <Container>
      <View style={styles.headerview}>
        <Header title={''} onPress={() => props.navigation.goBack()} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: heightPercentageToDP(30) }} style={styles.mainView}>
        <View style={styles.imageview}>
          <Image
            source={Images.logoSimple}
            style={styles.logostyle}
            resizeMode="contain"
          />
        </View>
        <View style={styles.inputview}>
          <TextInputcomp
            placeholder={'First name'}
            value={FirstName}
            keyboardType={''}
            onChangeText={(text) => {
              handleChange("firstName", text)
              setFirstName(text?.replace(/[^a-zA-Z]/g, ''))
            }}
          />
          {errors.firstName ?
            <ResponsiveText style={styles.error}>
              {errors.firstName}
            </ResponsiveText>
            : null}

          <TextInputcomp
            placeholder={'Last name'}
            value={LastName}
            onChangeText={(text) => {
              handleChange("lastName", text)
              setLastName(text?.replace(/[^a-zA-Z]/g, ''))
            }}
          />
          {errors.lastName ?
            <ResponsiveText style={styles.error}>
              {errors.lastName}
            </ResponsiveText>
            : null}

          <TextInputcomp
            placeholder={'Email address'}
            value={emailaddress}
            type={'email'}
            onChangeText={(text) => {
              handleChange("email", text)
              setemailaddress(text)
            }}
          />
          {errors.email ?
            <ResponsiveText style={styles.error}>
              {errors.email}
            </ResponsiveText>
            : null}

          <TextInputcomp
            placeholder={'Password'}
            value={password}
            righticon={true}
            error={passvalidation}
            secureTextEntry={true}
            onChangeText={(text) => {
              handleChange("password", text);
              validatePassword(text, 'password'),
                setpassword(text);
            }}
          />
          {errors.password ?
            <ResponsiveText style={styles.error}>
              {errors.password}
            </ResponsiveText>
            : null}

          <TextInputcomp
            placeholder={'Confirm Password'}
            value={confirmpassword}
            righticon={true}
            error={confirmpasvalidation}
            secureTextEntry={true}
            onChangeText={(text) => {
              handleChange("confirmPassword", text);
              validatePassword(text, 'Confirmpassword');
              setconfirmpassword(text);
            }}
          />
          {errors.confirmPassword ?
            <ResponsiveText style={styles.error}>
              {errors.confirmPassword}
            </ResponsiveText>
            : null}
        </View>

        <View style={styles.brnview}>
          <ResponsiveText style={styles.frogettext}>
            {'Create a password with at least 6 characters, including one uppercase, one lowercase, one special character, and one number.'}
          </ResponsiveText>

          {generalError ?
            <ResponsiveText style={styles.error}>
              {generalError}
            </ResponsiveText>
            : null}

          <Button
            btnContainer={{}}
            onPress={() => onSignup()}
            title={'Continue'}
            titleStyle={styles.btntitle}
            loading={loading}
            loadingColor={Colors.secondaryColor}
          />
        </View>
      </ScrollView>
      {errorModal && <ErrorModal
        modalVisible={errorModal}
        setModalVisible={seterrorModal}
        errorMessage={errorMessage}
      />
      }
    </Container>
  );
};

export default Signup;
