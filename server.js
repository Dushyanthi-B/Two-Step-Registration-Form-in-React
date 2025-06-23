const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to other services like 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com', // Your email
    pass: process.env.EMAIL_PASS || 'your-app-password' // Your app password (not regular password)
  }
});

// Email template function
const createWelcomeEmail = (userData) => {
  return {
    from: process.env.EMAIL_USER || 'your-email@gmail.com',
    to: userData.email,
    subject: 'Welcome to Our Platform! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Welcome, ${userData.fullName}! 🎉</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your account has been successfully created</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #2c3e50; margin-top: 0;">Account Details</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Full Name:</strong> ${userData.fullName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${userData.email}</p>
            ${userData.phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${userData.phone}</p>` : ''}
            <p style="margin: 5px 0;"><strong>Account ID:</strong> ${userData.id}</p>
            <p style="margin: 5px 0;"><strong>Registration Date:</strong> ${new Date(userData.createdAt).toLocaleDateString()}</p>
          </div>
          
          <div style="background-color: #e8f5e8; border-left: 4px solid #27ae60; padding: 15px; margin: 20px 0;">
            <h3 style="color: #27ae60; margin: 0 0 10px 0;">✅ Registration Successful!</h3>
            <p style="margin: 0; color: #2c3e50;">Your account is now active and ready to use. You can log in with your email and password.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">Get Started</a>
          </div>
          
          <div style="border-top: 1px solid #e9ecef; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6c757d; font-size: 14px; margin: 0;">
              If you have any questions, please don't hesitate to contact our support team.
            </p>
            <p style="color: #6c757d; font-size: 14px; margin: 10px 0 0 0;">
              Thank you for choosing our platform!
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
          <p>This email was sent to ${userData.email}</p>
          <p>© 2024 Our Platform. All rights reserved.</p>
        </div>
      </div>
    `
  };
};

// Function to send welcome email
const sendWelcomeEmail = async (userData) => {
  try {
    const mailOptions = createWelcomeEmail(userData);
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// In-memory storage (replace with database in production)
const users = [];

// Registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // Basic validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and password are required'
      });
    }

    // Check if email already exists
    if (users.find(user => user.email === email)) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user object (don't store password in production without hashing)
    const newUser = {
      id: users.length + 1,
      fullName,
      email,
      phone: phone || null,
      password, // In production, hash this password!
      createdAt: new Date().toISOString()
    };

    // Add to users array
    users.push(newUser);

    // Send welcome email
    const emailResult = await sendWelcomeEmail(newUser);

    // Return success response (don't include password)
    const { password: _, ...userResponse } = newUser;
    
    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome email sent.',
      data: userResponse,
      emailSent: emailResult.success
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Get all users (for testing - remove in production)
app.get('/api/users', (req, res) => {
  const usersWithoutPasswords = users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  res.json(usersWithoutPasswords);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Registration endpoint: http://localhost:${PORT}/api/register`);
  console.log(`Email configuration: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured - using default'}`);
}); 