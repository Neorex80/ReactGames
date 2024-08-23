import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';  // Assuming you'll add some styles for the button

const HomeButton = () => {
  const navigate = useNavigate();
  return (
    <button className="btn-class-name" onClick={() => navigate('/')}>
      <span className="back"></span>
      <span className="front"></span>
      Home
    </button>
  );
};

export default HomeButton;
