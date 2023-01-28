import React from "react"
import { Link, createSearchParams, useNavigate } from "react-router-dom"
import Button from "src/components/Button"
import path from "src/constant/path"
import { Category } from "src/types/product.type"
import { QueryConfig } from "../ProductList"
import classNames from "classnames"
import { useForm, Controller } from "react-hook-form"
import { SchemaType, schema } from "src/utils/rulesForm"
import { yupResolver } from "@hookform/resolvers/yup"
import InputNumber from "src/components/InputNumber"
import { NoUndefinedField } from "src/types/utils.type"
import RatingStars from "../RatingStar"
import { omit } from "lodash"

interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}

type FormData = NoUndefinedField<Pick<SchemaType, "price_min" | "price_max">>

const priceSchema = schema.pick(["price_min", "price_max"])

export default function AsideFilter({ categories, queryConfig }: Props) {
  const navigate = useNavigate()
  const { category } = queryConfig
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      price_min: "",
      price_max: ""
    },
    resolver: yupResolver(priceSchema)
  })
  const onSubmit = handleSubmit((data) => {
    // gui gia tri
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_min: data.price_min,
        price_max: data.price_max,
      }).toString()
    })
    console.log(data)
  })
  // const valueForm = watch()

  const renderCategory = () => {
    return categories.map((item: Category, index: number) => {
      return (
        <li className="py-2 pl-2" key={index}>
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                category: item._id,
                page: "1"
              }).toString()
            }}
            className={classNames("relative px-2 font-semibold text-black", {
              "text-orange": item._id === category,
              "hover:text-orange": item._id !== category
            })}
          >
            {item._id === category && (
              <svg
                viewBox="0 0 4 7"
                className={classNames("absolute top-1/2 left-[-10px] h-2 w-2 -translate-y-1/2", {
                  "fill-orange": item._id === category,
                  "fill-current": item._id !== category
                })}
              >
                <polygon points="4 3.5 0 0 0 7" />
              </svg>
            )}

            {item.name}
          </Link>
        </li>
      )
    })
  }

  const removeFilter = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(queryConfig, ["price_min", "price_max", "rating_filter", "category"])
      ).toString()
    })
  }

  return (
    <div className="py-4">
      <Link to={path.home} className="flex items-center font-bold">
        <svg viewBox="0 0 12 10" className="mr-3 h-4 w-3 fill-current">
          <g fillRule="evenodd" stroke="none" strokeWidth={1}>
            <g transform="translate(-373 -208)">
              <g transform="translate(155 191)">
                <g transform="translate(218 17)">
                  <path d="m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z" />
                  <path d="m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z" />
                  <path d="m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z" />
                </g>
              </g>
            </g>
          </g>
        </svg>
        Tất cả danh mục
      </Link>
      <div className="my-4 h-[1px] bg-gray-300" />
      <ul>{renderCategory()}</ul>
      <Link to={path.home} className="mt-4 flex items-center font-bold uppercase">
        <svg
          enableBackground="new 0 0 15 15"
          viewBox="0 0 15 15"
          x={0}
          y={0}
          className="mr-3 h-4 w-3 fill-current stroke-current"
        >
          <g>
            <polyline
              fill="none"
              points="5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        Bộ lọc tìm kiếm
      </Link>
      <div className="my-4 h-[1px] bg-gray-300" />
      <div className="my-5">
        <div>Khoảng giá</div>
        <form onSubmit={onSubmit} className="mt-2">
          <div className="flex items-start">
            <Controller
              control={control}
              render={({ field: { onChange, value, ref } }) => (
                <InputNumber
                  type="text"
                  className="grow"
                  placeholder="đ Từ"
                  classNameInput="p-1 text-sm w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm"
                  classNameError="hidden"
                  onChange={(event) => {
                    onChange(event)
                    trigger("price_max")
                  }} // send value to hook form
                  value={value}
                  ref={ref}
                />
              )}
              name="price_min"
            />
            <div className="mx-2 mt-2 shrink-0">-</div>
            <Controller
              control={control}
              render={({ field: { onChange, value, ref } }) => (
                <InputNumber
                  type="text"
                  className="grow"
                  placeholder="đ Đến"
                  classNameInput="p-1 text-sm w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm"
                  classNameError="hidden"
                  onChange={(event) => {
                    onChange(event)
                    trigger("price_min")
                  }} // send value to hook form
                  value={value}
                  ref={ref}
                />
              )}
              name="price_max"
            />
          </div>
          <div className="mt-1 text-red-600 min-h-[1.25rem] text-sm">{errors?.price_min?.message}</div>
          <Button className="flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-opacity-80">
            Áp dụng
          </Button>
        </form>
      </div>
      <div className="my-4 h-[1px] bg-gray-300" />
      <div className="my-3">
        <ul>
          <li className="py-1 pl-2">
            <Link to={path.home} className="flex items-center text-sm"></Link>
          </li>
        </ul>
      </div>
      <div className='text-sm'>Đánh giá</div>
      <RatingStars queryConfig={queryConfig} />
      <div className='my-4 h-[1px] bg-gray-300' />
      <Button onClick={() => { removeFilter() }} className="flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-opacity-80">
        Xoá tất cả
      </Button>
    </div>
  )
}
