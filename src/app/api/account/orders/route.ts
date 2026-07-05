import { NextRequest, NextResponse } from 'next/server';
import config from '@/config.json';

// The session JWT's own "sub" claim is the authoritative email - never trust a
// client-supplied email, or any authenticated shopper could read another
// customer's order history by passing a different address in the query string.
function getEmailFromJwt(jwt: string): string | null {
    try {
        const payload = jwt.split('.')[1];
        const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
        return typeof decoded.sub === 'string' ? decoded.sub : null;
    } catch {
        return null;
    }
}

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Missing or malformed Authorization header' },
                { status: 401 }
            );
        }

        const jwt = authHeader.slice('Bearer '.length);
        const email = getEmailFromJwt(jwt);

        if (!email) {
            return NextResponse.json(
                { error: 'Invalid session token' },
                { status: 401 }
            );
        }

        const apiUrl = `https://${config.vtex.accountName}.vtexcommercestable.com.br/api/oms/user/orders?clientEmail=${encodeURIComponent(email)}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                // VTEX identifies the shopper via this cookie - no AppKey/AppToken needed here.
                'Cookie': `VtexIdclientAutCookie_${config.vtex.accountName}=${jwt}`,
            },
            cache: 'no-store',
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch account orders', details: data },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Account orders API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch account orders' },
            { status: 500 }
        );
    }
}
