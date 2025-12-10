import React, { useEffect, useState, useRef } from 'react';
import { LightState, Mode } from '../types';

interface RoadSceneProps {
  lightState: LightState;
  mode: Mode;
  isRunning: boolean;
}

interface Entity {
  id: number;
  x: number; // Percentage 0-100+
  speed: number;
  type: Mode;
  color: string;
}

const STOP_LINE_X = 40; // Percentage position of stop line
const CAR_GAP = 15; // Minimum distance between cars
const SPAWN_RATE_MS = 2500;

export const RoadScene: React.FC<RoadSceneProps> = ({ lightState, mode, isRunning }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Sky Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 to-sky-100 h-2/3" />
      
      {/* Scenery Elements */}
      <Scenery isRunning={isRunning} />

      {/* Ground/Grass */}
      <div className="absolute bottom-0 w-full h-1/3 bg-green-300 border-t-4 border-green-600" />

      {/* Road */}
      <div className="absolute bottom-10 w-full h-32 bg-gray-700 flex items-center justify-center border-y-4 border-gray-800 shadow-inner overflow-hidden">
        
        {mode === Mode.CAR ? (
          <>
            {/* Road Markings for Cars */}
            <div className="w-full h-full road-texture opacity-80" />
            
            {/* Stop Line */}
            <div 
                className="absolute h-full w-4 bg-white opacity-90" 
                style={{ left: `${STOP_LINE_X}%` }}
            >
                <div className="w-full h-full border-r-2 border-dashed border-gray-400 opacity-50"></div>
            </div>
            
            {/* Stop Text on Road */}
            <div className="absolute text-white/40 font-bold text-4xl transform -scale-x-100 rotate-90 tracking-widest" style={{ left: `${STOP_LINE_X - 8}%` }}>
                STOP
            </div>
          </>
        ) : (
          <>
            {/* Crosswalk for Walkers - Zebra Crossing Pattern */}
            <div 
                className="absolute inset-y-0 flex justify-between items-center opacity-90" 
                style={{ left: `${STOP_LINE_X}%`, width: '35%' }}
            >
               {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-full w-[10%] bg-white transform -skew-x-12 shadow-sm" />
               ))}
            </div>
            
            {/* Curb Line (Start of crossing) */}
            <div className="absolute h-full w-2 border-l-4 border-yellow-500 border-dotted opacity-60" style={{ left: `${STOP_LINE_X}%` }} />
          </>
        )}

      </div>

      {/* Traffic System */}
      <div className="absolute bottom-16 w-full h-24 flex items-end">
         <TrafficController lightState={lightState} mode={mode} isRunning={isRunning} />
      </div>
    </div>
  );
};

const Scenery = ({ isRunning }: { isRunning: boolean }) => {
    return (
        <>
            <div className={`absolute top-10 left-10 text-6xl opacity-80 ${isRunning ? 'animate-bounce-slow' : ''}`}>☁️</div>
            <div className={`absolute top-20 right-20 text-6xl opacity-60 ${isRunning ? 'animate-bounce-slow' : ''}`} style={{ animationDelay: '1s' }}>☁️</div>
            <div className="absolute bottom-[33%] left-20 text-4xl">🌳</div>
            <div className="absolute bottom-[33%] right-40 text-5xl">🌲</div>
        </>
    )
}

const TrafficController: React.FC<{ lightState: LightState; mode: Mode; isRunning: boolean }> = ({ lightState, mode, isRunning }) => {
    const [entities, setEntities] = useState<Entity[]>([]);
    const nextId = useRef(0);
    const lastSpawnTime = useRef(0);
    const animationFrameRef = useRef<number>(0);

    // Reset traffic when mode changes
    useEffect(() => {
        setEntities([]);
    }, [mode]);

    useEffect(() => {
        if (!isRunning) {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            return;
        }

        const updateLoop = (timestamp: number) => {
            // 1. Spawning Logic
            if (timestamp - lastSpawnTime.current > SPAWN_RATE_MS) {
                // Only spawn if the entrance is clear (last car is far enough)
                const lastEntity = entities[entities.length - 1];
                if (!lastEntity || lastEntity.x > -5) {
                    const newEntity: Entity = {
                        id: nextId.current++,
                        x: -20, // Start off-screen left
                        speed: 0,
                        type: mode,
                        color: getRandomColor()
                    };
                    setEntities(prev => [...prev, newEntity]);
                    lastSpawnTime.current = timestamp;
                }
            }

            // 2. Movement & Queuing Logic
            setEntities(prevEntities => {
                // Process from rightmost (closest to exit) to leftmost (newest)
                // We map then sort back if needed, but array order implies spawn order (newest last).
                // Actually, iterating standard array: index 0 is oldest (furthest right usually).
                
                return prevEntities.map((entity, index) => {
                    // Find target limit
                    let limitX = 200; // Default: drive off screen

                    // Rule 1: Traffic Light Limit
                    // Only applies if the entity is BEFORE the stop line.
                    // If they already crossed it (x > STOP_LINE_X), they ignore the light.
                    if (lightState === LightState.RED || lightState === LightState.YELLOW) {
                        if (entity.x < STOP_LINE_X) {
                            // Stop slightly before the line
                            limitX = STOP_LINE_X - 6; 
                        }
                    }

                    // Rule 2: Car Ahead Limit
                    if (index > 0) {
                        const carAhead = prevEntities[index - 1];
                        const trafficLimit = carAhead.x - CAR_GAP;
                        limitX = Math.min(limitX, trafficLimit);
                    }

                    // Physics: Move towards limit
                    let newSpeed = entity.speed;
                    const distToLimit = limitX - entity.x;

                    if (distToLimit > 2) {
                        // Clear road ahead, accelerate
                        newSpeed = Math.min(newSpeed + 0.02, 0.4); 
                    } else if (distToLimit > 0.1) {
                        // Getting close, slow down smoothly
                        newSpeed = distToLimit * 0.05;
                    } else {
                        // Stopped
                        newSpeed = 0;
                    }

                    // Update Position
                    let newX = entity.x + newSpeed;

                    return { ...entity, x: newX, speed: newSpeed };
                }).filter(e => e.x < 120); // Remove entities that drove off screen
            });

            animationFrameRef.current = requestAnimationFrame(updateLoop);
        };

        animationFrameRef.current = requestAnimationFrame(updateLoop);
        return () => cancelAnimationFrame(animationFrameRef.current);
    }, [isRunning, lightState, mode, entities.length]); // Dependencies for effect recreation

    return (
        <>
            {entities.map(entity => (
                <div 
                    key={entity.id}
                    className="absolute text-7xl transition-transform will-change-transform"
                    style={{ 
                        left: `${entity.x}%`,
                        // Flip car to face right. Add a little bounce if moving fast.
                        transform: `scaleX(-1) translateY(${entity.speed > 0.1 ? (Date.now() % 200 > 100 ? -2 : 0) : 0}px)`,
                        filter: entity.type === Mode.CAR ? `hue-rotate(${entity.color})` : 'none'
                    }}
                >
                    {entity.type === Mode.CAR ? '🚗' : '🚶'}
                </div>
            ))}
        </>
    );
};

const getRandomColor = () => {
    const colors = ['0deg', '45deg', '90deg', '180deg', '220deg', '300deg'];
    return colors[Math.floor(Math.random() * colors.length)];
}