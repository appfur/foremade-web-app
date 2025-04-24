import { useRef } from 'react';
import { Link } from 'react-router-dom';
import db from '../../db.json';

const TopStores = () => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Format price in Naira
  const formatPrice = (price) => {
    return `₦${price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <section className="p-4 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Top Stores</h2>
          <div className="flex items-center gap-2">
            <Link to="/stores" className="text-blue-600 text-sm hover:underline">
              View All
            </Link>
            <button
              onClick={scrollLeft}
              className="bg-gray-200 rounded-full p-1 hover:bg-gray-300"
            >
              <i className="bx bx-chevron-left text-xl text-gray-600"></i>
            </button>
            <button
              onClick={scrollRight}
              className="bg-gray-200 rounded-full p-1 hover:bg-gray-300"
            >
              <i className="bx bx-chevron-right text-xl text-gray-600"></i>
            </button>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide"
        >
          {db.stores.map((store) => (
            <Link
              key={store.id}
              to={`/store/${store.id}`}
              className="flex-shrink-0 w-80 bg-gray-100 border border-gray-200 rounded-lg p-4 hover:bg-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">{store.name}</h3>
                  <p className="text-xs text-gray-600">{store.productCount} Products</p>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`bx bx-star text-yellow-400 text-sm ${
                        i < Math.floor(store.rating) ? 'bx-star-filled' : ''
                      }`}
                    ></i>
                  ))}
                  <span className="text-xs text-gray-600 ml-1">({store.reviewCount})</span>
                </div>
              </div>
              <div className="flex gap-2">
                {store.products.map((product, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <img
                      src={product.image}
                      alt={`Product ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <p className="text-xs text-gray-600 mt-1">{formatPrice(product.price)}</p>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopStores;