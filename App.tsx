import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TrafficLight } from './components/TrafficLight';
import { Controls } from './components/Controls';
import { RoadScene } from './components/RoadScene';
import { LightState, Mode, GameLevel, Orientation } from './types';

const YELLOW_DURATION = 3;

const App: React.FC = () => {
  // Game Configuration State
  const [gameLevel, setGameLevel] = useState<GameLevel>(GameLevel.CAR_NORMAL);
  const [orientation, setOrientation] = useState<Orientation>('vertical');
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // User Preferences
  const [userRedSetting, setUserRedSetting] = useState<number>(15);
  const [userGreenSetting, setUserGreenSetting] = useState<number>(20);
  const [patienceDuration, setPatienceDuration] = useState<number>(120);

  // Simulation State
  const [lightState, setLightState] = useState<LightState>(LightState.RED);
  const [timer, setTimer] = useState<number>(15);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIdRef = useRef<number | null>(null);

  // Derived State
  const mode = gameLevel === GameLevel.WALKER_NORMAL ? Mode.WALK : Mode.CAR;
  
  // Logic to hide timer in Patience Level
  const shouldHideTimer = gameLevel === GameLevel.LONG_WAIT && lightState === LightState.RED && timer > 15;

  // Initialize timer
  useEffect(() => {
    if (!isRunning) {
      if (gameLevel === GameLevel.LONG_WAIT) {
        setTimer(patienceDuration);
      } else {
        setTimer(userRedSetting);
      }
    }
  }, [gameLevel, userRedSetting, patienceDuration, isRunning]);

  // Pause simulation when settings are opened
  useEffect(() => {
    if (showSettings && isRunning) {
      setIsRunning(false);
    }
  }, [showSettings, isRunning]);

  const handleStateTransition = useCallback(() => {
    setLightState((prevState) => {
      let newTimer = 0;
      
      switch (prevState) {
        case LightState.RED:
          newTimer = userGreenSetting;
          setTimer(newTimer);
          return LightState.GREEN;
          
        case LightState.GREEN:
          newTimer = YELLOW_DURATION;
          setTimer(newTimer);
          return LightState.YELLOW;
          
        case LightState.YELLOW:
          newTimer = gameLevel === GameLevel.LONG_WAIT ? patienceDuration : userRedSetting;
          setTimer(newTimer);
          return LightState.RED;
          
        default:
          newTimer = userRedSetting;
          setTimer(newTimer);
          return LightState.RED;
      }
    });
  }, [userRedSetting, userGreenSetting, patienceDuration, gameLevel]);

  // Main Timer Logic - Simplified
  useEffect(() => {
    if (!isRunning) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
        timerIdRef.current = null;
      }
      return;
    }

    // Clear any existing timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    // Start new timer
    timerIntervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          // Schedule state transition in next tick
          setTimeout(handleStateTransition, 0);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isRunning, handleStateTransition]);

  const reset = () => {
    setIsRunning(false);
    
    // Clear timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    // Reset state
    setLightState(LightState.RED);
    
    // Reset timer
    if (gameLevel === GameLevel.LONG_WAIT) {
      setTimer(patienceDuration);
    } else {
      setTimer(userRedSetting);
    }
  };

  const handleOpenSettings = () => {
    setIsRunning(false);
    // Use setTimeout to ensure state update happens before opening settings
    setTimeout(() => {
      setShowSettings(true);
    }, 10);
  };

  return (
    <div className="relative w-full h-screen bg-gray-50 overflow-hidden font-sans select-none flex flex-col">
      
      {/* 3D Scene Background */}
      <RoadScene lightState={lightState} mode={mode} isRunning={isRunning} />

      {/* UI Overlay */}
      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        
        {/* Top Controls Area */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-auto z-20">
            
            {/* Top Left: Game Controls */}
            <div className="flex gap-2">
                <button 
                    onClick={() => setIsRunning(!isRunning)}
                    className={`font-black text-lg py-3 px-6 rounded-2xl shadow-lg border-b-4 transition-all hover:scale-105 active:scale-95 active:border-b-0 active:translate-y-1 ${
                        isRunning 
                        ? 'bg-orange-400 border-orange-600 text-white hover:bg-orange-500' 
                        : 'bg-green-500 border-green-700 text-white hover:bg-green-600'
                    }`}
                >
                    {isRunning ? '⏸ PAUSE' : '▶ GO!'}
                </button>

                <button 
                    onClick={reset}
                    className="bg-gray-100 border-b-4 border-gray-300 text-gray-600 font-bold text-lg py-3 px-6 rounded-2xl shadow-md transition-all hover:bg-gray-200 active:scale-95 active:border-b-0 active:translate-y-1"
                >
                    🔄 RESET
                </button>
            </div>

            {/* Top Right: Settings Button */}
            {!showSettings && (
                <button 
                  onClick={handleOpenSettings}
                  className="bg-white/80 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg border-2 border-gray-200 hover:border-indigo-300 transition-all hover:rotate-90 active:scale-95"
                >
                  <span className="text-3xl">⚙️</span>
                </button>
            )}
        </div>

        {/* Main Center Area with Traffic Light */}
        <div className="flex-1 flex items-center justify-center pointer-events-auto mt-10">
          <TrafficLight 
            state={lightState} 
            timeLeft={timer} 
            orientation={orientation}
            hideTimer={shouldHideTimer}
          />
        </div>

        {/* Settings/Controls Overlay */}
        {showSettings && (
          <div className="absolute inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto">
             <Controls 
               redDuration={userRedSetting} 
               setRedDuration={setUserRedSetting}
               greenDuration={userGreenSetting}
               setGreenDuration={setUserGreenSetting}
               patienceDuration={patienceDuration}
               setPatienceDuration={setPatienceDuration}
               isRunning={isRunning}
               setIsRunning={setIsRunning}
               gameLevel={gameLevel}
               setGameLevel={setGameLevel}
               orientation={orientation}
               setOrientation={setOrientation}
               onClose={() => setShowSettings(false)}
             />
          </div>
        )}

      </div>
    </div>
  );
};

export default App;