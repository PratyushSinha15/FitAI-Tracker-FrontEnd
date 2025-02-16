import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, PoseLandmarker, DrawingUtils } from "@mediapipe/tasks-vision";

const PlankTimer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [count, setCount] = useState(0);
  const [plankTime, setPlankTime] = useState(0);
  const positionRef = useRef<"up" | "down" | null>(null);
  const plankStartTime = useRef<number | null>(null);

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
        if (!videoRef.current || !landmarker) return;

        const video = videoRef.current;
        if (video.readyState < 2) {
          animationFrameId = requestAnimationFrame(runPoseDetection);
          return;
        }

        const poses = landmarker.detectForVideo(video, performance.now());

        if (poses.landmarks.length > 0) {
          detectPushup(poses.landmarks[0]);
          detectPlank(poses.landmarks[0]);
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

      const threshold = 0.07;

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

  const detectPlank = (landmarks: any) => {
    const shoulder = landmarks[11];
    const hip = landmarks[23];

    if (shoulder && hip) {
      if (hip.y <= shoulder.y) { // Start timer if hip is at or above shoulder
        if (plankStartTime.current === null) {
          plankStartTime.current = Date.now();
        }
        const elapsedSeconds = Math.floor((Date.now() - plankStartTime.current) / 1000);
        setPlankTime(elapsedSeconds);
      } else {
        plankStartTime.current = null; // Stop timer when hips drop below shoulders
      }
    }
  };

  const drawCanvas = (ctx: CanvasRenderingContext2D, video: HTMLVideoElement, landmarks: any) => {
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    ctx.drawImage(video, 0, 0, canvasRef.current!.width, canvasRef.current!.height);

    const drawingUtils = new DrawingUtils(ctx);
    drawingUtils.drawLandmarks(landmarks, { color: "red", radius: 5 });
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto text-center">
      <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
      <canvas ref={canvasRef} className="absolute top-0 left-0" width={640} height={480} />
      <h2 className="text-xl mt-2">Plank Time: {plankTime} seconds</h2>
    </div>
  );
};

export default PlankTimer;
