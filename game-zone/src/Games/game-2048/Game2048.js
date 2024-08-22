import React, { useState, useEffect, useCallback } from 'react';
import './Game2048.css';

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
  const gameBoardRef = React.useRef(null);

  const handleSwipe = useCallback((e) => {
    if (gameOver) return;
    let newBoard;
    switch (e.type) {
      case 'swipeup':
        newBoard = move(board, 'up', setScore);
        break;
      case 'swipedown':
        newBoard = move(board, 'down', setScore);
        break;
      case 'swipeleft':
        newBoard = move(board, 'left', setScore);
        break;
      case 'swiperight':
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
    gameBoardRef.current.addEventListener('swipeup', handleSwipe);
    gameBoardRef.current.addEventListener('swipedown', handleSwipe);
    gameBoardRef.current.addEventListener('swipeleft', handleSwipe);
    gameBoardRef.current.addEventListener('swiperight', handleSwipe);
    return () => {
      gameBoardRef.current.removeEventListener('swipeup', handleSwipe);
      gameBoardRef.current.removeEventListener('swipedown', handleSwipe);
      gameBoardRef.current.removeEventListener('swipeleft', handleSwipe);
      gameBoardRef.current.removeEventListener('swiperight', handleSwipe);
    };
  }, [handleSwipe]);

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

  return (
    <div className="game-container">
      <div className="status">
        <h1 className="game-title">2048</h1>
        <div className="score-container">
          <div className="score-box">Score: {score}</div>
          <div className="best-score-box">Best: {bestScore}</div>
        </div>
        {gameOver ? 'Game Over!' : 'Swipe to move tiles'}
      </div>
      <div className="game-board" ref={gameBoardRef}>
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
        <p>Swipe on the game board to move the tiles. When two tiles with the same number touch, they merge into one! Reach the 2048 tile to win the game.</p>
      </div>
    </div>
  );
};

export default Game2048;
