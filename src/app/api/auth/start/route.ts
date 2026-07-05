import { NextResponse } from 'next/server';
import config from '@/config.json';

const VTEX_AUTH_HOST = `https://${config.vtex.accountName}.vtexcommercestable.com.br`;

export async function GET() {
    try {
        const params = new URLSearchParams({
            scope: config.vtex.accountName,
            locale: 'en-US',
            returnUrl: '/',
            appStart: 'true',
        });

        const apiUrl = `${VTEX_AUTH_HOST}/api/vtexid/pub/authentication/start?${params}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`VTEX API error: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Auth start API error:', error);
        return NextResponse.json(
            { error: 'Failed to start authentication' },
            { status: 500 }
        );
    }
}
