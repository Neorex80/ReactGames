import React, { useState, useEffect, useRef } from 'react';
import './SnakeGame.css';

const themes = {
  light: {
    backgroundColor: '#f0f0f0',
    containerColor: '#ffffff',
    snakeColor: '#00cc00',
    foodColor: '#ff3333',
    bonusColor: '#ffd700', // Bonus points color
    textColor: '#000000',
  },
  dark: {
    backgroundColor: '#121212',
    containerColor: '#1e1e1e',
    snakeColor: '#00ff00',
    foodColor: '#ff6600',
    bonusColor: '#ffa500', // Bonus points color
    textColor: '#ffffff',
  },
};

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [bonus, setBonus] = useState(null);
  const [bonusDuration, setBonusDuration] = useState(0); // Track moves left for the bonus point
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [personalBest, setPersonalBest] = useState(0);
  const [theme, setTheme] = useState('light');
  const [speed, setSpeed] = useState(200);
  const boardSize = 20;

  const directionRef = useRef(direction);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (directionRef.current.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (directionRef.current.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (directionRef.current.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    const gameInterval = setInterval(() => {
      if (gameOver) return;

      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };
        head.x += directionRef.current.x;
        head.y += directionRef.current.y;

        if (head.x === food.x && head.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize),
          });
          setScore((prevScore) => prevScore + 1);
        } else {
          newSnake.pop();
        }

        // Handle bonus point collection
        if (bonus && head.x === bonus.x && head.y === bonus.y) {
          setBonus(null);
          setBonusDuration(0); // Reset bonus duration
          setScore((prevScore) => prevScore + 5);
        }

        // Bonus point timing out
        if (bonusDuration > 0) {
          setBonusDuration((duration) => duration - 1);
          if (bonusDuration === 1) {
            setBonus(null);
          }
        }

        // Increase speed at every 50 points
        if (score > 0 && score % 50 === 0) {
          setSpeed((prevSpeed) => Math.max(prevSpeed * 0.95, 50)); // Increase speed, but not too fast
        }

        // Rarity: Randomly generate bonus points with a lower chance and limited visibility
        if (!bonus && Math.random() < 0.005) { // 0.5% chance to generate bonus on each move
          setBonus({
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize),
          });
          setBonusDuration(30); // Bonus point will disappear after 30 moves if not collected
        }

        if (
          head.x < 0 ||
          head.x >= boardSize ||
          head.y < 0 ||
          head.y >= boardSize ||
          newSnake.some(segment => segment.x === head.x && segment.y === head.y)
        ) {
          setGameOver(true);
          if (score > personalBest) {
            setPersonalBest(score);
           }
           return prevSnake;
        }

        newSnake.unshift(head);
        return newSnake;
      });
    }, speed);

    return () => clearInterval(gameInterval);
  }, [food, bonus, bonusDuration, gameOver, score, personalBest, speed]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setBonus(null);
    setBonusDuration(0);
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
    setSpeed(200); // Reset speed
  };

  const handleThemeChange = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="snake-game" style={{ backgroundColor: themes[theme].backgroundColor, color: themes[theme].textColor }}>
      <div className="header">
        <h1>Snake Rush</h1>
        <button className="theme-toggle-button" onClick={handleThemeChange}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
      <div className="scoreboard">
        <div>Score: {score}</div>
        <div>Personal Best: {personalBest}</div>
      </div>
      <div className="board" style={{ '--size': boardSize, backgroundColor: themes[theme].containerColor }}>
        {snake.map((segment, index) => (
          <div
            key={index}
            className="snake-segment"
            style={{
              gridRowStart: segment.y + 1,
              gridColumnStart: segment.x + 1,
              backgroundColor: themes[theme].snakeColor,
            }}
          ></div>
        ))}
        <div
          className="food"
          style={{
            gridRowStart: food.y + 1,
            gridColumnStart: food.x + 1,
            backgroundColor: themes[theme].foodColor,
          }}
        ></div>
        {bonus && (
          <div
            className="bonus"
            style={{
              gridRowStart: bonus.y + 1,
              gridColumnStart: bonus.x + 1,
              backgroundColor: themes[theme].bonusColor,
              animation: 'bonus-blink 1s linear infinite', // Add a blinking animation
            }}
          ></div>
        )}
      </div>
      {gameOver && <div className="game-over">Game Over</div>}
      <button onClick={resetGame}>Restart</button>
      {/* On-screen controls for mobile devices */}
      <div className="controls">
        <button onClick={() => setDirection({ x: 0, y: -1 })}>↑</button>
        <button onClick={() => setDirection({ x: -1, y: 0 })}>←</button>
        <button onClick={() => setDirection({ x: 1, y: 0 })}>→</button>
        <button onClick={() => setDirection({ x: 0, y: 1 })}>↓</button>
      </div>
    </div>
  );
};

export default SnakeGame;

