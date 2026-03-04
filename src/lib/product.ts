import { VTEXProduct } from '@/types/vtex';

const PRODUCT_API = '/api/product';

export async function getProductById(productId: string): Promise<VTEXProduct | null> {
    try {
        const response = await fetch(`${PRODUCT_API}?productId=${productId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Product API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

// Helper to get product by linkText (slug)
export async function getProductBySlug(slug: string): Promise<VTEXProduct | null> {
    // In a real scenario, you'd need a different API endpoint
    // For now, we'll use the productId approach
    // You can extend this later
    return null;
}
