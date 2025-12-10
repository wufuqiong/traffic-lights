import React, { useEffect, useState, useRef } from 'react';
import { LightState, Mode } from '../types';

import { Scenery } from './Scenery';

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
  icon: string; // Store the specific icon
  size: number; // Vary the size
  yOffset: number; // For variation in vertical placement
  flip: boolean; // Whether to flip the emoji horizontally
}

const STOP_LINE_X = 40; // Percentage position of stop line
const CAR_GAP = 15; // Minimum distance between cars
const SPAWN_RATE_MS = 2500;

// Road vehicle icons (with indication of which need flipping)
const ROAD_VEHICLE_ICONS = [
  { icon: '🚗', flip: true },  // Car facing left, need to flip
  { icon: '🚕', flip: true },  // Taxi facing left, need to flip
  { icon: '🚙', flip: true },  // SUV facing left, need to flip
  { icon: '🚌', flip: true },  // Bus facing left, need to flip
  { icon: '🚎', flip: true },  // Trolleybus facing left, need to flip
  { icon: '🚓', flip: true },  // Police car facing left, need to flip
  { icon: '🚑', flip: true },  // Ambulance facing left, need to flip
  { icon: '🚒', flip: true },  // Fire engine facing left, need to flip
  { icon: '🚐', flip: true },  // Minibus facing left, need to flip
  { icon: '🚚', flip: true },  // Truck facing left, need to flip
  { icon: '🚛', flip: true },  // Articulated lorry facing left, need to flip
  { icon: '🛵', flip: false },  // Motor scooter (rider facing forward)
  { icon: '🛺', flip: false },  // Auto rickshaw (facing right)
];

// People icons (with indication of which need flipping)
const PEOPLE_ICONS = [
  { icon: '🚶‍♂️', flip: true },  // Man walking facing left
  { icon: '🚶‍♀️', flip: true },  // Woman walking facing left
  { icon: '🏃‍♂️', flip: true },  // Man running facing left
  { icon: '🏃‍♀️', flip: true },  // Woman running facing left
  { icon: '🚴‍♂️', flip: true },  // Man biking facing left
  { icon: '🚴‍♀️', flip: true },  // Woman biking facing left
  { icon: '🚶', flip: true },   // Person walking facing left
  { icon: '🏃', flip: true },   // Person running facing left
  { icon: '🚴', flip: true },   // Person biking facing left
];

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

