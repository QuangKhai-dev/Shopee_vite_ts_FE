import { Purchase, PurchaseListStatus } from "src/types/purchase.type"
import { ResponseApi } from "src/types/utils.type"
import http from "src/utils/http"

const URL = "purchases"

const purchaseApi = {
  addToCart(body: { product_id: string; buy_count: number }) {
    return http.post<ResponseApi<Purchase>>(`${URL}/add-to-cart`, body)
  },
  getPurchases(params: { status: PurchaseListStatus }) {
    return http.get<ResponseApi<Purchase[]>>(`${URL}`, {
      params
    })
  },
  buyProducts(body: { product_id: string; buy_count: number }[]) {
    return http.post<ResponseApi<Purchase[]>>(`${URL}/buy-products`, body)
  },
  updatePurchase(body: { product_id: string; buy_count: number }) {
    return http.put<ResponseApi<Purchase>>(`${URL}/update-purchase`, body)
  },
  deletePurchase(purchaseIds: string[]) {
    return http.delete<ResponseApi<{ deleted_count: number }>>(`${URL}`, {
      data: purchaseIds
    })
  }
}

export default purchaseApi
