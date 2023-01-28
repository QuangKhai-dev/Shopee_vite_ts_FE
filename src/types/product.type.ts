import { ResponseApi } from "./utils.type"

export interface ProductApi {
  _id: string
  images: string[]
  price: number
  rating: number
  price_before_discount: number
  quantity: number
  sold: number
  view: number
  name: string
  description: string
  category: {
    _id: string
    name: string
  }
  image: string
  createdAt: string
  updatedAt: string
}

export interface ProductListApi {
  products: ProductApi[]
  pagination: {
    page: number
    limit: number
    page_size: number
  }
}

export interface ProductListConfigApi {
  page?: number | string
  limit?: number | string
  sort_by?: "createdAt" | "view" | "sold" | "price"
  order?: "asc" | "desc"
  exclude?: string
  rating_filter?: number | string
  price_max?: number | string
  price_min?: number | string
  name?: string
  category?: string
}

export interface Category {
  _id: string
  name: string
}

export type ProductResponse = ResponseApi<{
  pagination: {
    page: number
    limit: number
    page_size: number
  }
  products: ProductApi[]
}>
