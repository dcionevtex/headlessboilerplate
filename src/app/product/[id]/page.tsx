'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProductById } from '@/lib/product';
import { addItemToCart } from '@/lib/cart';
import { VTEXProduct, VTEXItem } from '@/types/vtex';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGallery from '@/components/ProductGallery';
import SKUSelector from '@/components/SKUSelector';
import QuantitySelector from '@/components/QuantitySelector';
import ShippingSimulation from '@/components/ShippingSimulation';
import config from '@/config.json';

export default function ProductPage() {
    const params = useParams();
    const productId = params.id as string;

    const [product, setProduct] = useState<VTEXProduct | null>(null);
    const [selectedSKU, setSelectedSKU] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [adding, setAdding] = useState(false);

    const { refreshCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(false);

            try {
                const data = await getProductById(productId);
                if (data) {
                    setProduct(data);
                    // Select first available SKU by default
                    if (data.items && data.items.length > 0) {
                        setSelectedSKU(data.items[0].itemId);
                    }
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error('Error loading product:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const selectedItem = product?.items?.find(item => item.itemId === selectedSKU);
    const seller = selectedItem?.sellers?.find(s => s.sellerDefault) || selectedItem?.sellers?.[0];
    const price = seller?.commertialOffer?.Price || 0;
    const listPrice = seller?.commertialOffer?.ListPrice || 0;
    const availableQuantity = seller?.commertialOffer?.AvailableQuantity || 0;
    const installments = seller?.commertialOffer?.Installments || [];
    const bestInstallment = installments.length > 0 ? installments[installments.length - 1] : null;

    const handleAddToCart = async () => {
        if (!selectedItem || !seller) return;

        setAdding(true);
        try {
            await addItemToCart({
                id: selectedItem.itemId,
                quantity: quantity,
                seller: seller.sellerId,
            });
            await refreshCart();
            alert(`Added ${quantity}x "${product?.productName}" to cart!`);
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add to cart. Please try again.');
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gray-50">
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500"></div>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (error || !product) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gray-50">
                    <div className="container mx-auto px-4 py-8">
                        <div className="text-center py-20">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
                            <a href="/" className="text-red-500 hover:text-red-600 font-medium">
                                Return to Homepage
                            </a>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // Build breadcrumb from categories
    const categories = product.categories || [];
    const categoryPath = categories[0] || '';
    const categoryParts = categoryPath.split('/').filter(Boolean);

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                        <a href="/" className="flex items-center gap-1 hover:text-red-500 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Home
                        </a>
                        {categoryParts.map((category, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className={index === categoryParts.length - 1 ? 'text-gray-900 font-medium' : ''}>
                                    {category}
                                </span>
                            </div>
                        ))}
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-gray-900 font-medium truncate max-w-xs">{product.productName}</span>
                    </nav>

                    {/* Product Content */}
                    <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                            {/* Left Column - Images */}
                            <div>
                                <ProductGallery
                                    images={selectedItem?.images || []}
                                    productName={product.productName}
                                />
                            </div>

                            {/* Right Column - Product Info */}
                            <div className="space-y-6">
                                {/* Brand */}
                                {config.pdp.showBrandName && product.brand && (
                                    <div className="text-sm text-gray-600">
                                        Brand: <span className="font-semibold text-gray-900">{product.brand}</span>
                                    </div>
                                )}

                                {/* Product Name */}
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {product.productName}
                                </h1>

                                {/* Product Metadata */}
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    {product.productReference && (
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium">Ref:</span>
                                            <span>{product.productReference}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium">ID:</span>
                                        <span>{product.productId}</span>
                                    </div>
                                    {selectedItem?.ean && (
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium">EAN:</span>
                                            <span>{selectedItem.ean}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="border-t border-b border-gray-200 py-4">
                                    {listPrice > price && (
                                        <div className="text-sm text-gray-500 line-through mb-1">
                                            AED {listPrice.toFixed(2)}
                                        </div>
                                    )}
                                    <div className="text-4xl font-bold text-gray-900">
                                        AED {price.toFixed(2)}
                                    </div>
                                    {bestInstallment && (
                                        <div className="text-sm text-gray-600 mt-2">
                                            or {bestInstallment.NumberOfInstallments}x of AED {bestInstallment.Value.toFixed(2)}
                                        </div>
                                    )}
                                </div>

                                {/* Seller Info */}
                                {config.marketplace.showSellerId && seller && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        <span className="text-gray-600">
                                            Sold by: <span className="font-semibold text-gray-900">{seller.sellerName}</span>
                                        </span>
                                        <span className="text-xs text-gray-500">(ID: {seller.sellerId})</span>
                                    </div>
                                )}

                                {/* Stock Status */}
                                {config.pdp.showInStock && (
                                    <div className="flex items-center gap-2">
                                        {availableQuantity === 0 ? (
                                            <>
                                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                <span className="text-sm text-red-700 font-medium">Out of Stock</span>
                                            </>
                                        ) : availableQuantity <= config.pdp.stockThresholds.low ? (
                                            <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                                Low Stock
                                            </div>
                                        ) : availableQuantity <= config.pdp.stockThresholds.medium ? (
                                            <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                                Medium Stock
                                            </div>
                                        ) : (
                                            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                                High Stock
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* SKU Selector */}
                                {product.items && product.items.length > 1 && (
                                    <SKUSelector
                                        items={product.items}
                                        selectedSKU={selectedSKU}
                                        onSelectSKU={setSelectedSKU}
                                    />
                                )}

                                {/* Quantity Selector */}
                                <QuantitySelector
                                    quantity={quantity}
                                    onQuantityChange={setQuantity}
                                    maxQuantity={Math.min(availableQuantity, 99)}
                                />

                                {/* Shipping Simulation */}
                                {selectedItem && seller && (
                                    <ShippingSimulation
                                        skuId={selectedItem.itemId}
                                        sellerId={seller.sellerId}
                                        quantity={quantity}
                                    />
                                )}

                                {/* Add to Cart Button */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={availableQuantity === 0 || adding}
                                    className="w-full py-4 px-6 bg-red-500 text-white rounded-lg font-semibold text-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                >
                                    {adding ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Adding to Cart...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Add to Cart
                                        </>
                                    )}
                                </button>

                                {/* Product Description */}
                                {product.description && (
                                    <div className="pt-6 border-t border-gray-200">
                                        <h2 className="text-xl font-bold text-gray-900 mb-3">
                                            Product Description
                                        </h2>
                                        <div
                                            className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ __html: product.description }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
