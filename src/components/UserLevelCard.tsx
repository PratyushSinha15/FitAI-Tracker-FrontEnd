import { motion } from "framer-motion";

const UserLevelCard = ({ userProfile }:{userProfile:any}) => {
  if (!userProfile) {
    return <div className="text-gray-400">Loading...</div>;
  }

  return (
    <div className="flex items-center gap-4 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 max-w-lg mx-auto">
      {/* User Avatar */}
      <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-semibold text-cyan-400">
        {userProfile.name ? userProfile.name[0].toUpperCase() : "U"}
      </div>

      {/* User Info */}
      <div className="flex-1">
        <h1 className="text-xl font-bold text-gray-100">Hi, {userProfile.name}!</h1>
        <p className="text-sm font-semibold text-cyan-400">Level {userProfile.level || 1}</p>
        
        {/* Progress Bar */}
        <div className="mt-2 relative">
          <motion.div 
            initial={{ width: "0%" }} 
            animate={{ width: `${(userProfile.points / 150) * 100}%` }} 
            className="absolute top-0 left-0 h-2 bg-cyan-400 rounded-full" 
          ></motion.div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-400" 
              style={{ width: `${(userProfile.points / 150) * 100}%` }} 
            />
          </div>
          <p className="text-xs text-center mt-1 text-cyan-400">
            {userProfile.points} / 150
          </p>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Earn 150 points to level up
        </p>
      </div>
    </div>
  );
};

export default UserLevelCard;