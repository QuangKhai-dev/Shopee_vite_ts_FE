import React, { useState } from "react"
import AsideFilter from "./components/AsideFilter"
import { omitBy, isUndefined } from "lodash"
import SortProductList from "./components/SortProductList"
import { useQuery } from "@tanstack/react-query"
import useQueryParams from "src/hooks/useQueryParams"
import productApi from "src/api/product.api"
import { ProductApi, ProductListConfigApi } from "src/types/product.type"
import Product from "./components/Product/Product"
import Pagination from "src/components/Paginate"
import useQueryConfig from "src/hooks/useQueryConfig"

export type QueryConfig = {
  [key in keyof ProductListConfigApi]: string
}

const ProductList = () => {
  // const [productList, setProductList] = useState<ProductApi[]>(initialProductList)
  const queryConfig = useQueryConfig()

  // console.log(queryPamrams)
  const { data: productData } = useQuery({
    queryKey: ["products", queryConfig],
    queryFn: () => {
      return productApi.getProduct(queryConfig as ProductListConfigApi)
    },
    //Giữ cho data k set về undifined khi query mới
    keepPreviousData: true
    // onSuccess: (result: ResponseApi<ProductResponse>) => {
    //   console.log(result?.data)
    //   setProductList(result?.data?.data?.products || initialProductList)
    // }
  })
  // console.log(productList)

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return productApi.getAllCategory()
    },
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })
  console.log(categories?.data.data)
  return (
    <div className="bg-gray-200 py-6">
      <div className="container">
        {productData && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <AsideFilter queryConfig={queryConfig} categories={categories?.data.data || []} />
            </div>
            <div className="col-span-9">
              <SortProductList queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {productData?.data.data.products.map((item: ProductApi, index: number) => {
                  return (
                    <div className="col-span-1" key={index}>
                      <Product product={item} />
                    </div>
                  )
                })}
              </div>
              <Pagination queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductList
