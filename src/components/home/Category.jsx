const Categories = () => {
  return (
    <section className="container mx-auto px-4 py-8">
        <h2 className="text-lg sm:text-lg md:text-xl font-bold text-gray-800 mb-4">Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Cut the Price Card */}
        <div className="sm:col-span-2 bg-[#E0F4FF] text-black rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">Cut the Price, Not the Features</h3>
            <p className="text-sm sm:text-xs mb-4">Get the latest phones at 20% off</p>
            <a
              href="/electronics"
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm sm:text-xs inline-block"
            >
              Buy Now
            </a>
          </div>
          <div className="flex-1 mt-4 sm:mt-0">
            <img
              src="/src/assets/images/iphone-mockup.png"
              alt="Phone"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Happy Club Card */}
        <div className="bg-[#D1FAE5] rounded-lg p-4 sm:p-6 flex flex-col justify-between max-md:hidden">
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-teal-800 mb-2">Happy Club</h3>
            <p className="text-sm sm:text-xs text-teal-800 mb-4">Collect coupons from stores and apply to get special discount</p>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm sm:text-xs font-semibold text-teal-800">10% OFF</p>
              <p className="text-xs sm:text-[0.65rem] text-gray-600">For ALL SHOPS</p>
              <p className="text-xs sm:text-[0.65rem] text-gray-600">CODE: 0va6ghmixg</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm sm:text-xs font-semibold text-teal-800">30% OFF</p>
              <p className="text-xs sm:text-[0.65rem] text-gray-600">For ALL SHOPS</p>
              <p className="text-xs sm:text-[0.65rem] text-gray-600">CODE: h7ay6gi9T7</p>
            </div>
          </div>
        </div>

        {/* Style Meets Function Card */}
        <div className="bg-[#EDE9FE] text-black rounded-lg p-5 sm:p-6 flex sm:flex-row items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">Style Meets Function</h3>
            <a
              href="/electronics"
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm sm:text-xs inline-block"
            >
              Shop Now
            </a>
          </div>
          <div className="mt-4 sm:mt-0">
            <img
              src="/src/assets/images/laptop-mockup.png"
              alt="Laptop"
              className="w-24 sm:w-28 h-auto"
            />
          </div>
        </div>

        {/* Capture the Magic Card */}
        <div className="bg-[#FFE5E5] text-black rounded-lg p-5 sm:p-6 flex sm:flex-row items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">Capture the Magic Around</h3>
            <a
              href="/electronics"
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm sm:text-xs inline-block"
            >
              Shop Now
            </a>
          </div>
          <div className="mt-4 sm:mt-0">
            <img
              src="/src/assets/images/camera-mockup.png"
              alt="Camera"
              className="w-20 sm:w-24 h-auto"
            />
          </div>
        </div>

        {/* Health & Wellness Card */}
        <div className="bg-[#E0F4FF] text-black rounded-lg p-4 sm:p-6 flex sm:flex-row items-center justify-between max-md:hidden">
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">Health & Wellness</h3>
            <a
              href="/health-beauty"
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm sm:text-xs inline-block"
            >
              Shop Now
            </a>
          </div>
          <div className="mt-4 sm:mt-0">
            <img
              src="/src/assets/images/bottle-mockup-2.png"
              alt="Bottle"
              className="w-20 sm:w-24 h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;