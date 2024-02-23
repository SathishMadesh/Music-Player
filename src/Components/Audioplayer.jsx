import React, { useState, useEffect, useRef } from 'react';

const AudioPlayer = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audioRef, setAudioRef] = useState(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongName, setCurrentSongName] = useState('');
  const handleEndedRef = useRef();

  // Assign the handleEnded function to the ref
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
    audioRef.onended = () => {
      handleEnded();
      handleEndedRef.current();
    };

    return () => {
      audioRef.onended = null;
    };
  }, [currentTrackIndex, playlist, audioRef]);

  useEffect(() => {
    // Save current playback position
    localStorage.setItem('currentTime', audioRef.currentTime.toString());
  }, [audioRef.currentTime]);

  return (
    <div>
      <input type="file" accept=".mp3" onChange={handleFileChange} />
      <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      <button onClick={handleNext}>Next</button>
      <div>Currently Playing: {currentSongName}</div>
      <ul>
        {playlist.map((track, index) => (
          <li key={index}>{track.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AudioPlayer;
