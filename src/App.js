import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import GameBoard from './components/GameBoard';
import Home from './components/Home';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <Link to="/">Home</Link>
          <Link to="/tic-tac-toe">Tic Tac Toe</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tic-tac-toe" element={<GameBoard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
