
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import uuid from 'react-native-uuid';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { Transaction } from '../types';
import * as store from '../utils/transactionStore';
import { processPaymentAPI } from '../api/mockPayment';

type TransactionContextType = {
    transactions: Transaction[];
    createTransaction: (amount: number) => Promise<void>;
    isOffline: boolean;
    syncing: boolean;
};

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isOffline, setIsOffline] = useState(false);
    const [syncing, setSyncing] = useState(false);

    const processingRef = useRef(false);

    // Load from Storage on mount
    useEffect(() => {
        const loadData = async () => {
            const loaded = await store.getTransactions();
            if (loaded.length === 0) {
                // Generate 5000 mock items for performance test
                const dummy: Transaction[] = [];
                for (let i = 0; i < 5000; i++) {
                    dummy.push({
                        id: uuid.v4().toString(),
                        amount: Math.floor(Math.random() * 1000),
                        status: Math.random() > 0.5 ? 'SUCCESS' : 'FAILED',
                        timestamp: Date.now() - Math.floor(Math.random() * 10000000),
                        synced: true,
                    });
                }
                setTransactions(dummy);
                store.saveTransactions(dummy);
            } else {
                setTransactions(loaded);
            }
        };
        loadData();
    }, []);

  
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
            const offline = state.isConnected === false;
            setIsOffline(offline);
            if (!offline) {
                triggerSync();
            }
        });
        return () => unsubscribe();
    }, [transactions]); 
    const createTransaction = async (amount: number) => {
        const newTx: Transaction = {
            id: uuid.v4().toString(),
            amount,
            status: 'INITIATED',
            timestamp: Date.now(),
            synced: false,
        };

        
        const updated = [newTx, ...transactions];
        setTransactions(updated);
        store.saveTransactions(updated);

        if (!isOffline) {
            processTransaction(newTx);
        }
    };

    const processTransaction = async (tx: Transaction) => {
        try {
            updateTransactionStatus(tx.id, 'PENDING');

            const result = await processPaymentAPI(tx.id, tx.amount);

            if (result.success) {
                updateTransactionStatus(tx.id, 'SUCCESS', true);
            } else {
                updateTransactionStatus(tx.id, 'FAILED', true);
            }
        } catch (error) {
            console.log('Process failed, leaving as pending/initiated for retry');
        }
    };

    const updateTransactionStatus = (id: string, status: Transaction['status'], synced: boolean = false) => {
        setTransactions(prev => {
            const updated = prev.map(t => t.id === id ? { ...t, status, synced } : t);
            store.saveTransactions(updated);
            return updated;
        });
    };

    const triggerSync = async () => {
        if (processingRef.current) return;

    
        processingRef.current = true;
        setSyncing(true);

        const all = await store.getTransactions();
        const queue = all.filter(t => !t.synced);
        console.log(`[Sync] Found ${queue.length} items to sync`);

        for (const tx of queue) {
            await processTransaction(tx);
        }

        setSyncing(false);
        processingRef.current = false;
    };

    return (
        <TransactionContext.Provider value={{ transactions, createTransaction, isOffline, syncing }}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (!context) throw new Error('useTransactions must be used within TransactionProvider');
    return context;
};
