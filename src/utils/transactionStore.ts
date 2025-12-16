
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types';

const TRANSACTIONS_KEY = 'transactions_list';



export const saveTransactions = async (transactions: Transaction[]) => {
    try {
        const json = JSON.stringify(transactions);
        await AsyncStorage.setItem(TRANSACTIONS_KEY, json);
    } catch (e) {
        console.error('Failed to save transactions', e);
    }
};

export const getTransactions = async (): Promise<Transaction[]> => {
    try {
        const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Failed to get transactions', e);
        return [];
    }
};
