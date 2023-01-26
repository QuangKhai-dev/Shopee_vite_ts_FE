import React, { useContext } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import Input from "src/components/Input"
import { SchemaType, schema } from "src/utils/rulesForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from "@tanstack/react-query"
import { registerAccount } from "src/api/auth.api"
import { isAxiosUnprocessableEntityError } from "src/utils/utils"
import { ResponseApi } from "src/types/utils.type"
import { AppContext } from "src/context/app.context"
import Button from "src/components/Button"
import path from "src/constant/path"

export type FormData = SchemaType

function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()

  //gắn react-hook-form
  //formState là object bóc tách
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(schema) })
  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, "confirm_password">) => {
      return registerAccount(body)
    }
  })
  const onSubmit = handleSubmit((data) => {
    const { confirm_password, ...body } = data
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        // console.log(data)
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate("/")
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ResponseApi<Omit<FormData, "confirm_password">>>(error)) {
          const formError = error.response?.data.data
          //check formError undifined
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as "email" | "password", { message: formError[key as "email" | "password"], type: "Server" })
            })
          }
        }
      }
    })
    console.log(data)
  })

  return (
    <div className="bg-orange">
      <div>
        <title>Đăng ký | Shopee Clone</title>
        <meta name="description" content="Đăng ký tài khoản vào dự án Shopee Clone" />
      </div>
      <div className="container">
        <div className="grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10">
          <div className="lg:col-span-2 lg:col-start-4">
            <form className="rounded bg-white p-10 shadow-sm" onSubmit={onSubmit} noValidate>
              <div className="text-2xl">Đăng ký</div>
              <Input
                autoComplete="on"
                name="email"
                register={register}
                type="email"
                className="mt-8"
                errorMessage={errors.email?.message}
                placeHolder="Email"
              />
              <Input
                autoComplete="on"
                name="password"
                register={register}
                type="password"
                className="mt-3"
                errorMessage={errors.password?.message}
                placeHolder="Password"
              />
              <Input
                autoComplete="on"
                name="confirm_password"
                register={register}
                type="password"
                className="mt-3"
                errorMessage={errors.confirm_password?.message}
                placeHolder="Confirm Password"
              />
              <input type="text" />
              <div className="mt-2">
                <Button
                  className="flex w-full items-center justify-center bg-red-500 py-4 px-2 text-sm uppercase text-white hover:bg-red-600"
                  isLoading={registerAccountMutation.isLoading}
                  disabled={registerAccountMutation.isLoading}
                >
                  Đăng ký
                </Button>
              </div>
              <div className="mt-8 flex items-center justify-center">
                <span className="text-gray-400">Bạn đã có tài khoản?</span>
                <Link className="ml-1 text-red-400" to={path.login}>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
