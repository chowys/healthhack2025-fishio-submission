import Image from "next/image";

export function Intro2() {
    return (
        <section className="mt-5 mb-5 md:mb-12 w-[95vw] h-auto">
            <div className="w-full h-auto relative flex flex-col md:flex-row justify-center items-center overflow-hidden">
                <div className="columns-2 gap-4 w-full md:w-3/5 p-4">
                    <div className="w-[95%] ml-auto mb-6">
                        <Image
                            alt="Physio 1"
                            src="/assets/blog/images/physio1.jpg"
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
                            src="/assets/blog/images/physio2.jpg"
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
                            src="/assets/blog/images/physio3.jpg"
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
                            src="/assets/blog/images/physio4.jpg"
                            layout="responsive"
                            objectFit="cover"
                            width={1600}
                            height={900}
                            className="rounded-lg"
                        />
                    </div>
                </div>
                <div className="w-full md:w-2/5 h-full flex items-center justify-center p-4">
                    <h1 className="text-6xl md:text-9xl lg:text-[10rem] font-bold tracking-tighter leading-tight text-right p-8">
                        <span className="text-primary">Hassle-free</span>
                        <br />
                        Physio Search
                    </h1>
                </div>

            </div>
        </section >
    );
}