"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Home, Dumbbell, Book, User, LogOut, Menu, X } from "lucide-react"

const exercises = [
  {
    name: "Plank",
    path: "/plank",
    videoId: "ASdvN_XEl_c" 
  },
  {
    name: "Pushups",
    path: "/pushups",
    videoId: "IODxDxX7oi4" 
  },
  {
    name: "Shoulder Tap",
    path: "/shoulder-taps",
    videoId: "gKA5LBy7WAI" 
  },
  {
    name: "Squats",
    path: "/squats",
    videoId: "xqvCmoLULNY"
  }
]

export default function Learning() {
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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-6 bg-black">
      <h2 className="text-2xl font-bold text-gray-200 mb-6">Dashboard</h2>

      <nav className="flex-1">
        <ul className="space-y-2">
          {[
            { icon: Home, text: "Dashboard", path: "/dashboard" },
            { icon: Dumbbell, text: "Training", path: "/training" },
            { icon: Book, text: "Learning", path: "/learning" },
            { icon: User, text: "Profile", path: "/profile" },
          ].map((item) => (
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
                      ? "text-cyan-400 bg-gray-700"
                      : "text-gray-400 hover:bg-gray-700 hover:text-cyan-300"
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
        onClick={() => {
          localStorage.removeItem("token")
          navigate("/auth")
        }}
        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-white text-lg font-medium bg-red-600 rounded-lg hover:bg-red-700 transition-all mt-4"
      >
        <LogOut className="w-5 h-5" />
        Log Out
      </motion.button>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-black">
      {/* Mobile Menu Button */}
      <button onClick={toggleSidebar} className="fixed top-4 left-4 z-50 lg:hidden bg-gray-800 p-2 rounded-lg shadow-md">
        {sidebarOpen ? <X className="w-6 h-6 text-gray-200" /> : <Menu className="w-6 h-6 text-gray-200" />}
      </button>

      {/* Desktop Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-gray-800/90 backdrop-blur-lg shadow-xl border-r border-gray-700 z-40"
      >
        <SidebarContent />
      </motion.div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-0 bg-gray-900/80 z-40 lg:hidden"
            onClick={toggleSidebar}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed left-0 top-0 h-full w-64 bg-gray-800 shadow-xl z-50 border-r border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Learning Content */}
      <div className="flex-1 transition-all duration-300 lg:ml-64">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 md:p-10 max-w-7xl mx-auto space-y-8"
        >
          <h1 className="text-4xl font-bold text-cyan-400 mb-8">Exercise Tutorials</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {exercises.map((exercise, index) => (
              <motion.div
                key={exercise.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-100 mb-4">
                    {exercise.name}
                  </h2>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${exercise.videoId}`}
                      title={`${exercise.name} tutorial`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                  <p className="text-gray-400 mt-4">
                    Learn proper form and technique for {exercise.name.toLowerCase()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}