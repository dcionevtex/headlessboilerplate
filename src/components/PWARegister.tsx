'use client';

import { useEffect } from 'react';

export default function PWARegister() {
    useEffect(() => {
        if (!('serviceWorker' in navigator)) return;
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Non-fatal: the site still works fully without the service worker,
            // it just won't be installable or cache the app shell for offline use.
        });
    }, []);

    return null;
}
