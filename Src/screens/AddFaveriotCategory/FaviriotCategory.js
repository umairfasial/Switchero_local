import { Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
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
import { getCategory } from '../../Apis/Apis'
import DropdownSelection from '../../components/DropDown'
import { useDispatch } from 'react-redux'
import { SaveFavCategory } from '../../redux/actions/userDataAction'
import Button from '../../components/Button'


const FavirotCategory = (props) => {

    const [SelectedCategory, setSelectedCategory] = useState('');
    const [categoryData, setcategoryData] = useState([]);

    const dispatch = useDispatch()

    const handleCategory = async () => {
        try {
            dispatch(SaveFavCategory(SelectedCategory?.label))

            props.navigation.dispatch(StackActions.replace('MainStack'))

        } catch (error) {




        }
    };


    useEffect(() => {
        getCategory().then(res => {

            let array = []
            res.data?.categories.map(categry => {
                let object = { label: categry?.name, value: categry?.id }
                array.push(object)
            })
            setcategoryData(array)
        }).catch(eror => {
        })

    }, [])

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
                    <ResponsiveText style={styles.gender}>{'Select a category'}</ResponsiveText>
                    <View style={{ height: 10 }} />
                    <ResponsiveText style={styles.categroy}>{`Which category are you most interested in now? Select that, and we'll start there. Or you can skip to see random options.`}</ResponsiveText>

                    <View style={{ height: 20 }} />

                    <DropdownSelection

                        setValue={setSelectedCategory}
                        placeholder={'Select a category'}
                        data={categoryData}
                        value={SelectedCategory}

                    />



                </View>
            </View>

            <View style={{ flex: 0.4, alignItems: "center", justifyContent: "center" }}>

                <Button
                    onPress={() => {
                        handleCategory()
                    }}
                    title={'Continue'}
                    titleStyle={styles.btntitle}
                    // loading={loading}
                    loadingColor={Colors.secondaryColor}
                />
                <View style={{ height: 20 }} />
                <Button
                    onPress={() => {
                        props.navigation.dispatch(StackActions.replace('MainStack'))
                    }}
                    title={'Skip'}
                    titleStyle={styles.btntitle}
                    // loading={loading}
                    loadingColor={Colors.secondaryColor}
                />


                {/* <TouchableOpacity onPress={() => { handleCategory() }}>
                    <ResponsiveText style={styles.adphototxt}>
                        {'Continue'}
                    </ResponsiveText>
                </TouchableOpacity>
                <View style={{ height: 20 }} />
                <TouchableOpacity onPress={() => { props.navigation.dispatch(StackActions.replace('MainStack')) }}>
                    <ResponsiveText style={styles.adphototxt}>
                        {'Skip'}
                    </ResponsiveText>
                </TouchableOpacity> */}

            </View>
            <View style={{ flex: 0.2, alignItems: 'flex-end', justifyContent: "flex-end" }}>
                <ResponsiveText style={{ marginRight: 20, fontSize: 16, color: 'black', }}>
                    6/6
                </ResponsiveText>
                <View style={{ height: 20 }} />


            </View>


        </Container>
    )
}

export default FavirotCategory

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
    categroy: {
        fontSize: 14,
        fontFamily: Fonts.Fontsmedeum,
        color: Colors.graytext,
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
        // marginTop: hp(10),
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