import React, { useState } from 'react';

const CarouselApp = () => {
  const images = [
    '/public/images/autam.jpg',
    '/public/images/summer.jpg',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // 左にスライド
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  // 右にスライド
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="relative w-full max-w-lg mx-auto "> {/* 親要素の最大幅を大きくしました */}
      
      {/* 画像の親要素にグレーの背景色を追加 */}
      <div className="relative overflow-hidden ">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex}`}
          className="w-full h-auto object-cover rounded-lg"
        />
      </div>

      {/* 左ボタン */}
      <button
        className="absolute top-1/2 -translate-y-1/2 left-[-80px] px-2 py-1 bg-gray-600 text-white rounded-full"
        onClick={goToPrevious}
      >
        ◀
      </button>

      {/* 右ボタン */}
      <button
        className="absolute top-1/2 -translate-y-1/2 right-[-80px] px-2 py-1 bg-gray-600 text-white rounded-full"
        onClick={goToNext}
      >
        ▶
      </button>

      {/* インジケーター */}
      <div className="flex justify-center mt-4 space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`h-3 w-3 rounded-full ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default CarouselApp;
