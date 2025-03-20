import Image from "next/image";

type DefaultBgProps = {
  className?: string;
};

const DefaultBg = ({ className = "" }: DefaultBgProps) => {
  return (
    <Image
      alt="hero"
      src="/assets/media/background/bg_1.png"
      layout="fill"
      objectFit="contain"
      objectPosition="-10% center"
      className={`w-full h-full object-cover rounded-lg ${className}`}
    />
  );
};

export default DefaultBg;
