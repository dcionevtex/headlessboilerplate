import type { MetadataRoute } from 'next';
import pwaContent from '@/pwa-content.json';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: pwaContent.name,
        short_name: pwaContent.shortName,
        description: pwaContent.description,
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: pwaContent.backgroundColor,
        theme_color: pwaContent.themeColor,
        icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: '/icons/icon-192-maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
            { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
    };
}
