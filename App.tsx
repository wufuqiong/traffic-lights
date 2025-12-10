import React, { useState, useEffect, useRef } from 'react';
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

  // Derived State
  const mode = gameLevel === GameLevel.WALKER_NORMAL ? Mode.WALK : Mode.CAR;
  
  // Logic to hide timer in Patience Level (Only applies to Red light)
  const shouldHideTimer = gameLevel === GameLevel.LONG_WAIT && lightState === LightState.RED && timer > 15;

  // Initialize and Handle Game Level Changes
  useEffect(() => {
    // Stop and Reset logic whenever level or settings change while not running
    if (!isRunning) {
        setLightState(LightState.RED);
        
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

  // Main Timer Logic
  useEffect(() => {
    if (!isRunning) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          handleStateTransition();
          return 0; // Temporary 0 before state switch
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, lightState, userRedSetting, userGreenSetting, patienceDuration, gameLevel]); 

  const handleStateTransition = () => {
    setLightState((prevState) => {
      switch (prevState) {
        case LightState.RED:
          // Red -> Green
          setTimer(userGreenSetting);
          return LightState.GREEN;
          
        case LightState.GREEN:
          // Green -> Yellow
          setTimer(YELLOW_DURATION);
          return LightState.YELLOW;
          
        case LightState.YELLOW:
          // Yellow -> Red
          let nextRedDuration = userRedSetting;
          if (gameLevel === GameLevel.LONG_WAIT) {
             nextRedDuration = patienceDuration;
          }
          setTimer(nextRedDuration);
          return LightState.RED;
          
        default:
          return LightState.RED;
      }
    });
  };

  const reset = () => {
    setIsRunning(false);
    setLightState(LightState.RED);
    
    // Reset timer based on current level logic
    if (gameLevel === GameLevel.LONG_WAIT) {
        setTimer(patienceDuration);
    } else {
        setTimer(userRedSetting);
    }
  };

  const handleOpenSettings = () => {
    // Pause the simulation first, then open settings
    setIsRunning(false);
    setShowSettings(true);
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

            {/* Top Right: Settings Button (Only visible if settings are closed) */}
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