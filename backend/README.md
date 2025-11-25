# MatchMind Backend API

Backend API for MatchMind with Google OAuth authentication.

## Features

- Google OAuth 2.0 authentication
- JWT token generation and verification
- MongoDB integration with Mongoose
- Session management
- Protected routes
- CORS enabled for frontend integration

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

The `.env` file is already configured with:
- Google OAuth credentials
- MongoDB connection string
- JWT and session secrets
- Port configuration

### 3. Google Cloud Console Setup

Make sure your Google OAuth app is configured with these redirect URIs:
- `http://localhost:5000/api/auth/google/callback`
- Add your production URL when deploying

### 4. Start the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication Routes

#### 1. Initiate Google OAuth
```
GET /api/auth/google
```
Redirects to Google OAuth consent screen.

#### 2. Google OAuth Callback
```
GET /api/auth/google/callback
```
Handles Google OAuth callback and redirects to frontend with JWT token.

#### 3. Get Current User
```
GET /api/auth/current-user
```
Returns the currently authenticated user (requires session).

#### 4. Verify JWT Token
```
POST /api/auth/verify
Headers: Authorization: Bearer <token>
```
Verifies if a JWT token is valid.

#### 5. Logout
```
POST /api/auth/logout
```
Logs out the user and destroys the session.

#### 6. Protected Route (Example)
```
GET /api/auth/protected
Headers: Authorization: Bearer <token>
```
Example of a JWT-protected route.

### Utility Routes

#### Health Check
```
GET /api/health
```
Returns API health status.

## Frontend Integration

### 1. Initiate OAuth Flow

```javascript
// Redirect user to backend OAuth endpoint
window.location.href = 'http://localhost:5000/api/auth/google';
```

### 2. Handle OAuth Success

After successful authentication, the user will be redirected to:
```
http://localhost:3000/auth/success?token=<JWT_TOKEN>&email=<USER_EMAIL>&name=<USER_NAME>
```

Parse the URL parameters and store the token:

```javascript
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const email = urlParams.get('email');
const name = urlParams.get('name');

// Store token in localStorage
localStorage.setItem('authToken', token);
localStorage.setItem('userEmail', email);
localStorage.setItem('userName', name);
```

### 3. Use Token for API Requests

```javascript
const token = localStorage.getItem('authToken');

fetch('http://localhost:5000/api/auth/protected', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

### 4. Pre-fill Forms with Email

```javascript
const userEmail = localStorage.getItem('userEmail');

// Use this email to pre-fill your three forms
document.getElementById('emailInput').value = userEmail;
```

## Project Structure

```
backend/
├── config/
│   ├── database.js       # MongoDB connection
│   └── passport.js       # Passport Google OAuth strategy
├── controllers/
│   └── authController.js # Authentication logic
├── middleware/
│   └── auth.js          # JWT verification middleware
├── models/
│   └── User.js          # User model
├── routes/
│   ├── authRoutes.js    # Auth routes
│   └── index.js         # Route aggregator
├── .env                 # Environment variables
├── .gitignore
├── package.json
├── server.js            # Express app entry point
└── README.md
```

## User Model Schema

```javascript
{
  googleId: String,      // Google OAuth ID
  email: String,         // User email (for forms)
  name: String,          // User display name
  picture: String,       // Profile picture URL
  createdAt: Date,       // Account creation date
  lastLogin: Date        // Last login timestamp
}
```

## Security Notes

- JWT tokens expire after 7 days
- Session cookies are httpOnly and secure in production
- CORS is configured to only allow requests from your frontend
- Change `JWT_SECRET` and `SESSION_SECRET` in production

## Development Tips

- Use Postman or Thunder Client to test API endpoints
- Check MongoDB Atlas for user data
- Monitor console logs for debugging
- Use `npm run dev` for hot-reload during development
