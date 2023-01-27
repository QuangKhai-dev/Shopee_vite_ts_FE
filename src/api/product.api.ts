import { ResponseApi } from "src/types/utils.type"
import { Product, ProductList, ProductListConfig } from "./../types/product.type"
import http from "src/utils/http"

const URL = "/products"
const productApi = {
  getProduct(params: ProductListConfig) {
    return http.get<ResponseApi<ProductList>>(URL, { params })
  },
  getProductDetail(id: string) {
    return http.get<Product>(`${URL}/${id}`)
  }
}

export default productApi
