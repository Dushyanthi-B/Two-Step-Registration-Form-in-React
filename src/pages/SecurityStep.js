import React, { useState } from 'react';
import { useRegistration } from '../context/RegistrationContext';
import FormField from '../components/FormField';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Notification from '../components/Notification';
import UserService from '../services/userService';
import { getFieldError } from '../utils/validation';
import './FormStep.css';

const SecurityStep = () => {
  const {
    formData,
    errors,
    setFieldValue,
    setFieldError,
    clearFieldError,
    prevStep,
    setSubmitting,
    setSubmitted,
    setSubmitError,
    isSubmitting,
    submitError,
  } = useRegistration();

  const [notification, setNotification] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const handleFieldChange = (field, value) => {
    // Always use the latest values for validation
    let newPassword = field === 'password' ? value : formData.password;
    let newConfirmPassword = field === 'confirmPassword' ? value : formData.confirmPassword;

    console.log('handleFieldChange:', {
      field,
      value,
      newPassword,
      newConfirmPassword,
      formDataPassword: formData.password,
      formDataConfirmPassword: formData.confirmPassword
    });

    setFieldValue(field, value);
    
    // Clear error when user starts typing
    if (errors[field]) {
      clearFieldError(field);
    }

    // Validate confirmPassword whenever either field changes
    if (field === 'password' || field === 'confirmPassword') {
      const confirmError = getFieldError('confirmPassword', newConfirmPassword, newPassword);
      console.log('confirmPassword validation result:', confirmError);
      if (confirmError) {
        setFieldError('confirmPassword', confirmError);
      } else {
        clearFieldError('confirmPassword');
      }
    }

    // Update password strength
    if (field === 'password') {
      const strength = UserService.getPasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const handleFieldBlur = (field, value) => {
    // Only validate on blur if there's no real-time validation happening
    // For confirmPassword, we already handle validation in handleFieldChange
    if (field === 'confirmPassword') {
      return; // Skip blur validation for confirmPassword
    }
    
    let error = getFieldError(field, value);
    
    if (error) {
      setFieldError(field, error);
    }
  };

  const validateStep = () => {
    const requiredFields = ['password', 'confirmPassword'];
    let isValid = true;

    console.log('validateStep - formData:', formData);
    console.log('validateStep - errors before:', errors);

    // Clear all errors first
    requiredFields.forEach(field => {
      clearFieldError(field);
    });

    // Validate required fields
    requiredFields.forEach(field => {
      let error;
      if (field === 'confirmPassword') {
        // Fixed: Pass the current password as the third parameter
        error = getFieldError('confirmPassword', formData[field], formData.password);
        console.log('confirmPassword validation in validateStep:', {
          confirmPassword: formData[field],
          password: formData.password,
          error: error
        });
      } else {
        error = getFieldError(field, formData[field]);
      }
      
      if (error) {
        setFieldError(field, error);
        isValid = false;
      }
    });

    console.log('validateStep - isValid:', isValid);
    return isValid;
  };

  const showNotification = (type, title, message) => {
    setNotification({ type, title, message });
  };

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    
    if (!validateStep()) {
      // Show the most relevant error
      if (!formData.confirmPassword || !formData.confirmPassword.trim()) {
        showNotification('error', 'Validation Error', 'Please confirm your password.');
      } else if (formData.password !== formData.confirmPassword) {
        showNotification('error', 'Validation Error', 'Passwords do not match.');
      } else {
        showNotification('error', 'Validation Error', 'Please fill in all required fields correctly.');
      }
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    // Sanitize user data before sending
    const userData = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || "", // Ensure phone is included even if empty
      password: formData.password
    };

    try {
      // Show loading notification
      showNotification('info', 'Processing Registration', 'Please wait while we create your account...');
      
      const result = await UserService.registerUser({ ...formData });
      
      if (result.success) {
        // Clear loading notification and show success
        setNotification(null);
        showNotification('success', 'Registration Successful!', 'Your account has been created successfully. Welcome to ZData Innovations!');
        
        // Wait a bit longer to show the success message
        setTimeout(() => {
          setSubmitted();
        }, 3000);
      } else {
        setSubmitError(result.error);
        showNotification('error', 'Registration Failed', result.error);
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setSubmitError(errorMessage);
      showNotification('error', 'Error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const isStepValid = () => {
    const passwordValid = formData.password && formData.password.trim();
    const confirmPasswordValid = formData.confirmPassword && formData.confirmPassword.trim();
    const passwordsMatch = passwordValid && confirmPasswordValid && formData.password === formData.confirmPassword;
    const noErrors = !errors.password && !errors.confirmPassword;
    
    return passwordValid && confirmPasswordValid && passwordsMatch && noErrors;
  };

  const getPasswordStrengthColor = () => {
    if (!passwordStrength) return '';
    switch (passwordStrength.strength) {
      case 'weak': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'strong': return 'text-green-500';
      default: return '';
    }
  };

  // Show validation errors if user has attempted to submit
  const shouldShowErrors = hasAttemptedSubmit || Object.keys(errors).some(key => errors[key]);

  return (
    <div className="form-step">
      <div className="step-header">
        <h2>Security</h2>
        <p>Create a secure password for your account.</p>
      </div>

      <div className="form-content">
        <FormField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={(e) => handleFieldChange('password', e.target.value)}
          onBlur={(e) => handleFieldBlur('password', e.target.value)}
          error={shouldShowErrors ? errors.password : ''}
          required
          placeholder="Enter your password (min 6 characters)"
          showPasswordToggle={true}
        />

        {/* Password Strength Indicator */}
        {passwordStrength && formData.password && (
          <div className="password-strength">
            <div className="strength-bar">
              <div 
                className={`strength-fill strength-${passwordStrength.strength}`}
                style={{ width: `${(passwordStrength.strength === 'weak' ? 33 : passwordStrength.strength === 'medium' ? 66 : 100)}%` }}
              ></div>
            </div>
            <div className="strength-text">
              <span className={`strength-label ${getPasswordStrengthColor()}`}>
                Password Strength: {passwordStrength.strength.charAt(0).toUpperCase() + passwordStrength.strength.slice(1)}
              </span>
            </div>
          </div>
        )}

        <FormField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
          onBlur={(e) => handleFieldBlur('confirmPassword', e.target.value)}
          error={shouldShowErrors ? errors.confirmPassword : ''}
          required
          placeholder="Confirm your password"
          showPasswordToggle={true}
        />

        {submitError && (
          <div className="submit-error">
            {submitError}
          </div>
        )}
      </div>

      <div className="step-actions btn-group">
        <Button
          variant="secondary"
          onClick={prevStep}
          disabled={isSubmitting}
        >
          Back
        </Button>
        
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!isStepValid()}
          loading={isSubmitting}
          loadingText="Submitting to ZData Innovations..."
        >
          Submit
        </Button>
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          duration={5000}
          onClose={() => setNotification(null)}
          show={true}
        />
      )}
    </div>
  );
};

export default SecurityStep; 