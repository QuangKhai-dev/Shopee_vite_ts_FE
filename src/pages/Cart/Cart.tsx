import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import React, { useEffect, useMemo } from "react"
import { Link, useLocation } from "react-router-dom"
import purchaseApi from "src/api/purchase.api"
import Button from "src/components/Button"
import path from "src/constant/path"
import { purchasesStatus } from "src/constant/purchase"
import produce from "immer"
import { Purchase } from "src/types/purchase.type"
import { formatCurrency, generateNameId } from "src/utils/utils"
import QuantityController from "src/components/QuantityController"
import { keyBy } from "lodash"
import { toast } from "react-toastify"
import successPurchase from './../../assets/img/SuccessfulPurchase.png'
import cartEmpty from './../../assets/img/cart-is-empty.png'

interface ExtendedPurchase extends Purchase {
  disabled: boolean
  checked: boolean
}

export default function Cart() {
  const location = useLocation()
  const choosenPurchaseIdFromLocation = (location.state as { purchaseId: string } | null)?.purchaseId
  const queryClient = useQueryClient()
  const [extendedPurchases, setExtendedPurchases] = React.useState<ExtendedPurchase[]>([])
  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ["purchases", { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart })
  })
  // Xử lí update purchase
  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      // console.log(data)
      queryClient.fetchQuery(["purchases", { status: purchasesStatus.inCart }])
    }
  })
  // Xử lí mua hàng
  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      refetch()
      toast.success(data.data.message, {
        position: "top-center",
        autoClose: 1000
      })
    }
  })
  // Xử lí xóa purchase
  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetch()
    }
  })

  const purchasesInCart = purchasesInCartData?.data.data
  // setState extendedPurchases khi call xong api
  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, "_id")
      return (
        purchasesInCart?.map((purchase) => {
          const isChoosenPurchaseFromLocation = choosenPurchaseIdFromLocation === purchase._id
          // const isChoosenPurchaseFromLocation = choosenPurchaseIdFromLocation === purchase._id
          return {
            ...purchase,
            disabled: false,
            checked: isChoosenPurchaseFromLocation || Boolean(extendedPurchasesObject[purchase._id]?.checked)
          }
        }) || []
      )
    })
  }, [purchasesInCart, choosenPurchaseIdFromLocation])

  //Xoá state location khi refesh 
  useEffect(() => {
    return () => {
      window.history.replaceState(null, "")
    }
  }, [])

  // xử lí checked các item trong giỏ hàng
  const handleChecked = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked
      })
    )
  }
  const isAllChecked = useMemo(() => extendedPurchases.every((purchase) => purchase.checked), [extendedPurchases])
  const handleCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft.forEach((purchase) => {
          // lí do dùng đảo ngược vì khi đang false đảo ngược lại render sau đó checked với every thì nó mới là true cho isAllChecked
          purchase.checked = !isAllChecked
        })
      })
    )
  }

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true
        })
      )
      updatePurchaseMutation.mutate({
        product_id: purchase.product._id,
        buy_count: value
      })
    }
  }
  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseDeleteId = extendedPurchases[purchaseIndex]._id
    deletePurchasesMutation.mutate([purchaseDeleteId])
  }

  //Mảng dùng lọc các sản phẩm chọn và tính độ dài để hiển thị số sản phẩm
  const purchaseCheckedArray = useMemo(
    () => extendedPurchases.filter((purchase) => purchase.checked),
    [extendedPurchases]
  )
  const handleMutiDelete = () => () => {
    if (purchaseCheckedArray.length > 0) {
      const ArrayPurchaseDelete = purchaseCheckedArray.map((purchase) => purchase._id)
      deletePurchasesMutation.mutate(ArrayPurchaseDelete)
    }
  }

  // mua hàng
  const handleBuyPurchases = () => {
    if (purchaseCheckedArray.length > 0) {

      const ArrayPurchaseBuy = purchaseCheckedArray.map((purchase) => {
        return {
          product_id: purchase.product._id,
          buy_count: purchase.buy_count
        }
      })
      console.log(ArrayPurchaseBuy)
      buyProductsMutation.mutate(ArrayPurchaseBuy)
    }
  }

  //Tính giá để show 
  const totalCheckedPurchasePrice = useMemo(
    () =>
      purchaseCheckedArray.reduce((result, current) => {
        return result + current.product.price * current.buy_count
      }, 0),
    [purchaseCheckedArray]
  )
  const totalCheckedPurchaseSavingPrice = useMemo(
    () =>
      purchaseCheckedArray.reduce((result, current) => {
        return result + (current.product.price_before_discount - current.product.price) * current.buy_count
      }, 0),
    [purchaseCheckedArray]
  )

  return (
    <div className="bg-neutral-100 py-16">
      <div className="container">
        {extendedPurchases.length > 0 ? (
          <>
            <div className="overflow-auto">
              <div className="min-w-[1000px]">
                <div className="grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow">
                  <div className="col-span-6">
                    <div className="flex items-center">
                      <div className="flex flex-shrink-0 items-center justify-center pr-3">
                        <input
                          type="checkbox"
                          className="h-5 w-5 cursor-pointer accent-orange"
                          checked={isAllChecked}
                          onChange={handleCheckAll}
                        />
                      </div>
                      <div className="flex-grow text-black">Sản phẩm</div>
                    </div>
                  </div>
                  <div className="col-span-6">
                    <div className="grid grid-cols-5 text-center">
                      <div className="col-span-2">Đơn giá</div>
                      <div className="col-span-1">Số lượng</div>
                      <div className="col-span-1">Số tiền</div>
                      <div className="col-span-1">Thao tác</div>
                    </div>
                  </div>
                </div>
                {extendedPurchases.length > 0 && (
                  <div className="my-3 rounded-sm bg-white p-5 shadow">
                    {extendedPurchases.map((purchase, index) => (
                      <div
                        key={purchase._id}
                        className="mb-5 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white py-5 px-4 text-center text-sm text-gray-500 first:mt-0"
                      >
                        <div className="col-span-6">
                          <div className="flex">
                            <div className="flex flex-shrink-0 items-center justify-center pr-3">
                              <input
                                type="checkbox"
                                className="h-5 w-5 cursor-pointer accent-orange"
                                checked={purchase.checked}
                                onChange={handleChecked(index)}
                              />
                            </div>
                            <div className="flex-grow">
                              <div className="flex">
                                <Link
                                  className="h-20 w-20 flex-shrink-0"
                                  to={`${path.home}${generateNameId({
                                    name: purchase.product.name,
                                    id: purchase.product._id
                                  })}`}
                                >
                                  <img alt={purchase.product.name} src={purchase.product.image} />
                                </Link>
                                <div className="flex-grow px-2 pt-1 pb-2">
                                  <Link
                                    to={`${path.home}${generateNameId({
                                      name: purchase.product.name,
                                      id: purchase.product._id
                                    })}`}
                                    className="text-left line-clamp-2"
                                  >
                                    {purchase.product.name}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-6">
                          <div className="grid grid-cols-5 items-center">
                            <div className="col-span-2">
                              <div className="flex items-center justify-center">
                                <span className="text-gray-300 line-through">
                                  ₫{formatCurrency(purchase.product.price_before_discount)}
                                </span>
                                <span className="ml-3">₫{formatCurrency(purchase.product.price)}</span>
                              </div>
                            </div>
                            <div className="col-span-1">
                              <QuantityController
                                max={purchase.product.quantity}
                                value={purchase.buy_count}
                                classNameWrapper="flex items-center"
                                onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                                onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                                onType={handleTypeQuantity(index)}
                                onFocusOut={(value) =>
                                  handleQuantity(
                                    index,
                                    value,
                                    value >= 1 &&
                                    value <= purchase.product.quantity &&
                                    value !== (purchasesInCart as Purchase[])[index].buy_count
                                  )
                                }
                                disabled={purchase.disabled}
                              />
                            </div>
                            <div className="col-span-1">
                              <span className="text-orange">
                                ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                              </span>
                            </div>
                            <div className="col-span-1">
                              <button
                                // onClick={handleDelete(index)}
                                onClick={handleDelete(index)}
                                className="bg-none text-black transition-colors hover:text-orange"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="sticky bottom-0 z-10 mt-8 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center">
              <div className="flex items-center">
                <div className="flex flex-shrink-0 items-center justify-center pr-3">
                  <input
                    type="checkbox"
                    className="h-5 w-5 cursor-pointer accent-orange"
                    checked={isAllChecked}
                    onChange={handleCheckAll}
                  />
                </div>
                <button
                  className="mx-3 border-none bg-none"
                // onClick={handleCheckAll}
                >
                  Chọn tất cả ({extendedPurchases.length})
                </button>
                <button
                  className="mx-3 border-none bg-none"
                  // onClick={handleDeleteManyPurchases}
                  onClick={handleMutiDelete()}
                >
                  Xóa
                </button>
              </div>

              <div className="mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center sm:justify-end">
                    <div>Tổng thanh toán ({purchaseCheckedArray.length} sản phẩm):</div>
                    <div className="ml-2 text-2xl text-orange">₫{formatCurrency(totalCheckedPurchasePrice)}</div>
                  </div>
                  <div className="flex items-center text-sm sm:justify-end">
                    <div className="text-gray-500">Tiết kiệm</div>
                    <div className="ml-6 text-orange">₫{formatCurrency(totalCheckedPurchaseSavingPrice)}</div>
                  </div>
                </div>
                <Button
                  className="mt-5 flex h-10 w-52 items-center justify-center bg-red-500 text-sm uppercase text-white hover:bg-red-600 sm:ml-4 sm:mt-0"
                  // onClick={handleBuyPurchases}
                  onClick={handleBuyPurchases}
                  disabled={buyProductsMutation.isLoading}
                >
                  Mua hàng
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <img src={cartEmpty} alt="no purchase" className="mx-auto h-72 w-72" />
            <div className="mt-5 font-bold text-gray-400">Giỏ hàng của bạn còn trống</div>
            <div className="mt-5 text-center">
              <Link
                to={path.home}
                className=" rounded-sm bg-orange px-10 py-2  uppercase text-white transition-all hover:bg-orange/80"
              >
                Mua ngay
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
