"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useState } from "react"
import { z } from "zod"
import axios from "axios"
import img3 from "../assets/main-app-preview.png"
import { useNavigate } from "react-router-dom"
// ye bad me dekhenge
const backendUrl = "http://localhost:5000";

// Define Zod schemas for form validation
const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  age: z.number().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  goal: z.string().min(1, "Fitness goal is required"),
  height: z.number().min(1, "Height is required"),
  weight: z.number().min(1, "Weight is required"),
})

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type SignUpFormData = z.infer<typeof signUpSchema>
type LoginFormData = z.infer<typeof loginSchema>

const goals = ["Weight Loss", "Muscle Gain", "Improve Fitness", "Build Strength", "Increase Flexibility"]

export default function AuthPage() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true) // Toggle between Login and SignUp
  const [loginData, setLoginData] = useState<LoginFormData>({ email: "", password: "" })
  const [signUpData, setSignUpData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    age: 0,
    gender: "",
    goal: "",
    height: 0,
    weight: 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false) // Loading state

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate login form data
      loginSchema.parse(loginData)
      setErrors({})

      // Handle login using Axios
      const response = await axios.post(`${backendUrl}/auth/login`, loginData, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      // Store the token in localStorage
      const { token } = response.data
      localStorage.setItem("token", token)

      console.log("Login successful:", response.data)
      // Redirect to dashboard
      navigate("/dashboard")
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
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate sign-up form data
      signUpSchema.parse(signUpData)
      setErrors({})

      // Handle sign-up using Axios
      const response = await axios.post(`${backendUrl}/auth/register`, signUpData, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("SignUp successful:", response.data)
      // Redirect to dashboard after successful signup
      navigate("/dashboard")
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
        setErrors({ server: error.response?.data?.message || "SignUp failed. Please try again." })
      } else {
        console.error("Error during sign-up:", error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSignUpData((prev) => ({
      ...prev,
      [name]: name === "age" || name === "height" || name === "weight" ? Number(value) : value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center">
      <div className="grid md:grid-cols-2 gap-2 w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8"
        >
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
              {isLogin ? "Welcome Back" : "Start Your Fitness Journey"}
            </h1>
            <p className="text-gray-600">
              {isLogin
                ? "Log in to continue your fitness journey with BodyBuddy"
                : "Join BodyBuddy and get personalized AI-powered workouts"}
            </p>
          </div>

          {/* Toggle Button */}
          <div className="mb-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:underline focus:outline-none"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
          </div>

          {/* Login Form */}
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Email Input */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className="w-full px-2 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  required
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </motion.div>

              {/* Password Input */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full px-2 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
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
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-pink-600 text-white font-semibold py-4 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isLoading ? "Logging in..." : "Log In"}
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              {/* Name Input */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={signUpData.name}
                  onChange={handleSignUpChange}
                  className="w-full px-2 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  required
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </motion.div>

              {/* Email Input */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={signUpData.email}
                  onChange={handleSignUpChange}
                  className="w-full px-2 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  required
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </motion.div>

              {/* Password Input */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="At least 6 characters"
                  value={signUpData.password}
                  onChange={handleSignUpChange}
                  className="w-full px-2 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  required
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </motion.div>

              {/* Age and Gender Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    placeholder="years"
                    value={signUpData.age}
                    onChange={handleSignUpChange}
                    className="w-full px-2 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    required
                  />
                  {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={signUpData.gender}
                    onChange={handleSignUpChange}
                    className="w-full px-2 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    required
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                </div>
              </motion.div>

              {/* Goal Selection */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fitness Goal</label>
                <select
                  name="goal"
                  value={signUpData.goal}
                  onChange={handleSignUpChange}
                  className="w-full px-2 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  required
                >
                  <option value="">Select your goal</option>
                  {goals.map((goal) => (
                    <option key={goal} value={goal.toLowerCase()}>
                      {goal}
                    </option>
                  ))}
                </select>
                {errors.goal && <p className="text-red-500 text-sm">{errors.goal}</p>}
              </motion.div>

              {/* Height and Weight Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    placeholder="cm"
                    value={signUpData.height}
                    onChange={handleSignUpChange}
                    className="w-full px-2 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    required
                  />
                  {errors.height && <p className="text-red-500 text-sm">{errors.height}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    placeholder="kg"
                    value={signUpData.weight}
                    onChange={handleSignUpChange}
                    className="w-full px-2 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    required
                  />
                  {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-pink-600 text-white font-semibold py-4 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative hidden md:block"
        >
          <img src={img3} alt="" className="object-cover h-full" width={800} height={1000} />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-pink-600/20" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white bg-gradient-to-t from-black/60 to-transparent">
            <h2 className="text-2xl font-bold mb-2">Transform Your Life</h2>
            <p className="text-sm opacity-90">
              Join thousands of others who have already started their fitness journey with BodyBuddy
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}