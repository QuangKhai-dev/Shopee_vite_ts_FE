import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from "@tanstack/react-query"
import React, { useContext } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { loginAccount } from "src/api/auth.api"
import Button from "src/components/Button"
import Input from "src/components/Input"
import path from "src/constant/path"
import { AppContext } from "src/context/app.context"
import { ResponseApi } from "src/types/utils.type"
import { LoginSchemaType, loginScheMa } from "src/utils/rulesForm"
import { isAxiosUnprocessableEntityError } from "src/utils/utils"

// type Props = {}

type LoginFormData = LoginSchemaType

function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()

  //gắn react-hook-form
  //formState là object bóc tách
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginScheMa)
  })

  const loginAccountMutation = useMutation({
    mutationFn: (body: LoginFormData) => {
      return loginAccount(body)
    }
  })

  const onSubmit = handleSubmit((data) => {
    loginAccountMutation.mutate(data, {
      onSuccess: (data) => {
        // console.log(data)
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate("/")
      },
      onError: (error) => {
        console.log(error)
        if (isAxiosUnprocessableEntityError<ResponseApi<LoginFormData>>(error)) {
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
  })

  return (
    <div className="bg-orange">
      <div>
        <title>Đăng nhập | Shopee Clone</title>
        <meta name="description" content="Đăng nhập vào dự án Shopee Clone" />
      </div>
      <div className="container">
        <div className="grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10">
          <div className="lg:col-span-2 lg:col-start-4">
            <form className="rounded bg-white p-10 shadow-sm" onSubmit={onSubmit} noValidate>
              <div className="text-2xl">Đăng nhập</div>
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
              <div className="mt-3">
                <Button
                  type="submit"
                  className="flex  w-full items-center justify-center bg-red-500 py-4 px-2 text-sm uppercase text-white hover:bg-red-600"
                  isLoading={loginAccountMutation.isLoading}
                  disabled={loginAccountMutation.isLoading}
                >
                  Đăng nhập
                </Button>
              </div>
              <div className="mt-8 flex items-center justify-center">
                <span className="text-gray-400">Bạn chưa có tài khoản?</span>
                <Link className="ml-1 text-red-400" to={path.register}>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
