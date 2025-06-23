import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  loadingText = 'Loading...',
  ...props
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${disabled || loading ? 'disabled' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="loading-button">
          <LoadingSpinner size="small" variant={variant} />
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button; 