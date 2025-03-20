import Image from "next/image";
import RotatingText from './landingPage2Text'

export function LandingPage2() {
    return (
        <section className="mt-5 mb-5 md:mb-12 w-[95vw] h-auto">
            <div className="w-full h-auto relative flex flex-col md:flex-row justify-center items-center overflow-hidden">
                <div className="columns-2 gap-4 w-full p-4">
                    <div className="w-[95%] ml-auto mb-6">
                        <Image
                            alt="Physio 1"
                            src="/images/physio1.jpg"
                            layout="responsive"
                            objectFit="cover"
                            width={1600}
                            height={900}
                            className="rounded-lg"
                        />
                    </div>
                    <div className="w-[65%] ml-24">
                        <Image
                            alt="Physio 2"
                            src="/images/physio2.jpg"
                            layout="responsive"
                            objectFit="cover"
                            width={900}
                            height={1600}
                            className="rounded-lg"
                        />
                    </div>
                    <div className="w-[65%] ml-6 mb-6">
                        <Image
                            alt="Physio 3"
                            src="/images/physio3.jpg"
                            layout="responsive"
                            objectFit="cover"
                            width={900}
                            height={1600}
                            className="rounded-lg"
                        />
                    </div>
                    <div className="w-[95%] mr-auto">
                        <Image
                            alt="Physio 4"
                            src="/images/physio4.jpg"
                            layout="responsive"
                            objectFit="cover"
                            width={1600}
                            height={900}
                            className="rounded-lg"
                        />
                    </div>
                </div>
                <div className="w-full md:w-2/5 h-full flex flex-col items-center justify-center p-4">
                    <div className="w-full md:w-2/5 h-full flex flex-col items-center justify-center p-4">
                        <h1 className="text-4xl md:text-4xl lg:text-7xl font-bold tracking-tighter leading-tight text-right p-4">
                            We're Fishio - a
                            <span className="inline-block ml-2">
                                <RotatingText
                                    texts={['All-In-One', 'Seamless']}
                                    mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-1 sm:py-1 md:py-1 justify-center rounded-lg font-bold text-4xl md:text-4xl lg:text-7xl"
                                    staggerFrom={"last"}
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    exit={{ y: "-120%" }}
                                    staggerDuration={0.025}
                                    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                                    rotationInterval={2000}
                                />
                            </span>
                        </h1>
                        <h1 className="text-4xl md:text-4xl lg:text-7xl font-bold text-right">
                            Physio Matching Platform
                        </h1>
                    </div>
                </div>
            </div>
        </section >
    );
}