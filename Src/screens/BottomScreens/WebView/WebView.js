import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ResponsiveText from '../../../components/ResponsiveText';
import Header from '../../../components/Header'
import Colors from '../../../theme/colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../components/Responsiveui';

const WebViewscreen = (props) => {
    return (
        <View style={styles.mainView}>
            <View style={styles.headerView}>
                <Header
                    title={'Privacy Policy'}
                    onPress={() => props.navigation.goBack()}
                />

            </View>
            <ScrollView>

                <View style={styles.textContainer}>
                    <ResponsiveText style={styles.termsPolicyText}>

                        {`
Privacy Policy Effective Date: 01.01.2024

1. Introduction
Welcome to Switcheroo. Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our mobile application Switcheroo.

2. Information We CollectWe collect the following types of information:

Personal Information: Name, email address, phone number, and other details you provide.

Usage Data: Information about how you interact with the App.

Device Information: IP address, device type, and operating system.

Location Data: If you allow location services, we collect your approximate or precise location.

3. How We Use Your InformationWe use your information to:

Provide and improve our services.

Personalize your experience.

Process transactions and communicate with you.

Ensure security and prevent fraud.

Comply with legal obligations.

4. How We Share Your InformationWe do not sell your information. However, we may share it with:

Service providers who assist us in operating the App.

Legal authorities if required by law.

Business partners in the event of a merger or acquisition.

5. Data SecurityWe implement security measures to protect your information but cannot guarantee absolute security.

6. Your Rights and Choices

You can update or delete your account.

You can opt out of marketing communications.

You may disable location services in your device settings.

7. Children's PrivacyOur App is not intended for children under 13, and we do not knowingly collect data from them.

8. Changes to This PolicyWe may update this Privacy Policy. Any changes will be posted with an updated effective date.

9. Contact UsIf you have any questions, contact us at support@switcherooapp.com`}

                    </ResponsiveText>
                </View>

            </ScrollView>


        </View>
    );
};

const styles = StyleSheet.create({
    termsPolicyText: {
        color: Colors.black,
        textAlign: 'justify',
        lineHeight: 25,
        fontWeight: '500',
        alignSelf: 'center',
        marginBottom:hp(2.5)
    },
    mainView: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
    },
    headerView: {
        marginTop: hp(Platform.OS == 'ios' ? 5.5 : -1),
        marginBottom: hp(1),
        paddingHorizontal: wp(2)
    },
    textContainer: { marginHorizontal: wp(4) },
});

export default WebViewscreen;

