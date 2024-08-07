import React from 'react';
import './ResultDialog.css';

const ResultDialog = ({ isOpen, onClose, result }) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2>{result}</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ResultDialog;
