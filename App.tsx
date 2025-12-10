import React, { useState, useEffect, useRef } from 'react';
import { TrafficLight } from './components/TrafficLight';
import { Controls } from './components/Controls';
import { RoadScene } from './components/RoadScene';
import { LightState, Mode, GameLevel, Orientation } from './types';
import { generateSafetyTip } from './services/geminiService';

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
  const [safetyTip, setSafetyTip] = useState<string>("");
  const [showTip, setShowTip] = useState<boolean>(false);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Derived State
  const mode = gameLevel === GameLevel.WALKER_NORMAL ? Mode.WALK : Mode.CAR;
  
  // Logic to hide timer in Patience Level
  const shouldHideTimer = gameLevel === GameLevel.LONG_WAIT && lightState === LightState.RED && timer > 15;

  // Initialize and Handle Game Level Changes
  useEffect(() => {
    // Stop and Reset logic whenever level or settings change while not running
    if (!isRunning) {
        setLightState(LightState.RED);
        
        if (gameLevel === GameLevel.LONG_WAIT) {
            setTimer(patienceDuration);
            setSafetyTip("Patience is a virtue! Wait for the signal.");
        } else {
            setTimer(userRedSetting);
            setSafetyTip(gameLevel === GameLevel.CAR_NORMAL ? "Ready to drive?" : "Ready to walk?");
        }
        setShowTip(true);
    }
  }, [gameLevel, userRedSetting, patienceDuration, isRunning]);

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
          setShowTip(false); 
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
          fetchTip(); 
          return LightState.RED;
          
        default:
          return LightState.RED;
      }
    });
  };

  const fetchTip = async () => {
    setShowTip(true);
    setSafetyTip("Thinking...");
    const tip = await generateSafetyTip();
    setSafetyTip(tip);
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
    
    setShowTip(true);
    setSafetyTip("Ready to start?");
  };

  return (
    <div className="relative w-full h-screen bg-gray-50 overflow-hidden font-sans select-none flex flex-col">
      
      {/* 3D Scene Background */}
      <RoadScene lightState={lightState} mode={mode} isRunning={isRunning} />

      {/* UI Overlay */}
      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        
        {/* Top Controls Area */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-auto z-20">
            
            {/* Top Left: Start Button */}
            {!isRunning && !showSettings ? (
                <button 
                onClick={() => setIsRunning(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-black text-xl py-3 px-8 rounded-full shadow-[0_4px_10px_rgba(34,197,94,0.4)] border-4 border-green-400 hover:scale-105 transition-transform active:scale-95 animate-bounce-slow"
                >
                GO! 🚦
                </button>
            ) : (
                <div className="w-20"></div> // Spacer to keep layout balanced if button hidden
            )}

            {/* Top Right: Settings Button (Only visible if settings are closed) */}
            {!showSettings && (
                <button 
                onClick={() => setShowSettings(true)}
                className="bg-white/80 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg border-2 border-gray-200 hover:border-indigo-300 transition-all hover:rotate-90 active:scale-95"
                >
                <span className="text-3xl">⚙️</span>
                </button>
            )}
        </div>

        {/* Tip Bubble (Centered below top bar or responsive placement) */}
        <div className="absolute top-20 left-0 right-0 flex justify-center pointer-events-none z-10 px-4">
             <div className={`transition-all duration-500 transform ${showTip ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                {showTip && (
                <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-3xl shadow-lg border-2 border-indigo-200 animate-bounce-slow max-w-lg flex items-center gap-3">
                    <span className="text-3xl">💡</span>
                    <span className="text-gray-700 font-bold text-lg md:text-xl leading-snug">{safetyTip}</span>
                </div>
                )}
            </div>
        </div>

        {/* Main Center Area with Traffic Light */}
        <div className="flex-1 flex items-center justify-center pointer-events-auto mt-10">
          <TrafficLight 
            state={lightState} 
            timeLeft={lightState === LightState.RED ? timer : undefined} 
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
               reset={reset}
               onClose={() => setShowSettings(false)}
             />
          </div>
        )}

      </div>
    </div>
  );
};

export default App;