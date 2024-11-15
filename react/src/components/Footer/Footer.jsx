import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from './Slider';
import axios from 'axios';

const Footer = () => {
  const [music, setMusic] = useState({ music_name: '', artist_name: '', music_file_url: '', image_file_url: '' });
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = React.useRef(null);
  const [previousMusicUrl, setPreviousMusicUrl] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const fetchMusicData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/history/latest');
      const musicItem = response.data;
      if (musicItem && musicItem.music_file_url !== previousMusicUrl) {
        setMusic({
          music_name: musicItem.music_name,
          artist_name: musicItem.artist_name,
          music_file_url: musicItem.music_file_url,
          image_file_url: musicItem.image_file_url,
        });
        setPreviousMusicUrl(musicItem.music_file_url);

        // 新しい楽曲がロードされた後に再生を開始
        setIsPlaying(true);
        if (audioRef.current) {
          audioRef.current.src = `http://localhost:5000/uploads/${musicItem.music_file_url}`;
          audioRef.current.currentTime = 0;
          audioRef.current.volume = volume;
          audioRef.current.play();
        }
      }
    } catch (error) {
      console.error('Error fetching music data:', error);
    }
  };

  useEffect(() => {
    fetchMusicData();
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        if (audioRef.current.src !== `http://localhost:5000/uploads/${music.music_file_url}`) {
          audioRef.current.src = `http://localhost:5000/uploads/${music.music_file_url}`;
          audioRef.current.currentTime = 0;
        }
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('ended', handleAudioEnded);

      const intervalId = setInterval(() => {
        if (audio.currentTime && audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      }, 1000);

      return () => {
        clearInterval(intervalId);
        audio.removeEventListener('ended', handleAudioEnded);
      };
    }
  }, []);

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const handleVolumeClick = () => {
    if (isMuted) {
      setVolume(0.5);
      handleVolumeChange(0.5);
    } else {
      setVolume(0);
      handleVolumeChange(0);
    }
    setIsMuted(!isMuted);
  };

  return (
    <footer className="min-w-full h-[115px] bg-amber-50 text-black flex justify-between border-2 border-gray p-3 fixed bottom-0 z-20">
      <div className="absolute top-0 left-0 right-0 h-1 bg-white" style={{ width: '100%' }}>
        <div className="h-1 bg-gray-600" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex items-center">
        <img 
          src={`http://localhost:5000/uploads/${music.image_file_url}`}
          className="w-[80px] h-[80px] object-cover rounded-md shadow-md"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/80';
          }}
          alt="Music Cover"
        />

        <div className="ml-6">
          <div className="text-2xl font-sans cursor-pointer ">{music.music_name || 'Loading...'}</div>
          <Link to={`/artist/${encodeURIComponent(music.artist_name)}`} className="mt-1 text-xl cursor-pointer hover:underline text-gray-600">
            {music.artist_name || 'Loading...'}
          </Link>
        </div>  
      </div>

      <div className="flex items-center space-x-10">
        <button className="button-hover">
          <img src="/images/next.png" alt="left" className="transform -scale-x-100 w-[30px] h-[30px]" />
        </button>
        <button className="button-hover" onClick={togglePlayPause}>
          <img src={isPlaying ? "/images/play.png" : "/images/stop.png"} alt="play/pause" className={isPlaying ? "w-[35px] h-[35px]" : "w-[50px] h-[50px]"} />
        </button>
        <button className="button-hover">
          <img src="/images/next.png" alt="right" className="w-[30px] h-[30px]" />
        </button>
      </div>

      <div className="flex items-center mr-20">
        <button onClick={handleVolumeClick}>
          <img 
            src={isMuted ? "/images/mute.png" : (volume > 0 ? "/images/volume.png" : "/images/mute.png")} 
            alt="volume" 
            className="w-[30px] h-[30px] m-3" 
          />
        </button>
        <Slider onVolumeChange={handleVolumeChange} initialVolume={volume}/>
      </div>

      <audio ref={audioRef} />
    </footer>
  );
};

export default Footer;
