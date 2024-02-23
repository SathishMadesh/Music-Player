// Playlist.js
import React from 'react';

const Playlist = ({ playlist }) => {
  return (
    <ul className="list-group mt-3">
      {playlist.map((track, index) => (
        <li key={index} className="list-group-item">
          {track.name}
        </li>
      ))}
    </ul>
  );
};

export default Playlist;
