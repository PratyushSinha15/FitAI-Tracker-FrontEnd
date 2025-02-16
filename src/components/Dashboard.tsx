import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token") // Clear the token
    navigate("/auth") // Redirect to login page
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-600">Welcome to your dashboard!</p>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
      >
        Log Out
      </button>
    </div>
  )
}