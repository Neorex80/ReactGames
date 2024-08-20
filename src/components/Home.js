// Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Import a separate CSS file for custom styling

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="text-4xl font-bold text-center mb-4">Welcome to the Game Hub!</h1>
        <p className="text-lg text-center mb-8">Explore our simple React-based games:</p>
      </header>
      <div className="button-container flex justify-center gap-4">
        <Link to="/tic-tac-toe" className="game-button bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md">
          Play Tic-Tac-Toe
        </Link>
        <Link to="/snake-game" className="game-button bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md">
          Play Snake Game
        </Link>
        <Link to="/dino-dash" className="game-button bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md">
          Play Dino Dash
        </Link>
      </div>
    </div>
  );
};

export default Home;