const TrafficController: React.FC<{ lightState: LightState; mode: Mode; isRunning: boolean }> = ({ lightState, mode, isRunning }) => {
    const [entities, setEntities] = useState<Entity[]>([]);
    const nextId = useRef(0);
    const lastSpawnTime = useRef(0);
    const animationFrameRef = useRef<number>(0);

    const getRandomIcon = (type: Mode): { icon: string; flip: boolean } => {
        if (type === Mode.CAR) {
            return ROAD_VEHICLE_ICONS[Math.floor(Math.random() * ROAD_VEHICLE_ICONS.length)];
        } else {
            return PEOPLE_ICONS[Math.floor(Math.random() * PEOPLE_ICONS.length)];
        }
    };

    const getRandomSize = (type: Mode): number => {
        if (type === Mode.CAR) {
            return 4.5 + Math.random() * 1.5; // Vehicles: 4.5-6rem
        } else {
            return 3.5 + Math.random() * 1.5; // People: 3.5-5rem
        }
    };

    const getRandomYOffset = (type: Mode): number => {
        if (type === Mode.CAR) {
            return Math.random() * 5 - 2.5; // -2.5 to 2.5 for vehicles
        } else {
            return Math.random() * 3 - 1.5; // -1.5 to 1.5 for people
        }
    };

    const getRandomColor = (type: Mode): string => {
        if (type === Mode.CAR) {
            const hueRotations = [
                '0deg', '20deg', '40deg', '60deg', '80deg', 
                '100deg', '120deg', '140deg', '160deg', '180deg',
                '200deg', '220deg', '240deg', '260deg', '280deg',
                '300deg', '320deg', '340deg'
            ];
            return hueRotations[Math.floor(Math.random() * hueRotations.length)];
        } else {
            // People get subtle color variations
            const saturations = ['100%', '110%', '90%', '80%'];
            return saturations[Math.floor(Math.random() * saturations.length)];
        }
    };

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
                const lastEntity = entities[entities.length - 1];
                if (!lastEntity || lastEntity.x > -5) {
                    const randomIcon = getRandomIcon(mode);
                    const newEntity: Entity = {
                        id: nextId.current++,
                        x: -20, // Start off-screen left
                        speed: 0,
                        type: mode,
                        icon: randomIcon.icon,
                        color: getRandomColor(mode),
                        size: getRandomSize(mode),
                        yOffset: getRandomYOffset(mode),
                        flip: randomIcon.flip
                    };
                    setEntities(prev => [...prev, newEntity]);
                    lastSpawnTime.current = timestamp;
                }
            }

            // 2. Movement & Queuing Logic
            setEntities(prevEntities => {
                return prevEntities.map((entity, index) => {
                    let limitX = 200; // Default: drive off screen

                    // Rule 1: Traffic Light Limit
                    if (lightState === LightState.RED || lightState === LightState.YELLOW) {
                        if (entity.x < STOP_LINE_X) {
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
                        newSpeed = Math.min(newSpeed + 0.02, entity.type === Mode.CAR ? 0.4 : 0.3);
                    } else if (distToLimit > 0.1) {
                        newSpeed = distToLimit * 0.05;
                    } else {
                        newSpeed = 0;
                    }

                    let newX = entity.x + newSpeed;

                    return { ...entity, x: newX, speed: newSpeed };
                }).filter(e => e.x < 120);
            });

            animationFrameRef.current = requestAnimationFrame(updateLoop);
        };

        animationFrameRef.current = requestAnimationFrame(updateLoop);
        return () => cancelAnimationFrame(animationFrameRef.current);
    }, [isRunning, lightState, mode, entities.length]);

    return (
        <>
            {entities.map(entity => (
                <div 
                    key={entity.id}
                    className="absolute transition-transform will-change-transform"
                    style={{ 
                        left: `${entity.x}%`,
                        bottom: `${entity.type === Mode.CAR ? 0 : 4}px`, // People are slightly above road
                        fontSize: `${entity.size}rem`,
                        filter: entity.type === Mode.CAR ? 
                            `hue-rotate(${entity.color})` : 
                            `saturate(${entity.color})`,
                        animation: entity.type === Mode.CAR && entity.speed > 0.1 ? 
                            'carBounce 0.5s infinite alternate' : 
                            entity.type !== Mode.CAR && entity.speed > 0 ? 
                            'walkAnimation 0.5s infinite alternate' : 'none',
                        transform: entity.flip ? 'scaleX(-1)' : 'none',
                        transformOrigin: 'center'
                    }}
                >
                    {entity.icon}
                </div>
            ))}
            
            {/* Add CSS animations */}
            <style>{`
                @keyframes carBounce {
                    0% { transform: translateY(0px) ${entities.find(e => e.flip) ? 'scaleX(-1)' : ''}; }
                    100% { transform: translateY(-2px) ${entities.find(e => e.flip) ? 'scaleX(-1)' : ''}; }
                }
                
                @keyframes walkAnimation {
                    0% { 
                        transform: translateY(0px) rotate(0deg) ${entities.find(e => e.flip) ? 'scaleX(-1)' : ''}; 
                    }
                    25% { 
                        transform: translateY(-2px) rotate(2deg) ${entities.find(e => e.flip) ? 'scaleX(-1)' : ''}; 
                    }
                    50% { 
                        transform: translateY(0px) rotate(0deg) ${entities.find(e => e.flip) ? 'scaleX(-1)' : ''}; 
                    }
                    75% { 
                        transform: translateY(-2px) rotate(-2deg) ${entities.find(e => e.flip) ? 'scaleX(-1)' : ''}; 
                    }
                    100% { 
                        transform: translateY(0px) rotate(0deg) ${entities.find(e => e.flip) ? 'scaleX(-1)' : ''}; 
                    }
                }
            `}</style>
        </>
    );
};