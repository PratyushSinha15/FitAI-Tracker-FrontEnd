import { useState, useEffect } from "react";
import { format, addDays, subDays, differenceInDays } from "date-fns";

const StreakTracker = ({ userProfile }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [streakData, setStreakData] = useState({ weekStreak: 0, bestStreak: 0, completedDays: [] });

  const today = new Date();
  const backendUrl = "http://localhost:5000";
  
  // Generate 7 days for the current week
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  useEffect(() => {
    const fetchStreakData = async () => {
      if (!userProfile?.email) return;
      try {
        const response = await fetch(`${backendUrl}/leaderboard/streaks?email=${userProfile.email}`);
        const data = await response.json();

        // Extract the last 7 days from today
        const last7Days = weekDays.map(day => format(day, "yyyy-MM-dd"));
        
        // Count workouts in the last 7 days
        const workoutDays = data.completedDays.filter(day => last7Days.includes(day)).length;

        // If 3 or more workouts in a week, keep streak; otherwise, reset to 0
        const weekStreak = workoutDays >= 3 ? data.weekStreak : 0;

        setStreakData({
          weekStreak,
          bestStreak: data.bestStreak,
          completedDays: data.completedDays,
        });
      } catch (error) {
        console.error("Error fetching streak data:", error);
      }
    };

    fetchStreakData();
  }, [userProfile, startDate]); // Re-fetch when user or week changes

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 max-w-lg mx-auto text-center">
      <div className="flex justify-around items-center mb-4">
        <div className="text-center">
          <span className="text-4xl font-bold text-gray-100">{streakData.weekStreak}</span>
          <p className="text-sm text-gray-400">Week Streak</p>
        </div>
        <div className="text-center">
          <span className="text-4xl font-bold text-gray-100">{streakData.bestStreak}</span>
          <p className="text-sm text-gray-400">Best Streak</p>
        </div>
      </div>

      <p className="text-lg font-semibold mb-2 text-gray-200">This Week</p>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStartDate(subDays(startDate, 7))}
          className="text-gray-300 hover:text-gray-100 transition-colors"
        >
          <span className="text-[32px] p-3">&#8249;</span>
        </button>
        <div className="flex gap-3">
          {weekDays.map((day, index) => {
            const dayFormatted = format(day, "yyyy-MM-dd");
            return (
              <div
                key={index}
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors ${
                  streakData.completedDays.includes(dayFormatted)
                    ? "bg-green-500 border-green-400 text-white"
                    : "border-gray-600 text-gray-400"
                }`}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>
        <button
          onClick={() => setStartDate(addDays(startDate, 7))}
          className="text-gray-300 hover:text-gray-100 transition-colors"
        >
          <span className="text-[32px] p-3">&#8250;</span>
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Exercise at least 3 times a week to keep your streak from resetting.
      </p>
      <button className="bg-gradient-to-r from-purple-400 to-cyan-400 text-gray-900 px-4 py-2 rounded-lg mt-4 font-semibold hover:opacity-90 transition-opacity">
        Today's Routine
      </button>
    </div>
  );
};

export default StreakTracker;
