import React, { useState } from 'react';
import ListSong_x from './ListSong_x';
import ListArtist_x from './ListArtist_x'; // You need to create this component

const MainLibrary = () => {
  const [selectedButton, setSelectedButton] = useState('song');

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  return (
    <div>
      <div className="relative min-h-screen">
        <div className="flex items-end ml-10 pt-8 mb-4">
          <p className="text-[50px] leading-none text-gray-600">LIBRARY</p>
          <p className="text-[20px] leading-none p-2 text-gray-600">ライブラリ</p>
        </div>

        <div className="flex ml-10 mr-10 mt-10 mb-4 bg-white h-10 text-lg">
          <button
            className={`w-1/2 rounded-l-md ${selectedButton === 'song' ? 'bg-amber-300 border-[2px] border-white text-black' : 'bg-white border-[2px] border-amber-300 hover:bg-gray-100 text-gray-600'}`}
            onClick={() => handleButtonClick('song')}
          >
            ソング
          </button>
          <button
            className={`w-1/2 rounded-r-md ${selectedButton === 'artist' ? 'bg-amber-300 border-[2px] border-white text-black' : 'bg-white border-[2px] border-amber-300 hover:bg-gray-100 text-gray-600'}`}
            onClick={() => handleButtonClick('artist')}
          >
            アーティスト
          </button>
        </div>

        {selectedButton === 'song' && <ListSong_x />}
        {selectedButton === 'artist' && <ListArtist_x />}
      </div>
    </div>
  );
};

export default MainLibrary;
