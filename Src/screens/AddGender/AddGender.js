import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Container from '../../components/Container'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../components/Responsiveui'
import { Fonts } from '../../theme/Fonts'
import Colors from '../../theme/colors'
import ResponsiveText from '../../components/ResponsiveText'
import Images from '../../components/Images'
import { SuccessToast } from '../../components/SuccessToast'
import { UpdateGender } from '../../Graphql/Graphql'
import Loader from '../../components/Loader'
import { getErrorString } from '../../helper/global'
import { GlobalStyles } from '../../utils/globalStyles'
import Button from '../../components/Button'
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
const AddGender = (props) => {
    const [selectedGender, setSelectedGender] = useState('');
    const [ErrorMessage, setErrorMessage] = useState('');
    const [Loading, setLoading] = useState(false);
    const [UpdateUsergender] = UpdateGender();

    const HandleGender = async () => {
        try {
            if (selectedGender) {
                setLoading(true)
                const Updateresponse = await UpdateUsergender({
                    variables: {
                        gender: selectedGender,
                    },
                });

                if (Updateresponse) {
                    setLoading(false)
                    SuccessToast({
                        title: 'Done',
                        text: 'Done',
                    });
                    props?.navigation?.replace('AddDob')
                }
            } else {
                alert('Please select your gender')

                // props?.navigation?.replace('AddDob')
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
                    <ResponsiveText style={styles.gender}>{'Select your Gender:'}</ResponsiveText>
                    {genderaray.map(item => (

                        <TouchableOpacity onPress={() => setSelectedGender(item.name)}
                            style={[styles.genderView, item.name == selectedGender && { borderColor: Colors.primaryColor, borderWidth: 1.5 }]}>
                            <ResponsiveText style={styles.gendertxt}>
                                {item?.name}
                            </ResponsiveText>
                            <Image source={item.name === 'Male' ? Images.male : item.name === 'Female' ? Images.female : Images.other} resizeMode='contain' style={{ width: wp(8), height: wp(8) }} />
                        </TouchableOpacity>
                        // <TouchableOpacity
                        //     onPress={() => setSelectedGender(item.name)}
                        //     style={styles.radiobtnrow}>
                        //     {item.name == selectedGender ? (
                        //         <View style={styles.checkdesign}>
                        //             <View style={styles.checkfill} />
                        //         </View>
                        //     ) : (
                        //         <View style={styles.uncheckradio} />
                        //     )}
                        //     <ResponsiveText style={styles.gendertxt}>
                        //         {item?.name}
                        //     </ResponsiveText>
                        // </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={{ flex: 0.4, alignItems: "center", justifyContent: "center" }}>

                {/* 
                <TouchableOpacity onPress={() => { HandleGender() }}>
                    <ResponsiveText style={styles.adphototxt}>
                        {'Continue'}
                    </ResponsiveText>
                </TouchableOpacity> */}

                <Button
                    onPress={() => {
                        HandleGender()
                    }}
                    title={'Continue'}
                    titleStyle={styles.btntitle}
                    // loading={loading}
                    loadingColor={Colors.secondaryColor}
                />



            </View>
            <View style={{ flex: 0.1, alignItems: 'flex-end', justifyContent: "flex-end" }}>
                <ResponsiveText style={{ marginRight: 20, fontSize: 16, color: 'black', }}>
                    3/6
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

export default AddGender

const styles = StyleSheet.create({
    genderView: { backgroundColor: Colors.white, padding: wp(2), ...GlobalStyles().shadow, ...GlobalStyles().row, justifyContent: 'space-between', borderRadius: wp(2), paddingHorizontal: wp(10) }
    ,
    ganderradio: {
        marginHorizontal: wp(5),
        marginTop: hp(4),
        rowGap: wp(4)

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

})