
import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { Transaction } from '../types';

const TransactionItem = memo(({ item }: { item: Transaction }) => {
    const getStatusColor = (status: Transaction['status']) => {
        switch (status) {
            case 'SUCCESS': return '#5cb85c';
            case 'FAILED': return '#d9534f';
            case 'PENDING': return '#f0ad4e';
            default: return '#777';
        }
    };

    return (
        <View style={styles.item}>
            <View>
                <Text style={styles.id}>ID: ...{item.id.slice(-6)}</Text>
                <Text style={styles.date}>{new Date(item.timestamp).toLocaleString()}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.amount}>${item.amount}</Text>
                <Text style={{ color: getStatusColor(item.status), fontWeight: 'bold' }}>
                    {item.status}
                </Text>
                {!item.synced && <Text style={styles.sync}>Offline</Text>}
            </View>
        </View>
    );
});

const TransactionList = ({ data }: { data: Transaction[] }) => {
    const renderItem: ListRenderItem<Transaction> = useCallback(({ item }) => (
        <TransactionItem item={item} />
    ), []);

    const getItemLayout = useCallback((data: any, index: number) => ({
        length: 70, 
        offset: 70 * index,
        index,
    }), []);

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            initialNumToRender={10}
            windowSize={10} // optimization
            maxToRenderPerBatch={10}
            removeClippedSubviews={true}
            getItemLayout={getItemLayout}
            contentContainerStyle={{ paddingBottom: 20 }}
        />
    );
};

const styles = StyleSheet.create({
    item: {
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    id: {
        fontSize: 12,
        color: '#888',
    },
    date: {
        fontSize: 10,
        color: '#ccc',
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    sync: {
        fontSize: 10,
        color: 'orange',
    },
});

export default memo(TransactionList);
