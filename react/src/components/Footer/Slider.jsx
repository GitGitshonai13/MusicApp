import React from 'react';

const Slider = ({ onVolumeChange, initialVolume }) => {
  const handleChange = (event) => {
    const volume = event.target.value;
    onVolumeChange(volume);
  };

  return (
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      onChange={handleChange}
      className="slider" // スライダーのスタイル
      style={{ width: '150px' }} // スライダーの幅を指定
      value={initialVolume} // 初期値を設定
    />
  );
};

export default Slider;
