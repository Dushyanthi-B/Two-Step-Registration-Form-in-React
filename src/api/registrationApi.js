import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://your-api-base.com';
const USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API === 'true' || !API_BASE_URL.includes('your-api-base.com');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock API for testing
const mockRegisterUser = async (userData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate success response
  return {
    success: true,
    data: {
      id: Math.floor(Math.random() * 10000),
      ...userData,
      createdAt: new Date().toISOString(),
      message: 'Registration successful!'
    }
  };
};

export const registerUser = async (userData) => {
  // Use mock API if configured or if using placeholder URL
  if (USE_MOCK_API) {
    return await mockRegisterUser(userData);
  }

  try {
    const response = await api.post('/api/register', userData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Registration failed. Please try again.' 
    };
  }
}; 