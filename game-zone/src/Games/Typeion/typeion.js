import React, { useState, useEffect, useRef } from 'react';
import './typeion.css';

const TypingGame = () => {
  const [mode, setMode] = useState('normal'); // 'normal' or 'time'
  const [textToType, setTextToType] = useState('');
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeLimit, setTimeLimit] = useState(60); // Time limit in seconds for time mode
  const [wordsTyped, setWordsTyped] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchRandomText = async () => {
      try {
        const response = await fetch('https://api.quotable.io/random');
        const data = await response.json();
        setTextToType(data.content);
      } catch (error) {
        console.error('Error fetching random text:', error);
        setTextToType('The quick brown fox jumps over the lazy dog.'); // Default text
      }
    };

    fetchRandomText();
  }, []);

  useEffect(() => {
    if (mode === 'time' && startTime && !endTime) {
      const timer = setTimeout(() => {
        setEndTime(Date.now());
      }, timeLimit * 1000);

      return () => clearTimeout(timer);
    }
  }, [mode, startTime, endTime, timeLimit]);

  const handleInputChange = (e) => {
    setTypedText(e.target.value);
  };

  const startGame = () => {
    setStartTime(Date.now());
    setTypedText('');
    inputRef.current.focus();
  };

  const calculateWpm = () => {
    const timeTaken = (endTime - startTime) / 60000; // Time in minutes
    const words = typedText.trim().split(/\s+/).length;
    const calculatedWpm = Math.round(words / timeTaken);
    setWpm(calculatedWpm);
  };

  const calculateAccuracy = () => {
    const correctChars = typedText
      .split('')
      .filter((char, index) => char === textToType[index]).length;
    const accuracy = Math.round((correctChars / textToType.length) * 100);
    setAccuracy(accuracy);
  };

  const handleFinish = () => {
    setEndTime(Date.now());
    calculateWpm();
    calculateAccuracy();
  };

  const resetGame = () => {
    setStartTime(null);
    setEndTime(null);
    setTypedText('');
    setWordsTyped(0);
    setWpm(0);
    setAccuracy(0);
    inputRef.current.value = '';
  };

  return (
    <div className="typing-game">
      <h1 className="game-title">Typing Game</h1>
      <div className="mode-selection">
        <button
          className={`mode-button ${mode === 'normal' ? 'active' : ''}`}
          onClick={() => setMode('normal')}
        >
          Normal Mode
        </button>
        <button
          className={`mode-button ${mode === 'time' ? 'active' : ''}`}
          onClick={() => setMode('time')}
        >
          Race Against Time
        </button>
      </div>
      {mode === 'time' && (
        <div className="time-limit">
          Time Limit: {timeLimit} seconds
        </div>
      )}
      <div className="text-container">
        <p className="text-to-type">{textToType}</p>
        <textarea
          className="typed-text"
          placeholder="Start typing here..."
          value={typedText}
          onChange={handleInputChange}
          ref={inputRef}
          disabled={!startTime}
        />
      </div>
      {startTime && !endTime && (
        <div className="timer">
          Time: {Math.round((Date.now() - startTime) / 1000)} seconds
        </div>
      )}
      {endTime && (
        <div className="results">
          <h2>Results</h2>
          <p>Words Typed: {wordsTyped}</p>
          <p>WPM: {wpm}</p>
          <p>Accuracy: {accuracy}%</p>
        </div>
      )}
      <div className="buttons">
        {startTime && !endTime ? (
          <button className="start-button" onClick={handleFinish}>
            Finish
          </button>
        ) : (
          <button className="start-button" onClick={startGame}>
            Start
          </button>
        )}
        <button className="reset-button" onClick={resetGame}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default TypingGame;
