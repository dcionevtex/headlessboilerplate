'use client';

import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import SortDropdown from './SortDropdown';
import { VTEXProduct } from '@/types/vtex';

interface PaginatedProductGridProps {
    products: VTEXProduct[];
    itemsPerPage?: number;
}

export default function PaginatedProductGrid({ products, itemsPerPage = 16 }: PaginatedProductGridProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState('relevance');

    // Memoized sort to avoid expensive re-computations
    const sortedProducts = useMemo(() => {
        const items = [...products];
        switch (sortOption) {
            case 'price_asc':
                return items.sort((a, b) => {
                    const priceA = a.items[0]?.sellers[0]?.commertialOffer?.Price || 0;
                    const priceB = b.items[0]?.sellers[0]?.commertialOffer?.Price || 0;
                    return priceA - priceB;
                });
            case 'price_desc':
                return items.sort((a, b) => {
                    const priceA = a.items[0]?.sellers[0]?.commertialOffer?.Price || 0;
                    const priceB = b.items[0]?.sellers[0]?.commertialOffer?.Price || 0;
                    return priceB - priceA;
                });
            case 'name_asc':
                return items.sort((a, b) => a.productName.localeCompare(b.productName));
            case 'name_desc':
                return items.sort((a, b) => b.productName.localeCompare(a.productName));
            default:
                return items;
        }
    }, [products, sortOption]);

    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const grid = document.getElementById('product-grid-top');
        if (grid) {
            const yOffset = -100;
            const y = grid.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <div id="product-grid-top" className="scroll-mt-24">
            <div className="flex justify-end mb-4">
                <SortDropdown currentSort={sortOption} onSortChange={setSortOption} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
                {currentProducts.map((product) => (
                    <ProductCard key={product.productId} product={product} />
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex flex-col items-center mt-12 space-y-4">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-lg border font-medium transition-colors
                                ${currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                                    : 'bg-white text-gray-700 hover:bg-red-50 hover:border-red-200 border-gray-300'}`}
                        >
                            Previous
                        </button>

                        <div className="flex space-x-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-10 h-10 rounded-lg font-bold transition-all flex items-center justify-center
                                        ${currentPage === page
                                            ? 'bg-red-500 text-white shadow-md transform scale-105'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-lg border font-medium transition-colors
                                ${currentPage === totalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                                    : 'bg-white text-gray-700 hover:bg-red-50 hover:border-red-200 border-gray-300'}`}
                        >
                            Next
                        </button>
                    </div>

                    <div className="text-sm text-gray-500">
                        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedProducts.length)} of {sortedProducts.length} products
                    </div>
                </div>
            )}
        </div>
    );
}
