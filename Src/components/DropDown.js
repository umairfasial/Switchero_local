import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from './Responsiveui';
import Colors from '../theme/colors';
import { useIsFocused } from '@react-navigation/native';
import { Fonts } from '../theme/Fonts';

const DropdownSelection = ({ setValue, data, value, placeholder }) => {
    // State to manage dropdown value
    const [dropdownValue, setDropdownValue] = useState(value);

    // Update dropdown value when defaultValue changes
    useEffect(() => {
        setDropdownValue(value);
    }, [value, useIsFocused()]);
    const renderItem = (item, selected ) => {
        return (
            <View style={{padding:wp(3)}}>
                <Text style={styles.label}>{item?.label}</Text>
            </View>
        )
    }
    return (
        <View style={{
            alignSelf: "center", backgroundColor: '#fff',
            alignItems: "center", width: wp(88),

        }}>
            <Dropdown
                style={styles.dropdown}
                containerStyle={styles.dropdown2}
                selectedTextStyle={{ color: Colors.darkGray }}
                placeholder={placeholder ?? dropdownValue?.value}
                placeholderStyle={{ color: Colors.darkGray }}
                itemTextStyle={{ color: Colors.darkGray }}
                itemContainerStyle={{borderBottomWidth:.5,borderColor:Colors.btncolor }}
                labelField="label"
                valueField="value"
                data={data}
                renderItem={renderItem}
                value={dropdownValue?.value}
                onChange={item => {
                    setDropdownValue(item);
                    setValue(item);
                }}
            />
        </View>
    );
};

export default DropdownSelection;


const styles = StyleSheet.create({

    dropdown: {
        width: wp(88),
        paddingHorizontal: wp(6),
        backgroundColor: '#fff',
        borderWidth: 1,
        height: hp(7),
        borderRadius: 10,
        borderColor: Colors.btncolor

    },
    dropdown2: {

        // paddingHorizontal: wp(3),
        backgroundColor: '#fff',
        // backgroundColor: "red"
        borderColor: Colors.btncolor, borderWidth: .8

    },
    label: {
        name: Colors.black,
        fontSize: 15,
        fontFamily:Fonts.Fontsmedeum,
        color:Colors.black
    }
})
