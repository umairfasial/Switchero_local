import { Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Container from '../../components/Container'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../components/Responsiveui'
import { Fonts } from '../../theme/Fonts'
import Colors from '../../theme/colors'
import ResponsiveText from '../../components/ResponsiveText'
import Images from '../../components/Images'
import { SuccessToast } from '../../components/SuccessToast'
import { UpdateDistance, UpdateGender } from '../../Graphql/Graphql'
import { StackActions } from '@react-navigation/native'
import Slider from 'react-native-slider';
import Loader from '../../components/Loader'
import { getErrorString } from '../../helper/global'
import Button from '../../components/Button'


const AddDistance = (props) => {

    const [Distance, setDistance] = useState(50);
    const [updateUserDistance] = UpdateDistance();
    const [ErrorMessage, setErrorMessage] = useState('');
    const [Loading, setLoading] = useState(false);

    const HandleDistanceupdate = async () => {
        try {
            const Updateresponse = await updateUserDistance({
                variables: {
                    distance: parseInt(Distance),
                },
            });
            setLoading(true)
            if (Updateresponse?.data?.updateUserDistance) {
                SuccessToast({
                    title: 'Done',
                    text: 'Done',
                });
                setLoading(false)


                props.navigation.dispatch(StackActions.replace('FavirotCategory'))

            }
        } catch (error) {
            setLoading(false)
            setErrorMessage(getErrorString(error))




        }
    };


    return (
        <Container>

            <View style={{ flex: 0.8 }}>

                <View style={{ alignItems: "center", justifyContent: 'center', marginTop: hp(Platform.OS == 'ios' ? 9 : 5) }}>
                    <Image
                        source={Images.logoBranding}
                        style={{ width: wp(50), height: wp(11) }}
                    />

                </View>
                <View style={styles.ganderradio}>
                    <ResponsiveText style={styles.gender}>{'Enter your distance:'}</ResponsiveText>


                    <View style={styles.textinputview}>
                        <TextInput
                            value={Distance > 1 ? Distance.toString() : Distance}
                            onChangeText={number => {
                                // number = number.replace(/[^0-9]/g, ' ');
                                if (number >= 1 && number <= 250) { setDistance(number) }
                                if (number.length == 1) {
                                    setDistance(1)
                                }
                                else if (number > 250) {
                                    setDistance(250)
                                }
                            }}
                            style={styles.input}
                            keyboardType="number-pad"
                            placeholder="Enter distance"
                            placeholderTextColor={Colors.darkGray}
                        />
                    </View>
                    <View style={styles.slider}>
                        <Slider
                            value={Number(Distance)}
                            onValueChange={newValue => setDistance(parseInt(newValue))}
                            minimumTrackTintColor={Colors.primaryColor}
                            maximumTrackTintColor={`${Colors.graytext}20`}
                            minimumValue={1}
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
            </View>

            <View style={{ flex: 0.4, alignItems: "center", justifyContent: "center" }}>


                {/* <TouchableOpacity onPress={() => { HandleDistanceupdate() }}>
                    <ResponsiveText style={styles.adphototxt}>
                        {'Continue'}
                    </ResponsiveText>
                </TouchableOpacity> */}

                <Button
                    onPress={() => {
                        HandleDistanceupdate()
                    }}
                    title={'Continue'}
                    titleStyle={styles.btntitle}
                    // loading={loading}
                    loadingColor={Colors.secondaryColor}
                />


            </View>
            <View style={{ flex: 0.2, alignItems: 'flex-end', justifyContent: "flex-end" }}>
                <ResponsiveText style={{ marginRight: 20, fontSize: 16, color: 'black', }}>
                    5/6
                </ResponsiveText>
                <View style={{ height: 20 }} />


            </View>
            <ResponsiveText style={{
                color: Colors.redcolor, fontSize: 12, textAlign: 'center'
            }}>
                {ErrorMessage}
            </ResponsiveText>
            <Loader
                loading={Loading}
            />
        </Container>
    )
}

export default AddDistance

const styles = StyleSheet.create({

    ganderradio: {
        marginHorizontal: wp(5),
        marginTop: hp(4),

    },
    radiobtnrow: {
        flexDirection: "row",
        alignItems: 'center',
        marginTop: hp(1),

        width: wp(20),


    },
    gender: {
        fontSize: 16,
        fontFamily: Fonts.FontsBold,
        color: Colors.black,
    },
    gendertxt: {
        color: Colors.black,
        fontFamily: Fonts.Fontsmedeum,
        fontSize: 16,
        marginLeft: 5

    },
    checkfill: {
        width: wp(4),
        height: wp(4),
        borderRadius: wp(6),

        backgroundColor: Colors.btncolor,
    },
    checkdesign: {
        width: wp(6),
        height: wp(6),
        borderWidth: 2,
        borderColor: Colors.btncolor,
        borderRadius: wp(8),
        alignItems: 'center',
        justifyContent: 'center',


    },
    uncheckradio: {
        width: wp(6),
        height: wp(6),
        borderWidth: 2,
        borderColor: Colors.btncolor,
        borderRadius: wp(6),
        alignSelf: "flex-end"
    },
    adphototxt: {
        color: Colors.btncolor,
        fontSize: 16,
        marginTop: hp(10),
        fontFamily: Fonts.Fontsmedeum
    },
    fulnameview: {
        marginHorizontal: wp(5),
        marginTop: hp(4)
    },
    headingtxt: {
        fontSize: 16,
        fontFamily: Fonts.FontsBold,
        color: Colors.black
    },
    textinputview: {
        backgroundColor: `${Colors.graytext}20`,
        paddingHorizontal: 10,
        borderRadius: 5
    }
    ,
    input: {
        color: Colors.black,
        height: hp(6)
    },
    slider: {
        marginTop: hp(2),
    },
    disc: {
        fontFamily: Fonts.Fontsregular,
        fontSize: 16,
        color: Colors.darkGray,
        marginTop: hp(2),
        textAlign: 'center'

    },

})