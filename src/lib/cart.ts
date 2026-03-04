
import config from '@/config.json';

const VTEX_CHECKOUT_API = `https://${config.vtex.accountName}.vtexcommercestable.com.br/api/checkout/pub/orderForm`;

export interface OrderItem {
    id: string;      // This maps to itemId
    quantity: number;
    seller: string;  // This maps to sellerId
}

export const getOrCreateCart = async (): Promise<string> => {
    // Check local storage first
    const existingCartId = localStorage.getItem('vtex_orderFormId');
    if (existingCartId) {
        return existingCartId;
    }

    // Create new cart via Proxy
    try {
        const response = await fetch('/api/cart/create', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to create cart: ${response.statusText}`);
        }

        const data = await response.json();
        const orderFormId = data.orderFormId;

        // Save to local storage
        localStorage.setItem('vtex_orderFormId', orderFormId);

        console.log('🛒 New VTEX Cart created:', orderFormId);
        return orderFormId;
    } catch (error) {
        console.error('Error creating cart:', error);
        throw error;
    }
};

export const addItemToCart = async (item: OrderItem) => {
    try {
        const orderFormId = await getOrCreateCart();
        console.log(`🛒 Adding item ${item.id} to cart ${orderFormId}...`);

        // Check for existing item to increment quantity instead of overwriting
        const currentCart = await getCartDetails(orderFormId);
        let quantityToSend = item.quantity;

        if (currentCart && currentCart.items) {
            const existingItem = currentCart.items.find((i: any) => i.id === item.id);
            if (existingItem) {
                console.log(`Found existing item ${item.id} with quantity ${existingItem.quantity}. Adding ${item.quantity}...`);
                quantityToSend += existingItem.quantity;
            }
        }

        // Use Proxy to add/update item
        // Since the API replaces quantity for existing items, we send the new calculated total.
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderFormId,
                items: [{ ...item, quantity: quantityToSend }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Failed to add item to cart: ${response.statusText} ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log('✅ Item added successfully!', data);
        return data;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
};

export const getCartDetails = async (orderFormId: string) => {
    try {
        const response = await fetch(`/api/cart/${orderFormId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) throw new Error('Failed to fetch cart');
        return await response.json();
    } catch (error) {
        console.error('Error fetching cart details:', error);
        return null;
    }
};

export const updateCartItem = async (index: number, quantity: number) => {
    try {
        const orderFormId = await getOrCreateCart();

        const response = await fetch('/api/cart/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderFormId,
                items: [{ index, quantity }]
            })
        });

        if (!response.ok) throw new Error('Failed to update item');
        return await response.json();
    } catch (error) {
        console.error('Error updating item:', error);
        throw error;
    }
};

export const attachShippingData = async (orderFormId: string, location: any) => {
    try {
        const response = await fetch('/api/cart/shipping', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderFormId,
                location
            })
        });

        if (!response.ok) {
            console.error('Failed to attach shipping data');
            throw new Error('Failed to attach shipping data');
        }

        return await response.json();
    } catch (error) {
        console.error('Error attaching shipping data:', error);
        throw error;
    }
};
