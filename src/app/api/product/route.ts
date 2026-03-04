import { NextRequest, NextResponse } from 'next/server';
import config from '@/config.json';

const VTEX_PRODUCT_API = `https://${config.vtex.accountName}.vtexcommercestable.com.br/api/catalog_system/pub/products/search`;

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            );
        }

        const params = new URLSearchParams({
            fq: `productId:${productId}`,
            sc: '1',
        });

        const apiUrl = `${VTEX_PRODUCT_API}?${params}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`VTEX API error: ${response.status}`);
        }

        const data = await response.json();

        // VTEX returns an array, get first product
        if (data && data.length > 0) {
            return NextResponse.json(data[0]);
        } else {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error('Product API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product details' },
            { status: 500 }
        );
    }
}
