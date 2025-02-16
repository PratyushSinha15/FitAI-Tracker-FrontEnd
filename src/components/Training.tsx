"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Home, Dumbbell, Book, User, LogOut, Menu, X } from "lucide-react"
import TrainingContent from "./TrainingContent"

export default function Training() {
  const navigate = useNavigate()
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/auth")
  }

  const sidebarItems = [
    { icon: Home, text: "Dashboard", path: "/dashboard" },
    { icon: Dumbbell, text: "Training", path: "/training" },
    { icon: Book, text: "Learning", path: "/learning" },
    { icon: User, text: "Profile", path: "/profile" },
  ]

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-6 bg-black border-r bg-black">
      <h2 className="text-2xl font-bold text-gray-200 mb-6">Dashboard</h2>

      <nav className="flex-1">
        <ul className="space-y-2">
          {sidebarItems.map((item, index) => (
            <motion.li key={item.text}>
              <button
                onClick={() => {
                  navigate(item.path)
                  setCurrentPath(item.path)
                  if (isMobile) setSidebarOpen(false)
                }}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-lg transition-all 
                  ${
                    currentPath === item.path
                      ? "text-cyan-400 bg-black shadow-md"
                      : "text-gray-400 hover:bg-gray-800 hover:text-cyan-300"
                  }`}
              >
                <item.icon className="w-6 h-6 mr-3" />
                <span className="font-semibold">{item.text}</span>
              </button>
            </motion.li>
          ))}
        </ul>
      </nav>

      <motion.button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-white text-lg font-medium bg-red-700 rounded-lg hover:bg-red-600 transition-all"
      >
        <LogOut className="w-5 h-5" />
        Log Out
      </motion.button>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-black from-gray-50 to-gray-200">
      <button onClick={toggleSidebar} className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-full shadow-md">
        {sidebarOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
      </button>

      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-lg shadow-xl border-r border-gray-200 z-40"
      >
        <SidebarContent />
      </motion.div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 transition-all duration-300 lg:ml-64">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 md:p-10 max-w-7xl mx-auto"
        >
          <TrainingContent />
        </motion.div>
      </div>
    </div>
  )
}
