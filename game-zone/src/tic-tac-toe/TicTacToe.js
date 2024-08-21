import React, { useState } from 'react';
import './TicTacToe.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircle, faRefresh, faUser, faRobot } from '@fortawesome/free-solid-svg-icons';

const initialBoard = Array(9).fill(null);

const TicTacToe = () => {
  const [board, setBoard] = useState(initialBoard);
  const [isPlayerX, setIsPlayerX] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameMode, setGameMode] = useState('pvc'); // Default to PvC
  // const [player1, setPlayer1] = useState('Player 1'); // Removed unused state
  const [player2, setPlayer2] = useState('Computer');

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isPlayerX ? 'X' : 'O';
    setBoard(newBoard);
    setIsPlayerX(!isPlayerX); // Switch turns

    checkWinner(newBoard);

    // Computer's turn (only if gameMode is 'pvc')
    if (!winner && gameMode === 'pvc' && !isPlayerX) {
      setTimeout(() => {
        const computerMove = getComputerMove(newBoard);
        handleClick(computerMove);
      }, 500); 
    }
  };

  const getComputerMove = (board) => {
    // Medium difficulty AI logic
    // 1. Check for winning move for computer ('O')
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const tempBoard = [...board];
        tempBoard[i] = isPlayerX ? 'X' : 'O'; // Computer is always 'O' in PvC
        if (checkWinner(tempBoard)) {
          return i;
        }
      }
    }

    // 2. Check for winning move for player ('X') and block it
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const tempBoard = [...board];
        tempBoard[i] = isPlayerX ? 'X' : 'O'; // Computer is always 'O' in PvC
        if (checkWinner(tempBoard)) {
          return i;
        }
      }
    }

    // 3. Prioritize center square
    if (board[4] === null) {
      return 4;
    }

    // 4. Choose a random available square
    const availableSquares = board.reduce((acc, cell, index) => {
      if (cell === null) {
        acc.push(index);
      }
      return acc;
    }, []);
    return availableSquares[Math.floor(Math.random() * availableSquares.length)];
  };

  const checkWinner = (board) => {
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
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        return;
      }
    }
    if (board.every(cell => cell)) {
      setWinner('Draw');
    }
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setWinner(null);
    setIsPlayerX(true);
  };

  const handleGameModeChange = (event) => {
    setGameMode(event.target.value);
    if (event.target.value === 'pvc') {
      setPlayer2('Computer');
    } else {
      setPlayer2('Player 2');
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Tic-Tac-Toe</h1>
        <div className="game-mode-selector">
          <label htmlFor="pvp">PvP</label>
          <input type="radio" id="pvp" name="gameMode" value="pvp" checked={gameMode === 'pvp'} onChange={handleGameModeChange} />
          <label htmlFor="pvc">PvC</label>
          <input type="radio" id="pvc" name="gameMode" value="pvc" checked={gameMode === 'pvc'} onChange={handleGameModeChange} />
        </div>
        <button className="reset-button" onClick={resetGame}>
          <FontAwesomeIcon icon={faRefresh} />
        </button>
      </div>
      <div className="game-board">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`game-tile ${cell ? 'active' : ''}`}
            onClick={() => handleClick(index)}
          >
            {cell === 'X' ? (
              <FontAwesomeIcon icon={faXmark} className="icon" />
            ) : cell === 'O' ? (
              <FontAwesomeIcon icon={faCircle} className="icon" />
            ) : null}
          </div>
        ))}
      </div>
      <div className="footer">
        {winner ? (
          <div>
            {winner === 'Draw' ? 'It\'s a Draw!' : `Winner: ${winner}`}
            <button className="button" onClick={resetGame}>Play Again</button>
          </div>
        ) : (
          <div>
            <div className="player-info">
              <FontAwesomeIcon icon={faUser} className="player-icon" />
              <span>Player 1</span> {/* Display Player 1 even though the state is removed */}
            </div>
            <div className="player-info">
              {gameMode === 'pvc' ? (
                <FontAwesomeIcon icon={faRobot} className="player-icon" />
              ) : (
                <FontAwesomeIcon icon={faUser} className="player-icon" />
              )}
              <span>{player2}</span>
            </div>
            <div>
              Next player: {isPlayerX ? 'X' : 'O'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicTacToe;
