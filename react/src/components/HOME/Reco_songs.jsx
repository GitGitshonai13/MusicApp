import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ImageGallery = () => {
  const [musicData, setMusicData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null); // To track which item is hovered

  // 音楽データを取得する関数
  const fetchMusicData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/music'); // 音楽データを取得
      setMusicData(response.data);
    } catch (error) {
      console.error('Error fetching music data:', error);
      setError('音楽データの取得に失敗しました');
    }
  };

  // 画像をクリックしたときに履歴に音楽を追加する関数
  const handleSongClick = async (song) => {
    try {
      await axios.post('http://127.0.0.1:5000/history/add', {
        music_id: song.id,
      });
      setSelectedMusic(song);
      window.location.reload();
    } catch (error) {
      console.error('Error adding song to history:', error);
      alert('履歴への追加に失敗しました');
    }
  };

  useEffect(() => {
    fetchMusicData();
  }, []);

  // id: 1, 4, 10, 11, 12 の音楽データを表示
  const musicIdsToDisplay = [1, 2, 3, 5, 6];
  const displayMusic = musicData.filter(music => musicIdsToDisplay.includes(music.id));

  return (
    <div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex space-x-8 ml-10 mr-10 px-20">
        {displayMusic.map((music, index) => (
          <div
            key={index}
            className="w-1/5 relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img
              src={`http://127.0.0.1:5000/uploads/${music.image_file_url}`}
              alt={`image-${index}`}
              className="w-full h-auto cursor-pointer"
              onClick={() => handleSongClick(music)}
            />
            <div className="flex items-center justify-between mt-2">
              <div>
                <p className="text-base text-gray-800 font-semibold">{music.music_name}</p>
                <p className="text-sm text-gray-600">{music.artist_name}</p>
              </div>
              {hoveredIndex === index && (
                <img
                  src="/public/images/download.png"
                  alt="Download"
                  className="w-4 h-4 ml-2"
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="m-4"></div>
    </div>
  );
};

export default ImageGallery;
