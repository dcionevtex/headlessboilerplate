import { NextRequest, NextResponse } from 'next/server';
import config from '@/config.json';

const VTEX_AUTH_HOST = `https://${config.vtex.accountName}.vtexcommercestable.com.br`;

export async function POST(request: NextRequest) {
    try {
        const { authenticationToken, email } = await request.json();

        if (!authenticationToken || !email) {
            return NextResponse.json(
                { error: 'authenticationToken and email are required' },
                { status: 400 }
            );
        }

        const formData = new FormData();
        formData.append('authenticationToken', authenticationToken);
        formData.append('email', email);
        formData.append('recaptcha', '');

        const apiUrl = `${VTEX_AUTH_HOST}/api/vtexid/pub/authentication/accesskey/send`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Cookie': `_vss=${authenticationToken}`,
            },
            body: formData,
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`VTEX API error: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Auth send-code API error:', error);
        return NextResponse.json(
            { error: 'Failed to send access code' },
            { status: 500 }
        );
    }
}
