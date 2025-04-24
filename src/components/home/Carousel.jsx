import { useState, useEffect } from 'react';

const Carousel = () => {
  const slides = [
    { image: '/assets/images/hero1.jpg', text: 'Shop the Latest Deals!' },
    { image: '/assets/images/hero2.jpg', text: 'Discover Unique Finds!' },
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full h-96">
      <img
        src={slides[current].image}
        alt="Carousel"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-start p-4 bg-black bg-opacity-30">
        <h2 className="text-3xl text-white font-bold">{slides[current].text}</h2>
      </div>
    </div>
  );
};

export default Carousel;