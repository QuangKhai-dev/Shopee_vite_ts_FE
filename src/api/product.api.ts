import { Category, ProductApi, ProductListApi, ProductListConfigApi } from "src/types/product.type"
import { ResponseApi } from "src/types/utils.type"
import http from "src/utils/http"

const URL = "/products"
const productApi = {
  getProduct(params: ProductListConfigApi) {
    return http.get<ResponseApi<ProductListApi>>(URL, { params })
  },
  getProductDetail(id: string) {
    return http.get<ResponseApi<ProductApi>>(`${URL}/${id}`)
  },
  getAllCategory() {
    return http.get<ResponseApi<Category[]>>("/categories")
  }
}

export default productApi
