import React from "react"
import { Link } from "react-router-dom"
import path from "src/constant/path"
import productImg from "./../../../assets/img/productDemo.png"
export default function Product() {
  return (
    <Link to={`${path.home}}`}>
      <div className="overflow-hidden rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.04rem] hover:shadow-md">
        <div className="relative w-full pt-[100%]">
          <img
            // src={product.image}
            src={productImg}
            alt="product"
            // alt={product.name}
            className="absolute top-0 left-0 h-full w-full bg-white object-cover"
          />
        </div>
        <div className="overflow-hidden p-2">
          <div className="line-clamp-2 min-h-[2rem] text-xs">Apple MacBook Air (2020) M1 Chip</div>
          <div className="mt-3 flex items-center">
            <div className="max-w-[50%] truncate text-gray-500 line-through">
              <span className="text-xs">₫</span>
              <span className="text-sm">28.149.000</span>
            </div>
            <div className="ml-1 truncate text-orange">
              <span className="text-xs">₫</span>
              <span className="text-sm">28.149.000</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-end">
            {/* <ProductRating rating={product.rating} /> */}
            <div className="ml-2 text-sm">
              {/* <span>{formatNumberToSocialStyle(product.sold)}</span> */}
              <span className="ml-1">Đã bán</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
