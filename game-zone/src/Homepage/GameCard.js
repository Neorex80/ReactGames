import React from 'react';
import { Link } from 'react-router-dom';
import './GameCard.css';

const GameCard = ({ title, description, imgSrc, route }) => {
  return (
    <div className="game-card">
      <img src={imgSrc} alt={title} className="game-image" />
      <h2 className="game-title">{title}</h2>
      <p className="game-description">{description}</p>
      <button className="play-button" onClick={() => window.location.href = route}>
        PLAY NOW
      </button>
    </div>
  );
};

export default GameCard;
