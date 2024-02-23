// AudioPlayer.js
import React, { useState, useEffect, useRef } from 'react';
import AudioControls from './AudioControls'; // Import the AudioControls component
import Playlist from './Playlist'; // Import the Playlist component


const AudioPlayer = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audioRef, setAudioRef] = useState(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongName, setCurrentSongName] = useState('');
  const handleEndedRef = useRef();

  handleEndedRef.current = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  useEffect(() => {
    const savedTrackIndex = localStorage.getItem('currentTrackIndex');
    if (savedTrackIndex) {
      setCurrentTrackIndex(parseInt(savedTrackIndex, 10));
    }

    const savedPlaylist = JSON.parse(localStorage.getItem('playlist'));
    if (savedPlaylist) {
      setPlaylist(savedPlaylist);
    }

    setAudioRef(new Audio());
  }, []);

  useEffect(() => {
    localStorage.setItem('currentTrackIndex', currentTrackIndex);
    localStorage.setItem('playlist', JSON.stringify(playlist));
    setCurrentSongName(playlist[currentTrackIndex]?.name || '');
  }, [currentTrackIndex, playlist]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPlaylist([...playlist, file]);
  };

  const handlePlayPause = async () => {
    if (playlist.length === 0) {
      console.log('Playlist is empty');
      return;
    }

    try {
      if (audioRef.paused || audioRef.src === '') {
        // If audio is paused or no source, set the src and play
        audioRef.src = URL.createObjectURL(playlist[currentTrackIndex]);

        const savedTime = localStorage.getItem('currentTime');
        if (savedTime) {
          audioRef.currentTime = parseFloat(savedTime);
        }

        await audioRef.play();
        setIsPlaying(true);
      } else {
        // If audio is playing, pause it
        audioRef.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error during playback:', error);
    }
  };

  const handleNext = () => {
    if (isPlaying) {
      audioRef.pause();
      setIsPlaying(false);
    }

    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  const handleEnded = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  // ...

  useEffect(() => {
    audioRef.src = playlist[currentTrackIndex] && URL.createObjectURL(playlist[currentTrackIndex]);
  
    const playPromise = audioRef.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error('Error playing the next track:', error);
        });
    }
  
    // Remove the event listener after it's used to avoid memory leaks
    audioRef.onended = handleEnded;  // Use the handleEnded function directly
  
    return () => {
      audioRef.onended = null;
    };
  }, [currentTrackIndex, playlist, audioRef]);
  
  useEffect(() => {
    // Save current playback position
    localStorage.setItem('currentTime', audioRef.currentTime.toString());
  }, [audioRef.currentTime]);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">React Audio Player</h1>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <AudioControls
            handleFileChange={handleFileChange}
            handlePlayPause={handlePlayPause}
            handleNext={handleNext}
            isPlaying={isPlaying}
            currentSongName={currentSongName}
          />
          <Playlist playlist={playlist} />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
