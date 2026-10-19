import config from '@/config.json';
import { VTEXProduct, SKUSpecification } from '@/types/vtex';

// Use Next.js API route instead of direct VTEX call to avoid CORS
const SEARCH_API = '/api/search';
const TOP_SEARCHES_API = '/api/top-searches';
const FACETS_API = '/api/facets';

export interface SearchProduct {
    productId: string;
    productName: string;
    brand: string;
    linkText: string;
    categories: string[];
    description?: string;
    skuSpecifications?: SKUSpecification[];
    items: Array<{
        itemId: string;
        name: string;
        variations?: RawVariation[];
        images: Array<{
            imageUrl: string;
            imageTag: string;
        }>;
        sellers: Array<{
            sellerId: string;
            sellerName: string;
            sellerDefault: boolean;
            commertialOffer: {
                Price: number;
                ListPrice: number;
                AvailableQuantity: number;
                Installments: Array<{
                    Value: number;
                    NumberOfInstallments: number;
                }>;
            };
        }>;
        [key: string]: any; // Allow dynamic variation properties
    }>;
}

export interface SearchResponse {
    products: SearchProduct[];
    recordsFiltered: number;
}

export interface TopSearch {
    term: string;
    count: number;
}

export interface TopSearchesResponse {
    searches: TopSearch[];
}

export interface FacetValue {
    id?: string;
    quantity: number;
    name: string;
    key: string;
    value?: string;
    selected: boolean;
    href?: string;
    range?: { from: number; to: number };
}

export interface Facet {
    values: FacetValue[];
    type: string;
    name: string;
    hidden: boolean;
    key: string;
    quantity: number;
}

export interface FacetsResponse {
    facets: Facet[];
    sampling: boolean;
    breadcrumb: Array<{ name: string; href: string }>;
    queryArgs: { query: string; selectedFacets: Array<{ key: string; value: string }> };
}

type RawVariation = string | { name: string; values: string[] };

// Intelligent Search returns variations as [{ name, values }]; the legacy Catalog API (used by
// the PDP) returns ["Colour"] with values under item["Colour"]. Normalize both to names + map.
export function normalizeVariations(item: { variations?: RawVariation[] }) {
    const variationNames: string[] = [];
    const variationValues: Record<string, string[]> = {};
    (item.variations || []).forEach(variation => {
        const name = typeof variation === 'string' ? variation : variation.name;
        const values = typeof variation === 'string'
            ? (item as Record<string, unknown>)[variation]
            : variation.values;
        if (!name) return;
        variationNames.push(name);
        if (Array.isArray(values)) variationValues[name] = values;
    });
    return { variationNames, variationValues };
}

// Variant values a search result is pinned to (e.g. "Black" when Intelligent Search splits a
// product per Colour): every SKU specification with a single value, unless the product name
// already says it. Dimension-agnostic - works for whatever specification the split uses.
export function getVariantLabel(product: VTEXProduct): string {
    const name = product.productName.toLowerCase();
    return (product.skuSpecifications || [])
        .filter(spec => spec.values.length === 1 && !name.includes(spec.values[0].name.toLowerCase()))
        .map(spec => spec.values[0].name)
        .join(' · ');
}

// Links a pinned result to its own SKU so the PDP opens on the variant the shopper clicked
export function getProductHref(product: VTEXProduct): string {
    const firstItemId = product.items[0]?.itemId;
    return getVariantLabel(product) && firstItemId
        ? `/product/${product.productId}?skuId=${firstItemId}`
        : `/product/${product.productId}`;
}

// Lower rank sorts first. VTEX's own sellerDefault flag is the authoritative
// signal for which seller is actually sellable; a positive Price is the
// fallback if that flag is ever missing.
function rankSeller(seller: SearchProduct['items'][number]['sellers'][number]): number {
    if (seller.sellerDefault) return 0;
    if (seller.commertialOffer.Price > 0) return 1;
    return 2;
}

