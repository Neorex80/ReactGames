import React from 'react';
import { Chessboard as Board } from 'react-chessboard';

const Chessboard = ({ position, onPieceDrop, width, orientation }) => {
  return (
    <div className="chessboard-container">
      <Board 
        position={position}
        onPieceDrop={onPieceDrop}
        boardWidth={width}
        boardOrientation={orientation}
      />
    </div>
  );
};

export default Chessboard;
