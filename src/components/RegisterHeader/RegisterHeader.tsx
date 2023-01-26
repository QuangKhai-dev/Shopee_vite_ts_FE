import React from "react"
import { Link, useMatch } from "react-router-dom"
import Logo from "../Logo/Logo"
import path from "src/constant/path"

const RegisterHeader = () => {
  const registerMatch = useMatch(path.register)
  const isRegister = Boolean(registerMatch)
  return (
    <div className="py-5">
      <div className="mx-auto max-w-7xl px-4">
        <nav className="flex items-end">
          <Link to={path.home}>
            <Logo />
          </Link>
          <div className="ml-5 text-xl lg:text-2xl">{isRegister ? "Đăng ký" : "Đăng nhập"}</div>
        </nav>
      </div>
    </div>
  )
}

export default RegisterHeader
