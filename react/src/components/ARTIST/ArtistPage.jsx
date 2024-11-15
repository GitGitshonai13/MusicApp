import React from 'react';
import { useParams } from 'react-router-dom';
import Artist from './Artist'; // 汎用のArtistコンポーネント

const ArtistPage = () => {
  const { artistName } = useParams(); // URLからアーティスト名を取得
  return <Artist artistName={artistName} />;
};

export default ArtistPage;
