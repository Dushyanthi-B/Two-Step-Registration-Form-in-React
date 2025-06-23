# Email Setup Guide

This application sends welcome emails to users upon successful registration. Follow these steps to configure email functionality:

## 🚀 Quick Setup (Gmail)

### 1. Enable 2-Factor Authentication
- Go to your Google Account settings
- Enable 2-Factor Authentication if not already enabled

### 2. Generate App Password
- Go to Google Account → Security → 2-Step Verification
- Click on "App passwords"
- Select "Mail" and "Other (Custom name)"
- Enter a name like "Registration App"
- Copy the generated 16-character password

### 3. Update Environment Variables
Edit the `.env` file in the project root:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

### 4. Test the Setup
1. Start the server: `npm run dev`
2. Register a new user
3. Check the email inbox for the welcome message

## 📧 Email Features

### Welcome Email Includes:
- ✅ Personalized greeting with user's name
- ✅ Account details (name, email, phone, ID)
- ✅ Registration confirmation
- ✅ Professional HTML template
- ✅ Responsive design

### Email Template Features:
- 🎨 Beautiful gradient header
- 📋 Account information section
- ✅ Success confirmation
- 🔗 Call-to-action button
- 📞 Support information

## 🔧 Alternative Email Services

### Outlook/Hotmail
```javascript
// In server.js, change the service:
service: 'outlook'
```

### Yahoo
```javascript
// In server.js, change the service:
service: 'yahoo'
```

### Custom SMTP
```javascript
// Replace the transporter configuration:
const transporter = nodemailer.createTransporter({
  host: 'your-smtp-host.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@domain.com',
    pass: 'your-password'
  }
});
```

## 🛠️ Troubleshooting

### Common Issues:

1. **"Invalid login" error**
   - Make sure you're using an App Password, not your regular password
   - Verify 2-Factor Authentication is enabled

2. **"Less secure app access" error**
   - Use App Passwords instead of regular passwords
   - Enable 2-Factor Authentication

3. **Email not received**
   - Check spam/junk folder
   - Verify email address is correct
   - Check server console for error messages

### Debug Mode:
Add this to see detailed email logs:
```javascript
// In server.js, add debug option:
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: true,
  logger: true
});
```

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Use App Passwords instead of regular passwords
- Consider using environment variables in production
- Implement rate limiting for email sending
- Add email verification in production

## 📱 Email Preview

The welcome email includes:
- Professional HTML design
- User's registration details
- Account confirmation
- Support information
- Responsive layout for mobile devices

## 🎯 Next Steps

For production deployment:
1. Use a dedicated email service (SendGrid, Mailgun, etc.)
2. Implement email templates with a service like MJML
3. Add email verification workflow
4. Set up email analytics and tracking
5. Implement email queue system for high volume 