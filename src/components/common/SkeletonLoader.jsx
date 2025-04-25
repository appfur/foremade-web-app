// src/components/common/SkeletonLoader.jsx
const SkeletonLoader = ({ type = 'default', count = 1 }) => {
  // Define placeholder layouts based on type
  const renderSkeleton = () => {
    switch (type) {
      case 'featuredProduct':
      case 'recommended':
        // Used in RecommendedForYou, ProductList - mimics a product card
        return (
          <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse">
            <div className="w-full h-48 bg-gray-300 rounded-t-lg"></div>
            <div className="p-2">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        );

      case 'productDetail':
        // Used in Product, ProductDetail - mimics a product detail layout
        return (
          <div className="flex flex-col md:flex-row gap-6 animate-pulse">
            <div className="md:w-1/2">
              <div className="w-full h-96 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="md:w-1/2">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-16 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        );

      case 'categories':
        // Used in Category - mimics category cards
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
            <div className="sm:col-span-2 h-40 bg-gray-200 rounded-lg"></div>
            <div className="h-40 bg-gray-200 rounded-lg"></div>
            <div className="h-40 bg-gray-200 rounded-lg"></div>
            <div className="h-40 bg-gray-200 rounded-lg max-md:hidden"></div>
            <div className="h-40 bg-gray-200 rounded-lg max-md:hidden"></div>
          </div>
        );

      default:
        // Used in TopStores (no type specified) - mimics a store card
        return (
          <div className="w-80 sm:w-full h-40 bg-gray-200 rounded-lg animate-pulse">
            <div className="p-4">
              <div className="h-5 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="flex gap-2">
                <div className="w-20 h-20 bg-gray-300 rounded-md"></div>
                <div className="w-20 h-20 bg-gray-300 rounded-md"></div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={type === 'default' ? 'flex gap-4 overflow-x-auto' : ''}>
      {[...Array(count)].map((_, index) => (
        <div key={index} className={type === 'default' ? 'flex-shrink-0' : ''}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;