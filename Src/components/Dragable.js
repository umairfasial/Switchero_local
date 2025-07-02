import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import DraggableGridView from 'react-native-drag-sort-gridview';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from './Responsiveui';
import Images from './Images';
import ResponsiveText from './ResponsiveText';
import Colors from '../theme/colors';
import { CloseIcon } from './ReviewFloating';

// Since we are not using TypeScript, we remove IItem interface and memo since we don't receive any props.
const Item = ({ item, index, isEditing, removeItem }) => (
    <View style={[
        styles.itemview,
        index === 0 ? { borderWidth: 2, borderColor: Colors.btncolor } : {}
    ]}>
        {isEditing == false && 
        // <TouchableOpacity
        //     hitSlop={styles.hitslop}
        //     onPress={() => { removeItem(item) }}
        //     style={styles.crossimage}>
        //     <Image
        //         source={Images.close}
        //         style={styles.closeimg}
        //         resizeMode="cover"
        //     />
        // </TouchableOpacity>
        <CloseIcon style={{ ...styles.crossimage }} onPress={()=> removeItem(item) } />
        }
        <Image
            source={{ uri: item.image }}
            style={styles.item}

        />
    </View>
);

const DraggableGrid = ({ data, setData }) => {
    const [isEditing, setIsEditing] = useState(true);


    const onOrderChanged = useCallback((orderedData) => {
        setData(orderedData);
    }, []);

    const removeItem = (itemId) => {
        setData(prevData => prevData.filter(item => item !== itemId));
    };


    const renderItem = ({ item, index }) => <Item item={item} index={index} isEditing={isEditing} removeItem={removeItem} />;

    const keyExtractor = (item) => `gridview-${item.id}`;

    return (
        <View>
            {data.length > 0 && <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editButton}>
                <ResponsiveText>{isEditing ? 'Delete' : 'Move'}</ResponsiveText>
            </TouchableOpacity>}
            <DraggableGridView
                style={styles.bg}
                contentContainerStyle={styles.contentContainer}
                itemContainerStyle={styles.itemContainer}
                isEditing={isEditing}
                numColumns={3}
                canCancelContentTouches={true}
                // itemHeight={0}
                debounce={300}
                data={data}
                shouldAnimOnRelease={false}
                shouldVibrate={false}
                keyExtractor={keyExtractor}
                onOrderChanged={onOrderChanged}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    editButton: {
        alignSelf: 'flex-end', padding: 5,
        backgroundColor: Colors.secondaryColor,
        marginRight: wp(2),
        borderRadius: 5,
        marginTop: hp(1)

    },
    bg: {
        overflow: 'visible',
        // backgroundColor: '#222222',
        // paddingVertical: 80,
        // height: hp(50)
    },
    contentContainer: {
        justifyContent: 'flex-start'
    },
    itemContainer: {
        paddingVertical: hp(12)
    },
    item: {
        width: wp(29.5),
        height: hp(21.5),
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },

    itemview: {
        width: wp(30),
        height: hp(22),
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    closeimg: {
        width: wp(7),
        height: wp(7),
    },
    crossimage: {
        width: wp(6), height: wp(6),
        backgroundColor: '#FF6961',
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        zIndex: 1,
        top: 5,
        alignSelf: 'flex-end',
        right: 5
    },
    hitslop: { top: 10, bottom: 12, right: 12, left: 12 },

});

export default DraggableGrid;
