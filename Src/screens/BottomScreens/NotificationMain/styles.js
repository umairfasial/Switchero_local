

import { Platform, StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../../components/Responsiveui";
import { Fonts } from "../../../theme/Fonts";
import Colors from "../../../theme/colors";

export const styles = StyleSheet.create({
    emptyView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: hp(20),
        paddingHorizontal: wp(6),

    },
    mainView: {
        flex: 1,
        // paddingHorizontal: wp(6),
        marginTop: hp(Platform.OS == 'ios' ? 6 : 3),
    },
    dot: {
        width: wp(1.5),
        height: wp(4),
        resizeMode: "contain"
    },
    title: {
        fontSize: 16,
        color: Colors.darkBlack,
        fontFamily: Fonts.FontsExtraBold
    },
    rowView: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: hp(2),
        paddingHorizontal: wp(6),

    },
    emptynotification: {
        width: wp(60),
        height: wp(60),
    },
    textempty: {
        fontFamily: Fonts.Fontsmedeum,
        color: Colors.black,
        fontSize: 14,
        marginTop: hp(2),
    },
    notificationRow: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        paddingHorizontal: wp(3),
        alignItems: 'center',
        paddingVertical: hp(1.5),
        // borderTopWidth: 0.8,
        // borderBottomWidth: 0.8,
        // marginTop: hp(0.5),
        borderColor: `${'#404040'}20`,
    },
    notificationTitle: {
        fontFamily: Fonts.Fontsmedeum,
        color: Colors.black,
        maxWidth: wp(75),
        fontSize: 12,
        textAlign: 'justify'
    },
    notificationDate: {
        fontFamily: Fonts.Fontsregular,
        color: Colors.gray,
        fontSize: 12,
        marginTop: 2
    },
    centeredView: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalView: {
        right: wp(6),
        top: hp(Platform.OS == 'ios' ? 8 : 5),

        width: wp(30),
        backgroundColor: 'white',
        paddingHorizontal: 10,
        borderRadius: 5,
        alignItems: 'flex-start',
        justifyContent: 'center',
        elevation: 5,
        paddingVertical: 5
    },
    modalText: {
        fontSize: 16,
        fontFamily: Fonts.Fontsmedeum,
        paddingVertical: 5,
        color: Colors.black,
        textAlign: 'left',
        width: wp(26)
    },
});
