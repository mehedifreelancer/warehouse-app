import React from "react";
import { toast } from "react-toastify";

type ToastProps = {
  title?: string;
  message: string;
  duration?: number;
  type?: "success" | "error" | "info" | "warning";
};

const CustomToast: React.FC<ToastProps> = ({ title, message, type }) => {
  return (
    <div className="bg-white dark:bg-[#111826] w-full rounded shadow-lg">
    <div className="p-3 font-semibold flex gap-2 items-center border-b border-b-[#D1D0D4] border-b-[1px] dark:border-gray-800 ">
        {type === "success" ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="20" height="20" rx="10" fill="#28C76F" />
            <path
              d="M5.65027 10.8485L7.82555 13.1706L14.6813 7.2715"
              stroke="white"
              stroke-width="1.5"
            />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="20" height="20" rx="10" fill="#FF4C51" />
            <path
              d="M6 6L14 14M6 14L14 6"
              stroke="white"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        )}
        <h3 className="text-capitalize text-[#444050] dark:text-[#cacaca] text-[18px] font-semibold ">{title} !</h3> 
      </div>
      <div className="px-3 py-4 text-gray-700 text-sm   text-[#757575] dark:text-[#cacaca]  text-[15px]">{message}</div>
    </div>
  );
};

export const toastCustom = ({
  title,
  message,
  duration = 3000,
  type = "success",
}: {
  title: string;
  message: string;
  duration?: number;
  type?: "success" | "error" | "info" | "warning";
}) => {
  // Later: Add color classes inside CustomToast based on `type`
  toast(<CustomToast title={title} message={message} type={type} />, {
    autoClose: duration,
    //   type
  });
};
