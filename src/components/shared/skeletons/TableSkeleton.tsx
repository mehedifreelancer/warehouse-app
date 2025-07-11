const TableSkeleton = () => {
  return (
    <div>
      {/* Header Skeleton */}
      <div className="flex items-center justify-between animate-pulse bg-white dark:bg-[#1e2939] px-3 py-[30px] rounded border-b border-gray-200 dark:border-gray-900">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20" />
      </div>

      {/* Row Skeletons */}
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between animate-pulse bg-white dark:bg-[#1e2939] px-3 py-5 rounded border-b border-gray-200 dark:border-gray-900"
        >
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-10" />
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;
