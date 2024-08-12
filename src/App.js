import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import GameBoard from './components/GameBoard';
import SnakeGame from './components/SnakeGame';
import Home from './components/Home';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tic-tac-toe" element={<GameBoard />} />
          <Route path="/snake-game" element={<SnakeGame />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
