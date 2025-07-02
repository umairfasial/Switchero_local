import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Container from '../../components/Container';
import ResponsiveText from '../../components/ResponsiveText';
import Colors from '../../theme/colors';
import Header from '../../components/Header';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../components/Responsiveui';

const TermsAndPolicy = (props) => {
    return (
        <Container>
            <View style={styles.headerview}>
                <Header
                    left={true}
                    title={'Terms & Privacy Policy'}
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
These terms shall be governed by the laws of [Your State/Country].

Privacy Policy

Information We Collect
We may collect personal information, including but not limited to your name, email address, and payment information.

Use of Information
We use your information to provide, maintain, and improve our services, communicate with you, and comply with legal obligations.

Sharing Your Information
We do not sell your personal information. We may share your information with third parties only to provide our services or when required by law.

Data Security
We implement reasonable security measures to protect your information but cannot guarantee its absolute security.

Your Rights
You have the right to access, correct, or delete your personal information. Please contact us to exercise these rights.

Changes to This Policy
We may update this policy from time to time. Changes will be posted on this page with an updated effective date.

Contact Us
If you have any questions about these terms or our privacy practices, please contact us at [Your Contact Information].
                    `}

                    </ResponsiveText>
                </View>

            </ScrollView>


        </Container>
    );
};

const styles = StyleSheet.create({
    termsPolicyText: {
        color: Colors.darkGray,
        textAlign: 'justify',
        lineHeight: 25,
        fontWeight: '500',
        alignSelf: 'center'
    },
    headerview: {
        // paddingTop: hp(Platform.OS == 'ios' ? 6 : 1.5),
        marginHorizontal: wp(3)
    },
    textContainer: { marginHorizontal: wp(4) },
});

export default TermsAndPolicy;
