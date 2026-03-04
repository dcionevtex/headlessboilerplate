'use client';

import { useState } from 'react';
import Image from 'next/image';
import { VTEXProduct } from '@/types/vtex';
import { addItemToCart } from '@/lib/cart';
import { useCart } from '@/context/CartContext';
import config from '@/config.json';

interface ProductCardProps {
    product: VTEXProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const { refreshCart } = useCart();

    // Get the first item and its details
    const firstItem = product.items[0];
    const firstSeller = firstItem?.sellers?.find(s => s.sellerDefault) || firstItem?.sellers?.[0];
    const commercialOffer = firstSeller?.commertialOffer;
    const commercialOfferInstallments = commercialOffer?.Installments || [];
    const image = firstItem?.images[0];

    // Format price
    const price = commercialOffer?.Price || 0;
    const listPrice = commercialOffer?.ListPrice || 0;
    const hasDiscount = listPrice > price;

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: config.globalSettings.currency,
        }).format(value);
    };

    const increment = () => setQuantity(q => q + 1);
    const decrement = () => setQuantity(q => q > 1 ? q - 1 : 1);

    const handleAddToCart = async () => {
        if (!firstItem || !firstSeller) return;

        setIsAdding(true);
        try {
            await addItemToCart({
                id: firstItem.itemId,
                quantity: quantity,
                seller: firstSeller.sellerId
            });
            await refreshCart(); // Update header
            alert(`Successfully added ${quantity}x "${product.productName}" to your cart!`);
            setQuantity(1); // Reset quantity after adding
        } catch (error) {
            console.error(error);
            alert('Failed to add product to cart. Please try again.');
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
            {/* Product Image */}
            <a href={`/product/${product.productId}`} className="block relative aspect-square bg-gray-100 overflow-hidden">
                {image && (
                    <Image
                        src={image.imageUrl}
                        alt={image.imageText || product.productName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                )}
                {hasDiscount && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {Math.round(((listPrice - price) / listPrice) * 100)}% OFF
                    </div>
                )}
            </a>

            {/* Product Info */}
            <div className="p-4">
                {/* Brand */}
                {product.brand && (
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        {product.brand}
                    </p>
                )}

                {/* Seller Name - Conditionally Rendered */}
                {config.marketplace.showSellerId && firstSeller?.sellerName && (
                    <p className="text-xs text-red-600 font-medium mb-2 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        Sold by {firstSeller.sellerName}
                    </p>
                )}

                {/* Product Name */}
                <a href={`/product/${product.productId}`}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem] hover:text-red-500 transition-colors">
                        {product.productName}
                    </h3>
                </a>

                {/* Price and Quantity Row */}
                <div className="mb-4 flex items-end justify-between gap-2">
                    {/* Price Block */}
                    <div>
                        {hasDiscount && (
                            <p className="text-sm text-gray-400 line-through">
                                {formatPrice(listPrice)}
                            </p>
                        )}
                        <p className="text-2xl font-bold text-red-500">
                            {formatPrice(price)}
                        </p>
                        {config.globalSettings.installmentProductCard && commercialOfferInstallments.length > 0 && (
                            <p className="text-xs text-gray-600 mt-1">
                                or {commercialOfferInstallments[0].NumberOfInstallments}x of{' '}
                                {formatPrice(commercialOfferInstallments[0].Value)}
                            </p>
                        )}
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg h-9 shadow-sm shrink-0">
                        <button
                            onClick={(e) => { e.preventDefault(); decrement(); }}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-l-lg transition-colors cursor-pointer font-bold text-lg"
                            aria-label="Decrease quantity"
                        >
                            -
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-900 text-sm select-none">{quantity}</span>
                        <button
                            onClick={(e) => { e.preventDefault(); increment(); }}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-r-lg transition-colors cursor-pointer font-bold text-lg"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Add to Cart Button */}
                <button
                    className={`w-full font-semibold py-3 rounded-lg transition-all duration-300 transform 
                        ${isAdding
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-black hover:bg-red-500 hover:scale-105 text-white'}`}
                    onClick={handleAddToCart}
                    disabled={isAdding}
                >
                    {isAdding ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Adding...
                        </span>
                    ) : (
                        `Add to Cart (${formatPrice(price * quantity)})`
                    )}
                </button>
            </div>
        </div>
    );
}
