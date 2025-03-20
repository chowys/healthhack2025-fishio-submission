import LandingPage from "@/app/component/homePage/landingPage";
import { LandingPage2 } from "@/app/component/homePage/landingPage2";
import { LandingPage3 } from "@/app/component/homePage/landingPage3";

export default function Home() {
  return (
    <div className=" min-h-screen bg-(--primary)">
      <LandingPage />
      <LandingPage2 />
      <LandingPage3 />
    </div>
  );
}
