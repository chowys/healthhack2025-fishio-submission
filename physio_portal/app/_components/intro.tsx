// import Image from "next/image";
import Waves from './wavesBg';

export function Intro() {
  return (
    <section className="mt-5 mb-5 md:mb-12 w-[100vw] h-[70vh] md:h-[100vh]">
      <div className="w-full h-full relative flex justify-center items-center overflow-hidden">
        <div className="w-full h-full relative overflow-hidden">
          {/* <Image
            alt="hero"
            src="/assets/media/background/bg_1.png"
            layout="fill"
            objectFit="contain"
            objectPosition="75% center"
            className="w-full h-full object-cover rounded-lg"/> */}
          <Waves
            lineColor="#fff"
            backgroundColor="rgba(113, 199, 110, 0.2)"
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
        <div className="w-full md:w-[75%] h-full absolute top-0 left-0 flex justify-center items-start p-4">
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-tight md:pr-8 p-8 ">
            Match the best Physios for your needs.
          </h1>
        </div>
      </div>
    </section>
  );
}
