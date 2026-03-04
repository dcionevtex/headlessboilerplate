export interface VTEXProduct {
  productId: string;
  productName: string;
  brand: string;
  linkText: string;
  productReference: string;
  categoryId: string;
  categories: string[];
  description: string;
  items: VTEXItem[];
}

export interface VTEXItem {
  itemId: string;
  name: string;
  nameComplete: string;
  complementName: string;
  ean: string;
  referenceId: Array<{ Key: string; Value: string }>;
  measurementUnit: string;
  unitMultiplier: number;
  modalType: string | null;
  isKit: boolean;
  images: VTEXImage[];
  sellers: VTEXSeller[];
  variations?: string[];
  variationValues?: Record<string, string[]>;
}

export interface VTEXImage {
  imageId: string;
  imageLabel: string | null;
  imageTag: string;
  imageUrl: string;
  imageText: string;
}

export interface VTEXSeller {
  sellerId: string;
  sellerName: string;
  addToCartLink: string;
  sellerDefault: boolean;
  commertialOffer: VTEXCommercialOffer;
}

export interface VTEXCommercialOffer {
  DeliverySlaSamplesPerRegion: Record<string, unknown>;
  Installments: VTEXInstallment[];
  DiscountHighLight: unknown[];
  GiftSkuIds: unknown[];
  Teasers: unknown[];
  BuyTogether: unknown[];
  ItemMetadataAttachment: unknown[];
  Price: number;
  ListPrice: number;
  PriceWithoutDiscount: number;
  RewardValue: number;
  PriceValidUntil: string;
  AvailableQuantity: number;
  Tax: number;
  CacheVersionUsedToCallCheckout: string;
}

export interface VTEXInstallment {
  Value: number;
  InterestRate: number;
  TotalValuePlusInterestRate: number;
  NumberOfInstallments: number;
  PaymentSystemName: string;
  PaymentSystemGroupName: string;
  Name: string;
}
