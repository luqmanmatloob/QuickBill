import React from 'react';

const LoadingSkeleton3 = () => {
  return (
    <div role="status" className="max-w-6xl animate-pulse space-y-4 divide-y divide-gray-200 rounded border border-gray-200 p-4 shadow md:p-6 dark:divide-gray-700 dark:border-gray-700">
      {[...Array(3)].map((_, index) => (
        <div className="flex items-center justify-between pt-4" key={index}>
          <div>
            <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        </div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSkeleton3;
