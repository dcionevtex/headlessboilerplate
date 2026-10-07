import { NextRequest, NextResponse } from 'next/server';
import config from '@/config.json';
import { buildCategoryFacetPath } from '@/lib/search';

const VTEX_SEARCH_API = `https://${config.vtex.accountName}.myvtex.com/api/io/_v/api/intelligent-search/product_search`;

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('query') || '';
        const category = searchParams.get('category') || ''; // e.g. "pets/dogs" - slash-separated slugs
        const page = searchParams.get('page') || '1';
        const count = searchParams.get('count') || '24';

        // Build query params for VTEX API
        const params = new URLSearchParams({
            simulationBehavior: 'default',
            count,
            page,
            showSponsored: 'false',
            hideUnavailableItems: 'false',
        });

        // Category browsing uses Intelligent Search's hierarchical path-segment facets
        // (category-1/{slug}/category-2/{slug}/...), not a free-text query: fq=categoryId:X and
        // similar query-param forms are silently ignored, and a bare subcategory slug without its
        // parent levels returns the wrong/empty set. A plain keyword search still uses `query`.
        let apiUrl: string;
        if (category) {
            apiUrl = `${VTEX_SEARCH_API}/${buildCategoryFacetPath(category)}/?${params}`;
        } else {
            params.set('query', query);
            apiUrl = `${VTEX_SEARCH_API}/?${params}`;
        }

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
