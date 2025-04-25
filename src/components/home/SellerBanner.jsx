import React from 'react'

export default function SellerInfo() {
  return (
    <>
      <div className="flex items-center justify-evenly bg-orange-600">
        <div className="flex-col m-6">
            <h2 className="text-[20px] sm:text-lg md:text-xl lg:text-3xl font-bold text-white">
                Want To Sell ?
            </h2>
            <p className="text-xs md:text-sm xl:text-lg text-gray-200">
                Join us and start selling your products to a wider audience. 
            </p>
            <button className="p-2 px-6 bg-blue-300 mt-4 rounded-lg text- hover:bg-blue-600 transition-all hover:text-white">Sell Now</button>
        </div>
        <img src="/src/assets/images/seller.png" alt="seller" className="h-36 sm:h-36 md:h-52 lg:h-64 xl:h-80" />
      </div>
    </>
  )
}
