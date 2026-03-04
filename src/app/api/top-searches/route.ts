import { NextResponse } from 'next/server';
import config from '@/config.json';

const VTEX_TOP_SEARCHES_API = `https://${config.vtex.accountName}.myvtex.com/api/io/_v/api/intelligent-search/top_searches`;

export async function GET() {
    try {
        const response = await fetch(VTEX_TOP_SEARCHES_API, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store', // Fresh data on each request
        });

        if (!response.ok) {
            throw new Error(`VTEX Top Searches API error: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Top Searches API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch top searches' },
            { status: 500 }
        );
    }
}
