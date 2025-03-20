'use client';

import Hyperspeed from './hyperSpeedBg';

export function LandingPage3() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#075540] to-black flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
                <p className="mb-1 text-white text-8xl font-bold text-center text-shadow -mt-50">
                    Quick matches, better care!
                </p>
                <p className="mb-1 text-white text-2xl text-center text-shadow max-w-prose mt-10">
                    Finding patients will be faster and more efficient with our platform, leveraging smart matching algorithms to connect physiotherapists with the right patients seamlessly—saving time and improving care outcomes.
                </p>
                <div className="w-3/4 h-[45vh] -mt-10 relative">
                    <Hyperspeed
                        effectOptions={{
                            onSpeedUp: () => { },
                            onSlowDown: () => { },
                            distortion: 'turbulentDistortion',
                            length: 400,
                            roadWidth: 10,
                            islandWidth: 2,
                            lanesPerRoad: 4,
                            fov: 90,
                            fovSpeedUp: 150,
                            speedUp: 2,
                            carLightsFade: 0.4,
                            totalSideLightSticks: 20,
                            lightPairsPerRoadWay: 40,
                            shoulderLinesWidthPercentage: 0.05,
                            brokenLinesWidthPercentage: 0.1,
                            brokenLinesLengthPercentage: 0.5,
                            lightStickWidth: [0.12, 0.5],
                            lightStickHeight: [1.3, 1.7],
                            movingAwaySpeed: [60, 80],
                            movingCloserSpeed: [-120, -160],
                            carLightsLength: [400 * 0.03, 400 * 0.2],
                            carLightsRadius: [0.05, 0.14],
                            carWidthPercentage: [0.3, 0.5],
                            carShiftX: [-0.8, 0.8],
                            carFloorSeparation: [0, 5],
                            colors: {
                                roadColor: 0x080808,
                                islandColor: 0x0a0a0a,
                                background: 0x000000,
                                shoulderLines: 0xFFFFFF,
                                brokenLines: 0xFFFFFF,
                                leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
                                rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
                                sticks: 0x03B3C3,
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
