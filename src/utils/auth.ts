import { User } from "src/types/user.type"

export const saveAccessTokenToLS = (access_token: string) => {
  localStorage.setItem("access_token", access_token)
}

export const clearInfoUserFromLS = () => {
  localStorage.removeItem("access_token")
  localStorage.removeItem("profile")
}

export const getAccessTokenFromLS = () => {
  return localStorage.getItem("access_token") || ""
}

export const getProfile = () => {
  return JSON.parse(localStorage.getItem("profile") || "{}")
}

export const setProfile = (profile: User | null) => {
  localStorage.setItem("profile", JSON.stringify(profile))
}
