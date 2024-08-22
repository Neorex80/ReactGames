import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ComingSoon = () => {
  const titleRef = useRef(null);
  const underConstructionRef = useRef(null);
  const messageRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // GSAP Animations
    gsap.fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );

    gsap.fromTo(
      underConstructionRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.2 }
    );

    gsap.fromTo(
      messageRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.4, ease: 'power3.out', delay: 0.4 }
    );

    gsap.fromTo(
      buttonRef.current,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.6, ease: 'power3.out', delay: 0.6 }
    );
  }, []);

  const handleClick = () => {
    navigate('/'); // Navigate to the homepage
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        color: '#fff',
        fontFamily: "'Press Start 2P', monospace",
        textShadow: '0 0 10px #631ac4, 0 0 15px #eb07b9',
      }}
    >
      <h1
        style={{
          fontSize: '4em',
          marginBottom: '20px',
        }}
        ref={titleRef}
      >
        Game Library
      </h1>
      <div
        style={{
          fontSize: '2em',
          marginBottom: '30px',
        }}
        ref={underConstructionRef}
      >
        <span
          style={{
            animation: 'blink 1s infinite',
          }}
        >
          Under Construction
        </span>
      </div>
      <p
        style={{
          fontSize: '1.2em',
          marginBottom: '30px',
        }}
        ref={messageRef}
      >
        We're working hard to bring you the best gaming experience. Check back
        soon!
      </p>
      <a
        href="#"
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          border: '2px solid #fff',
          borderRadius: '5px',
          backgroundColor: '#17C3B2',
          color: '#fff',
          textDecoration: 'none',
          fontSize: '1.2em',
          transition: 'background-color 0.3s',
        }}
        ref={buttonRef}
        onClick={handleClick} // Add onClick handler
      >
        Check Back Later
      </a>
    </div>
  );
};

export default ComingSoon;
