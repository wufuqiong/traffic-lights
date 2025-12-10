import React, { useMemo } from 'react';

export const Scenery = ({ isRunning }: { isRunning: boolean }) => {
    // Building icons
    const BUILDINGS = useMemo(() => [
        { emoji: '🏢', size: 8, left: 5, bottom: 33 },  // Office building
        { emoji: '🏨', size: 7, left: 12, bottom: 33 }, // Hotel
        { emoji: '🏪', size: 5, left: 20, bottom: 33 }, // Convenience store
        { emoji: '🏬', size: 9, right: 5, bottom: 33 },  // Department store
        { emoji: '🏥', size: 8, right: 15, bottom: 33 }, // Hospital
        { emoji: '🏫', size: 7, right: 25, bottom: 33 }, // School
        { emoji: '🏠', size: 5, left: 2, bottom: 33 },   // House
        { emoji: '🏭', size: 6, right: 35, bottom: 33 }, // Factory
        { emoji: '🏛️', size: 6, left: 30, bottom: 33 },  // Classical building
        { emoji: '⛪', size: 5, right: 45, bottom: 33 }, // Church
        { emoji: '🕌', size: 5, left: 35, bottom: 33 },  // Mosque
        { emoji: '🕍', size: 4, right: 55, bottom: 33 }, // Synagogue
        { emoji: '🛕', size: 4, left: 45, bottom: 33 },  // Hindu temple
    ], []);

    // Tree icons
    const TREES = useMemo(() => [
        { emoji: '🌳', size: 6, left: 8, bottom: 33, z: 10 },   // Deciduous tree
        { emoji: '🌲', size: 5, right: 8, bottom: 33, z: 10 },  // Evergreen tree
        { emoji: '🌴', size: 7, left: 15, bottom: 33, z: 10 },  // Palm tree
        { emoji: '🎄', size: 4, right: 20, bottom: 33, z: 10 }, // Christmas tree
        { emoji: '🎋', size: 3, left: 25, bottom: 33, z: 10 },  // Tanabata tree
        { emoji: '🌵', size: 3, right: 30, bottom: 33, z: 10 }, // Cactus
        { emoji: '🎍', size: 3, left: 50, bottom: 33, z: 10 },  // Pine decoration
        { emoji: '🪵', size: 2, right: 60, bottom: 33, z: 10 }, // Wood
        { emoji: '🌱', size: 2, left: 70, bottom: 33, z: 10 },  // Seedling
        { emoji: '🌿', size: 2, right: 70, bottom: 33, z: 10 }, // Herb
        { emoji: '🍀', size: 1.5, left: 85, bottom: 33, z: 20 }, // Four leaf clover
    ], []);

    // Flower icons
    const FLOWERS = useMemo(() => [
        { emoji: '🌷', size: 2, left: 10, bottom: 33, z: 20 },  // Tulip
        { emoji: '🌹', size: 2, right: 12, bottom: 33, z: 20 },  // Rose
        { emoji: '🥀', size: 2, left: 18, bottom: 33, z: 20 },  // Wilted flower
        { emoji: '🌸', size: 2, right: 18, bottom: 33, z: 20 },  // Cherry blossom
        { emoji: '🌺', size: 2.5, left: 22, bottom: 33, z: 20 }, // Hibiscus
        { emoji: '🌻', size: 2.5, right: 22, bottom: 33, z: 20 }, // Sunflower
        { emoji: '🏵️', size: 2, left: 28, bottom: 33, z: 20 },  // Rosette
        { emoji: '🌼', size: 2, right: 28, bottom: 33, z: 20 },  // Blossom
        { emoji: '💐', size: 2, left: 40, bottom: 33, z: 20 },  // Bouquet
        { emoji: '🪷', size: 2.5, right: 40, bottom: 33, z: 20 }, // Lotus
        { emoji: '🪻', size: 2, left: 48, bottom: 33, z: 20 },  // Hyacinth
    ], []);

    // Roadside objects
    const ROADSIDE_ITEMS = useMemo(() => [
        { emoji: '🚲', size: 2, left: 80, bottom: 33, z: 20 },   // Bicycle
        { emoji: '🛵', size: 2, right: 80, bottom: 33, z: 20 }, // Motor scooter
    ], []);

    // Animals
    const ANIMALS = useMemo(() => [
        { emoji: '🐶', size: 2, left: 32, bottom: 33, z: 30 },  // Dog
        { emoji: '🐱', size: 2, right: 32, bottom: 33, z: 30 },  // Cat
        { emoji: '🐦', size: 1.5, left: 36, bottom: 40, z: 5 },  // Bird
        { emoji: '🦆', size: 1.5, right: 36, bottom: 40, z: 5 }, // Duck
        { emoji: '🐿️', size: 1.5, left: 44, bottom: 33, z: 30 }, // Chipmunk
        { emoji: '🦊', size: 2, right: 44, bottom: 33, z: 30 },  // Fox
        { emoji: '🐇', size: 1.5, left: 56, bottom: 33, z: 30 },  // Rabbit
        { emoji: '🐿️', size: 1.5, right: 56, bottom: 33, z: 30 }, // Squirrel
    ], []);

    // Sky elements
    const SKY_ELEMENTS = useMemo(() => [
        { emoji: '☀️', size: 5, right: 5, top: 5, z: 1 },  // Sun
        { emoji: '☁️', size: 5, left: 10, top: 10, z: 2 },
        { emoji: '☁️', size: 4, left: 30, top: 5, z: 2},
    ], []);

    // Birds
    const BIRDS = useMemo(() => [
        { emoji: '🕊️', size: 1.5, left: 25, top: 18, z: 3, delay: 300 },
        { emoji: '🦅', size: 1.8, right: 15, top: 16, z: 3, delay: 200 },
    ], []);

    return (
        <>
            {/* Sky elements */}
            {SKY_ELEMENTS.map((element, index) => (
                <div
                    key={`sky-${index}`}
                    className="absolute opacity-80"
                    style={{
                        fontSize: `${element.size}rem`,
                        left: element.left !== undefined ? `${element.left}%` : undefined,
                        right: element.right !== undefined ? `${element.right}%` : undefined,
                        top: `${element.top}%`,
                        zIndex: element.z || 1,
                        opacity: element.opacity || 1,
                        animation: element.animate && isRunning ? 'float 20s infinite alternate ease-in-out' : 'none',
                        animationDelay: element.delay ? `${element.delay}ms` : undefined,
                    }}
                >
                    {element.emoji}
                </div>
            ))}

            {/* Birds */}
            {BIRDS.map((bird, index) => (
                <div
                    key={`bird-${index}`}
                    className="absolute"
                    style={{
                        fontSize: `${bird.size}rem`,
                        left: bird.left !== undefined ? `${bird.left}%` : undefined,
                        right: bird.right !== undefined ? `${bird.right}%` : undefined,
                        top: `${bird.top}%`,
                        zIndex: bird.z || 3,
                        animation: bird.animate && isRunning ? 'fly 15s infinite linear' : 'none',
                        animationDelay: `${bird.delay}ms`,
                    }}
                >
                    {bird.emoji}
                </div>
            ))}

            {/* Buildings */}
            {BUILDINGS.map((building, index) => (
                <div
                    key={`building-${index}`}
                    className="absolute"
                    style={{
                        fontSize: `${building.size}rem`,
                        left: building.left !== undefined ? `${building.left}%` : undefined,
                        right: building.right !== undefined ? `${building.right}%` : undefined,
                        bottom: `${building.bottom}%`,
                        zIndex: 5,
                        filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))',
                    }}
                >
                    {building.emoji}
                </div>
            ))}

            {/* Trees */}
            {TREES.map((tree, index) => (
                <div
                    key={`tree-${index}`}
                    className="absolute"
                    style={{
                        fontSize: `${tree.size}rem`,
                        left: tree.left !== undefined ? `${tree.left}%` : undefined,
                        right: tree.right !== undefined ? `${tree.right}%` : undefined,
                        bottom: `${tree.bottom}%`,
                        zIndex: tree.z || 10,
                        filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.2))',
                        animation: isRunning ? 'sway 8s infinite alternate ease-in-out' : 'none',
                        animationDelay: `${index * 200}ms`,
                    }}
                >
                    {tree.emoji}
                </div>
            ))}

            {/* Flowers */}
            {FLOWERS.map((flower, index) => (
                <div
                    key={`flower-${index}`}
                    className="absolute"
                    style={{
                        fontSize: `${flower.size}rem`,
                        left: flower.left !== undefined ? `${flower.left}%` : undefined,
                        right: flower.right !== undefined ? `${flower.right}%` : undefined,
                        bottom: `${flower.bottom}%`,
                        zIndex: flower.z || 20,
                        animation: isRunning ? 'flowerSway 5s infinite alternate ease-in-out' : 'none',
                        animationDelay: `${index * 100}ms`,
                    }}
                >
                    {flower.emoji}
                </div>
            ))}

            {/* Roadside items */}
            {ROADSIDE_ITEMS.map((item, index) => (
                <div
                    key={`roadside-${index}`}
                    className="absolute"
                    style={{
                        fontSize: `${item.size}rem`,
                        left: item.left !== undefined ? `${item.left}%` : undefined,
                        right: item.right !== undefined ? `${item.right}%` : undefined,
                        bottom: `${item.bottom}%`,
                        zIndex: item.z || 20,
                        filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.1))',
                    }}
                >
                    {item.emoji}
                </div>
            ))}

            {/* Animals */}
            {ANIMALS.map((animal, index) => (
                <div
                    key={`animal-${index}`}
                    className="absolute"
                    style={{
                        fontSize: `${animal.size}rem`,
                        left: animal.left !== undefined ? `${animal.left}%` : undefined,
                        right: animal.right !== undefined ? `${animal.right}%` : undefined,
                        bottom: `${animal.bottom}%`,
                        zIndex: animal.z || 30,
                        animation: isRunning ? 'animalMove 10s infinite alternate ease-in-out' : 'none',
                        animationDelay: `${index * 500}ms`,
                    }}
                >
                    {animal.emoji}
                </div>
            ))}

            {/* Additional decorative elements */}
            <div className="absolute left-1/4 top-1/2 text-3xl opacity-20" style={{ zIndex: 1 }}>🌁</div>
            <div className="absolute right-1/4 top-1/3 text-2xl opacity-20" style={{ zIndex: 1 }}>🏔️</div>
            <div className="absolute left-1/3 top-2/3 text-2xl opacity-15" style={{ zIndex: 1 }}>⛰️</div>
            <div className="absolute right-1/3 bottom-1/4 text-3xl opacity-15" style={{ zIndex: 1 }}>🗻</div>

            {/* CSS Animations */}
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px) translateX(0px); }
                    25% { transform: translateY(-5px) translateX(5px); }
                    50% { transform: translateY(0px) translateX(10px); }
                    75% { transform: translateY(5px) translateX(5px); }
                    100% { transform: translateY(0px) translateX(0px); }
                }
                
                @keyframes fly {
                    0% { transform: translateX(0px) translateY(0px); }
                    25% { transform: translateX(20px) translateY(-5px); }
                    50% { transform: translateX(40px) translateY(0px); }
                    75% { transform: translateX(20px) translateY(5px); }
                    100% { transform: translateX(0px) translateY(0px); }
                }
                
                @keyframes sway {
                    0% { transform: translateY(0px) rotate(0deg); }
                    25% { transform: translateY(-2px) rotate(1deg); }
                    50% { transform: translateY(0px) rotate(0deg); }
                    75% { transform: translateY(-2px) rotate(-1deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                
                @keyframes flowerSway {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-1px) rotate(2deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                
                @keyframes animalMove {
                    0% { transform: translateX(0px) translateY(0px); }
                    33% { transform: translateX(5px) translateY(-2px); }
                    66% { transform: translateX(-5px) translateY(2px); }
                    100% { transform: translateX(0px) translateY(0px); }
                }
            `}</style>
        </>
    );
};
