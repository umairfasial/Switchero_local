import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Platform } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../components/Responsiveui';
import Container from '../../../components/Container';
import Header from '../../../components/Header';
import Colors from '../../../theme/colors';
import { Fonts } from '../../../theme/Fonts';
import { useIsFocused } from '@react-navigation/native';
import { getUserInfo } from '../../../Apis/Apis';
import Spinner from '../../../components/Spinner';

const getRandomColor = () => {
    const colors = ['#F44336', '#E91E63', '#9C27B0', '#3F51B5', '#03A9F4', '#009688', '#4CAF50', '#FFC107', '#FF5722'];
    return colors[Math.floor(Math.random() * colors.length)];
};

const MatchedUserProfileScreen = props => {
    const userId = props?.route?.params?.userId
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(true);

    const hasAvatar = userInfo?.avatarUrl;
    const firstLetter = userInfo?.firstName?.charAt(0)?.toUpperCase() || '?';
    const backgroundColor = getRandomColor();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    useEffect(() => {
        getMatchedUserProfile()
    }, [useIsFocused()]);

    const getMatchedUserProfile = async () => {
        setLoading(true)
        getUserInfo(userId).then((response) => {

            if (response?.status === 200) {
                const { userInfo } = response?.data
                setUserInfo(userInfo);
                setLoading(false)
            } else {
                setLoading(false)
            }
        }).catch((error) => {
            setLoading(false)
            console.log('get matched user error--->', error)
        })
    }

    if (loading) {
        return <Spinner loading={loading} />;
    }

    return (
        <Container style={styles.container}>
            <View style={styles.headerView}>
                <Header title={'Matched User Profile'} onPress={() => props.navigation.goBack()} />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.avatarContainer}>
                    <View style={styles.imageContainer}>
                        {hasAvatar ? (
                            <Image
                                source={{ uri: userInfo.avatarUrl }}
                                style={styles.avatar}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={[styles.fallbackAvatar, { backgroundColor }]}>
                                <Text style={styles.initial}>{firstLetter}</Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.name}>{userInfo.firstName} {userInfo.lastName}</Text>
                    {/* <View style={styles.badge}>
                        <Text style={styles.badgeText}>{userInfo.userRoles[0]}</Text>
                    </View> */}
                    <Text style={styles.memberSince}>
                        Member since {new Date(userInfo.createdAt)?.getFullYear()}
                    </Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Email</Text>
                        <Text style={styles.value}>{userInfo.email}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Mobile</Text>
                        <Text style={styles.value}>{userInfo.mobile ?? "N/A"}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Gender</Text>
                        <Text style={styles.value}>{userInfo.gender ?? "N/A"}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Date of Birth</Text>
                        <Text style={styles.value}>{formatDate(userInfo.dateOfBirth)}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Distance</Text>
                        <Text style={styles.value}>{userInfo.distance} km away</Text>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statBox}>
                            <Text style={styles.statNumber}>{userInfo.itemCount}</Text>
                            <Text style={styles.statLabel}>Total Items</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statNumber}>{userInfo.matchedItemCount}</Text>
                            <Text style={styles.statLabel}>Matched Items</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </Container>
    );
};

export default MatchedUserProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerView: {
        paddingTop: hp(Platform.OS == 'ios' ? 5.5 : -1),

        paddingBottom: hp(1),
        paddingHorizontal: wp(2)
    },
    scrollContainer: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.backgroundColor,
        flexGrow: 1,
    },
    avatarContainer: {
        alignItems: 'center',
        marginTop: hp(1),
    },

    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: Colors.secondaryColor,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
    },
    name: {
        marginTop: 12,
        fontSize: hp(2.3),
        fontFamily: Fonts.FontsBold,
        color: Colors.black,
    },
    badge: {
        marginTop: 8,
        backgroundColor: Colors.secondaryColor,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    card: {
        backgroundColor: 'white',
        width: '100%',
        marginTop: 20,
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    infoItem: {
        marginBottom: hp(1.4),
    },
    label: {
        fontSize: hp(1.5),
        fontFamily: Fonts.Fontsregular,
        color: '#6b7280',
    },
    value: {
        fontSize: hp(1.8),
        color: '#0f172a',
        fontFamily: Fonts.Fontsmedeum,
        marginTop: 2,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: hp(1.5),
    },
    statBox: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: hp(2),
        fontFamily: Fonts.FontsBold,
        color: Colors.secondaryColor,
    },
    statLabel: {
        fontSize: hp(1.5),
        fontFamily: Fonts.Fontsmedeum,
        color: '#6b7280',
    },
    memberSince: {
        marginTop: 8,
        fontSize: 12,
        color: '#64748b',
        fontStyle: 'italic',
    },
    fallbackAvatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    initial: {
        color: 'white',
        fontSize: hp(5),
        fontWeight: Fonts.FontsBold
      },
});
