import React, { useContext } from "react"
import { Navigate, Outlet, useRoutes } from "react-router-dom"
import path from "src/constant/path"
import { AppContext } from "src/context/app.context"
import CartLayout from "src/layouts/CartLayout"
import MainLayout from "src/layouts/MainLayout"
import RegisterLayOut from "src/layouts/RegisterLayout"
import Cart from "src/pages/Cart"
import Login from "src/pages/Login"
import NotFound from "src/pages/NotFound"
import ProductDetail from "src/pages/ProductDetail"
import ProductList from "src/pages/ProductList"
import Register from "src/pages/Register"
import UserLayout from "src/pages/User/layouts/UserLayout"
import ChangePassword from "src/pages/User/pages/ChangePassword"
import HistoryPurchase from "src/pages/User/pages/HistoryPurchase"
import Profile from "src/pages/User/pages/Profile"

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
      path: path.productDetail,
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      )
    },
    {
      path: "",
      element: <ProtectedRoute />,
      children: [
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Cart />
            </CartLayout>
          )
        },
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              element: <Profile />
            },
            {
              path: path.historyPurchase,
              element: <HistoryPurchase />
            },
            {
              path: path.changePassword,
              element: <ChangePassword />
            }
          ]
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
    },
    {
      path: "*",
      element: (
        <MainLayout>
          <NotFound />
        </MainLayout>
      )
    }
  ])
  return element
}
