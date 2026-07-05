'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { startAuthentication, sendAccessKeyEmail, verifyAccessKey } from '@/lib/auth';

interface AuthContextType {
    email: string | null;
    sessionToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    requestLoginCode: (email: string) => Promise<{ authenticationToken: string }>;
    confirmLoginCode: (authenticationToken: string, email: string, accessKey: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [email, setEmail] = useState<string | null>(null);
    const [sessionToken, setSessionToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedEmail = localStorage.getItem('vtex_auth_email');
        const savedSession = localStorage.getItem('vtex_auth_session');

        if (savedEmail && savedSession) {
            setEmail(savedEmail);
            setSessionToken(savedSession);
        }

        setLoading(false);
    }, []);

    const requestLoginCode = async (emailToLogin: string) => {
        const startData = await startAuthentication();
        await sendAccessKeyEmail(startData.authenticationToken, emailToLogin);
        return { authenticationToken: startData.authenticationToken };
    };

    const confirmLoginCode = async (authenticationToken: string, emailToConfirm: string, accessKey: string) => {
        const data = await verifyAccessKey(authenticationToken, emailToConfirm, accessKey);

        if (data.success) {
            setEmail(emailToConfirm);
            setSessionToken(data.cookieValue);
            localStorage.setItem('vtex_auth_email', emailToConfirm);
            localStorage.setItem('vtex_auth_session', data.cookieValue);
            return true;
        }

        return false;
    };

    const logout = () => {
        setEmail(null);
        setSessionToken(null);
        localStorage.removeItem('vtex_auth_email');
        localStorage.removeItem('vtex_auth_session');
    };

    return (
        <AuthContext.Provider
            value={{
                email,
                sessionToken,
                isAuthenticated: sessionToken !== null,
                loading,
                requestLoginCode,
                confirmLoginCode,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
