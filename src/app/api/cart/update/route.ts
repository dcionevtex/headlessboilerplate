
import { NextResponse } from 'next/server';
import config from '@/config.json';

const VTEX_API_BASE = `https://${config.vtex.accountName}.vtexcommercestable.com.br/api/checkout/pub/orderForm`;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderFormId, items } = body;

        if (!orderFormId || !items) {
            return NextResponse.json({ error: 'Missing orderFormId or items' }, { status: 400 });
        }

        // VTEX update items endpoint matches usage: /items/update
        const response = await fetch(`${VTEX_API_BASE}/${orderFormId}/items/update`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderItems: items // items should be array of { index, quantity }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json({ error: `VTEX Error: ${response.status}`, details: errorText }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
