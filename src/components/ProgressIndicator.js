import React from 'react';
import './ProgressIndicator.css';

const ProgressIndicator = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, title: 'Personal Information' },
    { number: 2, title: 'Security' },
  ];

  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      <div className="steps-container">
        {steps.map((step, index) => (
          <div 
            key={step.number} 
            className={`step ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
          >
            <div className="step-number">
              {currentStep > step.number ? '✓' : step.number}
            </div>
            <div className="step-title">{step.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator; 