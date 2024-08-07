import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to My Portfolio</h1>
      <p>Explore my projects and games.</p>
      <Link to="/tic-tac-toe">
        <button className="home-button">Play Tic Tac Toe</button>
      </Link>
    </div>
  );
}

export default Home;
