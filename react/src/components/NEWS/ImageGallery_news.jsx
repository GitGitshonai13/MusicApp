import React from 'react';

const ImageGallery = () => {
  const images = [
    { src: 'public/images/summer.jpg', description: 'お題：「夏休み」の曲' },
    { src: 'public/images/autam.jpg', description: 'お題：「秋」の曲' },
    { src: 'public/images/xmas.jpg', description: 'お題：「クリスマス」の曲' },
  ];

  return (
    <div>
      <div className="flex space-x-14 m-10">
        {images.map((image, index) => (
          <div key={index} className="w-1/4 text-center">
            <img src={image.src} alt={`image-${index}`} className="w-full h-auto rounded-[60px]" />
            <p className="mt-2 text-gray-900 text-lg">{image.description}</p>
          </div>
        ))}
      </div>
      <div className="m-4"></div>
      <div className="h-4"></div>
    </div>
  );
};

export default ImageGallery;
