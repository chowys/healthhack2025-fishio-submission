import Image from "next/image";
import ShinyText from './ShinyText';

export function Intro3() {
    return (
        <div className="min-h-[110vh] bg-gradient-to-br from-primary to-black flex items-start justify-start">
            <div className="w-full md:w-1/2 flex flex-col items-start justify-start p-12">
                <h1 className="text-white text-8xl font-bold leading-tight">
                    <ShinyText text="Recover. Move Better. Feel Stronger." disabled={false} speed={4} className='custom-class' />
                </h1>
                <br />
                <h3 className="mt-20 text-[#b5b5b5a4] text-lg">
                    Recovery and mobility should be simple. With Fishio, finding the right registered physiotherapist is effortless. Whether you're healing from an injury, managing pain, or improving movement, we connect you with experts who understand your needs.
                </h3>
            </div>
            <div className="w-full md:w-1/2 p-24 items-center justify-center">
                <div className="relative w-full h-[80vh]">
                    <Image
                        src="/assets/blog/images/kttape.png"
                        alt="KT Tape"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
}