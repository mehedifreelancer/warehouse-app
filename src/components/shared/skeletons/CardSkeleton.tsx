import type { FC } from "react";

const SingleSkeletonCard: FC = () => {
  return (
    <div className="bg-white dark:bg-[#1e2939] border border-gray-200 dark:border-gray-900 shadow rounded-xl animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-900 py-4 px-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded" />
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20" />
        </div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16" />
      </div>

      {/* Body */}
      <div className="flex justify-between py-4 px-[10px]">
        {/* Left */}
        <div className="flex flex-col gap-3 text-sm w-2/4">
          <div className="space-y-1 mt-2">
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20" />
              
            </div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-28" />
          </div>

          <div className="space-y-1">
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24" />
            </div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-36 mt-1" />
          </div>

          <div className="space-y-1 mt-2">
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20" />
            </div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-8" />
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col rounded-lg p-2 justify-between items-center shadow-lg w-[45%]">
          <div className="flex gap-2 mb-3">
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded" />
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded" />
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded" />

          </div>
          <div className="flex flex-col gap-3 w-full">
            <div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-1" />
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-14" />
            </div>
            <div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-1" />
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-14" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MonitorCardSkeletonProps {
  count?: number;
}

const CardSkeleton: FC<MonitorCardSkeletonProps> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SingleSkeletonCard key={i} />
      ))}
    </div>
  );
};

export default CardSkeleton;
