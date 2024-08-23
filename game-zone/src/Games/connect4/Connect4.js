import React, { useState } from 'react';
import './Connect4.css';
import { gsap } from 'gsap';
import HomeButton from '../../Homepage/Homebutton';

const ROWS = 6;
const COLS = 7;

const initialBoard = () => Array(ROWS).fill(null).map(() => Array(COLS).fill(null));

const checkWin = (board, player) => {
  const directions = [
    { r: 0, c: 1 }, // Horizontal
    { r: 1, c: 0 }, // Vertical
    { r: 1, c: 1 }, // Diagonal \
    { r: 1, c: -1 } // Diagonal /
  ];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] === player) {
        for (let { r: dr, c: dc } of directions) {
          if (
            r + 3 * dr < ROWS &&
            c + 3 * dc < COLS &&
            c + 3 * dc >= 0 &&
            board[r + dr]?.[c + dc] === player &&
            board[r + 2 * dr]?.[c + 2 * dc] === player &&
            board[r + 3 * dr]?.[c + 3 * dc] === player
          ) {
            return true;
          }
        }
      }
    }
  }
  return false;
};                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 

const Connect4 = () => {
  const [board, setBoard] = useState(initialBoard());
  const [player, setPlayer] = useState('red');
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState({ red: 0, yellow: 0 });
  const [bestScore, setBestScore] = useState({ red: 0, yellow: 0 });
  const [playMode, setPlayMode] = useState('Player vs Player');
  const [difficulty, setDifficulty] = useState('medium');

  const handleClick = (col) => {
    if (winner) return;

    const newBoard = [...board];
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!newBoard[row][col]) {
        newBoard[row][col] = player;
        break;
      }
    }

    if (checkWin(newBoard, player)) {
      setWinner(player);
      setScore((prev) => ({
        ...prev,
        [player]: prev[player] + 1,
      }));
      if (score[player] + 1 > bestScore[player]) {
        setBestScore((prev) => ({
          ...prev,
          [player]: score[player] + 1,
        }));
      }
    } else {
      setPlayer(player === 'red' ? 'yellow' : 'red');
      if (playMode === 'Player vs Computer' && player === 'red') {
        computerMove(newBoard);
      }
    }

    setBoard(newBoard);
  };

  const computerMove = (board) => {
    let availableCols = [];
    for (let col = 0; col < COLS; col++) {
      if (board[0][col] === null) availableCols.push(col);
    }

    let chosenCol;
    if (difficulty === 'hard') {
      // Simple AI strategy: block or win if possible
      chosenCol = blockOrWin(board, 'yellow') || blockOrWin(board, 'red') || availableCols[Math.floor(Math.random() * availableCols.length)];
    } else {
      chosenCol = availableCols[Math.floor(Math.random() * availableCols.length)];
    }

    for (let row = ROWS - 1; row >= 0; row--) {
      if (!board[row][chosenCol]) {
        board[row][chosenCol] = 'yellow';
        break;
      }
    }

    if (checkWin(board, 'yellow')) {
      setWinner('yellow');
      setScore((prev) => ({
        ...prev,
        yellow: prev.yellow + 1,
      }));
      if (score.yellow + 1 > bestScore.yellow) {
        setBestScore((prev) => ({
          ...prev,
          yellow: score.yellow + 1,
        }));
      }
    } else {
      setPlayer('red');
    }
  };

  const blockOrWin = (board, player) => {
    for (let col = 0; col < COLS; col++) {
      let tempBoard = board.map(row => [...row]);
      for (let row = ROWS - 1; row >= 0; row--) {
        if (!tempBoard[row][col]) {
          tempBoard[row][col] = player;
          if (checkWin(tempBoard, player)) return col;
          break;
        }
      }
    }
    return null;
  };

  const resetGame = () => {
    setBoard(initialBoard());
    setPlayer('red');
    setWinner(null);
  };

  return (
    <div className="c4-container">
      <h1 className="tic-title">Connect4</h1>
      <div>
        <HomeButton/>
      </div>
      <div className="c4-status">
        {winner ? `${winner.toUpperCase()} wins!` : `Current Player: ${player.toUpperCase()}`}
      </div>
      <div className="c4-controls">
        <div className="mode-selection">
          <button className="button" onClick={() => setPlayMode('Player vs Player')}>Player vs Player</button>
          <button className="button" onClick={() => setPlayMode('Player vs Computer')}>Player vs Computer</button>
          {playMode === 'Player vs Computer' && (
            <div className="c4-difficulty-select">
              <label>
                Difficulty:
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </label>
            </div>
          )}
        </div>
      </div>
      <div className="c4-game-board">
        {board[0].map((_, col) => (
          <div key={col} className="c4-column" onClick={() => handleClick(col)}>
            {board.map((row, rIdx) => (
              <div key={rIdx} className={`c4-cell ${board[rIdx][col]}`}></div>
            ))}
          </div>
        ))}
      </div>
      <button className="button" onClick={resetGame}>Reset</button>
      <div className="c4-how-to-play">
        <h2>How to Play</h2>
        <p>Connect 4 pieces vertically, horizontally, or diagonally to win. Take turns dropping pieces with the red and yellow players. The first to connect four wins!</p>
      </div>
    </div>
  );
};

export default Connect4;
