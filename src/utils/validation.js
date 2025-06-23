// Validation utility functions
export const validateEmail = (email) => {
  if (!email || email.trim() === '') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePassword = (password) => {
  if (!password || password.trim() === '') return false;
  return password.length >= 6;
};

export const validateFullName = (fullName) => {
  return fullName && fullName.trim().length > 0;
};

export const validatePhone = (phone) => {
  // Phone is optional, so empty string is valid
  if (!phone || phone.trim() === '') return true;
  
  // Remove all spaces and check if it starts with a country code
  const cleanPhone = phone.replace(/\s/g, '');
  
  // Check if it starts with a country code (+ followed by 1-4 digits)
  const countryCodeRegex = /^\+[1-9]\d{0,3}/;
  if (!countryCodeRegex.test(cleanPhone)) {
    return false;
  }
  
  // Check if the rest of the number is valid (7-15 digits after country code)
  const phoneNumberRegex = /^\+[1-9]\d{0,3}\d{7,15}$/;
  return phoneNumberRegex.test(cleanPhone);
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword || confirmPassword.trim() === '') return false;
  return password === confirmPassword;
};

export const getFieldError = (fieldName, value, password = '') => {
  switch (fieldName) {
    case 'fullName':
      if (!value || value.trim() === '') {
        return 'Full name is required';
      }
      return !validateFullName(value) ? 'Full name is required' : '';
    case 'email':
      if (!value || value.trim() === '') {
        return 'Email address is required';
      }
      return !validateEmail(value) ? 'Please enter a valid email address' : '';
    case 'phone':
      return !validatePhone(value) ? 'Please enter a valid phone number with country code' : '';
    case 'password':
      if (!value || value.trim() === '') {
        return 'Password is required';
      }
      return !validatePassword(value) ? 'Password must be at least 6 characters' : '';
    case 'confirmPassword':
      if (!value || value.trim() === '') {
        return 'Please confirm your password';
      }
      return validateConfirmPassword(password, value) ? '' : 'Passwords do not match';
    default:
      return '';
  }
}; 