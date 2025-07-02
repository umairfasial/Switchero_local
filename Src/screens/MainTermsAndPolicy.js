import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../components/Responsiveui';
import Header from '../components/Header';
import ResponsiveText from '../components/ResponsiveText';
import Container from '../components/Container';
import Colors from '../theme/colors';

const MainTermsAndPolicy = (props) => {
    return (
        <View style={styles.mainView}>
            <View style={styles.headerview}>
                <Header
                    title={'Terms & Conditions'}
                    onPress={() => props.navigation.goBack()}
                />
            </View>
            <ScrollView>

                <View style={styles.textContainer}>
                    <ResponsiveText style={styles.termsPolicyText}>

                        {`
Acceptance of Terms
By accessing or using our services, you agree to comply with these Terms of Service. If you do not agree, please do not use our services.

Changes to Terms
We reserve the right to modify these terms at any time. Changes will be effective upon posting. Your continued use of the services after changes signifies your acceptance.

User Accounts
You may need to create an account to access certain features. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.

User Conduct
You agree to use the services only for lawful purposes and in a manner that does not infringe on the rights of others.

Intellectual Property
All content provided on our platform is the property of [Your Company] or our licensors and is protected by copyright and intellectual property laws.

Disclaimers
Our services are provided "as is" without any warranties. We do not guarantee the accuracy or completeness of any information.

Limitation of Liability
In no event shall [Your Company] be liable for any indirect, incidental, or consequential damages arising from your use of the services.

Governing Law
These terms shall be governed by the laws of [Your State/Country].`}

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
        marginBottom: hp(2.5)
    },
    mainView: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
    },
    headerview: {
        paddingTop: hp(Platform.OS == 'ios' ? 6 : 1.5),
        marginHorizontal: wp(3)
    },
    textContainer: { marginHorizontal: wp(4) },
});

export default MainTermsAndPolicy;
