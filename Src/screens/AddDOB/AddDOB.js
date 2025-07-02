import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Container from '../../components/Container'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../components/Responsiveui'
import { Fonts } from '../../theme/Fonts'
import Colors from '../../theme/colors'
import ResponsiveText from '../../components/ResponsiveText'
import Images from '../../components/Images'

import DateTimePicker from '@react-native-community/datetimepicker';
import { SuccessToast } from '../../components/SuccessToast'
import { StackActions } from '@react-navigation/native'
import { UpdateDOB } from '../../Graphql/Graphql'
import Loader from '../../components/Loader'
import { CheckTheme, getErrorString } from '../../helper/global'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Button from '../../components/Button'
import moment from 'moment'

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
const AddDob = (props) => {
    const isDarkTheme = CheckTheme()

    const [UpdateDateofbirh] = UpdateDOB();

    const [date, setDate] = useState(new Date());
    const [dateToShow, setdateToShow] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [ErrorMessage, setErrorMessage] = useState('');
    const [Loading, setLoading] = useState(false);
    const maxDate = moment().subtract(18, 'years').toDate();

    const handleDateChange = (event, currentDate) => {
        setShowDatePicker(false);
        // const currentDate = selectedDate
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        let formateddate = new Date(currentDate).toLocaleDateString(
            undefined,
            options,
        );
        setdateToShow(formateddate);
        setShowDatePicker(false);
        setDate(currentDate);
    };


    const handleConfirm = (date) => {
        console.warn("A date has been picked: ", date);
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = new Date(date).toLocaleDateString('en-US', options);
        console.warn("A date has been picked: ", formattedDate);
        setdateToShow(formattedDate)
        setDate(date);
        setShowDatePicker(false);
    };

    const Handledob = async () => {
        try {
            if (dateToShow) {
                setLoading(true)
                const Updateresponse = await UpdateDateofbirh({
                    variables: {
                        dateOfBirth: dateToShow?.toString(),
                    },
                });

                if (Updateresponse) {
                    setLoading(false)

                    SuccessToast({
                        title: 'Done',
                        text: 'Done',
                    });

                    props.navigation.dispatch(StackActions.replace('AddDistance'))

                }
            } else {
                alert('Please select your date of birth')
            }
        } catch (error) {
            setLoading(false)
            setErrorMessage(getErrorString(error))

        }
    };


    useEffect(() => {
        // const options = { day: 'numeric', month: 'long', year: 'numeric' };
        // let formateddate = new Date(date).toLocaleDateString(undefined, options);
        // setdateToShow(formateddate);
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
                    <ResponsiveText style={styles.gender}>{'Set your date of birth:'}</ResponsiveText>
                    <View style={styles.ganderradio}>
                        {Platform.OS == 'ios' ? (

                            <DateTimePickerModal
                                date={date}
                                isVisible={showDatePicker}
                                mode="date"
                                onConfirm={handleConfirm}
                                pickerContainerStyleIOS={{ backgroundColor: Colors.backgroundColor }}
                                isDarkModeEnabled={false}
                                maximumDate={maxDate}
                                customCancelButtonIOS={() => (
                                    <Button
                                        title={'cancel'}
                                        onPress={() => setShowDatePicker(false)}
                                        btnContainer={{ backgroundColor: Colors.white }}
                                        titleStyle={{ color: Colors.btncolor }}
                                    />
                                )}
                                onCancel={() => setShowDatePicker(false)}
                            />
                            // <DateTimePicker
                            //     testID="dateTimePicker"
                            //     value={date}
                            //     mode="date"
                            //     is24Hour={true}
                            //     display='inline'
                            //     onChange={handleDateChange}
                            // />
                        ) :
                            showDatePicker ? <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode="date"

                                is24Hour={true}
                                display='inline'
                                maximumDate={maxDate}
                                onChange={handleDateChange}
                            /> : null}
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            style={styles.dateofb}>
                            <ResponsiveText style={styles.dob}>
                                {' '}
                                Date: {dateToShow}
                            </ResponsiveText>

                            <Image source={Images.calander} style={styles.calandericon} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={{ flex: 0.4, alignItems: "center", justifyContent: "center" }}>


                {/* <TouchableOpacity onPress={() => { Handledob() }}>
                    <ResponsiveText style={styles.adphototxt}>
                        {'Continue'}
                    </ResponsiveText>
                </TouchableOpacity> */}

                <Button
                    onPress={() => {
                        Handledob()
                    }}
                    title={'Continue'}
                    titleStyle={styles.btntitle}
                    // loading={loading}
                    loadingColor={Colors.secondaryColor}
                />


            </View>
            <View style={{ flex: 0.2, alignItems: 'flex-end', justifyContent: "flex-end" }}>
                <ResponsiveText style={{ marginRight: 20, fontSize: 16, color: 'black', }}>
                    4/6
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

export default AddDob

const styles = StyleSheet.create({

    ganderradio: {
        marginHorizontal: wp(2),
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
        marginLeft: wp(6)
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
    dateofb: {
        borderWidth: 2,
        marginHorizontal: wp(4),
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        //backgroundColor: 'rgba(48, 182, 156, 0.05)',
        borderColor: Colors.primaryColor,
        padding: 14,
        borderRadius: 8

    },
    dob: {
        color: Colors.black,
        fontSize: 16,
        fontFamily: Fonts.FontssemiBold,
    },
    calandericon: {
        width: wp(6),
        height: wp(6.5)
    },
})