import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, PoseLandmarker, DrawingUtils } from "@mediapipe/tasks-vision";

const ShoulderTapCounter: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [count, setCount] = useState(0);
  const [leftTapState, setLeftTapState] = useState(false);
  const [rightTapState, setRightTapState] = useState(false);

  useEffect(() => {
    let landmarker: PoseLandmarker | null = null;

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
        if (!videoRef.current || !landmarker) return;

        const video = videoRef.current;
        if (video.readyState < 2) {
          requestAnimationFrame(runPoseDetection);
          return;
        }

        const poses = landmarker.detectForVideo(video, performance.now());

        if (poses.landmarks.length > 0) {
          detectShoulderTap(poses.landmarks[0]);
          drawCanvas(ctx, video, poses.landmarks[0]);
        }

        requestAnimationFrame(runPoseDetection);
      };

      runPoseDetection();
    };

    setupCamera().then(loadLandmarker);

    return () => {
      landmarker?.close();
    };
  }, []);

  const calculateAngle = (A: any, B: any, C: any) => {
    const vectorAB = { x: B.x - A.x, y: B.y - A.y };
    const vectorBC = { x: C.x - B.x, y: C.y - B.y };

    const dotProduct = vectorAB.x * vectorBC.x + vectorAB.y * vectorBC.y;
    const magnitudeAB = Math.sqrt(vectorAB.x ** 2 + vectorAB.y ** 2);
    const magnitudeBC = Math.sqrt(vectorBC.x ** 2 + vectorBC.y ** 2);

    const cosineAngle = dotProduct / (magnitudeAB * magnitudeBC);
    const angleInRadians = Math.acos(Math.min(Math.max(cosineAngle, -1), 1));
    return (angleInRadians * 180) / Math.PI; // Convert to degrees
  };

  
const activeTaps = new Set<string>(); // Track active taps

const detectShoulderTap = (landmarks: any) => {
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftElbow = landmarks[13];
  const rightElbow = landmarks[14];
  const leftWrist = landmarks[15];
  const rightWrist = landmarks[16];

  if (!leftShoulder || !rightShoulder || !leftElbow || !rightElbow || !leftWrist || !rightWrist) return;

  const tapThreshold = 0.05;
  const angleThreshold = { min: 30, max: 90 };

  const calculateAngle = (A: any, B: any, C: any) => {
    const BAx = A.x - B.x;
    const BAy = A.y - B.y;
    const BCx = C.x - B.x;
    const BCy = C.y - B.y;

    const dotProduct = BAx * BCx + BAy * BCy;
    const magnitudeBA = Math.sqrt(BAx * BAx + BAy * BAy);
    const magnitudeBC = Math.sqrt(BCx * BCx + BCy * BCy);

    const angleRad = Math.acos(dotProduct / (magnitudeBA * magnitudeBC));
    return (angleRad * 180) / Math.PI;
  };

  const rightArmAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
  const leftArmAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);

  const rightHandTouchesLeftShoulder =
    Math.abs(rightWrist.x - leftShoulder.x) < tapThreshold &&
    Math.abs(rightWrist.y - leftShoulder.y) < tapThreshold &&
    rightArmAngle > angleThreshold.min &&
    rightArmAngle < angleThreshold.max;

  const leftHandTouchesRightShoulder =
    Math.abs(leftWrist.x - rightShoulder.x) < tapThreshold &&
    Math.abs(leftWrist.y - rightShoulder.y) < tapThreshold &&
    leftArmAngle > angleThreshold.min &&
    leftArmAngle < angleThreshold.max;

  if (rightHandTouchesLeftShoulder && !activeTaps.has("right")) {
    activeTaps.add("right");
    console.log("✅ Right Tap Registered!");

    setTimeout(() => {
      if (activeTaps.has("right")) {
        setCount((prev) => prev + 1);
        console.log("🎯 Right Tap Count Increased!");
        activeTaps.delete("right");
      }
    }, 1000);
  }

  if (leftHandTouchesRightShoulder && !activeTaps.has("left")) {
    activeTaps.add("left");
    console.log("✅ Left Tap Registered!");

    setTimeout(() => {
      if (activeTaps.has("left")) {
        setCount((prev) => prev + 1);
        console.log("🎯 Left Tap Count Increased!");
        activeTaps.delete("left");
      }
    }, 1000);
  }
};

  
  
  
  

  const drawCanvas = (ctx: CanvasRenderingContext2D, video: HTMLVideoElement, landmarks: any) => {
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    ctx.drawImage(video, 0, 0, canvasRef.current!.width, canvasRef.current!.height);

    const drawingUtils = new DrawingUtils(ctx);
    landmarks.forEach((landmark: any) => {
      drawingUtils.drawLandmarks([landmark], { color: "blue", radius: 5 });
    });
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto text-center">
      <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
      <canvas ref={canvasRef} className="absolute top-0 left-0" />
      <h1 className="text-2xl font-bold mt-4">Shoulder Tap Count: {count}</h1>
    </div>
  );
};

export default ShoulderTapCounter;
