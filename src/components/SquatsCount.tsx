"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilesetResolver, PoseLandmarker, DrawingUtils } from "@mediapipe/tasks-vision";

const SquatCounter: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [count, setCount] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null); // State to store the user's email
  const [duration, setDuration] = useState(0); // State to track exercise duration
  const [isActive, setIsActive] = useState(false); // State to track if the timer is active
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Ref for the timer interval
  const positionRef = useRef<"up" | "down" | null>(null);

  // Fetch user email when the component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/profile", {
          method: "GET",
          credentials: "include", // Include cookies in the request
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setUserEmail(data.email); // Set the user's email
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  // Timer logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  // Setup camera and pose detection
  useEffect(() => {
    let landmarker: PoseLandmarker | null = null;
    let animationFrameId: number;

    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    const loadLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      landmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "/models/pose_landmarker_full.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });

      detectPose();
    };

    const detectPose = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      const runPoseDetection = async () => {
        if (!videoRef.current || !landmarker || !isTracking) return;

        const video = videoRef.current;
        if (video.readyState < 2) {
          animationFrameId = requestAnimationFrame(runPoseDetection);
          return;
        }

        const poses = landmarker.detectForVideo(video, performance.now());

        if (poses.landmarks.length > 0) {
          detectSquat(poses.landmarks[0]);
          drawCanvas(ctx, video, poses.landmarks[0]);
        }

        animationFrameId = requestAnimationFrame(runPoseDetection);
      };

      runPoseDetection();
    };

    if (isTracking) {
      setupCamera().then(loadLandmarker);
    }

    return () => {
      landmarker?.close();
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTracking]);

  // Detect squat motion
  const detectSquat = (landmarks: any) => {
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];

    if (leftHip && rightHip && leftKnee && rightKnee) {
      const leftHipY = leftHip.y;
      const rightHipY = rightHip.y;
      const leftKneeY = leftKnee.y;
      const rightKneeY = rightKnee.y;

      const threshold = 0.07;

      if (leftKneeY < leftHipY - threshold && rightKneeY < rightHipY - threshold) {
        if (positionRef.current !== "down") {
          positionRef.current = "down";
        }
      }

      if (leftKneeY > leftHipY + threshold && rightKneeY > rightHipY + threshold) {
        if (positionRef.current === "down") {
          setCount((prevCount) => prevCount + 1);
          positionRef.current = "up";
        }
      }
    }
  };

  // Draw landmarks on the canvas
  const drawCanvas = (ctx: CanvasRenderingContext2D, video: HTMLVideoElement, landmarks: any) => {
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    ctx.drawImage(video, 0, 0, canvasRef.current!.width, canvasRef.current!.height);

    const drawingUtils = new DrawingUtils(ctx);
    drawingUtils.drawLandmarks(landmarks, { color: "#10B981", radius: 5 });
    drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, { color: "#10B981" });
  };

  // Start tracking
  const startTracking = () => {
    setIsTracking(true);
    setIsActive(true); // Start the timer
  };

  // Stop tracking
  const stopTracking = () => {
    setIsTracking(false);
    setIsActive(false); // Stop the timer
  };

  // Reset all data
  const resetAll = () => {
    setCount(0);
    setDuration(0);
    setIsTracking(false);
    setIsActive(false);
    positionRef.current = null;
  };

  // Save data to the backend
  const saveData = async () => {
    if (!userEmail) {
      alert("You must be logged in to save data.");
      return;
    }

    const data = {
      email: userEmail, // Use the fetched email
      type: "squat", // Type of exercise
      count: count, // Number of squats
      duration: duration, // Duration in seconds
      notes: "Squat exercise completed", // Optional notes
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

        // Reset squat count and duration after successful save
        setCount(0);
        setDuration(0);
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
        <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-800 mb-8">Squat Challenge</h1>
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
                Squats: {count}
              </motion.h2>
              <motion.p
                className="text-3xl text-purple-600 mb-8"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {isTracking ? "Tracking Active" : "Tracking Inactive"}
              </motion.p>
              <motion.p
                className="text-2xl text-green-600 mb-8"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Duration: {duration}s
              </motion.p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <motion.button
                onClick={isTracking ? stopTracking : startTracking}
                className={`py-3 rounded-xl text-lg font-semibold shadow-lg ${
                  isTracking ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                } text-white transition-colors duration-200`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isTracking ? "Stop" : "Start"}
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
              <h3 className="text-2xl font-bold text-blue-800 mb-4">How to Perform Squats</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Stand with your feet shoulder-width apart.</li>
                <li>Lower your body by bending your knees and hips.</li>
                <li>Keep your chest up and back straight.</li>
                <li>Lower until your thighs are parallel to the ground.</li>
                <li>Push through your heels to return to the starting position.</li>
              </ol>
              <p className="mt-4 text-gray-600">
                Remember to keep your knees aligned with your toes and avoid leaning forward.
              </p>
              <div className="mt-6 flex justify-center">
                <img
                  src="https://i.pinimg.com/originals/bc/cc/b3/bcccb362fd9c0f100079d6a0fc3926ec.gif"
                  alt="Squat tutorial"
                  className="w-full max-w-md rounded-xl shadow-md"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SquatCounter;