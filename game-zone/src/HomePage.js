import React from 'react';
import './HomePage.css';
import ticTacToeImage from './assets/tic.png';
import toimage from './assets/2048.png';
import connect4Image from './assets/connect4.png';


function HomePage() {
  return (
    <div className="homepage-container">
      <h1 className="homepage-title">React GameZone</h1>
      <div className="games-container">
        <div className="game-card">
          <img src={ticTacToeImage} alt="Tic Tac Toe" className="game-image" />
          <h2 className="game-title">Tic Tac Toe</h2>
          <p className="game-description">A classic game of X's and O's. Sharpen your strategic skills!</p>
          <button className="play-button">PLAY NOW</button>
        </div>
        <div className="game-card">
          <img src={toimage} alt="2048" className="game-image" />
          <h2 className="game-title">2048 classic</h2>
          <p className="game-description">A classic game of 2048 to Bring back some memories.</p>
          <button className="play-button">PLAY NOW</button>
        </div>  
        <div className="game-card">
          <img src={connect4Image} alt="Connect 4" className="game-image" />
          <h2 className="game-title">Connect 4</h2>
          <p className="game-description">Drop your checkers and try to get four in a row!</p>
          <button className="play-button">PLAY NOW</button>
        </div>
        
      </div>
    </div>
  );
}

export default HomePage;
