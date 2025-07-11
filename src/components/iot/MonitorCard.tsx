import type { FC } from "react";
import { Briefcase, Circle,  Tablet, User, Wifi } from "lucide-react";

interface MonitorCardProps {
  deviceId: number;
  operatorName: string;
  operatorId: number | null;
  operationName: string | null;
  workstation: string; // or use `wsName`
  nptTotal: number;
  wsNo: number;
  styleName: string;
  performanceColor: string;
  performanceString: string;
  totalCycleTime: number;
  isBottleneck?: boolean; // Optional prop to indicate if it's a bottleneck
  deviceStatus?: string; // Optional prop to indicate device status
}

const MonitorCard: FC<MonitorCardProps> = ({
  deviceId,
  operatorName,
  operationName,
  operatorId,
  nptTotal,
  wsNo,
  performanceColor,
  performanceString,
  totalCycleTime,
  isBottleneck,
  deviceStatus
}) => {
  return (
    <div className="bg-white dark:bg-[#1e2939] border border-gray-200 dark:border-gray-800 shadow-lg rounded-xl w-full ">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 py-4 px-2">
        <div className="flex items-center gap-2">
          <Tablet  className={`w-5 h-5 ${deviceStatus ==="OFF" ? 'text-red-500':'text-green-500'} `} />
          <a href="#" className="text-[#1C98D8] font-semibold">
            ID: {deviceId}
          </a>
        </div>
        <span
          className={`flex gap-1 items-center  text-gray-500 dark:text-[#cACACA] text-[12px] `}
        >
          <Circle
            className="rounded-full"
            style={{ backgroundColor: `${performanceColor}` }}
            size={12}
          />
          {performanceString}
        </span>
      </div>

      {/* Body Info */}
      <div className="flex justify-between py-4 px-[10px]">
        <div className="flex flex-col gap-3 text-sm w-2/4">
          {/* Name */}
          <div className="text-[#6D6B77] dark:text-[#cACACA] font-medium mt-2">
            <label className="flex gap-2 items-center">
              <User />
              Name
            </label>
            <p className="text-[15px] text-[#444050] dark:text-white font-semibold">
              {operatorName} {operatorId ? `(${operatorId})` : ""}
            </p>
          </div>

          <div>
            <label className="text-gray-500 dark:text-[#cACACA] flex gap-2 items-center">
              <Briefcase size={20} />
              Operation
            </label>
            <div className="text-[#444050] dark:text-white font-medium text-[15px] mt-1">
              {operationName ? operationName : "N/A"}
            </div>
          </div>

          {/* Workstation */}
          <div className="text-gray-500 dark:text-[#cACACA] mt-2">
            <div className="flex gap-2 items-center">
              <Wifi className="w-4 h-4" />
              <p>Work station</p>
            </div>
            <p className="text-[#444050] dark:text-white font-semibold">
              {wsNo}
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col rounded-lg p-2 justify-between items-center shadow-lg bg-white dark:bg-[#1e2939]">
          <div className="flex justify-between gap-2">
            <div className={` text-white font-bold px-3 py-1 rounded ${isBottleneck ? "bg-red-500" : "bg-[#B3B3B3]"}`}>
              B
            </div>
            <div className="bg-green-500 text-white font-bold px-3 py-1 rounded">
              P
            </div>
            <div className="bg-[#CD6133] text-white font-bold px-3 py-1 rounded">
              N
            </div>
          </div>

          <div className="flex flex-col gap-3 text-sm p-2 rounded-md border border-[#eeeeee] dark:border-gray-700 w-full mt-2">
            <div>
              <span className="text-gray-500 dark:text-[#cACACA]">
                Total Production
              </span>
              <div className="font-semibold text-[#444050] dark:text-white">
                {totalCycleTime}
              </div>
            </div>
            <div>
              <span className="text-gray-500 dark:text-[#cACACA]">
                Total NPT
              </span>
              <div className="font-semibold text-gray-800 dark:text-white">
                {nptTotal}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorCard;
