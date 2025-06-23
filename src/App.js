import React from 'react';
import { RegistrationProvider, useRegistration } from './context/RegistrationContext';
import ProgressIndicator from './components/ProgressIndicator';
import PersonalInfoStep from './pages/PersonalInfoStep';
import SecurityStep from './pages/SecurityStep';
import SuccessPage from './pages/SuccessPage';
import './App.css';

const ZDataLogo = () => (
  <img 
    src="/zdata_innovations_logo.jpeg" 
    alt="ZData Innovations Logo" 
    style={{ width: '48px', height: '48px', objectFit: 'contain' }}
  />
);


const RegistrationForm = () => {
  const { currentStep, isSubmitted } = useRegistration();

  if (isSubmitted) {
    return <SuccessPage />;
  }

  return (
    <div className="registration-container">
      <div className="tech-logo">
        <ZDataLogo />
        <span className="tech-logo-text">ZData Innovations</span>
      </div>
      
      <div className="registration-header">
        <h1>Join Our Team</h1>
        <p>Create your account and start building the future with us</p>
      </div>
      
      <ProgressIndicator currentStep={currentStep} totalSteps={2} />
      
      <div className="form-container">
        {currentStep === 1 && <PersonalInfoStep />}
        {currentStep === 2 && <SecurityStep />}
      </div>
    </div>
  );
};

function App() {
  return (
    <RegistrationProvider>
      <div className="App">
        <RegistrationForm />
      </div>
    </RegistrationProvider>
  );
}

export default App;
