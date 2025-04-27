import { useState, useEffect } from 'react';

const Carousel = () => {
  const slides = [
    {
      image: 'https://media.istockphoto.com/id/1431595751/photo/online-payment-for-fruit-through-the-card-in-the-smartphone-smartphone-and-fruit-cart-copy.jpg?s=612x612&w=0&k=20&c=V_oUiRLBZGtfGozgXDlHZpq5nu0lZmZkxZmGbZS8Oqc=',
      text: 'Discovered Supports Tailored For You',
      description: 'Explore solutions for shipping, returns, and more.',
      button: 'Shop Now',
    },
    {
      image: 'https://media.istockphoto.com/id/2205223646/photo/device-touching-screen-with-shopping-cart-and.jpg?s=612x612&w=0&k=20&c=bpV-qL-_rzVhQ3-scnIuJEbWXLwdc44B74O3_TXBSDs=',
      text: 'Shop The Latest Deals',
      description: 'Find unique products at unbeatable prices.',
      button: 'Shop Now',
    },
    {
      image: 'https://media.istockphoto.com/id/1329052977/photo/smartphone-with-shopping-cart-and-blank-empty-screen-on-blue-stage-background-online-shopping.jpg?s=612x612&w=0&k=20&c=bH9R_JRrIH4DzIfDcwAHACx-mqRKT9PpzK5cOPW-pkM=',
      text: 'Top Notch Findings.',
      description: 'Quality and refinable products.',
      button: 'Shop Now',
    },
  ];
  const [current, setCurrent] = useState(0);
  const [prevSlide, setPrevSlide] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevSlide(current);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [current, slides.length]);

  return (
    <div className="relative mx-4 sm:max-w-5xl md:max-w-7xl lg:max-w-7xl xl:max-w-7xl md:mx-auto h-64 sm:h-80 md:h-96 overflow-hidden px-4 rounded-lg">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === current
              ? 'opacity-100 transform translate-x-0'
              : index === prevSlide
              ? 'opacity-0 transform -translate-x-10'
              : 'opacity-0 transform translate-x-10'
          }`}
        >
          <img
            src={slide.image}
            alt={`Slide ${index}`}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 flex items-center justify-start p-10 max-md:p-6 bg-black bg-opacity-30">
            <div className="text-white max-w-lg text-left">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2">
                {slide.text}
              </h2>
              <p className="text-sm sm:text-xs mb-4">{slide.description}</p>
              <button className="bg-white border-none transition-all hover:text-white text-gray-800 px-8 py-3 rounded-full border border-gray-300 hover:bg-blue-300 text-sm sm:text-xs">
                {slide.button}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Carousel;