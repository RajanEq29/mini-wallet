/**
 * Mini Offline Wallet App
 * Logic & Architecture Demo
 *
 * @format
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

import ErrorBoundary from './src/components/ErrorBoundary';
import { TransactionProvider } from './src/context/TransactionContext';

function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AuthProvider>
          <TransactionProvider>
            <RootNavigator />
          </TransactionProvider>
        </AuthProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

export default App;
