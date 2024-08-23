import React, { useState, useEffect } from 'react';
import Chessboard from 'react-chessboard';
import Chess from 'chess.js';
import Stockfish from './Stockfish';

const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (game.in_checkmate() || game.in_stalemate() || game.in_draw()) {
      setIsGameOver(true);
    }
  }, [game]);

  const handleMove = (move) => {
    const gameCopy = { ...game };
    const result = gameCopy.move(move);
    if (result) {
      setGame(gameCopy);
      setFen(gameCopy.fen());
    }
    if (!gameCopy.game_over()) {
      StockfishMove(gameCopy);
    }
  };

  const StockfishMove = (gameCopy) => {
    const stockfish = new Stockfish();
    stockfish.getBestMove(gameCopy.fen(), (bestMove) => {
      const gameCopyWithStockfishMove = { ...gameCopy };
      gameCopyWithStockfishMove.move(bestMove);
      setGame(gameCopyWithStockfishMove);
      setFen(gameCopyWithStockfishMove.fen());
    });
  };

  return (
    <div className="chess-game">
      <Chessboard 
        position={fen}
        onPieceDrop={(sourceSquare, targetSquare) => {
          handleMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q', // Always promote to a queen for simplicity
          });
        }}
        width={600}
        orientation="white"
      />
      {isGameOver && <div className="game-over">Game Over</div>}
    </div>
  );
};

export default ChessGame;
