import React, { useState } from 'react';
import ImageGallery from './ImageGallery_news';

const MainNews = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCategoryClick = (buttonCategory) => {
    setSelectedCategory(buttonCategory);
  };

  return (
    <div className="min-h-full">
      <div className="flex items-end ml-10 mt-8 mb-4">
        <p className="text-[50px] leading-none text-gray-600">NEWS</p>
        <p className="text-[20px] leading-none p-2 text-gray-600">ニュース</p>
      </div>
      
      <div className="ml-10 mb-10 mt-8 space-x-4">
        <button
          className={`rounded-3xl w-28 h-12 ${selectedCategory === 'all' ? 'bg-amber-300 border-[2px] border-white text-black' : 'bg-white border-[2px] border-amber-300 hover:bg-gray-100 text-gray-600'}`}
          onClick={() => handleCategoryClick('all')}>
          All
        </button>
        <button
          className={`rounded-3xl w-32 h-12 ${selectedCategory === 'music' ? 'bg-amber-300 border-[2px] border-white text-black' : 'bg-white border-[2px] border-amber-300 hover:bg-gray-100 text-gray-600'}`}
          onClick={() => handleCategoryClick('music')}>
          Music
        </button>
        <button
          className={`rounded-3xl w-32 h-12 ${selectedCategory === 'artist' ? 'bg-amber-300 border-[2px] border-white text-black' : 'bg-white border-[2px] border-amber-300 hover:bg-gray-100 text-gray-600'}`}
          onClick={() => handleCategoryClick('artist')}>
          Artist
        </button>
        <button
          className={`rounded-3xl w-32 h-12 ${selectedCategory === 'event' ? 'bg-amber-300 border-[2px] border-white text-black' : 'bg-white border-[2px] border-amber-300 hover:bg-gray-100 text-gray-600'}`}
          onClick={() => handleCategoryClick('event')}>
          Event
        </button>
      </div>
      
      {/* AllまたはEventが選択されている場合にImageGalleryを表示 */}
      {(selectedCategory === 'all' || selectedCategory === 'event') && <ImageGallery />}
    </div>
  );
};

export default MainNews;
