import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  [key: string]: any;
}

const Button = ({ children, ...rest }: ButtonProps) => {
  return (
    <button
      {...rest}
      className="group relative px-20 py-5 font-medium text-white text-xl bg-[#075540] border-3 border-[#228B22] transition-all duration-200 hover:bg-white hover:text-[#228B22] hover:border-[#075540]"
    >
      <span>{children}</span>

      {/* Border animations */}
      <span className="absolute left-0 top-0 h-[4px] w-0 bg-[#228B22] transition-all duration-100 group-hover:w-full" />
      <span className="absolute right-0 top-0 h-0 w-[4px] bg-[#228B22] transition-all delay-100 duration-100 group-hover:h-full" />
      <span className="absolute bottom-0 right-0 h-[4px] w-0 bg-[#228B22] transition-all delay-200 duration-100 group-hover:w-full" />
      <span className="absolute bottom-0 left-0 h-0 w-[4px] bg-[#228B22] transition-all delay-300 duration-100 group-hover:h-full" />
    </button>
  );
};

export default Button;
