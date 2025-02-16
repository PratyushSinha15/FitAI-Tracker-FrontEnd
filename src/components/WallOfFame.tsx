"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Medal, ChevronLeft, ChevronRight, X } from "lucide-react"

const WallOfFame = () => {
  const [startIndex, setStartIndex] = useState(0)
  const [showAllUsers, setShowAllUsers] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const [leaderboardData, setLeaderboardData] = useState([]) // State to store leaderboard data
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch leaderboard data from the backend
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch("http://localhost:5000/leaderboard/leaderboarddata", {
          method: "GET",
          credentials: "include", // Include cookies for authentication
        })

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data")
        }

        const data = await response.json()
        setLeaderboardData(data)
      } catch (error) {
        console.error("Error fetching leaderboard data:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboardData()
  }, [])

  // Responsive items per page
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 640 ? 1 : 3)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const nextSlide = () => {
    setStartIndex((prev) => (prev + 1) % (leaderboardData.length - itemsPerPage + 1))
  }

  const prevSlide = () => {
    setStartIndex(
      (prev) =>
        (prev - 1 + (leaderboardData.length - itemsPerPage + 1)) %
          (leaderboardData.length - itemsPerPage + 1)
    )
  }

  if (loading) {
    return <div className="text-center text-gray-400">Loading leaderboard...</div>
  }

  if (error) {
    return <div className="text-center text-red-400">Error: {error}</div>
  }

  if (leaderboardData.length === 0) {
    return <div className="text-center text-gray-400">No leaderboard data found.</div>
  }

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 max-w-lg mx-auto text-center">
      <h2 className="text-xl font-bold mb-4 text-gray-200">Wall of Fame</h2>

      {/* Mobile Navigation */}
      <div className="lg:hidden flex justify-center gap-4 mb-4">
        {leaderboardData.map(
          (_, index) =>
            index % itemsPerPage === 0 && (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  startIndex === index ? "bg-cyan-400" : "bg-gray-600"
                }`}
                onClick={() => setStartIndex(index)}
              />
            )
        )}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={prevSlide}
          className="text-gray-300 hover:text-gray-100 transition-colors p-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex gap-4 overflow-hidden px-2">
          {leaderboardData
            .slice(startIndex, startIndex + itemsPerPage)
            .map((user, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center bg-gray-700 p-4 rounded-lg shadow-lg border border-gray-600 min-w-[200px]"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  // src={`https://via.placeholder.com/50?text=${user.email[0]}`} // Placeholder avatar
                  // alt={user.email}
                  className="w-12 h-12 rounded-full mb-2 border-2 border-cyan-400"
                />
                <p className="font-semibold text-gray-100">
  {[...user.email.replace(/[^a-zA-Z]/g, '')].slice(0, 8).join('')}
</p>

                <p className="text-sm text-gray-400">{user.totalScore} Points</p>
                <Medal className="text-cyan-400 mt-1" />
              </motion.div>
            ))}
        </div>

        <button
          onClick={nextSlide}
          className="text-gray-300 hover:text-gray-100 transition-colors p-2"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <p className="text-gray-400 text-sm mt-3">
        Keep up with your exercise plan to earn new surprises
      </p>

      <button
        onClick={() => setShowAllUsers(true)}
        className="bg-gradient-to-r from-purple-400 to-cyan-400 text-gray-900 px-4 py-2 rounded-lg mt-4 font-semibold hover:opacity-90 transition-opacity"
      >
        View All
      </button>

      {/* All Users Modal */}
      <AnimatePresence>
        {showAllUsers && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAllUsers(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-200">All Champions</h3>
                <button
                  onClick={() => setShowAllUsers(false)}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leaderboardData.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-700 p-4 rounded-lg border border-gray-600"
                  >
                    <span className="text-cyan-400 mr-4 text-xl font-bold">#{index + 1}</span>
                    <img
                      // src={`https://via.placeholder.com/50?text=${user.email[0]}`} // Placeholder avatar
                      // alt={user.email}
                      className="w-10 h-10 rounded-full border-2 border-cyan-400"
                    />
                    <div className="ml-4 flex-1">
                    <p className="font-semibold text-gray-100">
  {[...user.email.replace(/[^a-zA-Z]/g, '')].slice(0, 8).join('')}
</p>

                      <p className="text-sm text-gray-400">{user.totalScore} Points</p>
                    </div>
                    <Medal className="text-cyan-400 ml-2" />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default WallOfFame