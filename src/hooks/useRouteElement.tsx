import React, { useContext } from "react"
import { Navigate, Outlet, useRoutes } from "react-router-dom"
import path from "src/constant/path"
import { AppContext } from "src/context/app.context"
import MainLayout from "src/layouts/MainLayout"
import RegisterLayOut from "src/layouts/RegisterLayout"
import Login from "src/pages/Login"
import ProductList from "src/pages/ProductList"
import Profile from "src/pages/Profile"
import Register from "src/pages/Register"

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)

  // nếu đã login cho đi tiếp, không thì đi vô login
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
}

function RejectRoute() {
  // nếu đã login thì đi vô profile, chưa login thì đi tiếp
  const { isAuthenticated } = useContext(AppContext)

  return isAuthenticated ? <Navigate to={path.home} /> : <Outlet />
}

export default function useRouteElement() {
  const element = useRoutes([
    {
      path: "/",
      index: true,
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      )
    },
    {
      path: "",
      element: <ProtectedRoute />,
      children: [
        {
          path: path.profile,
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          )
        }
      ]
    },
    {
      path: "",
      element: <RejectRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayOut>
              <Login />
            </RegisterLayOut>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayOut>
              <Register />
            </RegisterLayOut>
          )
        }
      ]
    }
  ])
  return element
}
