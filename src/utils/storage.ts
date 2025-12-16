
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AUTH_TOKEN_KEY = 'auth_token';


const USER_DATA_KEY = 'user_data';


export const saveAuthToken = async (token: string, expiry: number) => {
    try {
       
        const data = JSON.stringify({ token, expiry });
        await Keychain.setGenericPassword('auth_user', data, { service: AUTH_TOKEN_KEY });
        console.log('Token saved securely');
    } catch (error) {
        console.error('Error saving auth token', error);
        throw error;
    }
};

export const getAuthToken = async (): Promise<{ token: string; expiry: number } | null> => {
    try {
        const credentials = await Keychain.getGenericPassword({ service: AUTH_TOKEN_KEY });
        if (credentials) {
            return JSON.parse(credentials.password);
        }
        return null;
    } catch (error) {
        console.error('Error getting auth token', error);
        return null;
    }
};


export const clearAuthToken = async () => {
    try {
        await Keychain.resetGenericPassword({ service: AUTH_TOKEN_KEY });
        console.log('Token cleared');
    } catch (error) {
        console.error('Error clearing auth token', error);
    }
};


export const saveUserData = async (data: any) => {
    try {
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving user data', error);
    }
};


export const getUserData = async () => {
    try {
        const data = await AsyncStorage.getItem(USER_DATA_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting user data', error);
        return null;
    }
};
