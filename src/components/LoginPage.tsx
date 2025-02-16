import type React from "react"
import { motion } from "framer-motion"
import { useState } from "react"
import { z } from "zod"
import axios from "axios"
import img3 from "../assets/main-app-preview.png"

// Define Zod schema for login form validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validate form data
      loginSchema.parse(formData)
      setErrors({})

      // Handle login using Axios
      const response = await axios.post("/api/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Login successful:", response.data)
      // Redirect or handle successful login (e.g., store token, update state)
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const validationErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path) {
            validationErrors[err.path[0]] = err.message
          }
        })
        setErrors(validationErrors)
      } else if (axios.isAxiosError(error)) {
        // Handle Axios errors
        console.error("Axios error:", error.response?.data || error.message)
        setErrors({ server: error.response?.data?.message || "Login failed. Please try again." })
      } else {
        console.error("Error during login:", error)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
<div className="min-h-screen bg-black !important flex items-center justify-center p-4">
  <div className="grid md:grid-cols-2 gap-2 w-full max-w-6xl bg-black rounded-2xl shadow-2xl overflow-hidden">
    {/* Form Section */}
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8"
    >
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-gray-400">Log in to continue your fitness journey with Fit AI Trainer</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            required
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </motion.div>

        {/* Password Input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            required
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </motion.div>

        {/* Server Error */}
        {errors.server && <p className="text-red-500 text-sm">{errors.server}</p>}

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-all"
        >
          Log In
        </motion.button>
      </form>
    </motion.div>

    {/* Image Section */}
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="relative hidden md:block"
    >
      <img src={img3} alt="" className="object-cover h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-pink-600/20" />
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white bg-gradient-to-t from-black/60 to-transparent">
        <h2 className="text-2xl font-bold mb-2">Transform Your Life</h2>
        <p className="text-sm opacity-90">
          Join thousands of others who have already started their fitness journey with Fit AI Trainer
        </p>
      </div>
    </motion.div>
  </div>
</div>
  )
}