"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FilesetResolver, PoseLandmarker, DrawingUtils } from "@mediapipe/tasks-vision"
const PushupCounter: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [count, setCount] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const positionRef = useRef<"up" | "down" | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [showTutorial, setShowTutorial] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null) // State to store the user's email
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


  useEffect(() => {
    let landmarker: PoseLandmarker | null = null
    let animationFrameId: number

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
          animationFrameId = requestAnimationFrame(runPoseDetection)
          return
        }

        const poses = landmarker.detectForVideo(video, performance.now())

        if (poses.landmarks.length > 0) {
          detectPushup(poses.landmarks[0])
          drawCanvas(ctx, video, poses.landmarks[0])
        }

        animationFrameId = requestAnimationFrame(runPoseDetection)
      }

      runPoseDetection()
    }

    setupCamera().then(loadLandmarker)

    return () => {
      landmarker?.close()
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const detectPushup = (landmarks: any) => {
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftElbow = landmarks[13];
    const rightElbow = landmarks[14];

    if (leftShoulder && rightShoulder && leftElbow && rightElbow) {
      const leftShoulderY = leftShoulder.y;
      const rightShoulderY = rightShoulder.y;
      const leftElbowY = leftElbow.y;
      const rightElbowY = rightElbow.y;

      const threshold = 0.07; // Adjust threshold for movement detection

      if (leftElbowY > leftShoulderY + threshold && rightElbowY > rightShoulderY + threshold) {
        if (positionRef.current !== "down") {
          positionRef.current = "down";
        }
      }

      if (leftElbowY < leftShoulderY - threshold && rightElbowY < rightShoulderY - threshold) {
        if (positionRef.current === "down") {
          setCount((prevCount) => prevCount + 1);
          positionRef.current = "up";
        }
      }
    }
  };

  const drawCanvas = (ctx: CanvasRenderingContext2D, video: HTMLVideoElement, landmarks: any) => {
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
    ctx.drawImage(video, 0, 0, canvasRef.current!.width, canvasRef.current!.height)

    const drawingUtils = new DrawingUtils(ctx)
    drawingUtils.drawLandmarks(landmarks, { color: "#10B981", radius: 5 })
    drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, { color: "#10B981" })
  }

  const startTimer = () => {
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setTimer((prev) => prev + 1)
    }, 1000)
  }

  const stopTimer = () => {
    setIsRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const resetAll = () => {
    setCount(0)
    setTimer(0)
    setIsRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }
const saveData = async () => {
    if (!userEmail) {
      alert("You must be logged in to save data.");
      return;
    }
  
    const data = {
      email: userEmail, // Use the fetched email
      type: "pushup", // Type of exercise
      count: count, // Number of push-ups
      duration: timer, // Timer in seconds
      notes: "Push-up exercise completed", // Optional notes
    };
  
    try {
      const response = await fetch("http://localhost:5000/excercise/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Data saved successfully:", result);
        alert("Data saved successfully!");
  
        // Reset push count to 0 after successful save
        setCount(0);
      } else {
        const errorData = await response.json(); // Parse error response from the backend
        console.error("Failed to save data:", errorData);
        alert(`Failed to save data: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data. Check the console for details.");
    }
  };
  
  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-800 mb-8">Push-up Challenge</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" width={640} height={480} />
          </div>
          <div className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col justify-between">
            <div>
              <motion.h2
                className="text-4xl font-extrabold text-blue-600 mb-4"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Push-ups: {count}
              </motion.h2>
              <motion.p
                className="text-3xl text-purple-600 mb-8"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Timer: {timer}s
              </motion.p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <motion.button
                onClick={isRunning ? stopTimer : startTimer}
                className={`py-3 rounded-xl text-lg font-semibold shadow-lg ${
                  isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                } text-white transition-colors duration-200`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isRunning ? "Stop" : "Start"}
              </motion.button>
              <motion.button
                onClick={resetAll}
                className="py-3 bg-yellow-500 hover:bg-yellow-600 rounded-xl text-lg font-semibold shadow-lg text-white transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset
              </motion.button>
              <motion.button
                onClick={saveData}
                className="py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-lg font-semibold shadow-lg text-white transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Save
              </motion.button>
              <motion.button
                onClick={() => setShowTutorial(!showTutorial)}
                className="py-3 bg-purple-500 hover:bg-purple-600 rounded-xl text-lg font-semibold shadow-lg text-white transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showTutorial ? "Hide" : "Show"} Tutorial
              </motion.button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {showTutorial && (
            <motion.div
              className="mt-8 bg-white rounded-2xl shadow-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-blue-800 mb-4">How to Do a Perfect Push-up</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Start in a plank position with your hands slightly wider than shoulder-width apart.</li>
                <li>Keep your body in a straight line from head to heels.</li>
                <li>Lower your body until your chest nearly touches the floor.</li>
                <li>Pause, then push yourself back up to the starting position.</li>
                <li>Repeat for the desired number of repetitions.</li>
              </ol>
              <p className="mt-4 text-gray-600">
                Remember to breathe steadily and maintain proper form throughout the exercise.
              </p>
              <div className="mt-6 flex justify-center">
                <img
                  src="https://i.pinimg.com/originals/bc/cc/b3/bcccb362fd9c0f100079d6a0fc3926ec.gif"
                  alt="Push-up tutorial"
                  className="w-full max-w-md rounded-xl shadow-md"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default PushupCounter