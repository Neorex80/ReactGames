import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Game2048.css';
import HomeButton from '../../Homepage/Homebutton';

const initialBoard = () => {
  let board = Array(4).fill(null).map(() => Array(4).fill(0));
  addRandomTile(board);
  addRandomTile(board);
  return board;
};

const addRandomTile = (board) => {
  let emptyCells = [];
  board.forEach((row, i) => row.forEach((cell, j) => {
    if (cell === 0) emptyCells.push([i, j]);
  }));
  const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[i][j] = Math.random() < 0.9 ? 2 : 4;
};

const merge = (row, setScore) => {
  let newRow = row.filter(val => val !== 0);
  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      setScore(prev => prev + newRow[i]);
      newRow[i + 1] = 0;
    }
  }
  newRow = newRow.filter(val => val !== 0);
  while (newRow.length < 4) newRow.push(0);
  return newRow;
};

const transpose = (matrix) => matrix[0].map((_, i) => matrix.map(row => row[i]));

const move = (board, direction, setScore) => {
  let newBoard = [...board];
  if (direction === 'left' || direction === 'right') {
    newBoard = newBoard.map(row => direction === 'left' ? merge(row, setScore) : merge(row.reverse(), setScore).reverse());
  } else {
    newBoard = transpose(newBoard);
    newBoard = newBoard.map(row => direction === 'up' ? merge(row, setScore) : merge(row.reverse(), setScore).reverse());
    newBoard = transpose(newBoard);
  }
  return newBoard;
};

const Game2048 = () => {
  const [board, setBoard] = useState(initialBoard);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [swipeStart, setSwipeStart] = useState({ x: 0, y: 0 });
  const gameBoardRef = useRef(null);
  const animationRef = useRef(null);

  const handleSwipeStart = useCallback((e) => {
    const touch = e.touches[0];
    setSwipeStart({ x: touch.clientX, y: touch.clientY });
  }, []);

  const handleSwipeMove = useCallback((e) => {
    if (gameOver) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - swipeStart.x;
    const deltaY = touch.clientY - swipeStart.y;

    if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
      let newBoard;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        newBoard = deltaX > 0 ? move(board, 'right', setScore) : move(board, 'left', setScore);
      } else {
        newBoard = deltaY > 0 ? move(board, 'down', setScore) : move(board, 'up', setScore);
      }

      if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
        addRandomTile(newBoard);
        setBoard(newBoard);
        checkGameOver(newBoard);
      }
    }
  }, [board, gameOver, swipeStart]);

  const handleKeyDown = useCallback((e) => {
    if (gameOver) return;
    let newBoard;
    switch (e.key) {
      case 'ArrowUp':
        newBoard = move(board, 'up', setScore);
        break;
      case 'ArrowDown':
        newBoard = move(board, 'down', setScore);
        break;
      case 'ArrowLeft':
        newBoard = move(board, 'left', setScore);
        break;
      case 'ArrowRight':
        newBoard = move(board, 'right', setScore);
        break;
      default:
        return;
    }
    if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
      addRandomTile(newBoard);
      setBoard(newBoard);
      checkGameOver(newBoard);
    }
  }, [board, gameOver]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const checkGameOver = (board) => {
    const hasMoves = board.some((row, i) => row.some((cell, j) => {
      if (cell === 0) return true;
      if (i < 3 && cell === board[i + 1][j]) return true;
      if (j < 3 && cell === board[i][j + 1]) return true;
      return false;
    }));
    if (!hasMoves) setGameOver(true);
  };

  const resetGame = () => {
    setBoard(initialBoard());
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
    }
  }, [score, bestScore]);

  const animateMerge = (mergedCells) => {
    mergedCells.forEach(([i, j]) => {
      const cell = gameBoardRef.current.querySelector(`.board-cell:nth-child(${i * 4 + j + 1})`);
      cell.style.transition = 'transform 0.2s ease-in-out';
      cell.style.transform = 'scale(1.2)';
      setTimeout(() => {
        cell.style.transform = 'scale(1)';
      }, 200);
    });
  };

  const handleMove = (newBoard) => {
    if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
      const mergedCells = [];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (board[i][j] !== newBoard[i][j] && newBoard[i][j] !== 0) {
            mergedCells.push([i, j]);
          }
        }
      }
      addRandomTile(newBoard);
      setBoard(newBoard);
      checkGameOver(newBoard);
      animateMerge(mergedCells);
    }
  };

  return (
    <div className="game-container" onTouchStart={handleSwipeStart} onTouchMove={handleSwipeMove} ref={gameBoardRef}>
      <div className="status">
        <h1 className="game-title">2048</h1>
        <div>
          <HomeButton/>
        </div>
        <div className="score-container">
          <div className="score-box">Score: {score}</div>
          <div className="best-score-box">Best: {bestScore}</div>
        </div>
        {gameOver ? 'Game Over!' : 'Swipe or use arrow keys to move tiles'}
      </div>
      <div className="game-board">
        {board.map((row, i) => (
          <div key={i} className="board-row">
            {row.map((cell, j) => (
              <div key={j} className={`board-cell value-${cell}`}>
                {cell > 0 ? cell : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button className="reset-button" onClick={resetGame}>Reset</button>
      <div className="how-to-play">
        <h2>How to Play</h2>
        <p>Swipe on the game board or use arrow keys to move the tiles. When two tiles with the same number touch, they merge into one! Reach the 2048 tile to win the game.</p>
      </div>
    </div>
  );
};

export default Game2048;
