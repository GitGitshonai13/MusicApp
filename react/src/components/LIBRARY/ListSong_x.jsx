import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axios をインポート
import Playlist from './Playlist';

const ListSong_x = () => {
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [songs, setSongs] = useState([]); // 音楽データの状態を追加

  // 音楽データを取得する関数
  const fetchSongs = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/playlist'); // API から音楽データを取得
      setSongs(response.data); // 音楽データを状態に保存
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  useEffect(() => {
    fetchSongs(); // コンポーネントがマウントされたときに音楽データを取得
  }, []);

  const toggleVisibilityLeft = () => {
    setIsLeftVisible(!isLeftVisible);
  };

  return (
    <div>
      <div className="mr-10 ml-10 mb-20">
        <div className="">
          <Playlist />
        </div>
      </div>

    </div>
  );
};

export default ListSong_x;
