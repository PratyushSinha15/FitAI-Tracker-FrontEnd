import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const timeFrames = ["Week", "Month", "Year"] as const;

type TimeFrame = (typeof timeFrames)[number];

interface DataPoint {
  day: string;
  value: number;
}

const dataMap: Record<TimeFrame, DataPoint[]> = {
  Week: [
    { day: "Mon", value: 10 },
    { day: "Tue", value: 30 },
    { day: "Wed", value: 20 },
    { day: "Thu", value: 50 },
    { day: "Fri", value: 40 },
    { day: "Sat", value: 60 },
    { day: "Sun", value: 80 },
  ],
  Month: Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    value: Math.random() * 100,
  })),
  Year: Array.from({ length: 12 }, (_, i) => ({
    day: `Month ${i + 1}`,
    value: Math.random() * 500,
  })),
};

const Record: React.FC = () => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>("Week");

  const data = dataMap[selectedTimeFrame];

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 max-w-lg mx-auto text-center">
      <h2 className="text-xl font-bold mb-4 text-gray-200">Record</h2>
      <div className="flex gap-2 justify-center mb-4">
        {timeFrames.map((frame) => (
          <button
            key={frame}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedTimeFrame === frame 
                ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-gray-900"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => setSelectedTimeFrame(frame)}
          >
            {frame}
          </button>
        ))}
      </div>
      <div className="mt-6 p-4 bg-gray-900 rounded-lg shadow-inner">
        <h3 className="text-lg font-bold mb-2 text-gray-300">Activity Progress</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="day" 
              stroke="#9CA3AF" 
              tick={{ fill: '#9CA3AF' }} 
            />
            <YAxis 
              stroke="#9CA3AF" 
              tick={{ fill: '#9CA3AF' }} 
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
              itemStyle={{ color: '#e5e7eb' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#22d3ee" 
              strokeWidth={2}
              dot={{ fill: '#22d3ee', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Record;
