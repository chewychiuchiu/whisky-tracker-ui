export interface Whisky {
  id: number
  name: string
  distillery: string
  region?: string
  country: string
  ageYears?: number
  abv?: number
  type?: string
  sizeMl?: number
  bottledYear?: number
  imageUrl?: string
  createdAt: string
}

export interface Retailer {
  id: number
  name: string
  baseUrl: string
  country?: string
  active: boolean
}

export interface ProductListing {
  id: number
  whiskyId: number
  retailerId: number
  productUrl: string
  sku?: string
  inStock: boolean
  lastChecked?: string
  whisky?: Whisky
  retailer?: Retailer
  snapshots?: PriceSnapshot[]
}

export interface PriceSnapshot {
  id: number
  listingId: number
  price: number
  recordedAt: string
}

export interface PriceAlert {
  id: number
  whiskyId: number
  targetPrice: number
  triggered: boolean
  createdAt: string
}

export interface RetailerPriceHistory {
  retailer: Retailer
  productUrl: string
  inStock: boolean
  latestPrice: number | null
  priceHistory: {
    price: number
    recordedAt: string
  }[]
}

export interface WhiskyPriceData {
  whisky: Whisky
  retailers: RetailerPriceHistory[]
}