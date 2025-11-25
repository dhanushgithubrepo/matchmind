# Testing the Profile API

## 1. Start Backend Server
```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected successfully
```

## 2. Test Flow

### Step 1: Login with Google
- Go to http://localhost:3000
- Click "Login with Google"
- Complete OAuth flow
- You'll be redirected back with a JWT token stored in localStorage

### Step 2: Fill Out a Form
- Select your role (HR/Job Seeker/Researcher)
- Fill out the form
- Click "Complete Profile"

### Step 3: Verify in MongoDB
- Go to MongoDB Atlas
- Check the database: `masterMind`
- Look for collections:
  - `jobseekerprofiles`
  - `researcherprofiles`
  - `hrprofiles`

Your data should be there!

## 3. Check Browser Console
Open browser DevTools (F12) and check:
- Network tab: Look for POST request to `/api/profiles/...`
- Console: Should show "Profile saved successfully"

## 4. Verify Backend Logs
In your backend terminal, you should see the save operation logs.

## Common Issues

### "Please login first"
- Make sure you completed Google OAuth
- Check localStorage has `authToken`

### "Failed to save profile"
- Check backend is running on port 5000
- Check `.env.local` has `NEXT_PUBLIC_BACKEND_URL=http://localhost:5000`
- Check MongoDB connection

### CORS Error
- Make sure `CLIENT_URL` in backend `.env` matches your frontend URL
