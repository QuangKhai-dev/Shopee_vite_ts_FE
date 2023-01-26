import axios, { AxiosError, AxiosInstance, AxiosResponse, HttpStatusCode } from "axios"
import { toast } from "react-toastify"
import { clearInfoUserFromLS, getAccessTokenFromLS, saveAccessTokenToLS, setProfile } from "./auth"
import { AuthResponse } from "src/types/auth.type"
import path from "src/constant/path"
class Http {
  instance: AxiosInstance
  private access_token: string
  constructor() {
    this.access_token = getAccessTokenFromLS()
    this.instance = axios.create({
      baseURL: "https://api-ecom.duthanhduoc.com/",
      timeout: 30000,
      headers: {
        "Content-Type": "application/json"
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.access_token) {
          config.headers.authorization = this.access_token
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    // Add a response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        const { url } = response.config
        console.log(url)
        if (url === path.login || url === path.register) {
          this.access_token = (response.data as Required<AuthResponse>).data.access_token
          saveAccessTokenToLS(this.access_token)
          setProfile((response.data as Required<AuthResponse>).data.user)
        } else if (url === path.logout) {
          // clearAccessTokenFromLS()
          this.access_token = ""
          clearInfoUserFromLS()
        }
        return response
      },
      function (error: AxiosError) {
        if (error?.response?.status !== HttpStatusCode.UnprocessableEntity) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const errorResponse: any = error?.response?.data
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mess: any = errorResponse.message || error.message
          console.log(mess)
          toast.error(mess)
        }
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
