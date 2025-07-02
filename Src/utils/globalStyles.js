import { StyleSheet } from "react-native";
import Colors from "../theme/colors";
import { heightPercentageToDP } from "../components/Responsiveui";

export const GlobalStyles = (props) => StyleSheet.create({
    shadow: {
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    padding: {
        paddingVertical: props ? props : heightPercentageToDP(1)
    },
    row:{
        flexDirection:'row',alignItems:'center',
    }
})