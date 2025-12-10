import React from 'react';
import { LightState, Orientation } from '../types';

interface TrafficLightProps {
  state: LightState;
  timeLeft?: number;
  orientation: Orientation;
  hideTimer?: boolean;
}

export const TrafficLight: React.FC<TrafficLightProps> = ({ 
  state, 
  timeLeft, 
  orientation,
  hideTimer = false 
}) => {
  const isRed = state === LightState.RED;
  const isYellow = state === LightState.YELLOW;
  const isGreen = state === LightState.GREEN;

  const isHorizontal = orientation === 'horizontal';

  // Show timer if:
  // 1. Time is provided
  // 2. Timer is not explicitly hidden (e.g., patience mode)
  // 3. Light is Red OR Light is Green
  const showTimer = timeLeft !== undefined && timeLeft > 0 && !hideTimer && (isRed || isGreen);

  return (
    <div className={`relative bg-gray-900 p-4 rounded-3xl shadow-2xl border-4 border-gray-700 flex ${isHorizontal ? 'flex-row gap-4 h-32 md:h-40 items-center' : 'flex-col gap-4 w-32 md:w-40 items-center'} z-20 transition-all duration-500`}>
      
      {/* Red Light */}
      <div className={`relative w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-gray-950 transition-all duration-300 flex items-center justify-center
        ${isRed ? 'bg-red-500 shadow-[0_0_50px_10px_rgba(239,68,68,0.6)]' : 'bg-red-900 opacity-40'}`}>
        {isRed && showTimer && (
          <span className="text-white font-bold text-3xl md:text-5xl drop-shadow-md font-mono animate-pulse">
            {timeLeft}
          </span>
        )}
      </div>

      {/* Yellow Light */}
      <div className={`w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-gray-950 transition-all duration-300
        ${isYellow ? 'bg-yellow-400 shadow-[0_0_50px_10px_rgba(250,204,21,0.6)]' : 'bg-yellow-900 opacity-40'}`}>
      </div>

      {/* Green Light */}
      <div className={`relative w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-gray-950 transition-all duration-300 flex items-center justify-center
        ${isGreen ? 'bg-green-500 shadow-[0_0_50px_10px_rgba(34,197,94,0.6)]' : 'bg-green-900 opacity-40'}`}>
         {isGreen && showTimer && (
          <span className="text-white font-bold text-3xl md:text-5xl drop-shadow-md font-mono animate-pulse">
            {timeLeft}
          </span>
        )}
      </div>
    </div>
  );
};