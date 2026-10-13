'use client';

import { useState, useSyncExternalStore } from 'react';
import config from '@/config.json';

const STORAGE_KEY = 'demo_consent_accepted';

const readAccepted = () => {
    try {
        return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
        return false;
    }
};

const subscribe = (onChange: () => void) => {
    window.addEventListener('storage', onChange);
    return () => window.removeEventListener('storage', onChange);
};

// One-time acknowledgement that this is a test store; remembered per browser so repeat
// visitors (and demo presenters) only see it once. Server snapshot reports "accepted" so
// nothing renders during SSR and hydration stays consistent.
export default function DemoConsent() {
    const accepted = useSyncExternalStore(subscribe, readAccepted, () => true);
    const [dismissed, setDismissed] = useState(false);
    const { enabled, title, body, confirm } = config.demoConsent;
    const open = enabled && !accepted && !dismissed;

    const accept = () => {
        try {
            localStorage.setItem(STORAGE_KEY, '1');
        } catch {
            // Storage blocked (private mode): just close for this page view
        }
        setDismissed(true);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="demo-consent-title">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
                <div className="mb-4 h-1.5 w-12 rounded-full bg-red-500" />
                <h2 id="demo-consent-title" className="mb-3 text-xl font-bold text-gray-900">
                    {title}
                </h2>
                <p className="mb-6 text-sm leading-relaxed text-gray-600">
                    {body}
                </p>
                <button
                    onClick={accept}
                    className="w-full rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                >
                    {confirm}
                </button>
            </div>
        </div>
    );
}
