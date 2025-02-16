import type React from "react"
import { useEffect, useRef, useState } from "react"
import { FilesetResolver, PoseLandmarker, DrawingUtils } from "@mediapipe/tasks-vision"

const SquatCounter: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [count, setCount] = useState(0)
  const [isTracking, setIsTracking] = useState(false)
  const positionRef = useRef<"up" | "down" | null>(null)

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
        if (!videoRef.current || !landmarker || !isTracking) return

        const video = videoRef.current
        if (video.readyState < 2) {
          animationFrameId = requestAnimationFrame(runPoseDetection)
          return
        }

        const poses = landmarker.detectForVideo(video, performance.now())

        if (poses.landmarks.length > 0) {
          detectSquat(poses.landmarks[0])
          drawCanvas(ctx, video, poses.landmarks[0])
        }

        animationFrameId = requestAnimationFrame(runPoseDetection)
      }

      runPoseDetection()
    }

    if (isTracking) {
      setupCamera().then(loadLandmarker)
    }

    return () => {
      landmarker?.close()
      cancelAnimationFrame(animationFrameId)
    }
  }, [isTracking])

  const detectSquat = (landmarks: any) => {
    const leftHip = landmarks[23]
    const rightHip = landmarks[24]
    const leftKnee = landmarks[25]
    const rightKnee = landmarks[26]

    if (leftHip && rightHip && leftKnee && rightKnee) {
      const leftHipY = leftHip.y
      const rightHipY = rightHip.y
      const leftKneeY = leftKnee.y
      const rightKneeY = rightKnee.y

      const threshold = 0.07

      if (leftKneeY < leftHipY - threshold && rightKneeY < rightHipY - threshold) {
        if (positionRef.current !== "down") {
          positionRef.current = "down"
        }
      }

      if (leftKneeY > leftHipY + threshold && rightKneeY > rightHipY + threshold) {
        if (positionRef.current === "down") {
          setCount((prevCount) => prevCount + 1)
          positionRef.current = "up"
        }
      }
    }
  }

  const drawCanvas = (ctx: CanvasRenderingContext2D, video: HTMLVideoElement, landmarks: any) => {
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
    ctx.drawImage(video, 0, 0, canvasRef.current!.width, canvasRef.current!.height)

    const drawingUtils = new DrawingUtils(ctx)
    drawingUtils.drawLandmarks(landmarks, { color: "#10B981", radius: 5 })
    drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, { color: "#10B981" })
  }

  const handleStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsTracking(true)
    } catch (err) {
      console.error("Camera access denied:", err)
    }
  }

  const handleStop = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop()) // Stop the camera stream
    }
    setIsTracking(false)
  }

  const handleReset = () => {
    setCount(0)
    positionRef.current = null
  }

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
        AI Squat Counter
      </h2>

      {/* Video and Canvas Container */}
      <div className="relative aspect-video mb-6 rounded-lg overflow-hidden border-2 border-green-500">
        {/* Small Video on Top-Left with Higher z-index */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute top-2 left-2 w-24 h-24 rounded-lg border-2 border-white shadow-lg z-10"
        />

        {/* Canvas for Pose Tracking (Lower z-index) */}
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" width={640} height={480} />
      </div>

      {/* Count and Buttons */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
          {count}
        </div>
        <div className="space-x-4">
          {!isTracking ? (
            <button
              onClick={handleStart}
              className="px-6 py-2 rounded-full font-semibold bg-green-500 hover:bg-green-600 text-white transition-colors"
            >
              Start
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="px-6 py-2 rounded-full font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors"
            >
              Stop
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-6 py-2 rounded-full font-semibold bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center text-gray-400">
        <p>Stand in front of the camera and perform squats.</p>
        <p>The AI will count your repetitions automatically!</p>
      </div>
    </div>
  )
}

export default SquatCounter
