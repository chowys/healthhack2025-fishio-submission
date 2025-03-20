"use client"

import LandingPageText from "./landingPageText";
import Button from "../button";

const LandingPage = () => {
  return (
    <div className="relative flex justify-center items-center h-screen w-full overflow-hidden bg-black">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="landingPageVid.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

      {/* Text Overlay */}
      <div className="relative z-10 text-white text-center">
        <LandingPageText
          text="Grow Your Practice, Connect with Patients Effortlessly."
          delay={150}
          animateBy="words"
          direction="top"
          className="text-5xl mb-8"
        />
        <Button>Start my journey!</Button>
      </div>
    </div>
  );
};

export default LandingPage;
