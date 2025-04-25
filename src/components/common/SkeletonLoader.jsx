const SkeletonLoader = ({ count = 4, type = 'default' }) => {
    if (type === 'recommended') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-lg p-4 animate-pulse"
            >
              {/* Image Placeholder */}
              <div className="w-full h-48 bg-gray-200 rounded-md mb-2"></div>
              {/* Rating Placeholder */}
              <div className="flex items-center mb-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              {/* Name Placeholder */}
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              {/* Price Placeholder */}
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      );
    }
  
    if (type === 'categories') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Cut the Price Card */}
          <div className="sm:col-span-2 bg-gray-200 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center animate-pulse">
            <div className="flex-1">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-300 rounded w-24"></div>
            </div>
            <div className="flex-1 mt-4 sm:mt-0">
              <div className="w-full h-32 bg-gray-300 rounded-md"></div>
            </div>
          </div>
  
          {/* Happy Club Card - Hidden on mobile */}
          <div className="max-md:hidden bg-gray-200 rounded-lg p-4 sm:p-6 flex flex-col justify-between animate-pulse">
            <div>
              <div className="h-5 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-300 rounded-lg p-4">
                <div className="h-4 bg-white rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-white rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-white rounded w-1/3"></div>
              </div>
              <div className="bg-gray-300 rounded-lg p-4">
                <div className="h-4 bg-white rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-white rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-white rounded w-1/3"></div>
              </div>
            </div>
          </div>
  
          {/* Style Meets Function Card */}
          <div className="bg-gray-200 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between animate-pulse">
            <div>
              <div className="h-5 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-300 rounded w-24"></div>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="w-24 sm:w-28 h-16 bg-gray-300 rounded-md"></div>
            </div>
          </div>
  
          {/* Capture the Magic Card */}
          <div className="bg-gray-200 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between animate-pulse">
            <div>
              <div className="h-5 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-300 rounded w-24"></div>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="w-20 sm:w-24 h-16 bg-gray-300 rounded-md"></div>
            </div>
          </div>
  
          {/* Health & Wellness Card - Hidden on mobile */}
          <div className="max-md:hidden bg-gray-200 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between animate-pulse">
            <div>
              <div className="h-5 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-300 rounded w-24"></div>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="w-20 sm:w-24 h-16 bg-gray-300 rounded-md"></div>
            </div>
          </div>
        </div>
      );
    }
  
    if (type === 'topCategories') {
      return (
        <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 sm:gap-4 flex overflow-x-auto scrollbar-hide">
          <div className="sm:col-span-2 bg-gray-200 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center flex-shrink-0 w-72 sm:w-auto mr-4 sm:mr-0 animate-pulse">
            <div className="flex-1">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-300 rounded w-24"></div>
            </div>
            <div className="flex-1 mt-4 sm:mt-0">
              <div className="w-full h-32 bg-gray-300 rounded-md"></div>
            </div>
          </div>
          <div className="max-md:hidden sm:block bg-gray-200 rounded-lg p-4 sm:p-6 flex flex-col justify-between animate-pulse">
            <div>
              <div className="h-5 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-300 rounded-lg p-4">
                <div className="h-4 bg-white rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-white rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-white rounded w-1/3"></div>
              </div>
              <div className="bg-gray-300 rounded-lg p-4">
                <div className="h-4 bg-white rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-white rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-white rounded w-1/3"></div>
              </div>
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between flex-shrink-0 w-72 sm:w-auto mr-4 sm:mr-0 animate-pulse">
            <div>
              <div className="h-5 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-300 rounded w-24"></div>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="w-24 sm:w-28 h-16 bg-gray-300 rounded-md"></div>
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between flex-shrink-0 w-72 sm:w-auto mr-4 sm:mr-0 animate-pulse">
            <div>
              <div className="h-5 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-300 rounded w-24"></div>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="w-20 sm:w-24 h-16 bg-gray-300 rounded-md"></div>
            </div>
          </div>
          <div className="max-md:hidden sm:block bg-gray-200 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between animate-pulse">
            <div>
              <div className="h-5 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-300 rounded w-24"></div>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="w-20 sm:w-24 h-16 bg-gray-300 rounded-md"></div>
            </div>
          </div>
        </div>
      );
    }
  
    return (
      <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4 flex overflow-x-auto scrollbar-hide">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-80 sm:w-auto mr-4 sm:mr-0 bg-gray-100 border border-gray-200 rounded-lg p-4 animate-pulse"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="flex items-center">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
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