import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute = () => {
  const token = localStorage.getItem("token")

  // If no token exists, redirect to login page
  if (!token) {
    return <Navigate to="/auth" />
  }

  // If token exists, render the protected route
  return <Outlet />
}

export default ProtectedRoute