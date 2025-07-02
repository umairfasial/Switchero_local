import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import axios from 'axios';

export const _signInWithGoogle = async () => {
    try {

        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const userId = userInfo.user.id;
        const { accessToken } = await GoogleSignin.getTokens();
        const response = await axios.get(`https://people.googleapis.com/v1/people/${userId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                personFields: 'birthdays,genders',
            },
        });
        const { birthdays, genders } = response.data;
        const dateOfBirth = `${birthdays[0].date.year || birthdays[1].date.year}-${String(birthdays[0].date.month || birthdays[1].date.month).padStart(2, '0')}-${String(birthdays[0].date.day || birthdays[1].date.day).padStart(2, '0')}`;
        const gender = genders ? genders[0].formattedValue : '';
        return {
            ...userInfo,
            gender,
            dateOfBirth,
        };
    } catch (error) {
        console.log('=> Google Sign In', error);
        return null;
    }
};