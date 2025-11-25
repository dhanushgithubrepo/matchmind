# Complete Setup Guide - Google OAuth Backend

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- express
- mongoose
- passport & passport-google-oauth20
- express-session
- jsonwebtoken
- cors
- dotenv
- cookie-parser

## Step 2: Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen:
   - User Type: External
   - Add app name, user support email, developer contact
   - Add scopes: `email`, `profile`
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback`
     - Add production URL later

## Step 3: Update Environment Variables

The `.env` file is already created with your credentials. Make sure to update:
- `JWT_SECRET` - Use a strong random string
- `SESSION_SECRET` - Use a different strong random string
- `CLIENT_URL` - Your frontend URL (default: http://localhost:3000)

## Step 4: Start the Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

Server will run on `http://localhost:5000`

## Step 5: Frontend Setup

### Add Environment Variable

Create or update `.env.local` in your Next.js root:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### Install Frontend Dependencies (if needed)

The frontend files use existing Next.js setup. No additional packages needed.

## Step 6: Test the Integration

### Backend Health Check
```bash
curl http://localhost:5000/api/health
```

### Test OAuth Flow

1. Start both backend (port 5000) and frontend (port 3000)
2. Add the `GoogleLoginButton` component to any page:

```tsx
import GoogleLoginButton from '@/components/GoogleLoginButton';

export default function YourPage() {
  return (
    <div>
      <GoogleLoginButton />
    </div>
  );
}
```

3. Click the button - it will redirect to Google OAuth
4. After successful login, you'll be redirected to `/auth/success`
5. The email will be stored in localStorage

### Use Email in Forms

```tsx
'use client';

import { useEffect, useState } from 'react';
import { getUserEmail } from '@/lib/auth';

export default function YourForm() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const userEmail = getUserEmail();
    if (userEmail) {
      setEmail(userEmail);
    }
  }, []);

  return (
    <form>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      {/* Rest of your form */}
    </form>
  );
}
```

## API Endpoints Reference

### Authentication
- `GET /api/auth/google` - Start OAuth flow
- `GET /api/auth/google/callback` - OAuth callback
- `GET /api/auth/current-user` - Get current user (session)
- `POST /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - Logout user

### Protected Routes Example
- `GET /api/auth/protected` - Example protected route

## Troubleshooting

### CORS Issues
Make sure `CLIENT_URL` in backend `.env` matches your frontend URL.

### OAuth Redirect Mismatch
Verify the callback URL in Google Console matches:
`http://localhost:5000/api/auth/google/callback`

### MongoDB Connection Issues
- Check if your IP is whitelisted in MongoDB Atlas
- Verify the connection string is correct
- Ensure network access is configured

### Session Not Persisting
- Check if cookies are enabled
- Verify `secure` flag is false in development
- Check CORS credentials setting

## Production Deployment

### Backend
1. Deploy to a service (Heroku, Railway, Render, etc.)
2. Update environment variables with production values
3. Add production URL to Google OAuth redirect URIs
4. Set `NODE_ENV=production`

### Frontend
1. Update `NEXT_PUBLIC_BACKEND_URL` to production backend URL
2. Deploy Next.js app
3. Update `CLIENT_URL` in backend to production frontend URL

## Security Checklist

- ✅ Change `JWT_SECRET` and `SESSION_SECRET` to strong random strings
- ✅ Never commit `.env` file to git
- ✅ Use HTTPS in production
- ✅ Set secure cookie flags in production
- ✅ Whitelist only necessary domains in CORS
- ✅ Keep Google OAuth credentials secure
- ✅ Regularly rotate secrets

## File Structure Created

```
backend/
├── config/
│   ├── database.js       # MongoDB connection
│   └── passport.js       # Google OAuth strategy
├── controllers/
│   └── authController.js # Auth logic
├── middleware/
│   └── auth.js          # JWT & session middleware
├── models/
│   └── User.js          # User schema
├── routes/
│   ├── authRoutes.js    # Auth endpoints
│   └── index.js         # Route aggregator
├── .env                 # Environment variables
├── .gitignore
├── package.json
├── server.js            # Express app
├── README.md
└── SETUP_GUIDE.md

Frontend Integration:
├── lib/
│   └── auth.ts          # Auth utility functions
├── app/
│   └── auth/
│       ├── success/page.tsx  # OAuth success handler
│       └── error/page.tsx    # OAuth error handler
└── components/
    └── GoogleLoginButton.tsx # Login button component
```

## Next Steps

1. Start the backend server
2. Test the OAuth flow
3. Integrate the email into your three forms
4. Add additional user fields if needed
5. Implement protected routes for your app
6. Add error handling and loading states
7. Deploy to production

## Support

If you encounter issues:
1. Check server logs for errors
2. Verify all environment variables are set
3. Test API endpoints with Postman/Thunder Client
4. Check MongoDB Atlas for user data
5. Review Google Cloud Console OAuth settings
