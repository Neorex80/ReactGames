import React, { useState, useEffect } from 'react';
import './GameBoard.css';
import ResultDialog from './ResultDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faUser, faRobot, faTimes, faCircle } from '@fortawesome/free-solid-svg-icons';

const themes = {
  light: {
    backgroundColor: '#f0f0f0',
    hoverColor: '#ddd',
    winningColor: '#a0ffa0',
  },
  dark: {
    backgroundColor: '#333',
    hoverColor: '#444',
    winningColor: '#a0ffa0',
  },
  colorful: {
    backgroundColor: '#ffef62',
    hoverColor: '#ffd54f',
    winningColor: '#ffeb3b',
  },
};

const GameBoard = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameMode, setGameMode] = useState('PvP');
  const [winnerLine, setWinnerLine] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [theme, setTheme] = useState('light');
  const [boardSize, setBoardSize] = useState(3);
  const [scores, setScores] = useState({ X: 0, O: 0, ties: 0 });

  useEffect(() => {
    if (gameMode === 'PvB' && !isXNext && !winner) {
      const botIndex = botMove(board);
      const newBoard = board.slice();
      newBoard[botIndex] = 'O';
      setBoard(newBoard);
      setIsXNext(true);
    }
  }, [isXNext, board, gameMode, winner]);

  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) {
      setWinner(winner.winner);
      setWinnerLine(winner.line);
      setResultMessage(`Winner: ${winner.winner}`);
      setScores((prevScores) => ({
        ...prevScores,
        [winner.winner]: prevScores[winner.winner] + 1,
      }));
      setIsDialogOpen(true);
    } else if (!board.includes(null)) {
      setResultMessage('It\'s a Tie!');
      setScores((prevScores) => ({ ...prevScores, ties: prevScores.ties + 1 }));
      setIsDialogOpen(true);
    }
  }, [board]);

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const botMove = (board) => {
    const lines = getWinningLines(boardSize);

    // Try to win
    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] === 'O' && board[a] === board[b] && !board[c]) return c;
      if (board[a] === 'O' && board[a] === board[c] && !board[b]) return b;
      if (board[b] === 'O' && board[b] === board[c] && !board[a]) return a;
    }

    // Block player from winning
    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] === 'X' && board[a] === board[b] && !board[c]) return c;
      if (board[a] === 'X' && board[a] === board[c] && !board[b]) return b;
      if (board[b] === 'X' && board[b] === board[c] && !board[a]) return a;
    }

    // Choose a random available square
    let availableSquares = [];
    board.forEach((square, index) => {
      if (!square) availableSquares.push(index);
    });

    return availableSquares[Math.floor(Math.random() * availableSquares.length)];
  };

  const calculateWinner = (board) => {
    const lines = getWinningLines(boardSize);

    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line };
      }
    }
    return null;
  };

  const getWinningLines = (size) => {
    const lines = [];
    for (let i = 0; i < size; i++) {
      // Rows
      lines.push(Array.from({ length: size }, (_, k) => i * size + k));
      // Columns
      lines.push(Array.from({ length: size }, (_, k) => i + k * size));
    }
    // Diagonals
    lines.push(Array.from({ length: size }, (_, k) => k * (size + 1)));
    lines.push(Array.from({ length: size }, (_, k) => (k + 1) * (size - 1)));
    return lines;
  };

  const status = winner ? `Winner: ${winner}` : `Next player: ${isXNext ? 'X' : 'O'}`;

  const handleGameModeChange = (event) => {
    setGameMode(event.target.value);
    resetGame(boardSize);
  };

  const handleThemeChange = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleBoardSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setBoardSize(newSize);
    resetGame(newSize);
  };

  const resetGame = (size) => {
    setBoard(Array(size * size).fill(null));
    setIsXNext(true);
    setWinnerLine(null);
    setWinner(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetGame(boardSize);
  };

  const themeStyles = themes[theme];

 return (
    <div className="game-board">
      <h1 className="game-title">Tic Tac Toe</h1>
      <button className="theme-toggle-button" onClick={handleThemeChange}>
        <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
      </button>
      <div className="scoreboard-container">
        <div className="score-section">
          <h3>Player X</h3>
          <p>{scores.X}</p>
        </div>
        <div className="score-section">
          <h3>Player O</h3>
          <p>{scores.O}</p>
        </div>
        <div className="score-section">
          <h3>Ties</h3>
          <p>{scores.ties}</p>
        </div>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="PvP"
            checked={gameMode === 'PvP'}
            onChange={handleGameModeChange}
          />
          <FontAwesomeIcon icon={faUser} /> vs <FontAwesomeIcon icon={faUser} />
        </label>
        <label>
          <input
            type="radio"
            value="PvB"
            checked={gameMode === 'PvB'}
            onChange={handleGameModeChange}
          />
          <FontAwesomeIcon icon={faUser} /> vs <FontAwesomeIcon icon={faRobot} />
        </label>
      </div>
      <div>
        <label>
          Board Size:
          <select value={boardSize} onChange={handleBoardSizeChange}>
            <option value="3">3x3</option>
            <option value="4">4x4</option>
          </select>
        </label>
      </div>
      <div
        className="board"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, 100px)`,
        }}
      >
        {board.map((value, index) => (
          <div
            key={index}
            className={`square ${winnerLine && winnerLine.includes(index) ? 'winning-square' : ''}`}
            onClick={() => handleClick(index)}
            style={{
              backgroundColor: themeStyles.backgroundColor,
              '--hover-color': themeStyles.hoverColor,
              '--winning-color': themeStyles.winningColor,
            }}
          >
            {value === 'X' ? <FontAwesomeIcon icon={faTimes} /> : value === 'O' ? <FontAwesomeIcon icon={faCircle} /> : null}
          </div>
        ))}
      </div>
      <button className="reset-button" onClick={handleCloseDialog}>Reset</button>
      <ResultDialog isOpen={isDialogOpen} onClose={handleCloseDialog} result={resultMessage} />
    </div>
  );
};
export default GameBoard;