// Transform SearchProduct to VTEXProduct format for compatibility with ProductCard and PDP
export function mapSearchProductToVTEX(searchProduct: SearchProduct): VTEXProduct {
    return {
        ...searchProduct,
        productReference: searchProduct.productId,
        categoryId: '',
        categories: searchProduct.categories || [],
        description: searchProduct.description || '',
        items: searchProduct.items.map(item => {
            const { variationNames, variationValues } = normalizeVariations(item);

            return {
                ...item,
                // Product + SKU name (e.g. "Rainboot ... Size 40"); item.name alone may be just "Size 40"
                nameComplete: item.nameComplete || item.name,
                complementName: '',
                ean: '',
                referenceId: [{ Key: 'RefId', Value: searchProduct.productId }],
                measurementUnit: 'un',
                unitMultiplier: 1,
                modalType: null,
                isKit: false,
                variations: variationNames,
                variationValues,
                images: item.images.map((img, idx) => ({
                    imageId: `${item.itemId}-${idx}`,
                    imageLabel: 'Main',
                    imageTag: img.imageTag || searchProduct.productName,
                    imageUrl: img.imageUrl,
                    imageText: img.imageTag || searchProduct.productName,
                })),
                // Marketplace SKUs (e.g. Bosch via bosch656) also list the account's own
                // seller "1" first, out of stock or at Price 0 - rank the sellable one to
                // sellers[0] so any code reading that index directly gets the real offer.
                sellers: [...item.sellers]
                    .sort((a, b) => rankSeller(a) - rankSeller(b))
                    .map(seller => ({
                    ...seller,
                    addToCartLink: `/checkout/cart/add?sku=${item.itemId}&qty=1`,
                    commertialOffer: {
                        ...seller.commertialOffer,
                        DeliverySlaSamplesPerRegion: {},
                        Installments: seller.commertialOffer.Installments.map(inst => ({
                            Value: inst.Value,
                            InterestRate: 0,
                            TotalValuePlusInterestRate: inst.Value * inst.NumberOfInstallments,
                            NumberOfInstallments: inst.NumberOfInstallments,
                            PaymentSystemName: 'Credit Card',
                            PaymentSystemGroupName: 'creditCard',
                            Name: 'Credit Card',
                        })),
                        DiscountHighLight: [],
                        GiftSkuIds: [],
                        Teasers: [],
                        BuyTogether: [],
                        ItemMetadataAttachment: [],
                        PriceWithoutDiscount: seller.commertialOffer.ListPrice,
                        RewardValue: 0,
                        PriceValidUntil: '2026-12-31T23:59:59Z',
                        Tax: 0,
                        CacheVersionUsedToCallCheckout: '',
                    },
                })),
            };
        }),
    };
}

export interface SearchOptions {
    /** Slash-separated category slug path (e.g. "pets/dogs") for category browsing instead of
     * a free-text query - see api/search/route.ts for why this needs its own param. */
    category?: string;
}

/** Turns "pets/dogs" into Intelligent Search's "category-1/pets/category-2/dogs" facet path. */
export function buildCategoryFacetPath(category: string): string {
    return category
        .split('/')
        .filter(Boolean)
        .map((slug, index) => `category-${index + 1}/${encodeURIComponent(slug)}`)
        .join('/');
}

export async function searchProducts(
    query: string,
    page: number = 1,
    count: number = 24,
    options?: SearchOptions
): Promise<{ products: VTEXProduct[]; recordsFiltered: number }> {
    try {
        const params = new URLSearchParams({
            query,
            count: count.toString(),
            page: page.toString(),
        });
        if (options?.category) params.set('category', options.category);

        const response = await fetch(`${SEARCH_API}?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Search API error: ${response.status}`);
        }

        const data: SearchResponse = await response.json();

        // Transform SearchProducts to VTEXProducts
        const vtexProducts = (data.products || []).map(mapSearchProductToVTEX);

        return {
            products: vtexProducts,
            recordsFiltered: data.recordsFiltered || 0,
        };
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
}


// Intelligent Search caps a page at 100 products (101+ returns nothing). The search page sorts,
// filters and paginates in the browser, so it needs the whole result set: fetch page 1, then the
// remaining pages in parallel. Capped so a very large category doesn't pull thousands of products.
const IS_MAX_PAGE_SIZE = 100;
export const SEARCH_MAX_PRODUCTS = 500;

export async function searchAllProducts(
    query: string,
    options?: SearchOptions
): Promise<{ products: VTEXProduct[]; recordsFiltered: number }> {
    const first = await searchProducts(query, 1, IS_MAX_PAGE_SIZE, options);
    const pageCount = Math.ceil(Math.min(first.recordsFiltered, SEARCH_MAX_PRODUCTS) / IS_MAX_PAGE_SIZE);
    const rest = await Promise.all(
        Array.from({ length: Math.max(pageCount - 1, 0) }, (_, i) => searchProducts(query, i + 2, IS_MAX_PAGE_SIZE, options))
    );
    return {
        products: [first, ...rest].flatMap(page => page.products).slice(0, SEARCH_MAX_PRODUCTS),
        recordsFiltered: first.recordsFiltered,
    };
}

export async function getTopSearches(): Promise<TopSearchesResponse> {
    try {
        const response = await fetch(TOP_SEARCHES_API, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Top Searches API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching top searches:', error);
        // Return empty array on error instead of throwing
        return { searches: [] };
    }
}

export async function getFacets(query: string, options?: SearchOptions): Promise<FacetsResponse> {
    try {
        const params = new URLSearchParams({ query });
        if (options?.category) params.set('category', options.category);

        const response = await fetch(`${FACETS_API}?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Facets API error: ${response.status}`);
        }

        const data: FacetsResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching facets:', error);
        // Return empty facets on error instead of throwing
        return { facets: [], sampling: false, breadcrumb: [], queryArgs: { query, selectedFacets: [] } };
    }
}
