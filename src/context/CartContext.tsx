'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCartDetails, updateCartItem } from '@/lib/cart';

interface CartContextType {
    itemCount: number;
    cartItems: any[];
    sellers: any[];
    cartTotal: number;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    refreshCart: () => Promise<void>;
    updateItem: (index: number, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextType>({
    itemCount: 0,
    cartItems: [],
    sellers: [],
    cartTotal: 0,
    isCartOpen: false,
    openCart: () => { },
    closeCart: () => { },
    refreshCart: async () => { },
    updateItem: async () => { },
});

export function CartProvider({ children }: { children: ReactNode }) {
    const [itemCount, setItemCount] = useState(0);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [sellers, setSellers] = useState<any[]>([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const refreshCart = async () => {
        const orderFormId = localStorage.getItem('vtex_orderFormId');
        if (!orderFormId) return;

        const details = await getCartDetails(orderFormId);
        if (details && details.items) {
            // Calculate total quantity across all items
            const count = details.items.reduce((acc: number, item: any) => acc + item.quantity, 0);
            setItemCount(count);
            setCartItems(details.items);
            setSellers(details.sellers || []);

            // Calculate total value
            // VTEX returns price in cents
            const total = details.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
            setCartTotal(total / 100);
        }
    };

    const updateItem = async (index: number, quantity: number) => {
        try {
            await updateCartItem(index, quantity);
            await refreshCart();
        } catch (error) {
            console.error('Failed to update cart item:', error);
        }
    };

    useEffect(() => {
        // Initial fetch on mount
        refreshCart();
    }, []);

    return (
        <CartContext.Provider value={{
            itemCount,
            cartItems,
            sellers,
            cartTotal,
            isCartOpen,
            openCart,
            closeCart,
            refreshCart,
            updateItem
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
