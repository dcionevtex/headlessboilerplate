import { VTEXProduct } from '@/types/vtex';
import config from '@/config.json';

const VTEX_API_BASE = `https://${config.vtex.accountName}.vtexcommercestable.com.br/api/catalog_system/pub/products/search/?fq=productClusterIds%3A`;
const MOCK_PRODUCTS: VTEXProduct[] = [
    {
        productId: '1',
        productName: 'Professional Cordless Drill Set',
        brand: 'PowerPro',
        linkText: 'cordless-drill-set',
        productReference: 'PP-DRILL-001',
        categoryId: '1',
        categories: ['Tools', 'Power Tools'],
        description: 'High-performance cordless drill with 2 batteries and carrying case',
        items: [
            {
                itemId: '1001',
                name: 'Professional Cordless Drill Set',
                nameComplete: 'PowerPro Professional Cordless Drill Set',
                complementName: '20V Max',
                ean: '1234567890123',
                referenceId: [{ Key: 'RefId', Value: 'PP-DRILL-001' }],
                measurementUnit: 'un',
                unitMultiplier: 1,
                modalType: null,
                isKit: true,
                images: [
                    {
                        imageId: '1',
                        imageLabel: 'Main',
                        imageTag: 'drill',
                        imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=800&fit=crop',
                        imageText: 'Cordless Drill',
                    },
                ],
                sellers: [
                    {
                        sellerId: '1',
                        sellerName: 'DIY Tools Co.',
                        addToCartLink: '/checkout/cart/add?sku=1001&qty=1',
                        sellerDefault: true,
                        commertialOffer: {
                            DeliverySlaSamplesPerRegion: {},
                            Installments: [
                                {
                                    Value: 24.99,
                                    InterestRate: 0,
                                    TotalValuePlusInterestRate: 149.94,
                                    NumberOfInstallments: 6,
                                    PaymentSystemName: 'Credit Card',
                                    PaymentSystemGroupName: 'creditCard',
                                    Name: 'Credit Card',
                                },
                            ],
                            DiscountHighLight: [],
                            GiftSkuIds: [],
                            Teasers: [],
                            BuyTogether: [],
                            ItemMetadataAttachment: [],
                            Price: 149.99,
                            ListPrice: 199.99,
                            PriceWithoutDiscount: 199.99,
                            RewardValue: 0,
                            PriceValidUntil: '2026-12-31T23:59:59Z',
                            AvailableQuantity: 50,
                            Tax: 0,
                            CacheVersionUsedToCallCheckout: '',
                        },
                    },
                ],
            },
        ],
    },
    {
        productId: '2',
        productName: 'Heavy Duty Hammer Set',
        brand: 'BuildMaster',
        linkText: 'hammer-set',
        productReference: 'BM-HAM-002',
        categoryId: '1',
        categories: ['Tools', 'Hand Tools'],
        description: '3-piece professional hammer set for all your construction needs',
        items: [
            {
                itemId: '1002',
                name: 'Heavy Duty Hammer Set',
                nameComplete: 'BuildMaster Heavy Duty Hammer Set',
                complementName: '3-Piece',
                ean: '1234567890124',
                referenceId: [{ Key: 'RefId', Value: 'BM-HAM-002' }],
                measurementUnit: 'un',
                unitMultiplier: 1,
                modalType: null,
                isKit: true,
                images: [
                    {
                        imageId: '2',
                        imageLabel: 'Main',
                        imageTag: 'hammer',
                        imageUrl: 'https://images.unsplash.com/photo-1586864387634-700a6f0f8784?w=800&h=800&fit=crop',
                        imageText: 'Hammer Set',
                    },
                ],
                sellers: [
                    {
                        sellerId: '1',
                        sellerName: 'DIY Tools Co.',
                        addToCartLink: '/checkout/cart/add?sku=1002&qty=1',
                        sellerDefault: true,
                        commertialOffer: {
                            DeliverySlaSamplesPerRegion: {},
                            Installments: [
                                {
                                    Value: 12.49,
                                    InterestRate: 0,
                                    TotalValuePlusInterestRate: 49.96,
                                    NumberOfInstallments: 4,
                                    PaymentSystemName: 'Credit Card',
                                    PaymentSystemGroupName: 'creditCard',
                                    Name: 'Credit Card',
                                },
                            ],
                            DiscountHighLight: [],
                            GiftSkuIds: [],
                            Teasers: [],
                            BuyTogether: [],
                            ItemMetadataAttachment: [],
                            Price: 49.99,
                            ListPrice: 49.99,
                            PriceWithoutDiscount: 49.99,
                            RewardValue: 0,
                            PriceValidUntil: '2026-12-31T23:59:59Z',
                            AvailableQuantity: 100,
                            Tax: 0,
                            CacheVersionUsedToCallCheckout: '',
                        },
                    },
                ],
            },
        ],
    },
    {
        productId: '3',
        productName: 'Multi-Purpose Screwdriver Set',
        brand: 'ToolCraft',
        linkText: 'screwdriver-set',
        productReference: 'TC-SCR-003',
        categoryId: '1',
        categories: ['Tools', 'Hand Tools'],
        description: '12-piece precision screwdriver set with magnetic tips',
        items: [
            {
                itemId: '1003',
                name: 'Multi-Purpose Screwdriver Set',
                nameComplete: 'ToolCraft Multi-Purpose Screwdriver Set',
                complementName: '12-Piece',
                ean: '1234567890125',
                referenceId: [{ Key: 'RefId', Value: 'TC-SCR-003' }],
                measurementUnit: 'un',
                unitMultiplier: 1,
                modalType: null,
                isKit: true,
                images: [
                    {
                        imageId: '3',
                        imageLabel: 'Main',
                        imageTag: 'screwdriver',
                        imageUrl: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&h=800&fit=crop',
                        imageText: 'Screwdriver Set',
                    },
                ],
                sellers: [
                    {
                        sellerId: '1',
                        sellerName: 'DIY Tools Co.',
                        addToCartLink: '/checkout/cart/add?sku=1003&qty=1',
                        sellerDefault: true,
                        commertialOffer: {
                            DeliverySlaSamplesPerRegion: {},
                            Installments: [
                                {
                                    Value: 7.99,
                                    InterestRate: 0,
                                    TotalValuePlusInterestRate: 31.96,
                                    NumberOfInstallments: 4,
                                    PaymentSystemName: 'Credit Card',
                                    PaymentSystemGroupName: 'creditCard',
                                    Name: 'Credit Card',
                                },
                            ],
                            DiscountHighLight: [],
                            GiftSkuIds: [],
                            Teasers: [],
                            BuyTogether: [],
                            ItemMetadataAttachment: [],
                            Price: 29.99,
                            ListPrice: 39.99,
                            PriceWithoutDiscount: 39.99,
                            RewardValue: 0,
                            PriceValidUntil: '2026-12-31T23:59:59Z',
                            AvailableQuantity: 75,
                            Tax: 0,
                            CacheVersionUsedToCallCheckout: '',
                        },
                    },
                ],
            },
        ],
    },
    {
        productId: '4',
        productName: 'Professional Tool Box',
        brand: 'StoragePro',
        linkText: 'tool-box',
        productReference: 'SP-BOX-004',
        categoryId: '2',
        categories: ['Storage', 'Tool Boxes'],
        description: 'Heavy-duty steel tool box with 5 drawers and wheels',
        items: [
            {
                itemId: '1004',
                name: 'Professional Tool Box',
                nameComplete: 'StoragePro Professional Tool Box',
                complementName: '5-Drawer',
                ean: '1234567890126',
                referenceId: [{ Key: 'RefId', Value: 'SP-BOX-004' }],
                measurementUnit: 'un',
                unitMultiplier: 1,
                modalType: null,
                isKit: false,
                images: [
                    {
                        imageId: '4',
                        imageLabel: 'Main',
                        imageTag: 'toolbox',
                        imageUrl: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=800&h=800&fit=crop',
                        imageText: 'Tool Box',
                    },
                ],
                sellers: [
                    {
                        sellerId: '1',
                        sellerName: 'DIY Tools Co.',
                        addToCartLink: '/checkout/cart/add?sku=1004&qty=1',
                        sellerDefault: true,
                        commertialOffer: {
                            DeliverySlaSamplesPerRegion: {},
                            Installments: [
                                {
                                    Value: 49.99,
                                    InterestRate: 0,
                                    TotalValuePlusInterestRate: 299.94,
                                    NumberOfInstallments: 6,
                                    PaymentSystemName: 'Credit Card',
                                    PaymentSystemGroupName: 'creditCard',
                                    Name: 'Credit Card',
                                },
                            ],
                            DiscountHighLight: [],
                            GiftSkuIds: [],
                            Teasers: [],
                            BuyTogether: [],
                            ItemMetadataAttachment: [],
                            Price: 299.99,
                            ListPrice: 349.99,
                            PriceWithoutDiscount: 349.99,
                            RewardValue: 0,
                            PriceValidUntil: '2026-12-31T23:59:59Z',
                            AvailableQuantity: 25,
                            Tax: 0,
                            CacheVersionUsedToCallCheckout: '',
                        },
                    },
                ],
            },
        ],
    },
    {
        productId: '5',
        productName: 'Electric Circular Saw',
        brand: 'CutMaster',
        linkText: 'circular-saw',
        productReference: 'CM-SAW-005',
        categoryId: '1',
        categories: ['Tools', 'Power Tools'],
        description: '7.25-inch circular saw with laser guide and dust blower',
        items: [
            {
                itemId: '1005',
                name: 'Electric Circular Saw',
                nameComplete: 'CutMaster Electric Circular Saw',
                complementName: '7.25-inch',
                ean: '1234567890127',
                referenceId: [{ Key: 'RefId', Value: 'CM-SAW-005' }],
                measurementUnit: 'un',
                unitMultiplier: 1,
                modalType: null,
                isKit: false,
                images: [
                    {
                        imageId: '5',
                        imageLabel: 'Main',
                        imageTag: 'saw',
                        imageUrl: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&h=800&fit=crop',
                        imageText: 'Circular Saw',
                    },
                ],
                sellers: [
                    {
                        sellerId: '1',
                        sellerName: 'DIY Tools Co.',
                        addToCartLink: '/checkout/cart/add?sku=1005&qty=1',
                        sellerDefault: true,
                        commertialOffer: {
                            DeliverySlaSamplesPerRegion: {},
                            Installments: [
                                {
                                    Value: 29.99,
                                    InterestRate: 0,
                                    TotalValuePlusInterestRate: 179.94,
                                    NumberOfInstallments: 6,
                                    PaymentSystemName: 'Credit Card',
                                    PaymentSystemGroupName: 'creditCard',
                                    Name: 'Credit Card',
                                },
                            ],
                            DiscountHighLight: [],
                            GiftSkuIds: [],
                            Teasers: [],
                            BuyTogether: [],
                            ItemMetadataAttachment: [],
                            Price: 179.99,
                            ListPrice: 229.99,
                            PriceWithoutDiscount: 229.99,
                            RewardValue: 0,
                            PriceValidUntil: '2026-12-31T23:59:59Z',
                            AvailableQuantity: 40,
                            Tax: 0,
                            CacheVersionUsedToCallCheckout: '',
                        },
                    },
                ],
            },
        ],
    },
    {
        productId: '6',
        productName: 'Adjustable Wrench Set',
        brand: 'GripTech',
        linkText: 'wrench-set',
        productReference: 'GT-WRE-006',
        categoryId: '1',
        categories: ['Tools', 'Hand Tools'],
        description: '4-piece adjustable wrench set with chrome finish',
        items: [
            {
                itemId: '1006',
                name: 'Adjustable Wrench Set',
                nameComplete: 'GripTech Adjustable Wrench Set',
                complementName: '4-Piece',
                ean: '1234567890128',
                referenceId: [{ Key: 'RefId', Value: 'GT-WRE-006' }],
                measurementUnit: 'un',
                unitMultiplier: 1,
                modalType: null,
                isKit: true,
                images: [
                    {
                        imageId: '6',
                        imageLabel: 'Main',
                        imageTag: 'wrench',
                        imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=800&fit=crop',
                        imageText: 'Wrench Set',
                    },
                ],
                sellers: [
                    {
                        sellerId: '1',
                        sellerName: 'DIY Tools Co.',
                        addToCartLink: '/checkout/cart/add?sku=1006&qty=1',
                        sellerDefault: true,
                        commertialOffer: {
                            DeliverySlaSamplesPerRegion: {},
                            Installments: [
                                {
                                    Value: 14.99,
                                    InterestRate: 0,
                                    TotalValuePlusInterestRate: 59.96,
                                    NumberOfInstallments: 4,
                                    PaymentSystemName: 'Credit Card',
                                    PaymentSystemGroupName: 'creditCard',
                                    Name: 'Credit Card',
                                },
                            ],
                            DiscountHighLight: [],
                            GiftSkuIds: [],
                            Teasers: [],
                            BuyTogether: [],
                            ItemMetadataAttachment: [],
                            Price: 59.99,
                            ListPrice: 79.99,
                            PriceWithoutDiscount: 79.99,
                            RewardValue: 0,
                            PriceValidUntil: '2026-12-31T23:59:59Z',
                            AvailableQuantity: 60,
                            Tax: 0,
                            CacheVersionUsedToCallCheckout: '',
                        },
                    },
                ],
            },
        ],
    },
    {
        productId: '7',
        productName: 'Measuring Tape Pro',
        brand: 'MeasurePro',
        linkText: 'measuring-tape',
        productReference: 'MP-TAP-007',
        categoryId: '1',
        categories: ['Tools', 'Measuring Tools'],
        description: '25-foot measuring tape with auto-lock and magnetic tip',
        items: [
            {
                itemId: '1007',
                name: 'Measuring Tape Pro',
                nameComplete: 'MeasurePro Measuring Tape Pro',
                complementName: '25-Foot',
                ean: '1234567890129',
                referenceId: [{ Key: 'RefId', Value: 'MP-TAP-007' }],
                measurementUnit: 'un',
                unitMultiplier: 1,
                modalType: null,
                isKit: false,
                images: [
                    {
                        imageId: '7',
                        imageLabel: 'Main',
                        imageTag: 'tape',
                        imageUrl: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&h=800&fit=crop',
                        imageText: 'Measuring Tape',
                    },
                ],
                sellers: [
                    {
                        sellerId: '1',
                        sellerName: 'DIY Tools Co.',
                        addToCartLink: '/checkout/cart/add?sku=1007&qty=1',
                        sellerDefault: true,
                        commertialOffer: {
                            DeliverySlaSamplesPerRegion: {},
                            Installments: [],
                            DiscountHighLight: [],
                            GiftSkuIds: [],
                            Teasers: [],
                            BuyTogether: [],
                            ItemMetadataAttachment: [],
                            Price: 19.99,
                            ListPrice: 19.99,
                            PriceWithoutDiscount: 19.99,
                            RewardValue: 0,
                            PriceValidUntil: '2026-12-31T23:59:59Z',
                            AvailableQuantity: 150,
                            Tax: 0,
                            CacheVersionUsedToCallCheckout: '',
                        },
                    },
                ],
            },
        ],
    },
    {
        productId: '8',
        productName: 'Safety Glasses Pack',
        brand: 'SafetyFirst',
        linkText: 'safety-glasses',
        productReference: 'SF-GLA-008',
        categoryId: '3',
        categories: ['Safety', 'Eye Protection'],
        description: 'UV protection safety glasses with anti-fog coating - 3 pack',
        items: [
            {
                itemId: '1008',
                name: 'Safety Glasses Pack',
                nameComplete: 'SafetyFirst Safety Glasses Pack',
                complementName: '3-Pack',
                ean: '1234567890130',
                referenceId: [{ Key: 'RefId', Value: 'SF-GLA-008' }],
                measurementUnit: 'un',
                unitMultiplier: 1,
                modalType: null,
                isKit: true,
                images: [
                    {
                        imageId: '8',
                        imageLabel: 'Main',
                        imageTag: 'glasses',
                        imageUrl: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&h=800&fit=crop',
                        imageText: 'Safety Glasses',
                    },
                ],
                sellers: [
                    {
                        sellerId: '1',
                        sellerName: 'DIY Tools Co.',
                        addToCartLink: '/checkout/cart/add?sku=1008&qty=1',
                        sellerDefault: true,
                        commertialOffer: {
                            DeliverySlaSamplesPerRegion: {},
                            Installments: [],
                            DiscountHighLight: [],
                            GiftSkuIds: [],
                            Teasers: [],
                            BuyTogether: [],
                            ItemMetadataAttachment: [],
                            Price: 24.99,
                            ListPrice: 34.99,
                            PriceWithoutDiscount: 34.99,
                            RewardValue: 0,
                            PriceValidUntil: '2026-12-31T23:59:59Z',
                            AvailableQuantity: 200,
                            Tax: 0,
                            CacheVersionUsedToCallCheckout: '',
                        },
                    },
                ],
            },
        ],
    },
];


export async function fetchVTEXCollection(collectionId: string, options?: { from?: number; to?: number }): Promise<VTEXProduct[]> {
    try {
        let url = `${VTEX_API_BASE}${collectionId}&sc=1`;
        if (options) {
            const { from = 0, to = 49 } = options;
            url += `&_from=${from}&_to=${to}`;
        } else {
            // Default to fetch up to 50 items
            url += `&_from=0&_to=49`;
        }

        const response = await fetch(url, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            // Revalidate every 5 minutes
            next: { revalidate: 300 },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch products from collection ${collectionId}: ${response.statusText}`);
        }

        const products: VTEXProduct[] = await response.json();
        console.log(`✅ VTEX API Success: Fetched ${products.length} products from collection ${collectionId}`);
        return products;
    } catch (error) {
        console.warn(`Error fetching VTEX collection ${collectionId}, falling back to mock data:`, error);
        // Fallback to MOCK_PRODUCTS for ANY collection failure to ensure UI renders in dev/demo
        return MOCK_PRODUCTS;
    }
}

export async function fetchVTEXProducts(): Promise<VTEXProduct[]> {
    return fetchVTEXCollection('139');
}
