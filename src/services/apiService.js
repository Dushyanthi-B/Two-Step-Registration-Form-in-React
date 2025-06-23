import axios from 'axios';

// API Configuration
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Create axios instance with default configuration
const apiClient = axios.create(API_CONFIG);

// Request interceptor for adding auth tokens, logging, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Add loading state if needed
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common responses
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('Response Error:', error);
    
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return Promise.reject(new Error(data.message || 'Bad request'));
        case 401:
          return Promise.reject(new Error('Unauthorized access'));
        case 403:
          return Promise.reject(new Error('Access forbidden'));
        case 404:
          return Promise.reject(new Error('Resource not found'));
        case 409:
          return Promise.reject(new Error(data.message || 'Conflict - resource already exists'));
        case 422:
          return Promise.reject(new Error(data.message || 'Validation error'));
        case 500:
          return Promise.reject(new Error('Internal server error'));
        default:
          return Promise.reject(new Error(data.message || 'An error occurred'));
      }
    } else if (error.request) {
      // Network error
      return Promise.reject(new Error('Network error - please check your connection'));
    } else {
      // Other error
      return Promise.reject(new Error('An unexpected error occurred'));
    }
  }
);

// API Service Class
class ApiService {
  // Health check
  static async healthCheck() {
    try {
      const response = await apiClient.get('/api/health');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // User registration
  static async registerUser(userData) {
    try {
      // Ensure the payload matches the exact format required
      const payload = {
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone || "",
        password: userData.password
      };

      console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
      console.log('Sending registration payload:', payload);
      console.log('Full URL:', `${API_CONFIG.baseURL}/api/register`);

      const response = await apiClient.post('/api/register', payload);
      console.log('API Response:', response.data);
      return { 
        success: true, 
        data: response.data,
        message: response.data.message || 'Registration successful!'
      };
    } catch (error) {
      console.error('API Error:', error);
      console.error('Error response:', error.response?.data);
      return { 
        success: false, 
        error: error.message,
        message: error.message
      };
    }
  }

  // Get all users (for testing)
  static async getUsers() {
    try {
      const response = await apiClient.get('/api/users');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Validate email format
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static validatePassword(password) {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: password.length >= minLength,
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      strength: this.calculatePasswordStrength(password)
    };
  }

  // Calculate password strength
  static calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  }

  // Format phone number
  static formatPhoneNumber(phone) {
    if (!phone) return '';
    
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Format based on length
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    
    return phone; // Return original if can't format
  }

  // Debounce function for API calls
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Retry mechanism for failed requests
  static async retryRequest(requestFn, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
}

export default ApiService; 