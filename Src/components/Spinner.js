import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UIActivityIndicator } from 'react-native-indicators';
import Colors from '../theme/colors';

const Spinner = ({ loading, indicatorSize = 40, customIndicatorContainer }) => {
    return (
        loading && <View style={[styles.container, customIndicatorContainer]}>

            <UIActivityIndicator size={indicatorSize} color={Colors.secondaryColor} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
});

export default Spinner;