// HomePage.js
import React, { useRef, useEffect } from 'react';
import './HomePage.css';
import GameCard from './GameCard';
import ticTacToeImage from '../assets/tic.png';
import toimage from '../assets/2048.png';
import connect4Image from '../assets/connect4.png';
import typingimage from '../assets/typing.png';// Chess image placeholder
import chessImage from '../assets/chess.png';
import { gsap } from 'gsap';
import HomeButton from './Homebutton';

function HomePage() {
  const gamesContainerRef = useRef(null);
  
  useEffect(() => {
    if (gamesContainerRef.current) {
      gsap.fromTo(
        gamesContainerRef.current.children,
        { opacity: 0, transform: 'rotateY(90deg)' },
        {
          opacity: 1,
          transform: 'rotateY(0deg)',
          duration: 1,
          stagger: 0.2,
          ease: 'back.out(1.7)',
        }
      );
    }
  }, []);

  const games = [
    {
      title: "Tic Tac Toe",
      description: "A classic game of X's and O's. Sharpen your strategic skills!",
      imgSrc: ticTacToeImage,
      route: '/tic-tac-toe',
    },
    {
      title: "2048 Classic",
      description: "A classic game of 2048 to bring back some memories.",
      imgSrc: toimage,
      route: '/2048',
    },
    {
      title: "Connect 4",
      description: "Drop your checkers and try to get four in a row!",
      imgSrc: connect4Image,
      route: '/connect-four',
    },
    {
      title: "Typeion",
      description: "Test your typing speed and accuracy in two exciting modes!",
      imgSrc: typingimage,
      route: '/typeion',
    },
    {
      title: "Chess",
      description: "Challenge yourself in a classic game of strategy.",
      imgSrc: chessImage,
      route: '/chess',
    },
  ];

  return (
    <div className="homepage-container">
      <h1 className="tic-title">React GameZone</h1>
      <div className="games-container" ref={gamesContainerRef}>
        {games.map((game, index) => (
          <GameCard
            key={index}
            title={game.title}
            description={game.description}
            imgSrc={game.imgSrc}
            route={game.route}
          />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
