// AudioControls.js
import React from 'react';

const AudioControls = ({ handleFileChange, handlePlayPause, handleNext, isPlaying, currentSongName }) => {
  return (
    <div>
      <input type="file" accept=".mp3" onChange={handleFileChange} className="form-control mb-3" />
      <div className="d-flex justify-content-between">
        <button onClick={handlePlayPause} className="btn btn-primary">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={handleNext} className="btn btn-secondary">
          Next
        </button>
      </div>
      <div className="mt-3">Currently Playing: {currentSongName}</div>
    </div>
  );
};

export default AudioControls;
