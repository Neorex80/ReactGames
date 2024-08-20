// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GameBoard from './components/tictactoe/GameBoard';
import SnakeGame from './components/snakegame/SnakeGame';
import DinoDash from './components/dinorush/DinoDash';
import Home from './components/Home';
import './App.css'; // Import App.css for Tailwind

const App = () => {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen flex flex-col"> {/* Tailwind classes */}
        <main className="flex-grow p-4"> {/* Main content area */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tic-tac-toe" element={<GameBoard />} />
            <Route path="/snake-game" element={<SnakeGame />} />
            <Route path="/dino-dash" element={<DinoDash />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
