import GradientText from './GradientText'

export function QuickSignUp() {
    return (
        <div className="min-h-[110vh] bg-white flex items-start justify-start">
            <div className="w-full md:full flex-col items-center justify-center p-12">
                <h1 className="text-black text-9xl font-bold">
                    <GradientText
                        //colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                        colors={["#010203", "#014122", "#018141", "#014122", "#010203"]}
                        animationSpeed={3}
                        showBorder={false}
                        className="custom-class">
                        Kickstart your journey now
                    </GradientText>
                </h1>

                <div className="flex pt-16 w-full">
                    <form action="#" className="flex items-center mt-4 lg:mt-5 space-x-12 w-3/5">
                        <div className="flex-1">
                            <input
                                type="email"
                                name=""
                                id=""
                                placeholder="Enter your email"
                                className="block w-full px-8 py-3 text-base font-normal leading-7 text-white placeholder-white bg-gray-900 border border-white rounded-md focus:ring-gray-900 focus:border-gray-900"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="
                                            inline-flex
                                            w-full
                                            lg:w-auto
                                            items-center
                                            justify-center
                                            px-12
                                            py-3
                                            text-base
                                            font-bold
                                            leading-7
                                            text-white
                                            transition-all
                                            duration-200
                                            bg-gray-900
                                            border border-transparent
                                            rounded-md
                                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900
                                            hover:bg-gray-600
                                            focus:ring-offset-[#FFE942]
                                        "
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}