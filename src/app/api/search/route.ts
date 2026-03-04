import { NextRequest, NextResponse } from 'next/server';
import config from '@/config.json';

const VTEX_SEARCH_API = `https://${config.vtex.accountName}.myvtex.com/api/io/_v/api/intelligent-search/product_search`;

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('query') || '';
        const page = searchParams.get('page') || '1';
        const count = searchParams.get('count') || '24';

        // Build query params for VTEX API
        const params = new URLSearchParams({
            query,
            simulationBehavior: 'default',
            count,
            page,
            showSponsored: 'false',
            hideUnavailableItems: 'false',
        });

        // Fetch from VTEX Intelligent Search API
        const apiUrl = `${VTEX_SEARCH_API}/?${params}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store', // Disable caching for real-time results
        });

        if (!response.ok) {
            throw new Error(`VTEX API error: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch search results' },
            { status: 500 }
        );
    }
}
