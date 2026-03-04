'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import { simulateShipping } from '@/lib/simulation';
import { attachShippingData } from '@/lib/cart';
import content from '@/site-content.json';
import config from '@/config.json';

// Helper to determine best shipping option
const getBestShippingOption = (logisticsInfo: any[]) => {
    let totalShipping = 0;

    logisticsInfo.forEach((info) => {
        if (!info.slas || info.slas.length === 0) return;

        // Find cheapest, then fastest
        const sorted = info.slas.sort((a: any, b: any) => {
            if (a.price !== b.price) return a.price - b.price;
            return 0;
        });

        // Add price of best option (in cents)
        totalShipping += sorted[0].price;
    });

    return totalShipping;
};

export default function MiniCart() {
    const { isCartOpen, closeCart, cartItems, sellers, cartTotal, updateItem } = useCart();
    const { location } = useLocation();
    const cartRef = useRef<HTMLDivElement>(null);

    // Shipping State
    const [shippingCost, setShippingCost] = useState(0);
    const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderFormId, setOrderFormId] = useState<string | null>(null);

    useEffect(() => {
        setOrderFormId(localStorage.getItem('vtex_orderFormId'));
    }, [isCartOpen]);

    // Calculate Shipping when cart or location changes
    useEffect(() => {
        const calculateShipping = async () => {
            // Needs items and Location
            if (cartItems.length === 0 || !location.countryCode) {
                setShippingCost(0);
                return;
            }

            setIsCalculatingShipping(true);
            try {
                // Map cart items to ID/Qty/Seller format
                const itemsPayload = cartItems.map(item => ({
                    id: item.id || item.uniqueId,
                    quantity: item.quantity,
                    seller: item.seller ?? item.sellerId ?? '1'
                }));

                const result = await simulateShipping(itemsPayload, {
                    countryCode: location.countryCode,
                    postalCode: location.postalCode,
                    lat: location.lat,
                    lng: location.lng
                });

                if (result && result.logisticsInfo) {
                    const cost = getBestShippingOption(result.logisticsInfo);
                    setShippingCost(cost / 100); // VTEX uses cents
                } else {
                    setShippingCost(0);
                }

            } catch (error) {
                console.error("Failed to calculate cart shipping", error);
                setShippingCost(0);
            } finally {
                setIsCalculatingShipping(false);
            }
        };

        if (isCartOpen) {
            calculateShipping();
        }
    }, [isCartOpen, cartItems, location]);

    if (!isCartOpen) return null;

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: config.globalSettings.currency,
        }).format(value);
    };

    const handleCheckout = async () => {
        const orderFormId = localStorage.getItem('vtex_orderFormId');
        console.log('Attempting checkout with OrderFormID:', orderFormId);

        if (orderFormId) {
            setIsCheckingOut(true);
            try {
                // Attach Shipping Data if location is set
                if (location.countryCode) {
                    console.log('Attaching shipping data...', location);
                    await attachShippingData(orderFormId, location);
                }

                const url = `https://${config.vtex.accountName}.myvtex.com/checkout?orderFormId=${orderFormId}#/cart`;
                console.log('Navigating to:', url);
                window.location.href = url;
            } catch (error) {
                console.error('Error during checkout preparation:', error);
                // Fallback: navigate anyway
                const url = `https://${config.vtex.accountName}.myvtex.com/checkout?orderFormId=${orderFormId}#/cart`;
                window.location.href = url;
            }
        } else {
            console.error('No OrderFormID found in localStorage');
            alert('Order Form ID not found. Please try refreshing or adding an item again.');
        }
    };

    // Grand Total
    const grandTotal = cartTotal + shippingCost;

    return (
        <div
            className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeCart}
        >
            <div
                ref={cartRef}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right transform transition-transform duration-300"
            >
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-gray-900">{content.cart.title}</h2>
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                            {cartItems.length} items
                        </span>
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        aria-label="Close cart"
                    >
                        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <p className="text-lg font-medium text-gray-900">{content.cart.empty}</p>
                            <button
                                onClick={closeCart}
                                className="text-red-600 font-semibold hover:text-red-700 transition-colors"
                            >
                                {content.cart.continueShopping} &rarr;
                            </button>
                        </div>
                    ) : config.marketplace.showSellerId ? (
                        // Marketplace mode: Group by seller
                        Object.entries(
                            cartItems.reduce((acc, item) => {
                                const sellerId = item.seller;
                                if (!acc[sellerId]) acc[sellerId] = [];
                                acc[sellerId].push(item);
                                return acc;
                            }, {} as Record<string, any[]>)
                        ).map(([sellerId, items]) => {
                            const seller = sellers.find(s => s.id === sellerId);
                            const sellerName = seller?.name || 'Unknown Seller';

                            return (
                                <div key={sellerId} className="mb-6 last:mb-0">
                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 sticky top-0 bg-white z-10">
                                        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <span className="text-sm font-bold text-gray-700">{content.cart.soldBy} {sellerName}</span>
                                    </div>

                                    <div className="space-y-6">
                                        {(items as any[]).map((item: any) => {
                                            const index = cartItems.indexOf(item);
                                            return (
                                                <div key={item.uniqueId || item.id} className="flex gap-4 group">
                                                    <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                                        {item.imageUrl && (
                                                            <Image
                                                                src={item.imageUrl}
                                                                alt={item.name}
                                                                fill
                                                                className="object-contain p-2"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-between py-1">
                                                        <div>
                                                            <div className="flex justify-between items-start gap-2">
                                                                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                                                                    {item.name}
                                                                </h3>
                                                                <button
                                                                    onClick={() => updateItem(index, 0)}
                                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1 -mr-2"
                                                                    title="Remove item"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Unit: {formatPrice(item.price / 100)}
                                                            </p>
                                                        </div>

                                                        <div className="flex justify-between items-end mt-2">
                                                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg h-8">
                                                                <button
                                                                    onClick={() => updateItem(index, item.quantity - 1)}
                                                                    disabled={item.quantity <= 1}
                                                                    className={`px-3 h-full flex items-center justify-center transition-colors rounded-l-lg
                                                                        ${item.quantity <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 hover:text-red-600'}`}
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="w-8 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                                                                <button
                                                                    onClick={() => updateItem(index, item.quantity + 1)}
                                                                    className="px-3 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-red-600 transition-colors rounded-r-lg"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                            <p className="font-bold text-gray-900 text-lg">
                                                                {formatPrice((item.price * item.quantity) / 100)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        // Non-marketplace mode
                        <div className="space-y-6">
                            {cartItems.map((item, index) => (
                                <div key={item.uniqueId || item.id} className="flex gap-4 group">
                                    <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                        {item.imageUrl && (
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.name}
                                                fill
                                                className="object-contain p-2"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                                                    {item.name}
                                                </h3>
                                                <button
                                                    onClick={() => updateItem(index, 0)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1 -mr-2"
                                                    title="Remove item"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Unit: {formatPrice(item.price / 100)}
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-end mt-2">
                                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg h-8">
                                                <button
                                                    onClick={() => updateItem(index, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className={`px-3 h-full flex items-center justify-center transition-colors rounded-l-lg
                                                        ${item.quantity <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 hover:text-red-600'}`}
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateItem(index, item.quantity + 1)}
                                                    className="px-3 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-red-600 transition-colors rounded-r-lg"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p className="font-bold text-gray-900 text-lg">
                                                {formatPrice((item.price * item.quantity) / 100)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="p-6 border-t bg-gray-50 space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        <div className="space-y-2">
                            {/* Subtotal */}
                            <div className="flex justify-between items-center text-gray-600 text-sm">
                                <span>{content.cart.subtotal}</span>
                                <span>{formatPrice(cartTotal)}</span>
                            </div>

                            {/* Shipping */}
                            <div className="flex justify-between items-center text-gray-600 text-sm">
                                <span>Shipping Cost</span>
                                <span className={`${isCalculatingShipping ? 'opacity-50' : ''}`}>
                                    {isCalculatingShipping
                                        ? 'Calculating...'
                                        : shippingCost === 0
                                            ? 'Free'
                                            : formatPrice(shippingCost)
                                    }
                                </span>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center text-xl font-bold text-gray-900 pt-3 border-t border-gray-200 mt-2">
                                <span>Total</span>
                                <span>{formatPrice(grandTotal)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            className="w-full bg-black text-white py-4 rounded-lg font-bold hover:bg-red-500 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isCheckingOut ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    {content.cart.checkout}
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </>
                            )}
                        </button>

                        {/* Debug Info */}
                        <p className="text-[10px] text-gray-400 text-center font-mono">
                            ID: {orderFormId || 'Not set'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
