"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function AllExercises() {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch exercises from the backend
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/allExercises", {
          method: "GET",
          credentials: "include", // Include cookies for authentication
        })

        if (!response.ok) {
          throw new Error("Failed to fetch exercises")
        }

        const data = await response.json()
        setExercises(data)
      } catch (error) {
        console.error("Error fetching exercises:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchExercises()
  }, [])

  if (loading) {
    return <div className="text-center text-gray-400">Loading exercises...</div>
  }

  if (error) {
    return <div className="text-center text-red-400">Error: {error}</div>
  }

  if (exercises.length === 0) {
    return <div className="text-center text-gray-400">No exercises found.</div>
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-cyan-400 mb-8">Your Exercise History</h1>
      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <motion.div
            key={index}
            className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="text-xl font-bold text-cyan-400 mb-2">{exercise.type}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400">Count</p>
                <p className="text-lg font-semibold text-gray-100">{exercise.count}</p>
              </div>
              <div>
                <p className="text-gray-400">Duration</p>
                <p className="text-lg font-semibold text-gray-100">{exercise.duration} seconds</p>
              </div>
              <div>
                <p className="text-gray-400">Intensity</p>
                <p className="text-lg font-semibold text-gray-100">{exercise.intensityLevel}</p>
              </div>
              <div>
                <p className="text-gray-400">Calories Burned</p>
                <p className="text-lg font-semibold text-gray-100">{exercise.caloriesBurned}</p>
              </div>
            </div>
            {exercise.notes && (
              <div className="mt-4">
                <p className="text-gray-400">Notes</p>
                <p className="text-lg text-gray-200">{exercise.notes}</p>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-4">
              Date: {new Date(exercise.timestamp).toLocaleDateString()}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}