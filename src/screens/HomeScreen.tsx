
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';
import * as storage from '../utils/storage';
import TransactionList from '../components/TransactionList';
import DeviceInfo from 'react-native-device-info';

const HomeScreen = () => {
    const { signOut } = useAuth();
    const { transactions, createTransaction, isOffline, syncing } = useTransactions();
    const [expiryTime, setExpiryTime] = useState<string>('');
    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
    const [networkType, setNetworkType] = useState<string>('Loading...');

    useEffect(() => {
        const fetchExpiry = async () => {
            const data = await storage.getAuthToken();
            if (data) {
                const date = new Date(data.expiry * 1000);
                setExpiryTime(date.toLocaleTimeString());
            }
        };

      const fetchDeviceInfo = async () => {
  try {
    const battery = await DeviceInfo.getBatteryLevel(); // 0 - 1
   

    setBatteryLevel(Math.round(battery * 100)); // %
   
  } catch (error) {
    console.log('Device info error:', error);
  }
};


        fetchExpiry();
        fetchDeviceInfo();
    }, []);

    const handleCreatePayment = () => {
        // Random amount
        const amount = Math.floor(Math.random() * 100) + 1;
        createTransaction(amount);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.deviceInfo}>
                    | Type: {networkType} | Bat: {batteryLevel}%
                </Text>
                <Text style={styles.title}>Secure Wallet</Text>
                <View style={styles.row}>
                    <Text style={styles.status}>
                        Net: {isOffline ? 'OFFLINE' : 'ONLINE'} {syncing && '(Syncing)'}
                    </Text>

                </View>
                <Text style={styles.info}>Expires: {expiryTime}</Text>
                <Button title="Create Payment" onPress={handleCreatePayment} />
            </View>

            <View style={styles.listContainer}>
                <Text style={styles.subtitle}>Transactions ({transactions.length})</Text>
                <TransactionList data={transactions} />
            </View>

            <View style={styles.footer}>
                <Button title="Logout" onPress={() => signOut()} color="#d9534f" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    status: {
        fontWeight: '600',
        color: '#333',
    },
    deviceInfo: {
        fontSize: 12,
        color: '#666',
        marginLeft: 5,
    },
    info: {
        fontSize: 12,
        color: '#666',
        marginBottom: 10,
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#fff',
    },
});

export default HomeScreen;
