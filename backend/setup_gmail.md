# Gmail SMTP Setup for AITrade

## Why Gmail SMTP?
- More reliable than Brevo for development
- Better deliverability to Gmail addresses
- Free to use with reasonable limits

## Setup Instructions:

### 1. Enable 2-Step Verification
1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security"
3. Enable "2-Step Verification"

### 2. Generate App Password
1. Go to Google Account → Security → App Passwords
2. Select "Mail" and "Other (Custom name)"
3. Enter "AITrade Auth" and generate password
4. Copy the 16-character app password

### 3. Add to .env file
Add these lines to your backend/.env file:

```env
# Gmail SMTP Configuration
GMAIL_USERNAME=your-email@gmail.com
GMAIL_PASSWORD=your-16-character-app-password
```

### 4. Test the setup
Run: `python test_email_delivery.py`

## Troubleshooting Brevo Issues:

### Check Spam/Junk Folder
1. Go to Gmail
2. Check "Spam" folder
3. If found, mark as "Not spam" and add sender to contacts

### Common Brevo Issues:
1. **Domain Verification**: Your sending domain may not be verified
2. **Sending Limits**: Free Brevo account has daily limits (300 emails/day)
3. **Content Filters**: Email content might trigger spam filters
4. **Reputation**: New Brevo accounts have lower sending reputation

### Quick Fix - Use Gmail
Update your .env file to include Gmail credentials as backup.

## Current Status:
- ✅ Brevo SMTP connection works
- ❌ Emails not reaching inbox (likely spam/junk)
- 🔧 Gmail SMTP recommended as backup
