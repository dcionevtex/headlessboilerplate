'use client';

import { useMemo } from 'react';
import { VTEXProduct } from '@/types/vtex';
import { FacetsResponse, Facet, FacetValue } from '@/lib/search';
import config from '@/config.json';

export interface FilterState {
    brand: string[];
    /** Selected category values keyed by 1-based depth (1 = department, 2 = subcategory, 3+ =
     * deeper levels). Not hardcoded to 2 levels because real VTEX category trees often go deeper. */
    categoryByDepth: Record<number, string[]>;
    seller: string[];
    priceRange: [number, number];
}

interface SearchSidebarProps {
    facets: FacetsResponse;
    products: VTEXProduct[];
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    /** How many category levels are already fixed by a category URL (?category=pets is 1,
     * ?category=pets/dogs is 2), 0 for a free-text search. Those depths are not offered as
     * checkboxes - an already-chosen (or sibling) level never makes sense as a filter, and VTEX's
     * department facet doesn't reliably respect that scoping anyway. */
    categoryBrowseDepth?: number;
}

interface FilterOption {
    value: string;
    quantity?: number;
}

const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: config.globalSettings.currency,
    }).format(value);
};

const getCategoryFacetByDepth = (facets: Facet[], depth: number): Facet | undefined => {
    return facets.find(f => {
        const match = f.key.match(/^category-(\d+)$/);
        return match !== null && parseInt(match[1], 10) === depth;
    });
};

const MAX_CATEGORY_DEPTH = 10; // generous ceiling - real category trees won't get anywhere near this

