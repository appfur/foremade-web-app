import React from 'react'

export default function BuyerBanner() {
  return (
    <>
      <div className="flex items-center justify-evenly max-md:justify-between bg-blue-500 mt-14">
        <div className="flex-col m-6">
            <h2 className="text-[20px] sm:text-lg md:text-xl lg:text-3xl font-bold text-white">
              Buy Quality Products At Your Comfort 
            </h2>
            <p className="text-xs md:text-sm xl:text-lg text-gray-200">
                Join us and start selling your products to a wider audience. 
            </p>
            <button className="p-2 px-6 max-md:p-1 max-md:px-5 bg-blue-300 mt-4 rounded-lg hover:bg-blue-600 transition-all hover:text-white">Sell Now</button>
        </div>
        <img src="/src/assets/images/vacuum.png" alt="seller" className="h-36 m-6 sm:h-36 md:h-52 lg:h-64 xl:h-80" />

      </div>
    </>
  )
}
