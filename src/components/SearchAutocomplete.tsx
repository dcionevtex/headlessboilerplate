'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { searchProducts } from '@/lib/search';
import { VTEXProduct } from '@/types/vtex';
import config from '@/config.json';

interface SearchAutocompleteProps {
    placeholder: string;
    size: 'md' | 'sm';
}

interface SearchResults {
    products: VTEXProduct[];
    recordsFiltered: number;
}

const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: config.globalSettings.currency,
    }).format(value);
};

export default function SearchAutocomplete({ placeholder, size }: SearchAutocompleteProps) {
    const router = useRouter();
    const [value, setValue] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SearchResults | null>(null);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const wrapperRef = useRef<HTMLFormElement>(null);
    const requestIdRef = useRef(0);

    const trimmedValue = value.trim();
    const rowCount = results && results.recordsFiltered > 0 ? results.products.length + 1 : 0;

    // VTEX fuzzy matching needs a near-complete token to return anything - short prefixes of a
    // longer word can legitimately return zero results, so we gate on length before fetching.
    useEffect(() => {
        const requestId = ++requestIdRef.current;
        setHighlightedIndex(-1);

        if (trimmedValue.length < 2) {
            setOpen(false);
            setResults(null);
            setLoading(false);
            return;
        }

        const timer = setTimeout(async () => {
            setOpen(true);
            setLoading(true);
            try {
                const data = await searchProducts(trimmedValue, 1, 5);
                if (requestIdRef.current !== requestId) return;
                setResults(data);
            } catch {
                if (requestIdRef.current !== requestId) return;
                setResults({ products: [], recordsFiltered: 0 });
            } finally {
                if (requestIdRef.current === requestId) setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [trimmedValue]);

    // Results can arrive up to 300ms after the highlight was last reset (e.g. an arrow-key
    // press during the debounce window) - re-clamp whenever the underlying list actually changes
    // so Enter/click can't silently activate a row that no longer exists.
    useEffect(() => {
        setHighlightedIndex(-1);
    }, [results]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (trimmedValue) {
            router.push(`/search?q=${encodeURIComponent(trimmedValue)}`);
        }
        setOpen(false);
    };

    const handleSelectProduct = (product: VTEXProduct) => {
        setOpen(false);
        router.push(`/product/${product.productId}`);
    };

    const handleSeeAll = () => {
        setOpen(false);
        router.push(`/search?q=${encodeURIComponent(trimmedValue)}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            if (!open || rowCount === 0) return;
            e.preventDefault();
            setHighlightedIndex(i => Math.min(i + 1, rowCount - 1));
        } else if (e.key === 'ArrowUp') {
            if (!open || rowCount === 0) return;
            e.preventDefault();
            setHighlightedIndex(i => Math.max(i - 1, -1));
        } else if (e.key === 'Escape') {
            setOpen(false);
            setHighlightedIndex(-1);
        } else if (e.key === 'Enter' && open && highlightedIndex >= 0 && rowCount > 0) {
            e.preventDefault();
            if (results && highlightedIndex < results.products.length) {
                handleSelectProduct(results.products[highlightedIndex]);
            } else {
                handleSeeAll();
            }
        }
    };

    const inputClasses = size === 'md'
        ? 'w-full px-6 py-3 pr-12 rounded-lg border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-colors text-base'
        : 'w-full px-4 py-2 pr-10 rounded-lg border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-colors text-sm';

    const buttonClasses = size === 'md'
        ? 'absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 transition-colors'
        : 'absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 transition-colors';

    const iconClasses = size === 'md' ? 'w-5 h-5' : 'w-4 h-4';

    return (
        <form ref={wrapperRef} onSubmit={handleSubmit} className="relative">
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={inputClasses}
            />
            <button type="submit" className={buttonClasses} aria-label="Search">
                <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>

            {open && (
                <div
                    role="listbox"
                    className="absolute top-full left-0 right-0 mt-1 z-50 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                >
                    {loading ? (
                        <div className="flex items-center justify-center py-6">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500" />
                        </div>
                    ) : results && results.recordsFiltered === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-600">
                            No results found for &quot;{trimmedValue}&quot;
                        </div>
                    ) : results && results.recordsFiltered > 0 ? (
                        <>
                            {results.products.map((product, index) => {
                                const thumbnailUrl = product.items[0]?.images[0]?.imageUrl;
                                const price = product.items[0]?.sellers[0]?.commertialOffer?.Price ?? 0;
                                return (
                                    <button
                                        key={product.productId}
                                        type="button"
                                        role="option"
                                        aria-selected={highlightedIndex === index}
                                        onClick={() => handleSelectProduct(product)}
                                        className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${highlightedIndex === index ? 'bg-red-50' : 'hover:bg-red-50'
                                            }`}
                                    >
                                        <div className="w-10 h-10 relative flex-shrink-0 rounded bg-gray-100 overflow-hidden">
                                            {thumbnailUrl && (
                                                <Image
                                                    src={thumbnailUrl}
                                                    alt={product.productName}
                                                    fill
                                                    sizes="40px"
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>
                                        <span className="flex-1 min-w-0">
                                            <span className="block text-sm text-gray-800 line-clamp-1">
                                                {product.productName}
                                            </span>
                                            <span className="block text-sm font-semibold text-red-500">
                                                {formatPrice(price)}
                                            </span>
                                        </span>
                                    </button>
                                );
                            })}
                            <button
                                type="button"
                                role="option"
                                aria-selected={highlightedIndex === results.products.length}
                                onClick={handleSeeAll}
                                className={`w-full px-4 py-2 text-left text-sm font-medium text-red-600 border-t border-gray-100 transition-colors ${highlightedIndex === results.products.length ? 'bg-red-50' : 'hover:bg-red-50'
                                    }`}
                            >
                                See all {results.recordsFiltered} results for &quot;{trimmedValue}&quot;
                            </button>
                        </>
                    ) : null}
                </div>
            )}
        </form>
    );
}
