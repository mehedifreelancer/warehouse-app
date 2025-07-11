interface TextSkeletonProps {
  className: string;
}

const TextSkeleton = ({ className }: TextSkeletonProps) => {
    return (
      <div className={ `h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse ${className} `}></div>
    );
  };
  
  export default TextSkeleton;
  