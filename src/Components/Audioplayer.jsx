import React, { useState, useEffect } from 'react';

const AudioPlayer = () => {
    const [playlist, setPlaylist] = useState([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [audioRef, setAudioRef] = useState(new Audio());

    useEffect(() => {
        // Load the last playing audio file and position on component mount
        const savedTrackIndex = localStorage.getItem('currentTrackIndex');
        if (savedTrackIndex) {
            setCurrentTrackIndex(parseInt(savedTrackIndex, 10));
        }

        const savedPlaylist = JSON.parse(localStorage.getItem('playlist'));
        if (savedPlaylist) {
            setPlaylist(savedPlaylist);
            // Check if there is a last playing audio file
            const lastPlayingTrack = savedPlaylist[parseInt(savedTrackIndex, 10)];
            if (lastPlayingTrack) {
                audioRef.current.src = URL.createObjectURL(lastPlayingTrack);
                audioRef.current.play();
            }
        }
    }, []);

    useEffect(() => {
        // Save current playing track and position on change
        localStorage.setItem('currentTrackIndex', currentTrackIndex);
        localStorage.setItem('playlist', JSON.stringify(playlist));
    }, [currentTrackIndex, playlist]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setPlaylist([...playlist, file]);
    };

    const handlePlay = (index) => {
        setCurrentTrackIndex(index);
      
        const file = playlist[index];
        const objectURL = URL.createObjectURL(file);
      
        audioRef.current.pause();
        audioRef.current.src = objectURL;
        audioRef.current.load();
        audioRef.current.play();
      };

    const handleNext = () => {
        setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
    };

    const handleEnded = () => {
        // Play the next track when the current one ends
        handleNext();
    };

    return (
        <div>
            <input type="file" accept=".mp3" onChange={handleFileChange} />
            <button onClick={() => handlePlay(currentTrackIndex)}>Play</button>
            <button onClick={handleNext}>Next</button>
            <audio ref={(ref) => setAudioRef(ref)} onEnded={handleEnded} />
            <ul>
                {playlist.map((track, index) => (
                    <li key={index}>{track.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default AudioPlayer;