export default function SearchSidebar({ facets, products, filters, onFilterChange, categoryBrowseDepth = 0 }: SearchSidebarProps) {
    // Fallback facets derived from loaded products - used only when the real VTEX facet group is
    // missing. Depth-agnostic: one Set of values per category depth.
    const fallbackFacets = useMemo(() => {
        const brands = new Set<string>();
        const categoriesByDepth = new Map<number, Set<string>>();
        let minPrice = Infinity;
        let maxPrice = 0;

        products.forEach(product => {
            if (product.brand) brands.add(product.brand);

            // Format: ["/Tools/Power Tools/Drills/", "/Tools/"]
            if (product.categories) {
                product.categories.forEach(path => {
                    const parts = path.split('/').filter(Boolean);
                    parts.forEach((part, i) => {
                        const depth = i + 1;
                        if (!categoriesByDepth.has(depth)) categoriesByDepth.set(depth, new Set());
                        categoriesByDepth.get(depth)!.add(part);
                    });
                });
            }

            const price = product.items[0]?.sellers[0]?.commertialOffer?.Price || 0;
            if (price < minPrice) minPrice = price;
            if (price > maxPrice) maxPrice = price;
        });

        return {
            brands: Array.from(brands).sort(),
            categoriesByDepth,
            minPrice: minPrice === Infinity ? 0 : Math.floor(minPrice),
            maxPrice: Math.ceil(maxPrice),
        };
    }, [products]);

    // Sellers have no native VTEX facet on this account - keep deriving them from products
    const sellers = useMemo(() => {
        const sellerSet = new Set<string>();
        products.forEach(product => {
            product.items[0]?.sellers.forEach(seller => {
                if (seller.sellerName) sellerSet.add(seller.sellerName);
            });
        });
        return Array.from(sellerSet).sort();
    }, [products]);

    // VTEX hides a facet group once its value is already implied by the free-text query;
    // exclude those so we don't render an all-unchecked group for a filter that's already applied.
    const visibleFacets = useMemo(() => (facets.facets || []).filter(f => !f.hidden), [facets]);

    const toOptions = (values: FacetValue[]): FilterOption[] =>
        values.map(v => ({ value: v.name, quantity: v.quantity }));

    // One section per remaining category depth, starting right after whatever's already fixed by
    // the category URL, and continuing while a deeper level actually has values (real facet or
    // fallback). Each depth is independently selectable; selections across depths AND together.
    const categoryDepthOptions = useMemo(() => {
        const result: { depth: number; options: FilterOption[] }[] = [];
        for (let depth = categoryBrowseDepth + 1; depth <= MAX_CATEGORY_DEPTH; depth++) {
            const facet = getCategoryFacetByDepth(visibleFacets, depth);
            const fallbackValues = fallbackFacets.categoriesByDepth.get(depth);
            const options: FilterOption[] = facet && facet.values.length > 0
                ? toOptions(facet.values)
                : fallbackValues
                    ? Array.from(fallbackValues).sort().map(value => ({ value }))
                    : [];
            if (options.length === 0) break; // a hierarchical tree can't have a populated depth N+1 under an empty depth N
            result.push({ depth, options });
        }
        return result;
    }, [visibleFacets, categoryBrowseDepth, fallbackFacets.categoriesByDepth]);

    const brandFacet = useMemo(
        () => visibleFacets.find(f => f.name.toLowerCase() === 'brand'),
        [visibleFacets]
    );

    const priceRangeFacet = useMemo(
        () => visibleFacets.find(f => f.type === 'PRICERANGE'),
        [visibleFacets]
    );

    // [0, 0] doubles as the "no price filter selected" sentinel, so drop any degenerate
    // bucket that would collide with it (missing range, or a genuine 0-0 bucket).
    const priceBuckets = useMemo(() => {
        if (!priceRangeFacet) return [];
        return priceRangeFacet.values.filter(bucket => {
            const from = bucket.range?.from ?? 0;
            const to = bucket.range?.to ?? 0;
            return !(from === 0 && to === 0);
        });
    }, [priceRangeFacet]);

    const brandOptions: FilterOption[] = brandFacet && brandFacet.values.length > 0
        ? toOptions(brandFacet.values)
        : fallbackFacets.brands.map(value => ({ value }));

    // Handle Checkbox Changes
    const handleCheckboxChange = (key: 'brand' | 'seller', value: string) => {
        const current = filters[key];
        const updated = current.includes(value)
            ? current.filter(item => item !== value)
            : [...current, value];

        onFilterChange({
            ...filters,
            [key]: updated
        });
    };

    const handleCategoryChange = (depth: number, value: string) => {
        const current = filters.categoryByDepth[depth] || [];
        const updated = current.includes(value)
            ? current.filter(item => item !== value)
            : [...current, value];

        onFilterChange({
            ...filters,
            categoryByDepth: { ...filters.categoryByDepth, [depth]: updated },
        });
    };

    const handlePriceRangeClick = (from: number, to: number) => {
        const isSelected = filters.priceRange[0] === from && filters.priceRange[1] === to;
        onFilterChange({
            ...filters,
            priceRange: isSelected ? [0, 0] : [from, to]
        });
    };

    if (products.length === 0) return null;

    const hasActiveFilters = filters.brand.length > 0 || filters.seller.length > 0 ||
        Object.values(filters.categoryByDepth).some(values => values.length > 0) ||
        filters.priceRange[0] !== 0 || filters.priceRange[1] !== 0;

    return (
        <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            {/* Filter Header - Mobile Only */}
            <div className="lg:hidden mb-4 border-b pb-2">
                <span className="font-bold text-gray-900">Filters</span>
            </div>

            {/* Category depths - one section per level beyond what the category URL already fixes.
                First shown depth is labeled "Category", every deeper one "Subcategory". */}
            {categoryDepthOptions.map(({ depth, options }, index) => (
                <div key={depth}>
                    <h3 className="font-semibold text-gray-900 mb-3">{index === 0 ? 'Category' : 'Subcategory'}</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {options.map(opt => (
                            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={(filters.categoryByDepth[depth] || []).includes(opt.value)}
                                    onChange={() => handleCategoryChange(depth, opt.value)}
                                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 transition-colors"
                                />
                                <span className="text-sm text-gray-600 group-hover:text-red-500 transition-colors">
                                    {opt.value}{opt.quantity !== undefined && ` (${opt.quantity})`}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}

            {/* Brands */}
            {brandOptions.length > 0 && (
                <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Brand</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {brandOptions.map(brand => (
                            <label key={brand.value} className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filters.brand.includes(brand.value)}
                                    onChange={() => handleCheckboxChange('brand', brand.value)}
                                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 transition-colors"
                                />
                                <span className="text-sm text-gray-600 group-hover:text-red-500 transition-colors">
                                    {brand.value}{brand.quantity !== undefined && ` (${brand.quantity})`}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Sellers */}
            {sellers.length > 0 && (
                <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Seller</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {sellers.map(seller => (
                            <label key={seller} className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filters.seller.includes(seller)}
                                    onChange={() => handleCheckboxChange('seller', seller)}
                                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 transition-colors"
                                />
                                <span className="text-sm text-gray-600 group-hover:text-red-500 transition-colors">
                                    {seller}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Price Range */}
            <div className="pt-4 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">Price Range</h3>
                {priceBuckets.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {priceBuckets.map((bucket, index) => {
                            const from = bucket.range?.from ?? 0;
                            const to = bucket.range?.to ?? 0;
                            const isSelected = filters.priceRange[0] === from && filters.priceRange[1] === to;

                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handlePriceRangeClick(from, to)}
                                    className={`w-full flex items-center justify-between gap-2 text-sm px-2 py-1.5 rounded transition-colors cursor-pointer ${isSelected
                                        ? 'bg-red-50 text-red-600 font-medium'
                                        : 'text-gray-600 hover:text-red-500'
                                        }`}
                                >
                                    <span>{formatPrice(from)} - {formatPrice(to)}</span>
                                    <span className="text-xs text-gray-400">({bucket.quantity})</span>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-600 font-medium">
                            {formatPrice(fallbackFacets.minPrice)} - {formatPrice(fallbackFacets.maxPrice)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Sort by price to order results
                        </p>
                    </>
                )}
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
                <button
                    onClick={() => onFilterChange({ brand: [], categoryByDepth: {}, seller: [], priceRange: [0, 0] })}
                    className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline pt-2"
                >
                    Clear all filters
                </button>
            )}
        </div>
    );
}
