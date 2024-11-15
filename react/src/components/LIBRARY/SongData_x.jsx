import React, { useState } from 'react';
import axios from 'axios';

const SongData_x = ({ imgSrc, imgAlt, songName, artistName, songId }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleSongClick = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/history/playlist_add', {
        artist_name: artistName,
        song_name: songName,
      });
      window.location.reload();
    } catch (error) {
      console.error('Error adding song to history:', error);
      alert('履歴への追加に失敗しました');
    }
  };
  
  return (
    <div
      className="ml-14 "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={() => handleSongClick(songId)}
        className="flex items-center bg-white p-2 rounded-lg transition transform cursor-pointer border-b border-t w-5/6 ml-20 "
      >
        <img src={imgSrc} alt={imgAlt} className="w-16 h-16 ml-5" />
        <div className="flex-1 flex justify-between items-center w-full">
          <p className="text-xl text-gray-800 ml-64">{songName}</p>
          <p className="text-xl text-gray-800 mr-64 ">{artistName}</p>
        </div>
      </button>
    </div>
  );
};

export default SongData_x;
