import React, { useState, useEffect, useRef, useCallback } from 'react';
import './DinoDash.css'; // Import your CSS file

const themes = {
  light: {
    backgroundColor: '#f0f0f0',
    dinoColor: '#00cc00',
    obstacleColor: '#ff3333',
    powerUpColor: '#ffd700',
    textColor: '#000000',
  },
  dark: {
    backgroundColor: '#121212',
    dinoColor: '#00ff00',
    obstacleColor: '#ff6600',
    powerUpColor: '#ffa500',
    textColor: '#ffffff',
  },
};

const DinoDash = () => {
  const [dino, setDino] = useState({ x: 50, y: 150 });
  const [obstacles, setObstacles] = useState([]);
  const [powerUps, setPowerUps] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [theme, setTheme] = useState('light');
  const [speed, setSpeed] = useState(5); // Adjust initial speed
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const isJumping = useRef(false); // Track if the dino is jumping

  // Define the draw function outside the useEffect hook
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the dinosaur
    ctx.fillStyle = themes[theme].dinoColor;
    ctx.fillRect(dino.x, dino.y, 20, 30);

    // Draw obstacles
    ctx.fillStyle = themes[theme].obstacleColor;
    obstacles.forEach((obstacle) => {
      ctx.fillRect(obstacle.x, obstacle.y, 20, 30);
    });

    // Draw power-ups
    ctx.fillStyle = themes[theme].powerUpColor;
    powerUps.forEach((powerUp) => {
      ctx.fillRect(powerUp.x, powerUp.y, 15, 15);
    });

    // Update score
    ctx.fillStyle = themes[theme].textColor;
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Check for game over
    if (gameOver) {
      ctx.font = '30px Arial';
      ctx.fillText('Game Over!', canvas.width / 2 - 70, canvas.height / 2);
      return;
    }

    // Move the dinosaur
    setDino((prevDino) => ({ ...prevDino, x: prevDino.x + speed }));

    // Generate obstacles
    if (Math.random() < 0.01) {
      setObstacles((prevObstacles) => [
        ...prevObstacles,
        { x: canvas.width, y: 150 },
      ]);
    }

    // Generate power-ups
    if (Math.random() < 0.005) {
      setPowerUps((prevPowerUps) => [
        ...prevPowerUps,
        { x: canvas.width, y: Math.random() * canvas.height },
      ]);
    }

    // Move obstacles and power-ups
    setObstacles((prevObstacles) =>
      prevObstacles.map((obstacle) => ({
        ...obstacle,
        x: obstacle.x - speed,
      }))
    );
    setPowerUps((prevPowerUps) =>
      prevPowerUps.map((powerUp) => ({
        ...powerUp,
        x: powerUp.x - speed,
      }))
    );

    // Remove off-screen obstacles and power-ups
    setObstacles((prevObstacles) =>
      prevObstacles.filter((obstacle) => obstacle.x > 0)
    );
    setPowerUps((prevPowerUps) =>
      prevPowerUps.filter((powerUp) => powerUp.x > 0)
    );

    // Check for collisions
    const isCollision = obstacles.some(
      (obstacle) =>
        dino.x < obstacle.x + 20 &&
        dino.x + 20 > obstacle.x &&
        dino.y < obstacle.y + 30 &&
        dino.y + 30 > obstacle.y
    );

    if (isCollision) {
      setGameOver(true);
      clearInterval(animationRef.current);
    }

    // Check for power-up collection
    const powerUpIndex = powerUps.findIndex(
      (powerUp) =>
        dino.x < powerUp.x + 15 &&
        dino.x + 20 > powerUp.x &&
        dino.y < powerUp.y + 15 &&
        dino.y + 30 > powerUp.y
    );

    if (powerUpIndex !== -1) {
      setPowerUps((prevPowerUps) => [
        ...prevPowerUps.slice(0, powerUpIndex),
        ...prevPowerUps.slice(powerUpIndex + 1),
      ]);
      setScore((prevScore) => prevScore + 10); // Increase score for power-up
      setSpeed((prevSpeed) => prevSpeed + 2); // Increase speed for power-up
    }

    // Update score based on distance
    setScore((prevScore) => prevScore + 1);
  }, [dino, obstacles, powerUps, gameOver, score, theme, speed]);

  const handleThemeChange = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Handle key presses for jumping and moving
  const handleKeyDown = useCallback((e) => {
    if (gameOver) return;

    if (e.key === 'ArrowUp' || e.key === ' ') {
      if (!isJumping.current) {
        isJumping.current = true;
        setDino((prevDino) => ({ ...prevDino, y: prevDino.y - 30 })); // Jump
        setTimeout(() => {
          isJumping.current = false;
          setDino((prevDino) => ({ ...prevDino, y: prevDino.y + 30 })); // Fall back down
        }, 300); // Adjust jump duration as needed
      }
    }
  }, [gameOver]);

  useEffect(() => {
    // Include 'handleKeyDown' in the dependency array
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, handleKeyDown]); // Include 'handleKeyDown'

  // Move the resetGame function outside the return statement
  const resetGame = () => {
    setDino({ x: 50, y: 150 });
    setObstacles([]);
    setPowerUps([]);
    setScore(0);
    setGameOver(false);
    setSpeed(5); // Reset speed
    clearInterval(animationRef.current);
    // Call the draw function to restart the animation
    animationRef.current = setInterval(draw, 40); 
  };

  return (
    <div
      className="dino-dash"
      style={{ backgroundColor: themes[theme].backgroundColor }}
    >
      <div className="header">
        <h1>Dino Dash</h1>
        <button className="theme-toggle-button" onClick={handleThemeChange}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
      <canvas ref={canvasRef} width="800" height="200" />
      {gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Your Score: {score}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default DinoDash;
