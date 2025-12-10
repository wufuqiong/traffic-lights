import React from 'react';
import { GameLevel, Orientation } from '../types';

interface ControlsProps {
  redDuration: number;
  setRedDuration: (val: number) => void;
  greenDuration: number;
  setGreenDuration: (val: number) => void;
  patienceDuration: number;
  setPatienceDuration: (val: number) => void;
  isRunning: boolean;
  setIsRunning: (val: boolean) => void;
  gameLevel: GameLevel;
  setGameLevel: (level: GameLevel) => void;
  orientation: Orientation;
  setOrientation: (o: Orientation) => void;
  onClose: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  redDuration,
  setRedDuration,
  greenDuration,
  setGreenDuration,
  patienceDuration,
  setPatienceDuration,
  isRunning,
  gameLevel,
  setGameLevel,
  orientation,
  setOrientation,
  onClose
}) => {

  const isLongWait = gameLevel === GameLevel.LONG_WAIT;

  return (
    <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl border-2 border-indigo-100 max-w-md w-full mx-auto relative animate-in fade-in slide-in-from-bottom-10 duration-300 max-h-[90vh] overflow-y-auto">
      
      {/* Header with Close Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">⚙️ Game Setup</h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      
      <div className="space-y-6">
        
        {/* Level Selector */}
        <div>
           <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Select Level</label>
           <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setGameLevel(GameLevel.CAR_NORMAL)}
                className={`p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                  gameLevel === GameLevel.CAR_NORMAL 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-200 hover:border-indigo-300 text-gray-600'
                }`}
              >
                <span className="text-2xl">🚗</span>
                <div>
                  <div className="font-bold">Car Adventure</div>
                  <div className="text-xs opacity-75">Standard traffic rules</div>
                </div>
              </button>

              <button
                onClick={() => setGameLevel(GameLevel.WALKER_NORMAL)}
                className={`p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                  gameLevel === GameLevel.WALKER_NORMAL 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-200 hover:border-indigo-300 text-gray-600'
                }`}
              >
                <span className="text-2xl">🚶</span>
                <div>
                  <div className="font-bold">Crosswalk Challenge</div>
                  <div className="text-xs opacity-75">Safe crossing practice</div>
                </div>
              </button>

              <button
                onClick={() => setGameLevel(GameLevel.LONG_WAIT)}
                className={`p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                  gameLevel === GameLevel.LONG_WAIT 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-200 hover:border-indigo-300 text-gray-600'
                }`}
              >
                <span className="text-2xl">⏳</span>
                <div>
                  <div className="font-bold">The Patience Test</div>
                  <div className="text-xs opacity-75">Hidden timer!</div>
                </div>
              </button>
           </div>
        </div>

        {/* Orientation Toggle */}
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Traffic Light Style</label>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setOrientation('vertical')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                orientation === 'vertical' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'
              }`}
            >
              Vertical 🚦
            </button>
            <button
              onClick={() => setOrientation('horizontal')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                orientation === 'horizontal' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'
              }`}
            >
              Horizontal 🚥
            </button>
          </div>
        </div>

        {/* Timers */}
        {!isLongWait ? (
          <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <label className="block text-sm font-bold text-red-600 mb-1 uppercase tracking-wide flex justify-between">
                <span>Red Light</span>
                <span>{redDuration}s</span>
              </label>
              <input
                type="range"
                min="3"
                max="60"
                value={redDuration}
                onChange={(e) => setRedDuration(Number(e.target.value))}
                disabled={isRunning}
                className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600 disabled:opacity-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-green-600 mb-1 uppercase tracking-wide flex justify-between">
                <span>Green Light</span>
                <span>{greenDuration}s</span>
              </label>
              <input
                type="range"
                min="3"
                max="60"
                value={greenDuration}
                onChange={(e) => setGreenDuration(Number(e.target.value))}
                disabled={isRunning}
                className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600 disabled:opacity-50"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
             <div>
              <label className="block text-sm font-bold text-yellow-800 mb-1 uppercase tracking-wide flex justify-between">
                <span>Patience Wait Time</span>
                <span>{patienceDuration}s</span>
              </label>
              <input
                type="range"
                min="0"
                max="120"
                step="1"
                value={patienceDuration}
                onChange={(e) => setPatienceDuration(Number(e.target.value))}
                disabled={isRunning}
                className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer accent-yellow-600 disabled:opacity-50"
              />
            </div>
             <div className="text-xs text-yellow-800">
               ⚠️ Timer is hidden until the last 15 seconds.
             </div>
          </div>
        )}
      </div>
    </div>
  );
};