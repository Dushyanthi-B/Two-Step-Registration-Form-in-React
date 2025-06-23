import React, { useEffect, useState } from 'react';
import { useRegistration } from '../context/RegistrationContext';
import FormField from '../components/FormField';
import { getFieldError } from '../utils/validation';
import './FormStep.css';

const PersonalInfoStep = () => {
  const {
    formData,
    errors,
    setFieldValue,
    setFieldError,
    clearFieldError,
    nextStep,
  } = useRegistration();

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const handleFieldChange = (field, value) => {
    setFieldValue(field, value);
    
    // Clear error when user starts typing
    if (errors[field]) {
      clearFieldError(field);
    }
  };

  const handleFieldBlur = (field, value) => {
    const error = getFieldError(field, value);
    if (error) {
      setFieldError(field, error);
    }
  };

  const validateStep = () => {
    const requiredFields = ['fullName', 'email'];
    let isValid = true;

    // Clear all errors first
    requiredFields.forEach(field => {
      clearFieldError(field);
    });

    // Validate required fields
    requiredFields.forEach(field => {
      const error = getFieldError(field, formData[field]);
      if (error) {
        setFieldError(field, error);
        isValid = false;
      }
    });

    // Validate phone if provided (optional field)
    if (formData.phone && formData.phone.trim()) {
      const phoneError = getFieldError('phone', formData.phone);
      if (phoneError) {
        setFieldError('phone', phoneError);
        isValid = false;
      }
    } else {
      // Clear phone error if field is empty (since it's optional)
      clearFieldError('phone');
    }

    return isValid;
  };

  const handleNext = () => {
    setHasAttemptedSubmit(true);
    
    if (validateStep()) {
      nextStep();
    }
  };

  const isStepValid = () => {
    return (
      formData.fullName && 
      formData.fullName.trim() &&
      formData.email && 
      formData.email.trim() &&
      !errors.fullName &&
      !errors.email &&
      (!formData.phone || !errors.phone)
    );
  };

  // Show validation errors if user has attempted to submit
  const shouldShowErrors = hasAttemptedSubmit || Object.keys(errors).some(key => errors[key]);

  return (
    <div className="form-step">
      <div className="step-header">
        <h2>Personal Information</h2>
        <p>Please provide your basic information to get started.</p>
      </div>

      <div className="form-content">
        <FormField
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={(e) => handleFieldChange('fullName', e.target.value)}
          onBlur={(e) => handleFieldBlur('fullName', e.target.value)}
          error={shouldShowErrors ? errors.fullName : ''}
          required
          placeholder="Enter your full name"
        />

        <FormField
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          onBlur={(e) => handleFieldBlur('email', e.target.value)}
          error={shouldShowErrors ? errors.email : ''}
          required
          placeholder="Enter your email address"
        />

        <FormField
          label="Phone Number (optional)"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={(e) => handleFieldChange('phone', e.target.value)}
          onBlur={(e) => handleFieldBlur('phone', e.target.value)}
          error={shouldShowErrors ? errors.phone : ''}
          placeholder="Enter phone number with country code (eg: +94 76 789 4561)"
        />
        
        <div className="phone-help-text">
          <p>Optional: Please include your country code if you provide a phone number (e.g., +1 for US, +44 for UK, +91 for India, +94 for Sri Lanka)</p>
        </div>
      </div>

      <div className="step-actions">
        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!isStepValid()}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoStep; 