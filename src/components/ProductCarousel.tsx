'use client';

import { useRef } from 'react';
import ProductCard from './ProductCard';
import { VTEXProduct } from '@/types/vtex';

interface ProductCarouselProps {
    products: VTEXProduct[];
    title: string;
}

export default function ProductCarousel({ products, title }: ProductCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300; // Approximate card width
            const targetScroll =
                scrollContainerRef.current.scrollLeft +
                (direction === 'left' ? -scrollAmount : scrollAmount);

            scrollContainerRef.current.scrollTo({
                left: targetScroll,
                behavior: 'smooth',
            });
        }
    };

    if (products.length === 0) return null;

    return (
        <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 border-l-4 border-red-500 pl-4">
                    {title}
                </h2>

                {/* Navigation Controls */}
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="p-2 rounded-full border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all"
                        aria-label="Scroll left"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-2 rounded-full border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all"
                        aria-label="Scroll right"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="relative">
                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product) => (
                        <div
                            key={product.productId}
                            className="min-w-[280px] md:min-w-[320px] snap-start"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {/* Gradient Fade for scroll indication */}
                <div className="absolute right-0 top-0 bottom-6 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden" />
            </div>
        </div>
    );
}
