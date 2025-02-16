import type React from "react"
import { useEffect, useRef, useState } from "react"
import { FilesetResolver, PoseLandmarker, DrawingUtils } from "@mediapipe/tasks-vision"
import { motion } from "framer-motion"

const ShoulderTapCounter: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [timer, setTimer] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null) // State to store the user's email

  // Fetch the user's profile data (including email) when the component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/profile", {
          method: "GET",
          credentials: "include", // Include cookies in the request
        })

        if (!response.ok) {
          throw new Error("Failed to fetch profile data")
        }

        const data = await response.json()
        setUserEmail(data.email) // Set the user's email
      } catch (error) {
        console.error("Error fetching profile data:", error)
      }
    }

    fetchProfileData()
  }, [])

  // Timer logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isActive])

  // Camera and pose detection setup
  useEffect(() => {
    let landmarker: PoseLandmarker | null = null

    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error("Error accessing camera:", err)
      }
    }

    const loadLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
      )

      landmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "/models/pose_landmarker_full.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      })

      setIsLoading(false)
      detectPose()
    }

    const detectPose = async () => {
      if (!videoRef.current || !canvasRef.current) return

      const ctx = canvasRef.current.getContext("2d")
      if (!ctx) return

      const runPoseDetection = async () => {
        if (!videoRef.current || !landmarker) return

        const video = videoRef.current
        if (video.readyState < 2) {
          requestAnimationFrame(runPoseDetection)
          return
        }

        const poses = landmarker.detectForVideo(video, performance.now())

        if (poses.landmarks.length > 0) {
          detectShoulderTap(poses.landmarks[0])
          drawCanvas(ctx, video, poses.landmarks[0])
        }

        requestAnimationFrame(runPoseDetection)
      }

      runPoseDetection()
    }

    setupCamera().then(loadLandmarker)

    return () => {
      landmarker?.close()
    }
  }, [])

  const activeTaps = new Set<string>()

  const detectShoulderTap = (landmarks: any) => {
    const leftShoulder = landmarks[11]
    const rightShoulder = landmarks[12]
    const leftElbow = landmarks[13]
    const rightElbow = landmarks[14]
    const leftWrist = landmarks[15]
    const rightWrist = landmarks[16]

    if (!leftShoulder || !rightShoulder || !leftElbow || !rightElbow || !leftWrist || !rightWrist) return

    const tapThreshold = 0.05
    const angleThreshold = { min: 30, max: 90 }

    const calculateAngle = (A: any, B: any, C: any) => {
      const BAx = A.x - B.x
      const BAy = A.y - B.y
      const BCx = C.x - B.x
      const BCy = C.y - B.y

      const dotProduct = BAx * BCx + BAy * BCy
      const magnitudeBA = Math.sqrt(BAx * BAx + BAy * BAy)
      const magnitudeBC = Math.sqrt(BCx * BCx + BCy * BCy)

      const angleRad = Math.acos(dotProduct / (magnitudeBA * magnitudeBC))
      return (angleRad * 180) / Math.PI
    }

    const rightArmAngle = calculateAngle(rightShoulder, rightElbow, rightWrist)
    const leftArmAngle = calculateAngle(leftShoulder, leftElbow, leftWrist)

    const rightHandTouchesLeftShoulder =
      Math.abs(rightWrist.x - leftShoulder.x) < tapThreshold &&
      Math.abs(rightWrist.y - leftShoulder.y) < tapThreshold &&
      rightArmAngle > angleThreshold.min &&
      rightArmAngle < angleThreshold.max

    const leftHandTouchesRightShoulder =
      Math.abs(leftWrist.x - rightShoulder.x) < tapThreshold &&
      Math.abs(leftWrist.y - rightShoulder.y) < tapThreshold &&
      leftArmAngle > angleThreshold.min &&
      leftArmAngle < angleThreshold.max

    if (rightHandTouchesLeftShoulder && !activeTaps.has("right")) {
      activeTaps.add("right")
      console.log("✅ Right Tap Registered!")

      setTimeout(() => {
        if (activeTaps.has("right")) {
          setCount((prev) => prev + 1)
          console.log("🎯 Right Tap Count Increased!")
          activeTaps.delete("right")
        }
      }, 1000)
    }

    if (leftHandTouchesRightShoulder && !activeTaps.has("left")) {
      activeTaps.add("left")
      console.log("✅ Left Tap Registered!")

      setTimeout(() => {
        if (activeTaps.has("left")) {
          setCount((prev) => prev + 1)
          console.log("🎯 Left Tap Count Increased!")
          activeTaps.delete("left")
        }
      }, 1000)
    }
  }

  const drawCanvas = (ctx: CanvasRenderingContext2D, video: HTMLVideoElement, landmarks: any) => {
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
    ctx.drawImage(video, 0, 0, canvasRef.current!.width, canvasRef.current!.height)

    const drawingUtils = new DrawingUtils(ctx)
    landmarks.forEach((landmark: any) => {
      drawingUtils.drawLandmarks(landmarks, { color: "#10B981", radius: 1 })
      drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, { color: "#10B981" })
    })
  }

  const handleStart = () => {
    setIsActive(true)
  }

  const handleReset = () => {
    setIsActive(false)
    setTimer(0)
    setCount(0)
  }

  const handleSave = async () => {
    if (!userEmail) {
      alert("You must be logged in to save data.")
      return
    }

    const data = {
      email: userEmail, // Use the fetched email
      type: "shoulder-tap", // Type of exercise
      count: count, // Number of shoulder taps
      duration: timer, // Timer in seconds
      notes: "Shoulder tap exercise completed", // Optional notes
    }

    try {
      const response = await fetch("http://localhost:5000/excercise/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Data saved successfully:", result)
        alert("Data saved successfully!")

        // Reset count and timer after saving
        setCount(0)
        setTimer(0)
      } else {
        const errorData = await response.json() // Parse error response from the backend
        console.error("Failed to save data:", errorData)
        alert(`Failed to save data: ${errorData.message || response.statusText}`)
      }
    } catch (error) {
      console.error("Error saving data:", error)
      alert("Error saving data. Check the console for details.")
    }
  }

  const handleTutorial = () => {
    // Implement tutorial functionality
    console.log("Show tutorial")
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <motion.h1
        className="text-4xl font-bold text-blue-600 text-center mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Shoulder Tap Challenge
      </motion.h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          className="relative rounded-3xl overflow-hidden shadow-xl bg-white"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
          <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
        </motion.div>

        <motion.div
          className="bg-white rounded-3xl p-8 shadow-xl"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="mb-8"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-blue-600">Shoulder-taps: {count}</h2>
            <p className="text-2xl text-purple-600 mt-2">Timer: {timer}s</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <motion.button
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-6 rounded-xl text-lg transition-colors"
              onClick={handleStart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start
            </motion.button>

            <motion.button
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-4 px-6 rounded-xl text-lg transition-colors"
              onClick={handleReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Reset
            </motion.button>

            <motion.button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl text-lg transition-colors"
              onClick={handleSave}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Save
            </motion.button>

            <motion.button
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-4 px-6 rounded-xl text-lg transition-colors"
              onClick={handleTutorial}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Show Tutorial
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ShoulderTapCounter