import ApiService from './apiService';

class UserService {
  // Register a new user
  static async registerUser(userData) {
    try {
      // Validate user data before sending
      const validation = this.validateUserData(userData);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', '),
          message: 'Please fix the validation errors'
        };
      }

      // Format phone number if provided
      const formattedData = {
        ...userData,
        phone: userData.phone ? ApiService.formatPhoneNumber(userData.phone) : null
      };

      // Remove confirmPassword before sending to backend
      const sanitizedData = { ...formattedData };
      delete sanitizedData.confirmPassword;

      // Use retry mechanism for registration
      const result = await ApiService.retryRequest(
        () => ApiService.registerUser(sanitizedData),
        3,
        1000
      );

      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Registration failed. Please try again.'
      };
    }
  }

  // Validate user data
  static validateUserData(userData) {
    const errors = [];
    const { fullName, email, phone, password, confirmPassword } = userData;

    // Full name validation
    if (!fullName || fullName.trim().length === 0) {
      errors.push('Full name is required');
    } else if (fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters');
    }

    // Email validation
    if (!email || email.trim().length === 0) {
      errors.push('Email is required');
    } else if (!ApiService.validateEmail(email)) {
      errors.push('Please enter a valid email address');
    }

    // Phone validation (optional)
    if (phone && phone.trim().length > 0) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanedPhone = phone.replace(/\s/g, '');
      if (!phoneRegex.test(cleanedPhone)) {
        errors.push('Please enter a valid phone number');
      }
    }

    // Password validation
    if (!password || password.length === 0) {
      errors.push('Password is required');
    } else {
      const passwordValidation = ApiService.validatePassword(password);
      if (!passwordValidation.isValid) {
        errors.push('Password must be at least 6 characters');
      }
    }

    // Confirm password validation
    if (!confirmPassword || confirmPassword.length === 0) {
      errors.push('Please confirm your password');
    } else if (password !== confirmPassword) {
      errors.push('Passwords do not match');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get password strength information
  static getPasswordStrength(password) {
    if (!password) return null;
    
    const validation = ApiService.validatePassword(password);
    return {
      strength: validation.strength,
      criteria: {
        minLength: validation.minLength,
        hasUpperCase: validation.hasUpperCase,
        hasLowerCase: validation.hasLowerCase,
        hasNumbers: validation.hasNumbers,
        hasSpecialChar: validation.hasSpecialChar
      }
    };
  }

  // Format user data for display
  static formatUserData(userData) {
    return {
      ...userData,
      fullName: userData.fullName?.trim(),
      email: userData.email?.toLowerCase().trim(),
      phone: userData.phone ? ApiService.formatPhoneNumber(userData.phone) : null,
      createdAt: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : null
    };
  }

  // Sanitize user data (remove sensitive information)
  static sanitizeUserData(userData) {
    const { password, confirmPassword, ...sanitizedData } = userData;
    return sanitizedData;
  }

  // Check if user data is complete
  static isUserDataComplete(userData) {
    const requiredFields = ['fullName', 'email', 'password', 'confirmPassword'];
    return requiredFields.every(field => 
      userData[field] && userData[field].toString().trim().length > 0
    );
  }

  // Get user data summary
  static getUserDataSummary(userData) {
    return {
      name: userData.fullName,
      email: userData.email,
      hasPhone: !!userData.phone,
      isComplete: this.isUserDataComplete(userData)
    };
  }

  // Validate email availability (mock function)
  static async checkEmailAvailability(email) {
    // In a real app, this would make an API call
    // For now, we'll simulate a check
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate some emails as taken
        const takenEmails = ['test@example.com', 'admin@example.com'];
        const isAvailable = !takenEmails.includes(email.toLowerCase());
        resolve({ available: isAvailable });
      }, 500);
    });
  }

  // Get registration statistics
  static async getRegistrationStats() {
    try {
      const usersResult = await ApiService.getUsers();
      if (usersResult.success) {
        const users = usersResult.data;
        return {
          totalUsers: users.length,
          recentRegistrations: users.slice(-5), // Last 5 registrations
          averageRegistrationTime: this.calculateAverageRegistrationTime(users)
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting registration stats:', error);
      return null;
    }
  }

  // Calculate average registration time (mock)
  static calculateAverageRegistrationTime(users) {
    if (users.length === 0) return 0;
    
    // Mock calculation - in real app, you'd have actual timestamps
    return Math.floor(Math.random() * 30) + 10; // 10-40 seconds
  }
}

export default UserService; 