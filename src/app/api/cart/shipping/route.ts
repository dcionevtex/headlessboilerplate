
import { NextResponse } from 'next/server';
import config from '@/config.json';

const VTEX_API_BASE = `https://${config.vtex.accountName}.vtexcommercestable.com.br/api/checkout/pub/orderForm`;

export async function POST(request: Request) {
    try {
        const { orderFormId, location } = await request.json();

        if (!orderFormId || !location) {
            return NextResponse.json({ error: 'Missing orderFormId or location data' }, { status: 400 });
        }

        const url = `${VTEX_API_BASE}/${orderFormId}/attachments/shippingData`;

        // Construct payload suitable for VTEX
        // Using sample provided by user as template
        const payload = {
            clearAddressIfPostalCodeNotFound: false,
            selectedAddresses: [{
                addressType: "Residential",
                receiverName: "Valued Customer", // Default name
                addressId: "Home", // Common ID
                postalCode: location.postalCode || "00000", // Fallback
                city: "Dubai", // Fallback city if not parsed (Google formatted address usually has it, but we store string)
                country: location.countryCode || "ARE",
                street: location.address ? location.address.substring(0, 100) : "Street Address", // Truncate if too long?
                number: "1", // Dummy number if not known
                neighborhood: "Downtown", // Dummy
                geoCoordinates: (location.lng && location.lat)
                    ? [location.lng, location.lat]
                    : []
            }]
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('VTEX Shipping Attachment Error:', response.status, errorText);
            return NextResponse.json({
                error: `VTEX Error: ${response.status}`,
                details: errorText
            }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
