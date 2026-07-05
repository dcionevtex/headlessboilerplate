'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const { requestLoginCode, confirmLoginCode } = useAuth();

    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [authenticationToken, setAuthenticationToken] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset to a clean step-1 state every time the modal opens, so leftover
    // state from a previous login attempt never leaks into a fresh one.
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setEmail('');
            setCode('');
            setAuthenticationToken(null);
            setSubmitting(false);
            setError(null);
        }
    }, [isOpen]);

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const { authenticationToken: token } = await requestLoginCode(email);
            setAuthenticationToken(token);
            setStep(2);
        } catch (err) {
            setError('Failed to send code. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authenticationToken) return;

        setError(null);
        setSubmitting(true);

        try {
            const success = await confirmLoginCode(authenticationToken, email, code);
            if (success) {
                onClose();
            } else {
                setError('Invalid or expired code, please try again.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUseDifferentEmail = () => {
        setStep(1);
        setCode('');
        setAuthenticationToken(null);
        setError(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            {step === 1 ? 'Sign In' : 'Verify Your Email'}
                        </h2>
                        <p className="text-sm text-gray-500 font-medium">
                            {step === 1 ? 'Enter your email to continue' : `We sent a code to ${email}`}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-all hover:rotate-90 duration-300"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-8">
                    {step === 1 ? (
                        <form onSubmit={handleSendCode}>
                            <div className="relative mb-8">
                                <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 ml-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-red-500 focus:outline-none transition-all text-gray-900 shadow-sm hover:border-gray-200"
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-600 font-medium mb-4">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={submitting || !email}
                                className={`w-full px-8 py-4 rounded-2xl font-black text-white transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                                    ${submitting || !email ? 'bg-gray-200 cursor-not-allowed text-gray-400' : 'bg-gray-900 hover:bg-red-600 hover:-translate-y-0.5 active:translate-y-0'}`}
                            >
                                {submitting ? 'SENDING...' : 'SEND CODE'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyCode}>
                            <div className="relative mb-4">
                                <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 ml-1">
                                    6-Digit Code
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    required
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                    placeholder="123456"
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-red-500 focus:outline-none transition-all text-gray-900 shadow-sm hover:border-gray-200 tracking-[0.5em] text-center text-lg"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleUseDifferentEmail}
                                className="block text-sm text-red-500 hover:text-red-600 hover:underline font-medium mb-8"
                            >
                                Use a different email
                            </button>

                            {error && (
                                <p className="text-sm text-red-600 font-medium mb-4">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={submitting || code.length !== 6}
                                className={`w-full px-8 py-4 rounded-2xl font-black text-white transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                                    ${submitting || code.length !== 6 ? 'bg-gray-200 cursor-not-allowed text-gray-400' : 'bg-gray-900 hover:bg-red-600 hover:-translate-y-0.5 active:translate-y-0'}`}
                            >
                                {submitting ? 'VERIFYING...' : 'VERIFY'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
