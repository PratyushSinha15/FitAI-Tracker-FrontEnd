"use client";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const exercises = [
  { name: "Plank", path: "/plank", gif: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/plank-1457045584.gif?crop=1xw:1xh;center,top&resize=1200:*" },
  { name: "Push-ups", path: "/pushups", gif: "https://i.pinimg.com/originals/bc/cc/b3/bcccb362fd9c0f100079d6a0fc3926ec.gif" },
  { name: "Squats", path: "/squats", gif: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/bodyweightsquat-1457041691.gif" },
  { name: "Shoulder Tap", path: "/shoulder-taps", gif: "https://res.cloudinary.com/dblzslnh9/image/upload/v1739712133/shouldertap_w2j9hj.gif" },
];

export default function TrainingContent() {
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-100 mb-6">Training Exercises</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
        {exercises.map((exercise, index) => (
          <motion.div
            key={exercise.name}
            className="bg-gray-800 shadow-lg hover:shadow-gray-900/50 rounded-xl p-6 cursor-pointer border border-gray-700 hover:border-cyan-400 transition-all flex flex-col items-center text-center group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(exercise.path)}
            whileHover={{ scale: 1.03 }}
          >
            <img 
              src={exercise.gif} 
              alt={exercise.name} 
              className="w-full h-40 object-cover rounded-lg mb-4 border border-gray-700 group-hover:border-cyan-400 transition-colors"
            />
            <h3 className="text-xl font-semibold text-gray-100 group-hover:text-cyan-400 transition-colors">
              {exercise.name}
            </h3>
          </motion.div>
        ))}
      </div>
    </div>
  );
}