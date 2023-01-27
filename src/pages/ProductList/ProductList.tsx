import React, { useState } from "react"
import AsideFilter from "./AsideFilter"
import { omitBy, isUndefined } from "lodash"
import SortProductList from "./SortProductList"
import { useQuery } from "@tanstack/react-query"
import useQueryParams from "src/hooks/useQueryParams"
import productApi from "src/api/product.api"
import { ProductApi, ProductListConfigApi } from "src/types/product.type"
import Product from "./Product/Product"
import Pagination from "src/components/Paginate"

export type QueryConfig = {
  [key in keyof ProductListConfigApi]: string
}

const ProductList = () => {
  // const [productList, setProductList] = useState<ProductApi[]>(initialProductList)
  const [page, setPage] = useState(3)
  const queryPamrams: QueryConfig = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryPamrams.page || "1",
      limit: queryPamrams.limit,
      sort_by: queryPamrams.sort_by,
      order: queryPamrams.order,
      category: queryPamrams.category,
      exclude: queryPamrams.exclude,
      name: queryPamrams.name,
      price_max: queryPamrams.price_max,
      price_min: queryPamrams.price_min,
      rating_filter: queryPamrams.rating_filter
    },
    isUndefined
  )
  // console.log(queryPamrams)
  const { data } = useQuery({
    queryKey: ["products", queryConfig],
    queryFn: () => {
      return productApi.getProduct(queryConfig)
    },
    //Giữ cho data k set về undifined khi query mới
    keepPreviousData: true
    // onSuccess: (result: ResponseApi<ProductResponse>) => {
    //   console.log(result?.data)
    //   setProductList(result?.data?.data?.products || initialProductList)
    // }
  })
  // console.log(productList)

  return (
    <div className="bg-gray-200 py-6">
      <div className="container">
        {data && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <AsideFilter />
            </div>
            <div className="col-span-9">
              <SortProductList />
              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {data?.data.data.products.map((item: ProductApi, index: number) => {
                  return (
                    <div className="col-span-1" key={index}>
                      <Product product={item} />
                    </div>
                  )
                })}
              </div>
              <Pagination queryConfig={queryConfig} setPage={setPage} pageSize={data.data.data.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductList
