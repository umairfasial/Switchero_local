import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { styles } from './styles'
import Header from '../../../components/Header'
import ResponsiveText from '../../../components/ResponsiveText'
import Images from '../../../components/Images'
import Button from '../../../components/Button'
import Colors from '../../../theme/colors'
import { Logoutacountmutaion, clearApolloCache, useDeleteUserMutation } from '../../../Graphql/Graphql'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useApolloClient } from '@apollo/react-hooks'
import { useDispatch } from 'react-redux'
import { saveisFirstinstall } from '../../../redux/actions/userDataAction'
import CustomModal from '../../../components/CustomModal'
import { CheckTheme } from '../../../helper/global'
import { ProfileItem } from '../Profile/Profile'

const PrivacyPolicy = (props) => {
    const isDarkTheme = CheckTheme()

    const client = useApolloClient();
    const [signOut] = Logoutacountmutaion();

    const myPersnolData = props?.route.params.data

    console.log('myPersnolDatamyPersnolData', myPersnolData?.id);
    const dispatch = useDispatch();
    const [deleteUserMutation] = useDeleteUserMutation();

    const [DeleteModal, setDeleteModal] = useState(false);
    const logoutPress = async () => {
        await signOut();

        await AsyncStorage.clear();

        clearApolloCache(client);
        dispatch(saveisFirstinstall(true));
        props.navigation.replace('AuthStack', {
            screen: 'Onboarding',
        });
    };



    const handleDelete = async () => {
        try {
            const { data } = await deleteUserMutation({
                variables: {
                    userIds: [myPersnolData?.id],
                },
            });
            console.log('data response', data); //
            setDeleteModal(false);
            dispatch(saveisFirstinstall(true));
            await AsyncStorage.clear();

            clearApolloCache(client);

            props.navigation.replace('AuthStack', {
                screen: 'Onboarding',
            });
        } catch (error) {
            console.log('error delete', error);
        }
    };




    return (
        <View style={styles.mainView}>


            <View style={styles.headerView}>
                <Header
                    title={'Account center'}
                    onPress={() => props.navigation.goBack()}
                />

            </View>
            <View style={styles.mainView2}>
                <TouchableOpacity onPress={() => props.navigation.navigate('WebViewscreen')} style={styles.rowView}>

                    <ResponsiveText style={styles.titletxt}>
                        {'Privacy Policy'}
                    </ResponsiveText>
                    <Image

                        source={Images.rightarrow}
                        style={styles.rightarow}
                    />
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={() => props.navigation.navigate('MainTermsAndPolicy')}
                style={styles.rowView}>

                    <ResponsiveText style={styles.titletxt}>
                        {'Terms and Conditions'}
                    </ResponsiveText>
                    <Image

                        source={Images.rightarrow}
                        style={styles.rightarow}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.rowView}>
                    <ResponsiveText style={styles.titletxt}>
                        {'FAQ'}
                    </ResponsiveText>
                    <Image
                        source={Images.rightarrow}
                        style={styles.rightarow}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.btnview}>
                <Button
                    title={'Delete Account'}
                    titleStyle={{ color: Colors.white }}
                    btnContainer={styles.deletebtn}
                    onPress={() => setDeleteModal(true)}
                />

                <Button
                    title={'Logout'}
                    titleStyle={{ color: Colors.white }}
                    btnContainer={{ ...styles.deletebtn, marginTop: 2, }}
                    onPress={() => logoutPress()}
                />
            </View>

            <CustomModal modalVisible={DeleteModal} setModalVisible={setDeleteModal}>
                <View style={styles.deletemodal}>
                    <ResponsiveText style={styles.deletetxt}>
                        Are you sure you want to delete your account?
                    </ResponsiveText>
                    <View style={styles.btnrowdeler}>
                        <Button
                            title={'Yes'}
                            btnContainer={styles.btn}
                            onPress={() => handleDelete()}
                        />

                        <Button
                            title={'No'}
                            btnContainer={styles.btnno}
                            onPress={() => setDeleteModal(false)}
                        />
                    </View>
                </View>
            </CustomModal>
        </View>
    )
}

export default PrivacyPolicy
