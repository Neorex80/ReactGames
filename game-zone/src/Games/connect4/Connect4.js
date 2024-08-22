import React, { useState } from 'react';
import './Connect4.css';

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

const getAvailableColumns = (board) => {
  const availableCols = [];
  for (let col = 0; col < COLS; col++) {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!board[row][col]) {
        availableCols.push(col);
        break;
      }
    }
  }
  return availableCols;
};

const getBestMove = (board, player) => {
  const availableCols = getAvailableColumns(board);
  let bestMove = availableCols[0]; // Default to the first available column
  let bestScore = -Infinity;

  for (let col of availableCols) {
    const newBoard = [...board];
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!newBoard[row][col]) {
        newBoard[row][col] = player;
        break;
      }
    }

    // Evaluate the move using a simple heuristic (can be improved)
    const score = evaluateMove(newBoard, player);
    if (score > bestScore) {
      bestScore = score;
      bestMove = col;
    }
  }

  return bestMove;
};

const evaluateMove = (board, player) => {
  // Simple heuristic: prioritize winning moves, then blocking opponent's wins
  if (checkWin(board, player)) {
    return Infinity; // Winning move is the best
  }

  const opponent = player === 'red' ? 'yellow' : 'red';
  if (checkWin(board, opponent)) {
    return -Infinity; // Blocking opponent's win is important
  }

  // ... (Add more sophisticated heuristics here if needed)

  return 0; // Neutral score for other moves
};

const Connect4 = () => {
  const [board, setBoard] = useState(initialBoard());
  const [player, setPlayer] = useState('red');
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState({ red: 0, yellow: 0 });
  const [bestScore, setBestScore] = useState({ red: 0, yellow: 0 });
  const [mode, setMode] = useState('player'); // 'player' or 'ai'

  const handleClick = (col) => {
    if (winner || mode === 'ai') return;

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
    }

    setBoard(newBoard);
  };

  const handleAIMove = () => {
    if (winner) return;

    const aiMove = getBestMove(board, 'yellow');
    handleClick(aiMove);
  };

  const resetGame = () => {
    setBoard(initialBoard());
    setPlayer('red');
    setWinner(null);
  };

  return (
    <div className="c4-game-container">
      <div className="c4-status">
        {winner ? `${winner.toUpperCase()} wins!` : `Current Player: ${player.toUpperCase()}`}
      </div>
      <div className="c4-scoreboard">
        <div>Red: {score.red}</div>
        <div>Yellow: {score.yellow}</div>
        <div>Best Red: {bestScore.red}</div>
        <div>Best Yellow: {bestScore.yellow}</div>
      </div>
      <div className="c4-game-board">
        {board[0].map((_, col) => (
          <div key={col} className="c4-column" onClick={() => handleClick(col)}>
            {board.map((row, rIdx) => (
              <div key={rIdx} className={`c4-cell ${board[rIdx][col] ? board[rIdx][col] : ''}`}></div>
            ))}
          </div>
        ))}
      </div>
      <button className="c4-reset-button" onClick={resetGame}>Reset</button>
      <div className="c4-how-to-play">
        <h2>How to Play</h2>
        <p>Connect 4 pieces vertically, horizontally, or diagonally to win. Take turns dropping pieces with the red and yellow players. The first to connect four wins!</p>
      </div>
      <div>
        <label htmlFor="mode-select">Select Mode:</label>
        <select id="mode-select" value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="player">Player vs Player</option>
          <option value="ai">Player vs AI</option>
        </select>
      </div>
      {mode === 'ai' && !winner && (
        <button className="c4-reset-button" onClick={handleAIMove}>AI Move</button>
      )}
    </div>
  );
};

export default Connect4;
