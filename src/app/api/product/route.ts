import { NextRequest, NextResponse } from 'next/server';
import config from '@/config.json';

// Same backend as /api/search, so the PDP sees exactly what search results show (and the
// multi-language catalog, unlike the legacy Catalog System search API). Intelligent Search has
// no exact-ID filter (fq=productId:X, a top-level productId param and slug lookups are all
// ignored), so search by the raw productId as the free-text term and pick the exact match.
const VTEX_SEARCH_API = `https://${config.vtex.accountName}.myvtex.com/api/io/_v/api/intelligent-search/product_search`;

interface SearchProductEntry {
    productId: string;
    items: Array<{ itemId: string }>;
}

async function fetchProductById(productId: string, sc: string) {
    const params = new URLSearchParams({ query: productId, count: '50', sc });
    const response = await fetch(`${VTEX_SEARCH_API}/?${params}`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
    });
    if (!response.ok) throw new Error(`VTEX API error: ${response.status}`);

    const data = await response.json();
    // When Intelligent Search splits a product by a SKU specification (e.g. one result per
    // Colour: cacheId "sp-140-black", "sp-140-silver"), each entry carries only that slice of
    // SKUs. The PDP needs all of them, so merge every entry for this productId.
    const matches: SearchProductEntry[] = (data.products || [])
        .filter((p: SearchProductEntry) => p.productId === productId);
    if (matches.length === 0) return null;

    const seen = new Set<string>();
    const items = matches.flatMap(p => p.items).filter(item => !seen.has(item.itemId) && seen.add(item.itemId));
    items.sort((a, b) => Number(a.itemId) - Number(b.itemId));
    return { ...matches[0], items };
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const productId = searchParams.get('productId');
        const sc = searchParams.get('sc') || '1';

        if (!productId) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            );
        }

        const product = await fetchProductById(productId, sc);
        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(product);
    } catch (error) {
        console.error('Product API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product details' },
            { status: 500 }
        );
    }
}
