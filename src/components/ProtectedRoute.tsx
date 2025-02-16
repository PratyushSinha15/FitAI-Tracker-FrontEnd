import { Cookie } from "lucide-react"
import { Navigate, Outlet } from "react-router-dom"
import Cookies from "js-cookie"

const ProtectedRoute = () => {
  const token = Cookies.get("authToken")

  // If no token exists, redirect to login page
  if (!token) {
    return <Navigate to="/auth" />
  }

  // If token exists, render the protected route
  return <Outlet />
}

export default ProtectedRoute