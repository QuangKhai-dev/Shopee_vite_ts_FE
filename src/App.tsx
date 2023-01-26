import { ToastContainer } from "react-toastify"
import "./App.css"
import useRouteElement from "./hooks/useRouteElement"
import "react-toastify/dist/ReactToastify.css"

function App() {
  const routeElement = useRouteElement()
  return (
    <div>
      {routeElement}
      <ToastContainer />
    </div>
  )
}

export default App
