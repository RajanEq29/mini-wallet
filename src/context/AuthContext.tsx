
import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as storage from '../utils/storage';
import * as api from '../api/mockAuth';

type AuthContextType = {
    isLoading: boolean;
    userToken: string | null;
    signIn: (data: any) => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState<string | null>(null);

  
    useEffect(() => {
        const bootstrapAsync = async () => {
            let restoredToken: string | null = null;
            try {
                const data = await storage.getAuthToken();
                if (data) {
                    const { token, expiry } = data;
                    const now = Math.floor(Date.now() / 1000);

                    if (expiry > now) {
                        restoredToken = token;
                    } else {
                        console.log('Token expired on startup, clearing...');
                        await storage.clearAuthToken();
                    }
                }
            } catch (e) {
                console.warn('Restoring token failed');
            }
            setUserToken(restoredToken);
            setIsLoading(false);
        };

        bootstrapAsync();
    }, []);


    useEffect(() => {
        const handleAppStateChange = async (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active' && userToken) {
                // Check token validity
                const data = await storage.getAuthToken();
                if (data) {
                    const now = Math.floor(Date.now() / 1000);
                    if (data.expiry <= now) {
                        console.log('Token expired while backgrounded, logging out.');
                        signOut();
                    }
                }
            }
        };
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => {
            subscription.remove();
        };
    }, [userToken]);

    useEffect(() => {
        if (!userToken) return;

        let timer: ReturnType<typeof setTimeout>;

        const setExpiryTimer = async () => {
            const data = await storage.getAuthToken();
            if (data) {
                const now = Math.floor(Date.now() / 1000);
                const remaining = (data.expiry - now) * 1000;
                if (remaining > 0) {
                    timer = setTimeout(() => {
                        console.log('Token expired while active, logging out.');
                        signOut();
                    }, remaining);
                } else {
                    signOut(); 
                }
            }
        };
        setExpiryTimer();

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [userToken]);


    const authContext = useMemo(
        () => ({
            isLoading,
            userToken,
            signIn: async (data: any) => {
                try {
                    const { username, password } = data;
                    const res = await api.login(username, password);
                    await storage.saveAuthToken(res.token, res.expiry);
                    setUserToken(res.token);
                } catch (e) {
                    throw e;
                }
            },
            signOut: async () => {
                try {
                    await storage.clearAuthToken();
                    setUserToken(null);
                } catch (e) {
                    console.error(e);
                }
            },
        }),
        [isLoading, userToken]
    );

    const signOut = async () => {
        await storage.clearAuthToken();
        setUserToken(null);
    }

    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
