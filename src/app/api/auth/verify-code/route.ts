import { NextRequest, NextResponse } from 'next/server';
import config from '@/config.json';

const VTEX_AUTH_HOST = `https://${config.vtex.accountName}.vtexcommercestable.com.br`;

export async function POST(request: NextRequest) {
    try {
        const { authenticationToken, email, accessKey } = await request.json();

        if (!authenticationToken || !email || !accessKey) {
            return NextResponse.json(
                { error: 'authenticationToken, email and accessKey are required' },
                { status: 400 }
            );
        }

        const body = new URLSearchParams({
            login: email,
            accessKey,
            authenticationToken,
        });

        const apiUrl = `${VTEX_AUTH_HOST}/api/vtexid/pub/authentication/accesskey/validate`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': `_vss=${authenticationToken}`,
            },
            body,
            cache: 'no-store',
        });

        // VTEX returns a real authStatus (e.g. "WrongCredentials") in the body even on a
        // non-2xx response - read the body first so that case isn't collapsed into a
        // generic 500 that looks identical to a normal "wrong code" to the client.
        const data = await response.json();

        if (data.authStatus === 'Success') {
            return NextResponse.json({
                success: true,
                cookieValue: data.authCookie.Value,
                cookieName: data.authCookie.Name,
                userId: data.userId,
                email,
            });
        }

        return NextResponse.json(
            { success: false, authStatus: data.authStatus },
            { status: 401 }
        );
    } catch (error) {
        console.error('Auth verify-code API error:', error);
        return NextResponse.json(
            { error: 'Failed to verify access code' },
            { status: 500 }
        );
    }
}
