import { useState, useEffect } from 'react';

const Carousel = () => {
  const slides = [
    {
      image: '/assets/images/hero1.jpg',
      text: 'Discovered Supports Tailored For You',
      description: 'Explore solutions for shipping, returns, and more.',
      button: 'Shop Now',
    },
    {
      image: '/assets/images/hero2.jpg',
      text: 'Shop The Latest Deals',
      description: 'Find unique products at unbeatable prices.',
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
    <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
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
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-start p-10 max-md:p-6 bg-black bg-opacity-30">
            <div className="text-white max-w-lg text-left">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2">
                {slide.text}
              </h2>
              <p className="text-sm sm:text-xs mb-4">{slide.description}</p>
              <button className="bg-white text-gray-800 px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 text-sm sm:text-xs">
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