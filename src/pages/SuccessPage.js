import React from 'react';
import { useRegistration } from '../context/RegistrationContext';
import Button from '../components/Button';
import './SuccessPage.css';

const SuccessPage = () => {
  const { formData, resetForm } = useRegistration();

  const handleStartOver = () => {
    resetForm();
  };

  const ZDataLogo = () => (
    <img 
      src="/zdata_innovations_logo.jpeg" 
      alt="ZData Innovations Logo" 
      style={{ width: '48px', height: '48px', objectFit: 'contain' }}
    />
  );

  return (
    <div className="success-page">
      <div className="success-content">
        <div className="tech-logo">
          <ZDataLogo />
          <span className="tech-logo-text">ZData Innovations</span>
        </div>
        
        <div className="success-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        
        <h1>Welcome to ZData Innovations!</h1>
        <p>Congratulations, <strong>{formData.fullName}</strong>! Your account has been successfully created and you're now part of our innovative team.</p>
        
        <div className="email-notice">
          <div className="email-icon">📧</div>
          <div className="email-text">
            <h3>Welcome Email Sent!</h3>
            <p>A personalized welcome email has been sent to <strong>{formData.email}</strong></p>
            <p className="email-note">Check your inbox (and spam folder) for your welcome package and next steps.</p>
          </div>
        </div>
        
        <div className="account-details">
          <h3>Your Account Information</h3>
          <div className="detail-item">
            <span className="label">Email Address:</span>
            <span className="value">{formData.email}</span>
          </div>
          {formData.phone && (
            <div className="detail-item">
              <span className="label">Phone Number:</span>
              <span className="value">{formData.phone}</span>
            </div>
          )}
        </div>

        <div className="next-steps">
          <h3>What's Next?</h3>
          <ul>
            <li>Check your email for login credentials</li>
            <li>Complete your profile setup</li>
            <li>Join our team collaboration platform</li>
            <li>Schedule your onboarding session</li>
          </ul>
        </div>
        
        <div className="success-actions">
          <Button
            variant="primary"
            onClick={handleStartOver}
          >
            Register Another Team Member
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage; 