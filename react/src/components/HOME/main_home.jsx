import React from 'react';
import TopSong from './TopSong';
import HistorySong from './HistorySong';
import Reco_songs from './Reco_songs';
import New_songs from './New_songs';
import Carousel from './Carousel';

const MainHome = () => {
  return (
    <div className="min-h-full space-y-10">
      <div className="mt-10"></div>
      {/* <div className=''>
        <Carousel />
      </div> */}
      
      <div>
        <button className="text-2xl font-bold text-gray-600 ml-24 m-4">おすすめ曲</button>
        <Reco_songs />
      </div>

      <div>
        <button className="text-2xl font-bold text-gray-600 ml-24 m-4">ソング TOP 30</button>
        <TopSong />
      </div>

      <div>
        <button className="text-2xl font-bold text-gray-600 ml-24 m-4">最新曲</button>
        <New_songs />
      </div>

      <div>
        <button className="text-2xl font-bold text-gray-600 ml-24 m-4">再生履歴</button>
        <HistorySong />
      </div>
    </div>
  );
};

export default MainHome;
