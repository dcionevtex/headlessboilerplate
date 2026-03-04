
import { NextResponse } from 'next/server';
import config from '@/config.json';

const VTEX_API_BASE = `https://${config.vtex.accountName}.vtexcommercestable.com.br/api/checkout/pub/orderForm`;

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Missing cart ID' }, { status: 400 });
        }

        const response = await fetch(`${VTEX_API_BASE}/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
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
