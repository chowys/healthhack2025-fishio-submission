import Image from "next/image";
import Waves from "./wavesBg";
import Button from "./button";
import Link from "next/link";

export function Landing() {
    return (
        <section>
            <div className="relative bg-transparent sm:pt-12 lg:py-12 xl:py-20 h-[88vh]">
                {/* Waves Background */}
                <div className="absolute inset-0 -z-10 opacity-100">
                    <Waves
                        lineColor="#075540"
                        backgroundColor="rgba(8, 102, 77, 0.78)"
                        waveSpeedX={0.02}
                        waveSpeedY={0.01}
                        waveAmpX={40}
                        waveAmpY={20}
                        friction={0.9}
                        tension={0.01}
                        maxCursorMove={120}
                        xGap={12}
                        yGap={36}
                    />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-start h-screen px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl text-center mt-16">
                    <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white">
                        Match the best certified physios for your needs.
                    </h1>

                    <div className="mt-8 sm:mt-12">
                        <Link href="/physio/find_physio">
                            <Button>Get Started</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
