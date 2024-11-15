import React, { useState } from 'react';
import TopSong from './TopSong';


const MainRanking = () => {
  const [selectedButton, setSelectedButton] = useState('daily');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  const handleCategoryClick = (buttonCategory) => {
    setSelectedCategory(buttonCategory);
  };

  return (
    <div className="min-h-full">
      <div className="flex items-end ml-10 mt-8 mb-4">
        <p className="text-[50px] leading-none text-gray-600">RANKING</p>
        <p className="text-[20px] leading-none p-2 text-gray-600">ランキング</p>
      </div>

      <div className="flex ml-10 mr-10 m-10 bg-gray-200 h-10">
        <button
          className={`w-1/3 rounded-l-md ${selectedButton === 'daily' ? 'bg-amber-300 border-[2px] border-white text-black' : 'bg-white border-[2px] border-amber-300 hover:bg-gray-100 text-gray-600'}`}
          onClick={() => handleButtonClick('daily')}>
          デイリー
        </button>
        <button
          className={`w-1/3 ${selectedButton === 'weekly' ? 'bg-amber-300 border-[2px] border-white text-black' : 'bg-white border-[2px] border-amber-300 hover:bg-gray-100 text-gray-600'}`}
          onClick={() => handleButtonClick('weekly')}>
          ウィークリー
        </button>
        <button
          className={`w-1/3 rounded-r-md ${selectedButton === 'monthly' ? 'bg-amber-300 border-[2px] border-white text-black' : 'bg-white border-[2px] border-amber-300 hover:bg-gray-100 text-gray-600'}`}
          onClick={() => handleButtonClick('monthly')}>
          マンスリー
        </button>
      </div>

      <TopSong />


    </div>
  );
};

export default MainRanking;
