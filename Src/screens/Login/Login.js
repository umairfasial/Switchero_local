import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, Platform, TouchableOpacity, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import styles from './styles';
import Colors from '../../theme/colors';
import Header from '../../components/Header';
import Images from '../../components/Images';
import Button from '../../components/Button';
import { getErrorString } from '../../helper/global';
import Container from '../../components/Container';
// import {useSignInMutation} from '../../Graphql/types';
import TextInputcomp from '../../components/TextInputcomp';
import ResponsiveText from '../../components/ResponsiveText';
import { useSignInMutation } from '../../Graphql/Graphql';
import ErrorModal from '../../components/ErrorModal';
import { StackActions } from '@react-navigation/native';
import { SaveUserId, Savematchingitem, saveUserCradential } from '../../redux/actions/userDataAction';
import { useDispatch, useSelector } from 'react-redux';
import { _signInWithGoogle } from './googleLogin';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';

import { Settings, LoginManager, AccessToken } from 'react-native-fbsdk-next';

import { loginWithAppleMutation, loginWithFacebookMutation, loginWithGoogleMutation } from '../../Apis/Apis';
import { logLoginEvent } from '../../helper/EventsTracking';
import { heightPercentageToDP, widthPercentageToDP } from '../../components/Responsiveui';

const Login = props => {
  Settings.initializeSDK();

  const [signInMutation, { loading }] = useSignInMutation();
  const state = useSelector(state => state.userdataReducer.remember)
  const prevuser = useSelector(state => state.userdataReducer.totalScore)

  useEffect(() => {
    GoogleSignin.signOut()
    LoginManager.logOut();
    // Settings.setAppID(419098410568608);
    Settings.setClientToken('ab7e42650a3b7fc608305fd1fc859ef9');



    GoogleSignin.configure({
      offlineAccess: true,
      webClientId: '752477583659-90a2dgd5ln0t9sigelhsjlmem1fv62md.apps.googleusercontent.com',
      scopes: ['profile', 'email', 'https://www.googleapis.com/auth/user.birthday.read',
        'https://www.googleapis.com/auth/user.gender.read'],
    });

  }, [])






  const dispatch = useDispatch();
  // const [signIn, {loading}] = useSignInMutation();

  const [emailaddress, setemailaddress] = useState(state?.email);
  const [password, setpassword] = useState(state?.password);
  const [errorModal, seterrorModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [Remember, setRemember] = useState(state?.email ? true : false);
  const [errorMessage, seterrorMessage] = useState('');
  const [error, setError] = useState({
    email: '',
    password: ''
  });

  const validateEmail = (input) => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };


  const handleEmailChange = (input) => {
    setemailaddress(input);
    if (input == '') {
      setError((prev) => ({ ...prev, email: 'Please enter your email address.' }));
    }
    else if (!validateEmail(input)) {
      setError((prev) => ({ ...prev, email: 'Invalid email address.' }));
    }

    else {
      setError((prev) => ({ ...prev, email: '' }));
    }
  };

  const handlePasswordChange = (input) => {
    setpassword(input);
    if (input === '') {
      setError((prev) => ({ ...prev, password: 'Please enter your password.' }));
    } else {
      setError((prev) => ({ ...prev, password: '' }));
    }
  };

  const LoginWithGoogle = async () => {
    try {
      GoogleSignin.signOut()
      const userInfo = await _signInWithGoogle()

      if (userInfo?.idToken) {
        const response = await loginWithGoogleMutation(userInfo?.idToken, userInfo?.gender, userInfo?.dateOfBirth)
        console.log('response of login', response?.data?.signInGoogle);

        if (response?.data) {


          if (prevuser != response?.data?.signInGoogle?.id) {
            dispatch(Savematchingitem(null));
          }
          dispatch(SaveUserId(response?.data?.signInGoogle?.id))
          props.navigation.dispatch(StackActions.replace('MainStack'))
          logLoginEvent('Login_with_Google');



        }
      }
    } catch (error) {
      console.log('Error from login with Google', error);
      // Handle the error, maybe show an alert to the user
    }
  };


  const PERMISSIONS = ['public_profile', 'email'];

  const handleFacebookLogin = async () => {
    try {
      const currentAccessToken = await AccessToken.getCurrentAccessToken();
      if (currentAccessToken) {
        console.log('getCurrentAccessToken', currentAccessToken.accessToken);

        const response = await loginWithFacebookMutation(currentAccessToken.accessToken)
        console.log('responseresponse handleFacebookLogin', response);



        if (response?.data) {


          if (prevuser != response?.data?.signInFacebook?.id) {
            dispatch(Savematchingitem(null));
          }
          dispatch(SaveUserId(response?.data?.signInFacebook?.id))
          props.navigation.dispatch(StackActions.replace('MainStack'))
          logLoginEvent('Login_with_Facebook');



        }
      }
      else {
        const logInResponse = await LoginManager.logInWithPermissions(PERMISSIONS);

        console.log('logInResponse', logInResponse);
        const accessTokenObject = await AccessToken.getCurrentAccessToken();

        console.log(accessTokenObject.accessToken);
        const response = await loginWithFacebookMutation(accessTokenObject.accessToken)
        console.log('responseresponse handleFacebookLogin', response);
        if (response?.data) {


          if (prevuser != response?.data?.signInFacebook?.id) {
            dispatch(Savematchingitem(null));
          }
          dispatch(SaveUserId(response?.data?.signInFacebook?.id))
          props.navigation.dispatch(StackActions.replace('MainStack'))
          logLoginEvent('Login_with_Google');



        }
      }


    } catch (error) {
      console.log('Login failed', error);
    }
  };

  const onPressLogin = async () => {

    // props.navigation.navigate('TabBarNav');
    seterrorModal(false)
    seterrorMessage('')
    if (emailaddress == '') {
      setError((prev) => ({ ...prev, email: 'Please enter your email address.' }));
      // seterrorModal(true)
      // seterrorMessage('Please enter the email address')
    } if (password == '') {
      setError((prev) => ({ ...prev, password: 'Please enter your password.' }));
      // seterrorModal(true)
      // seterrorMessage('Please enter the password')
    } else {
      try {
        const signInResponse = await signInMutation({
          variables: {
            email: emailaddress.trim(),
            password: password.trim(),
          },
        });
        console.log('signInResponse===>>>>>', signInResponse);
        //Once getting the error
        if (
          !signInResponse.data ||
          !signInResponse.data.signIn ||
          !signInResponse.data.signIn.id
        ) {
          throw new Error('Log in failed');
        } else {

          console.log('prevuser != signInResponse?.data?.signIn?.id', prevuser, '\n*******(*(*(*(\n', signInResponse?.data?.signIn?.id);

          if (prevuser != signInResponse?.data?.signIn?.id) {
            dispatch(Savematchingitem(null));
          }
          dispatch(SaveUserId(signInResponse?.data?.signIn?.id))

          if (Remember) {

            const objectdata = {
              email: emailaddress.trim(),
              password: password.trim(),
            }


            dispatch(saveUserCradential(objectdata));
          }

          else {

            const objectdata = {
              email: '',
              password: ''
            }


            dispatch(saveUserCradential(objectdata));
          }
          props.navigation.dispatch(StackActions.replace('MainStack'))
          logLoginEvent('Login_with_Email');

          //Success response
          // props.navigation.replace('TabBarNav',{
          //   screen:'Home'
          // });
        }
      } catch (err) {
        //Failure response
        console.log('Log in error', err);

        if (err.message.toString().includes('Account not Actived')) {
          setModalVisible(true)
        }
        else {
          seterrorModal(true)
          seterrorMessage(getErrorString(err))
        }

      }
    }
  };

  const verificationCode = () => {
    try {
      props.navigation.navigate('OtpForverifay', {
        emailaddress: emailaddress

      })
      setModalVisible(false)
    } catch (error) {
      console.log('error on verification code', error);
    }
  }


  async function onAppleButtonPress() {
    // Start the sign-in request
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Get user credentials
      console.log('appleAuthRequestResponseappleAuthRequestResponse', appleAuthRequestResponse);
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
      console.log('credentialStatecredentialState', credentialState);


      const response = await loginWithAppleMutation(appleAuthRequestResponse?.identityToken, appleAuthRequestResponse?.fullName?.givenName ?? '')
      console.log('response of login,prevuser', response);

      if (response?.data) {


        if (prevuser != response?.data?.signInApple?.id) {
          dispatch(Savematchingitem(null));
        }
        dispatch(SaveUserId(response?.data?.signInApple?.id))
        props.navigation.dispatch(StackActions.replace('MainStack'))
        logLoginEvent('Login_with_Apple');


      }

    } catch (error) {
      console.error(error);
    }
  }



  const VerifayModal = () => {
    return <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {

        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ResponsiveText style={styles.modalText}>
            Your account is currently unverified. Please verify your email address and then log in!
          </ResponsiveText>
          <Button
            title={'Verify your account'}
            btnContainer={styles.verifaybtn}
            onPress={() => verificationCode()}
          />
        </View>
      </View>
    </Modal>
  }

  return (
    <Container>
      <View style={styles.headerview}>
        <Header title={''} onPress={() => props.navigation.goBack()} />
      </View>
      <View style={styles.mainView}>
        <View style={styles.imageview}>
          <Image
            source={Images.logoSimple}
            style={styles.logostyle}
            resizeMode="contain"
          />
        </View>
        <View style={styles.inputview}>
          <TextInputcomp
            placeholder={'Email address'}
            value={emailaddress}
            //onChangeText={setemailaddress}
            onChangeText={handleEmailChange}
            type={'email'}
          />

          {error.email ?
            <ResponsiveText style={styles.error}>
              {error.email}
            </ResponsiveText>
            : null}

          <TextInputcomp
            placeholder={'Password'}
            value={password}
            // onChangeText={setpassword}
            onChangeText={handlePasswordChange}
            righticon={true}
            secureTextEntry={true}

          />
          {error.password ?
            <ResponsiveText style={styles.error}>
              {error.password}
            </ResponsiveText>
            : null}

        </View>
        {/* <TouchableOpacity style={styles.remembermemain} activeOpacity={0.8} onPress={() => setRemember(!Remember)}>
          <Image
            source={Remember ? Images.checkbox : Images.uncheckbox}
            style={styles.checkbox}
          />
          <ResponsiveText style={styles.remembertext}>
            {'Remember me!'}
          </ResponsiveText>
        </TouchableOpacity> */}

        <View style={styles.brnview}>
          <TouchableOpacity onPress={() => props.navigation.navigate('ForgotPassword')}>
            <ResponsiveText style={styles.frogettext}>
              {'Forgot Password?'}
            </ResponsiveText>
          </TouchableOpacity>
          <Button
            onPress={onPressLogin}
            title={'Log in'}
            titleStyle={styles.btntitle}
            loading={loading}
            loadingColor={Colors.secondaryColor}
          />
        </View>

        <ResponsiveText style={styles.ortext}>{'OR'}</ResponsiveText>
        <TouchableOpacity onPress={() => handleFacebookLogin()} style={styles.socialbtn}>
          <View style={styles.rowView}>
            <Image source={Images.facebookIcon} style={[styles.btnimg, {
              width: widthPercentageToDP(8),
              height: heightPercentageToDP(4),
            }]} />
            <ResponsiveText style={styles.btntext}>
              {'Continue with Facebook'}
            </ResponsiveText>
          </View>
        </TouchableOpacity>




        <TouchableOpacity

          onPress={() => LoginWithGoogle()}
          style={{ ...styles.socialbtn, backgroundColor: Colors.black, }}>
          <View style={styles.rowView}>
            <Image source={Images.googleIcon} style={[styles.btnimg, {
              width: widthPercentageToDP(8),
              height: heightPercentageToDP(5),
              marginEnd: widthPercentageToDP(5)
            }]} />
            <ResponsiveText style={[styles.btntext, { left: widthPercentageToDP(-5), }]}>
              {'Continue with Google'}
            </ResponsiveText>
          </View>
        </TouchableOpacity>




        {Platform.OS == 'ios' ?
          <TouchableOpacity

            onPress={() => onAppleButtonPress()}
            style={{ ...styles.socialbtn, backgroundColor: 'black' }}>
            <View style={styles.rowView}>
              <Image source={Images.appleLogin} resizeMode='contain' style={styles.applelogin} />
              <ResponsiveText style={styles.btntext}>
                {'Continue with Apple'}
              </ResponsiveText>
            </View>
          </TouchableOpacity>

          : null
        }
      </View>
      {errorModal && <ErrorModal
        modalVisible={errorModal}
        setModalVisible={seterrorModal}
        errorMessage={errorMessage}
      />
      }

      <VerifayModal />
    </Container>
  );
};

export default Login;
