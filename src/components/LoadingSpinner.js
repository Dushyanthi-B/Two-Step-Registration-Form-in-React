import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  variant = 'primary', 
  text = 'Loading...',
  showText = true,
  className = '' 
}) => {
  return (
    <div className={`loading-container ${className}`}>
      <div className={`spinner spinner-${size} spinner-${variant}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {showText && text && (
        <p className="loading-text">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner; 