import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, PoseLandmarker, DrawingUtils } from "@mediapipe/tasks-vision";

const PushupCounter = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [count, setCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const positionRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    let landmarker = null;
    let animationFrameId;

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
      const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");

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
        if (!videoRef.current || !landmarker) return;

        const video = videoRef.current;
        if (video.readyState < 2) {
          animationFrameId = requestAnimationFrame(runPoseDetection);
          return;
        }

        const poses = landmarker.detectForVideo(video, performance.now());

        if (poses.landmarks.length > 0) {
          detectPushup(poses.landmarks[0]);
          drawCanvas(ctx, video, poses.landmarks[0]);
        }

        animationFrameId = requestAnimationFrame(runPoseDetection);
      };

      runPoseDetection();
    };

    setupCamera().then(loadLandmarker);

    return () => {
      landmarker?.close();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const detectPushup = (landmarks) => {
    const leftShoulderY = landmarks[11]?.y;
    const rightShoulderY = landmarks[12]?.y;
    const leftElbowY = landmarks[13]?.y;
    const rightElbowY = landmarks[14]?.y;

    const threshold = 0.07;

    if (leftElbowY > leftShoulderY + threshold && rightElbowY > rightShoulderY + threshold) {
      if (positionRef.current !== "down") {
        positionRef.current = "down";
      }
    }

    if (leftElbowY < leftShoulderY - threshold && rightElbowY < rightShoulderY - threshold) {
      if (positionRef.current === "down") {
        setCount((prev) => prev + 1);
        positionRef.current = "up";
      }
    }
  };

  const drawCanvas = (ctx, video, landmarks) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(video, 0, 0, canvasRef.current.width, canvasRef.current.height);

    const drawingUtils = new DrawingUtils(ctx);
    drawingUtils.drawLandmarks(landmarks, { color: "#00FF00", radius: 6 });
  };

  const startTimer = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const resetAll = () => {
    setCount(0);
    setTimer(0);
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const saveData = () => {
    const data = { pushups: count, time: timer };
    console.log("Saved Data:", data);
    alert("Data saved successfully!");
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-r from-gray-900 to-black text-white p-6">
      <div className="relative w-full max-w-3xl shadow-xl rounded-lg overflow-hidden border-4 border-gray-700">
        <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-lg shadow-lg" />
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" width={640} height={480} />
      </div>
      <div className="mt-6 text-center">
        <h1 className="text-5xl font-extrabold text-green-400 drop-shadow-lg">Push-ups: {count}</h1>
        <h2 className="text-3xl mt-2 text-blue-300 drop-shadow-md">Timer: {timer}s</h2>
      </div>
      <div className="mt-6 flex gap-6 flex-wrap justify-center">
        <button onClick={startTimer} className="px-8 py-4 bg-green-600 hover:bg-green-500 transition-all rounded-xl text-lg font-semibold shadow-xl border border-green-300">Start</button>
        <button onClick={stopTimer} className="px-8 py-4 bg-red-600 hover:bg-red-500 transition-all rounded-xl text-lg font-semibold shadow-xl border border-red-300">Stop</button>
        <button onClick={resetAll} className="px-8 py-4 bg-gray-700 hover:bg-gray-600 transition-all rounded-xl text-lg font-semibold shadow-xl border border-gray-300">Reset</button>
        <button onClick={saveData} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 transition-all rounded-xl text-lg font-semibold shadow-xl border border-blue-300">Save</button>
      </div>
    </div>
  );
};

export default PushupCounter;
