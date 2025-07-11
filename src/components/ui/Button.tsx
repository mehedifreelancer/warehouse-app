import React from "react";
import { useFormStatus } from "react-dom";
import Spinner from "./Spinner";

interface ButtonProps {
  bg?: string;
  className?: string;
  disabled?: boolean;
  src?: string;
  type?: "button" | "submit" | "reset";
  children?: React.ReactNode;
  onClick?: () => void;
  shadowOnHover?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  type = "button",
  className,
  disabled= false,
  children,
  shadowOnHover = true,
}) => {
  const status = useFormStatus();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`dark:text-white text-[14px] hover:${shadowOnHover && 'shadow-lg'}  transition duration-200 flex rounded items-center  px-3 py-2 ${disabled ? 'opacity-30 pointer-events-none' : ''} ${className} ${
        status.pending && type === "submit"
          ? "opacity-30 cursor-not-allowed"
          : "cursor-pointer"
      }`}
    >
      {type === "submit" && status.pending ? (<span className="flex gap-2 items-center "><Spinner /> Loading...</span> ): children}
    </button>
  );
};
 
export default Button;
