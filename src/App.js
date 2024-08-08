import React from 'react';
import GameBoard from './components/GameBoard';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>
      <GameBoard />
    </div>
  );
};

export default App;
