import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Homepage/HomePage';
import TicTacToe from './Games/tic-tac-toe/TicTacToe';
import Game2048 from './Games/game-2048/Game2048';
import Connect4 from './Games/connect4/Connect4';
import Error from './error';




function AppRoutes(){
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tic-tac-toe" element={<TicTacToe />} />
        <Route path="/2048" element={<Game2048 />} />
        <Route path="/connect-four" element={<Connect4 />} /> 
        <Route path="/typeion" element={<Error />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
