const SkeletonLoader = ({ count = 4 }) => {
    return (
      <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4 flex overflow-x-auto scrollbar-hide">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-80 sm:w-auto mr-4 sm:mr-0 bg-gray-100 border border-gray-200 rounded-lg p-4 animate-pulse"
          >
            {/* Store Header Placeholder */}
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="flex items-center">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            {/* Product Images Placeholder */}
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-md mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default SkeletonLoader;