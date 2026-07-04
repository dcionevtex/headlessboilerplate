import config from '@/config.json';
import { VTEXProduct } from '@/types/vtex';

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
    items: Array<{
        itemId: string;
        name: string;
        variations?: string[];
        images: Array<{
            imageUrl: string;
            imageTag: string;
        }>;
        sellers: Array<{
            sellerId: string;
            sellerName: string;
            commertialOffer: {
                Price: number;
                ListPrice: number;
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

// Transform SearchProduct to VTEXProduct format for compatibility with ProductCard
function mapSearchProductToVTEX(searchProduct: SearchProduct): VTEXProduct {
    return {
        ...searchProduct,
        productReference: searchProduct.productId,
        categoryId: '',
        categories: searchProduct.categories || [],
        description: '',
        items: searchProduct.items.map(item => {
            // Extract variation values dynamically
            const variationValues: Record<string, string[]> = {};
            if (item.variations) {
                item.variations.forEach(variation => {
                    if (item[variation]) {
                        variationValues[variation] = item[variation];
                    }
                });
            }

            return {
                ...item,
                nameComplete: item.name,
                complementName: '',
                ean: '',
                referenceId: [{ Key: 'RefId', Value: searchProduct.productId }],
                measurementUnit: 'un',
                unitMultiplier: 1,
                modalType: null,
                isKit: false,
                variations: item.variations,
                variationValues,
                images: item.images.map((img, idx) => ({
                    imageId: `${item.itemId}-${idx}`,
                    imageLabel: 'Main',
                    imageTag: img.imageTag || searchProduct.productName,
                    imageUrl: img.imageUrl,
                    imageText: img.imageTag || searchProduct.productName,
                })),
                sellers: item.sellers.map(seller => ({
                    ...seller,
                    addToCartLink: `/checkout/cart/add?sku=${item.itemId}&qty=1`,
                    sellerDefault: true,
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
                        AvailableQuantity: 100,
                        Tax: 0,
                        CacheVersionUsedToCallCheckout: '',
                    },
                })),
            };
        }),
    };
}

export async function searchProducts(
    query: string,
    page: number = 1,
    count: number = 24
): Promise<{ products: VTEXProduct[]; recordsFiltered: number }> {
    try {
        const params = new URLSearchParams({
            query,
            count: count.toString(),
            page: page.toString(),
        });

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

export async function getFacets(query: string): Promise<FacetsResponse> {
    try {
        const response = await fetch(`${FACETS_API}?query=${encodeURIComponent(query)}`, {
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
