import React, { useState, useCallback, useEffect } from 'react';
import './TicTacToe.css';
import HomeButton from '../../Homepage/Homebutton';

const X_ICON = (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke="#ffde59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 6L18 18" stroke="#ffde59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const O_ICON = (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#a9d8f0" strokeWidth="2"/>
  </svg>
);

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameMode, setGameMode] = useState('PVP');
  const [dialog, setDialog] = useState({ open: false, result: null });
  const [scores, setScores] = useState({ X: 0, O: 0, ties: 0 });

  useEffect(() => {
    if (gameMode === 'CPU' && !isXNext && !dialog.open) {
      setTimeout(() => computerMove(board), 500);
    }
  }, [isXNext, board, gameMode, dialog.open]);

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || dialog.open) return;

    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const winner = checkWinner(newBoard);
    if (winner) {
      setDialog({ open: true, result: `${winner} Wins!` });
      setScores((prevScores) => ({
        ...prevScores,
        [winner]: prevScores[winner] + 1,
      }));
    } else if (!newBoard.includes(null)) {
      setDialog({ open: true, result: 'It\'s a Tie!' });
      setScores((prevScores) => ({ ...prevScores, ties: prevScores.ties + 1 }));
    }
  };

  const computerMove = useCallback((newBoard) => {
    let availableMoves = newBoard.map((value, index) => value === null ? index : null).filter(value => value !== null);
    
    const winningMove = findBestMove(newBoard, 'O');
    if (winningMove !== null) {
      newBoard[winningMove] = 'O';
    } else {
      const blockingMove = findBestMove(newBoard, 'X');
      if (blockingMove !== null) {
        newBoard[blockingMove] = 'O';
      } else {
        newBoard[availableMoves[Math.floor(Math.random() * availableMoves.length)]] = 'O';
      }
    }
    
    setBoard(newBoard);
    setIsXNext(true);

    const winner = checkWinner(newBoard);
    if (winner) {
      setDialog({ open: true, result: `${winner} Wins!` });
      setScores((prevScores) => ({
        ...prevScores,
        [winner]: prevScores[winner] + 1,
      }));
    } else if (!newBoard.includes(null)) {
      setDialog({ open: true, result: 'It\'s a Tie!' });
      setScores((prevScores) => ({ ...prevScores, ties: prevScores.ties + 1 }));
    }
  }, [dialog.open]);

  const findBestMove = (board, player) => {
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = player;
        if (checkWinner(board) === player) {
          board[i] = null;
          return i;
        }
        board[i] = null;
      }
    }
    return null;
  };

  const handleCloseDialog = () => {
    setDialog({ open: false, result: null });
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="tic-tac-toe">
      <h1 className="tic-title">Tic Tac Toe</h1>
      <div>
        <HomeButton/>
      </div>
      <div className="mode-selection">
        <button className="button" onClick={() => setGameMode('PVP')}>Player vs Player</button>
        <button className="button" onClick={() => setGameMode('CPU')}>Player vs CPU</button>
      </div>
      <div className="tic-status">
        <p>Current Mode: {gameMode === 'PVP' ? 'Player vs Player' : 'Player vs CPU'}</p>
      </div>
      <div className="board">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`cell ${cell}`}
            onClick={() => handleClick(index)}
          >
            {cell === 'X' ? X_ICON : cell === 'O' ? O_ICON : null}
          </div>
        ))}
      </div>
      {dialog.open && (
        <div className="dialog">
          <div className="dialog-content">
            <div className="dialog-title">{dialog.result}</div>
            <button className="dialog-close button" onClick={handleCloseDialog}>Reset</button>
          </div>
        </div>
      )}
      <div className="scoreboard-container">
        <div className="score-section">
          <h3> X</h3>
          <p>{scores.X}</p>
        </div>
        <div className="score-section">
          <h3> O</h3>
          <p>{scores.O}</p>
        </div>
        <div className="score-section">
          <h3>Ties</h3>
          <p>{scores.ties}</p>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;
