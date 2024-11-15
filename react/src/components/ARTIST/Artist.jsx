import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Artist = ({ artistName }) => {
  const [latestSong, setLatestSong] = useState(null);
  const [popularSongs, setPopularSongs] = useState([]);
  const [error, setError] = useState(null);

  const fetchSongs = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/music', {
        params: { artist_name: artistName },
      });

      if (!response.data || response.data.length === 0) {
        setError(`アーティスト「${artistName}」には楽曲がありません`);
      } else {
        const artistSongs = response.data.filter(song => song.artist_name === artistName);
        
        const sortedByDate = [...artistSongs].sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        setLatestSong(sortedByDate[0]);

        const sortedByPlayCount = [...artistSongs].sort((a, b) => b.play_count - a.play_count);
        setPopularSongs(sortedByPlayCount);
      }
    } catch (error) {
      console.error('音楽データの取得に失敗しました:', error);
      setError('音楽データの取得に失敗しました');
    }
  };

  const addToHistory = async (musicId) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/history/add', { music_id: musicId });
      console.log(response.data.message);
    } catch (error) {
      console.error('履歴の追加に失敗しました:', error);
      alert('履歴の追加に失敗しました');
    }
  };

  const addToPlaylist = async (musicId) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/playlist/add', { music_id: musicId });
      console.log(response.data.message);
    } catch (error) {
      console.error('プレイリストの追加に失敗しました:', error);
      alert('プレイリストの追加に失敗しました');
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [artistName]); // artistNameが変わるたびにデータを再取得

  return (
    <div className="flex mx-5 my-20">
      <div className="w-1/3 flex flex-col items-center">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <img
          src={`/public/images/${artistName}.jpg`} 
          className="rounded-full w-[300px] h-[300px] object-cover shadow-lg mt-20"
          alt={`${artistName}の画像`}
        />
        <h1 className="text-4xl font-bold text-gray-700 mt-6">{artistName}</h1>
      </div>
  
      <div className="w-3/5 ml-4 mt-14">
        <p className="font-bold text-xl mb-4 text-gray-800">最新曲</p>
        {latestSong && (
          <div 
            className="flex items-center bg-white p-2 rounded-lg transition transform cursor-pointer border-b border-t mb-2 relative group"
            onClick={() => addToHistory(latestSong.id)}
          >
            <img 
              src={latestSong.image_file_url ? `http://127.0.0.1:5000/uploads/${latestSong.image_file_url}` : 'https://via.placeholder.com/90'} 
              alt={latestSong.music_name} 
              className="w-32 h-32 m-4" 
            />
            <div className="flex-1 flex flex-col ml-10">
              <p className="text-[24px] text-gray-800">{latestSong.music_name}</p>
              <p className="text-[20px] text-gray-600">{latestSong.artist_name}</p>
              <p className="text-[14px] text-gray-500 mt-6">2024.12.01</p>
            </div>
            <div className="absolute right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button onClick={(e) => { e.stopPropagation(); addToPlaylist(latestSong.id); }}>
                <img src="/public/images/download.png" className="w-7 h-7" alt="Download" />
              </button>
            </div>
          </div>
        )}
  
        <p className="font-bold text-xl mb-4 mt-10 text-gray-800">人気順</p>
        <div className="max-h-[400px] overflow-y-auto pr-2 bg-gray-100 rounded-lg">
          {popularSongs.map((song) => (
            <div 
              key={song.id} 
              className="flex items-center bg-white p-2 rounded-lg transition transform cursor-pointer border-b border-t relative group"
              onClick={() => addToHistory(song.id)}
            >
              <img src={song.image_file_url ? `http://127.0.0.1:5000/uploads/${song.image_file_url}` : 'https://via.placeholder.com/90'} alt={song.music_name} className="w-16 h-16 ml-5" />
              <div className="flex-1 flex items-center">
                <p className="text-[20px] ml-20 w-[40%] truncate text-gray-800">{song.music_name}</p>
                <p className="text-[20px] ml-5 w-[40%] truncate text-gray-800">{song.artist_name}</p>
                
              </div>
              <div className="absolute right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={(e) => { e.stopPropagation(); addToPlaylist(song.id); }}>
                  <img src="/public/images/download.png" className="w-7 h-7" alt="Download" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Artist;
