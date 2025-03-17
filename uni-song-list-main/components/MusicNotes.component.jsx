import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

const MusicNotes = () => {
  const [notes, setNotes] = useState([]);

  const generateNotes = () => {
    const musicSymbols = ['♫', '♪', '♬', '🎶', '♬', '♪', '♫', '♬', '♪', '♫'];
    return [...Array(20)].map(() => {
      const randomRotationDirection = Math.random() > 0.5 ? 1 : -1;
      const randomRotation = Math.random() * 90 * randomRotationDirection;
      const randomDuration = Math.random() * 10 + 20;
      const randomDelay = Math.random() * 30;
      const randomSymbol = musicSymbols[Math.floor(Math.random() * musicSymbols.length)];
      const left = Math.random() * window.innerWidth;
      const top = Math.random() * (window.innerHeight * 0.5);
      const endTop = top + Math.random() * (window.innerHeight - top);

      return {
        left: `${left}px`,
        top: `${top}px`,
        endTop: `${endTop}px`,
        animationDuration: `${randomDuration}s`,
        animationDelay: `${randomDelay}s`,
        fontSize: `${Math.random() * 24 + 12}px`,
        color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.55)`,
        transform: `rotate(${randomRotation}deg)`,
        '--rotation-direction': randomRotationDirection,
        symbol: randomSymbol,
      };
    });
  };

  useEffect(() => {
    setNotes(generateNotes());

    const handleAnimationEnd = (event) => {
      setNotes((prevNotes) => {
        const remainingNotes = prevNotes.filter((note, index) => index !== Number(event.target.dataset.noteId));
        const newNote = generateNotes()[0];
        return [...remainingNotes, newNote];
      });
    };

    const noteElements = document.querySelectorAll(`.${styles.musicNote}`);
    noteElements.forEach((note) => {
      note.addEventListener('animationend', handleAnimationEnd);
    });

    return () => {
      noteElements.forEach((note) => {
        note.removeEventListener('animationend', handleAnimationEnd);
      });
    };
  }, []);

  return (
    <div className={styles.musicNotesContainer}>
      {notes.map((note, index) => (
        <div
          key={index}
          className={styles.musicNote}
          style={{
            position: 'absolute',
            left: note.left,
            top: note.top,
            animationDuration: note.animationDuration,
            animationDelay: note.animationDelay,
            fontSize: note.fontSize,
            color: note.color,
            transform: note.transform,
            '--rotation-direction': note['--rotation-direction'],
            '--end-top': note.endTop,
          }}
          data-note-id={index}
        >
          {note.symbol}
        </div>
      ))}
    </div>
  );
};

export default MusicNotes;