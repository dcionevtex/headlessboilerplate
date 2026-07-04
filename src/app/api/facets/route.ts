import { NextRequest, NextResponse } from 'next/server';
import config from '@/config.json';

const VTEX_FACETS_API = `https://${config.vtex.accountName}.myvtex.com/api/io/_v/api/intelligent-search/facets`;

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('query') || '';

        const apiUrl = `${VTEX_FACETS_API}/?query=${encodeURIComponent(query)}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store', // Disable caching for real-time results
        });

        if (!response.ok) {
            throw new Error(`VTEX Facets API error: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Facets API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch facets' },
            { status: 500 }
        );
    }
}
