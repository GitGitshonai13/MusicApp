import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SongData_x from './SongData_x';

const Playlist = () => {
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState({ type: 'id', order: 'asc' });
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/playlist')
      .then(response => {
        setSongs(response.data);
      })
      .catch(error => {
        console.error('Error fetching playlist data:', error);
        setError('プレイリストデータの取得に失敗しました');
      });
  }, []);

  const toggleSortModal = () => {
    setIsSortModalOpen(!isSortModalOpen);
  };

  const updateSortOrder = (type, order) => {
    setSortOrder({ type, order });
    setIsSortModalOpen(false); // Close modal after selection
  };

  const sortedSongs = [...songs].sort((a, b) => {
    if (sortOrder.type === 'name') {
      return sortOrder.order === 'asc'
        ? a.music_name.localeCompare(b.music_name)
        : b.music_name.localeCompare(a.music_name);
    } else {
      return sortOrder.order === 'asc' ? a.id - b.id : b.id - a.id;
    }
  });

  return (
    <div className="relative "> {/* Increased padding for larger layout */}
      {error && <p className="text-red-500 text-3xl">{error}</p>} {/* Increased error text size */}

      <div className="flex justify-end"> {/* Increased margin for spacing */}
        <button 
          onClick={toggleSortModal} 
          className="flex flex-col items-center py-6 px-8 text-3xl rounded-3xl" // Larger padding and font size
        >
          <img src="/public/images/sort.png" alt="Sort Icon" className="w-10 h-10" /> {/* Larger icon */}
          <span className="text-base text-gray-600">並び替え</span>
        </button>
      </div>

      {isSortModalOpen && (
        <>
          {/* Mask */}
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50 z-40" onClick={toggleSortModal}></div>

          {/* Modal Content */}
          <div className="fixed top-0 left-0 right-0 mx-auto mt-32 bg-white w-[800px] z-50 rounded-lg shadow-xl"> {/* Larger modal width and padding */}
            <div className="flex items-center mb-10 bg-amber-100 p-6 rounded-lg">
              {/* Sort Icon placed left of the title */}
              <img src="/public/images/sort.png" alt="Sort Icon" className="w-8 h-8 mr-4" /> {/* Smaller icon */}
              <h2 className="text-2xl font-bold text-gray-800">表示順を変える</h2>
              <button onClick={toggleSortModal} className="w-8 h-8 ml-auto">
                <img src="/public/images/batu.png" alt="Close" className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-10 px-10">
              <h3 className="text-2xl font-bold mb-2 text-gray-800">・名前</h3>
              <div className="grid grid-cols-2 gap-6">
                <button
                  onClick={() => updateSortOrder('name', 'asc')}
                  className={`w-full py-6 text-2xl rounded-xl ${sortOrder.type === 'name' && sortOrder.order === 'asc' ? 'bg-amber-300 border-[2px] border-white text-black' : 'bg-white border-[2px] border-amber-300 hover:bg-gray-100'}`}
                >
                  昇順：あ→ん
                </button>
                <button
                  onClick={() => updateSortOrder('name', 'desc')}
                  className={`w-full py-6 text-2xl rounded-xl ${sortOrder.type === 'name' && sortOrder.order === 'desc' ? 'bg-amber-300 border-[2px] border-white text-black' : 'bg-white border-[2px] border-amber-300 hover:bg-gray-100'}`}
                >
                  降順：ん→あ
                </button>
              </div>
            </div>

            <div className="mb-16 px-10">
              <h3 className="text-2xl font-bold mb-2 text-gray-800">・登録日</h3>
              <div className="grid grid-cols-2 gap-6">
                <button
                  onClick={() => updateSortOrder('id', 'asc')}
                  className={`w-full py-6 text-2xl rounded-xl ${sortOrder.type === 'id' && sortOrder.order === 'asc' ? 'bg-amber-300 border-[2px] border-white text-black' : 'bg-white border-[2px] border-amber-300 hover:bg-gray-100'}`}
                >
                  昇順：古→新
                </button>
                <button
                  onClick={() => updateSortOrder('id', 'desc')}
                  className={`w-full py-6 text-2xl rounded-xl ${sortOrder.type === 'id' && sortOrder.order === 'desc' ? 'bg-amber-300 border-[2px] border-white text-black' : 'bg-white border-[2px] border-amber-300 hover:bg-gray-100'}`}
                >
                  降順：新→古
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {sortedSongs.map((song, index) => (
        <SongData_x
          key={index}
          imgSrc={`http://127.0.0.1:5000/uploads/${song.image_file_url}`}
          imgAlt={song.music_name}
          songName={song.music_name}
          artistName={song.artist_name}
          songId={song.id}
        />
      ))}
    </div>
  );
};

export default Playlist;
