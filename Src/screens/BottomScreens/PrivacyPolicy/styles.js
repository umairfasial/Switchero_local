import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../../components/Responsiveui";
import { Fonts } from "../../../theme/Fonts";
import Colors from "../../../theme/colors";

const { StyleSheet, Platform } = require("react-native");

export const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
    },
    headerView: {
        marginTop: hp(Platform.OS == 'ios' ? 5.5 : -1),

        marginBottom: hp(1),
        paddingHorizontal: wp(2)
    },
    rowView: {
        flexDirection: "row",
        marginHorizontal: wp(5),
        alignItems: "center",
        justifyContent: 'space-between',
        // backgroundColor: "red",
        marginTop: hp(3),
        borderBottomWidth: 0.4,
        borderColor: Colors.graytext,
        paddingBottom: 4

    },
    rightarow: {
        width: wp(2.2),
        height: wp(3.5),
    },
    titletxt: {
        fontSize: 16,
        fontWeight: '500',
        color: `${Colors.black}80`,
    },
    deletebtn: {
        marginTop: hp(2),
        backgroundColor: '#FF6961',
        borderColor: '#b82c2c',
        borderWidth: 0,
        width: wp(80),
        height: hp(5),
        borderRadius: 400
    },
    mainView2: {
        flex: 0.8
    },
    btnview: {
        flex: 0.1
    },
    deletemodal: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    deletetxt: {
        fontSize: 18,
        color: Colors.black,
        fontFamily: Fonts.FontsBold,
        textAlign: 'center',
    },
    btnrowdeler: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: hp(4),
        width: wp(80),
    },
    btnno: {
        width: wp(38),
        backgroundColor: Colors.graytext,
        borderColor: Colors.graytext,
    },
    btn: {
        width: wp(38),
        backgroundColor: Colors.secondaryColor,
        borderColor: Colors.secondaryColor,
    },
})
