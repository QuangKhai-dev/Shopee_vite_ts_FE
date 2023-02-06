import { User } from "src/types/user.type"
import { ResponseApi } from "src/types/utils.type"
import http from "src/utils/http"

interface BodyUpdate extends Omit<User, "updatedAt" | "_id" | "roles" | "email" | "createdAt"> {
  password?: string
  new_password?: string
}

const userApi = {
  getProfile() {
    return http.get<ResponseApi<User>>("/me")
  },
  updateProfile(body: BodyUpdate) {
    return http.put<ResponseApi<User>>("/user", body)
  },
  uploadAvatar(file: FormData) {
    return http.post<ResponseApi<string>>("/user/upload-avatar", file, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  }
}

export default userApi
