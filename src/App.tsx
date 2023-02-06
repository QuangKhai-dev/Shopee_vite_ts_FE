import { ToastContainer } from "react-toastify"
import "./App.css"
import useRouteElement from "./hooks/useRouteElement"
import "react-toastify/dist/ReactToastify.css"
import { useContext, useEffect } from "react"
import { LocalStorageEventTartget } from "./utils/auth"
import { AppContext } from "./context/app.context"

function App() {
  const routeElement = useRouteElement()
  const { reset } = useContext(AppContext)
  useEffect(() => {
    LocalStorageEventTartget.addEventListener("clearLS", () => {
      reset()
    })
  }, [])


  return (
    <div>
      {routeElement}
      <ToastContainer />
    </div>
  )
}

export default App
