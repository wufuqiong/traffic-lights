import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TrafficLight } from './components/TrafficLight';
import { Controls, DEFAULT_DURATION, PATIENCE_MAX_DURATION } from './components/Controls';
import { RoadScene } from './components/RoadScene';
import { LightState, Mode, GameLevel, Orientation } from './types';

const YELLOW_DURATION = 3;

const App: React.FC = () => {
  // Game Configuration State
  const [gameLevel, setGameLevel] = useState<GameLevel>(GameLevel.CAR_NORMAL);
  const [orientation, setOrientation] = useState<Orientation>('vertical');
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // User Preferences
  const [userRedSetting, setUserRedSetting] = useState<number>(DEFAULT_DURATION);
  const [userGreenSetting, setUserGreenSetting] = useState<number>(DEFAULT_DURATION);
  const [patienceDuration, setPatienceDuration] = useState<number>(PATIENCE_MAX_DURATION);

  // Simulation State
  const [lightState, setLightState] = useState<LightState>(LightState.RED);
  const [timer, setTimer] = useState<number>(DEFAULT_DURATION);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIdRef = useRef<number | null>(null);
  const prevConfigRef = useRef({
    userRedSetting,
    userGreenSetting,
    patienceDuration,
    gameLevel,
    orientation
  });

  // Derived State
  const mode = gameLevel === GameLevel.WALKER_NORMAL ? Mode.WALK : Mode.CAR;
  
  // Logic to hide timer in Patience Level
  const shouldHideTimer = gameLevel === GameLevel.LONG_WAIT && lightState === LightState.RED && timer > DEFAULT_DURATION;

  // Auto-reset when configuration changes
  useEffect(() => {
    const currentConfig = {
      userRedSetting,
      userGreenSetting,
      patienceDuration,
      gameLevel,
      orientation
    };

    // Check if any configuration has changed
    const hasConfigChanged = 
      prevConfigRef.current.userRedSetting !== currentConfig.userRedSetting ||
      prevConfigRef.current.userGreenSetting !== currentConfig.userGreenSetting ||
      prevConfigRef.current.patienceDuration !== currentConfig.patienceDuration ||
      prevConfigRef.current.gameLevel !== currentConfig.gameLevel ||
      prevConfigRef.current.orientation !== currentConfig.orientation;

    if (hasConfigChanged) {
      console.log('Configuration changed, auto-resetting simulation');
      
      // Pause the simulation
      setIsRunning(false);
      
      // Reset to red light
      setLightState(LightState.RED);
      
      // Set timer based on current level
      if (gameLevel === GameLevel.LONG_WAIT) {
        setTimer(patienceDuration);
      } else {
        setTimer(userRedSetting);
      }
      
      // Update previous config
      prevConfigRef.current = currentConfig;
    }
  }, [userRedSetting, userGreenSetting, patienceDuration, gameLevel, orientation]);

  const handleStateTransition = useCallback(() => {
    console.log('State transition triggered, current state:', lightState);
    
    setLightState((prevState) => {
      let newTimer = 0;
      
      switch (prevState) {
        case LightState.RED:
          newTimer = userGreenSetting;
          console.log('Red -> Green, timer:', newTimer);
          setTimer(newTimer);
          return LightState.GREEN;
          
        case LightState.GREEN:
          newTimer = YELLOW_DURATION;
          console.log('Green -> Yellow, timer:', newTimer);
          setTimer(newTimer);
          return LightState.YELLOW;
          
        case LightState.YELLOW:
          newTimer = gameLevel === GameLevel.LONG_WAIT ? patienceDuration : userRedSetting;
          console.log('Yellow -> Red, timer:', newTimer);
          setTimer(newTimer);
          return LightState.RED;
          
        default:
          newTimer = userRedSetting;
          console.log('Default -> Red, timer:', newTimer);
          setTimer(newTimer);
          return LightState.RED;
      }
    });
  }, [userRedSetting, userGreenSetting, patienceDuration, gameLevel, lightState]);

  // Main Timer Logic
  useEffect(() => {
    console.log('Timer effect, isRunning:', isRunning, 'current timer:', timer);
    
    if (!isRunning) {
      if (timerIntervalRef.current) {
        console.log('Clearing interval - not running');
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
      timerIntervalRef.current = null;
    }

    // Start new timer
    timerIntervalRef.current = setInterval(() => {
      console.log('Timer tick, current timer:', timer);
      
      setTimer((prevTimer) => {
        console.log('prevTimer:', prevTimer);
        
        if (prevTimer <= 1) {
          // Schedule state transition in next tick
          console.log('Timer <= 1, scheduling state transition');
          setTimeout(() => {
            handleStateTransition();
          }, 0);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => {
      console.log('Cleaning up timer interval');
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isRunning, handleStateTransition, timer]);

  const reset = () => {
    console.log('Reset called');
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
    console.log('Opening settings');
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
                    onClick={() => {
                      console.log('Toggle running, current:', isRunning);
                      setIsRunning(!isRunning);
                    }}
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