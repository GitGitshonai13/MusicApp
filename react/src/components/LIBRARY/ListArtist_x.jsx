import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ArtistList = () => {
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/playlist')
      .then(response => {
        const uniqueArtists = Array.from(new Set(response.data.map(song => song.artist_name)))
          .map(name => ({
            name,
            imageUrl: `/public/images/${name}.jpg`
          }));
        setArtists(uniqueArtists);
      })
      .catch(error => {
        console.error('アーティスト一覧の取得に失敗しました:', error);
        setError('アーティスト一覧の取得に失敗しました');
      });
  }, []);

  return (
    <div className="p-4">
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 m-8">
        {artists.map((artist, index) => (
          <Link
            to={`/artist/${artist.name}`}
            key={index}
            className="flex flex-col items-center bg-white p-2 rounded-lg  duration-200"
          >
            <img
              src={artist.imageUrl}
              alt={`${artist.name}の画像`}
              className="rounded-full w-72 h-72 object-cover"
            />
            <p className="text-xl  mt-2 text-center text-gray-800">{artist.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ArtistList;
