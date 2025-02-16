import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const exercises = [
  { name: "Jumping Jacks", gif: "https://i.pinimg.com/originals/57/cc/e0/57cce0afa73a4b4c9c8c139d08aec588.gif" },
  { name: "Plank", gif: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/plank-1457045584.gif?crop=1xw:1xh;center,top&resize=1200:*" },
  { name: "Squats", gif: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/bodyweightsquat-1457041691.gif" },
  { name: "Push-ups", gif: "https://i.pinimg.com/originals/bc/cc/b3/bcccb362fd9c0f100079d6a0fc3926ec.gif" },
];

const MasterMoves = () => {
  const [index, setIndex] = useState(0);

  const prevExercise = () => {
    setIndex((prev) => (prev === 0 ? exercises.length - 1 : prev - 1));
  };

  const nextExercise = () => {
    setIndex((prev) => (prev === exercises.length - 1 ? 0 : prev + 1));
  };

  return (
<div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 max-w-lg mx-auto text-center">
      <h2 className="text-xl font-semibold mb-4 text-gray-200">Master the moves</h2>
      <div className="flex items-center justify-between">
        <button 
          onClick={prevExercise} 
          className="text-gray-300 hover:text-gray-100 p-2 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="flex gap-6">
          <motion.div 
            className="w-40 h-40 rounded-lg shadow-lg flex flex-col items-center justify-center bg-gray-700 border border-gray-600">
            <img 
              src={exercises[index].gif} 
              alt={exercises[index].name} 
              className="w-32 h-32 object-cover rounded-md" 
            />
            <p className="font-bold mt-2 text-gray-100">{exercises[index].name}</p>
          </motion.div>
        </div>

        <button 
          onClick={nextExercise} 
          className="text-gray-300 hover:text-gray-100 p-2 transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      <p className="text-gray-400 mt-4 text-sm">
        Learning how to move correctly would significantly increase your efficiency.
        We have some good tips for you, check it out!
      </p>
      <button className="bg-gradient-to-r from-purple-400 to-cyan-400 text-gray-900 px-5 py-2.5 rounded-lg mt-4 font-semibold hover:opacity-90 transition-opacity">
        Start Learning
      </button>
    </div>
  );
};

export default MasterMoves;
