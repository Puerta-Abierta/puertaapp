# Google Authentication Setup Guide

This app now has Google authentication with persistent sign-in. Here's what you need to do to get it working:

## 1. Set Up Convex

1. **Initialize Convex** (if not already done):
   ```bash
   npx convex dev
   ```
   This will:
   - Create a Convex project (if needed)
   - Generate the deployment URL
   - Push your schema and functions

2. **Get your Convex URL**:
   After running `npx convex dev`, you'll see a URL like:
   ```
   https://your-project.convex.cloud
   ```

3. **Set the Convex URL in your app**:
   Create a `.env` file in the root directory (or update `.env.local` if it exists):
   ```env
   EXPO_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
   ```
   Replace `your-project` with your actual Convex project name.

## 2. Push Convex Schema and Functions

The app includes:
- `convex/schema.ts` - Database schema for users
- `convex/users.ts` - User queries and mutations

Run:
```bash
npx convex dev
```

This will push your schema and functions to Convex.

## 3. How It Works

### Authentication Flow:
1. User clicks "Sign up with Google" button
2. Google Sign-In opens (native on mobile, web popup on web)
3. User selects Google account
4. App receives Google ID token and user info
5. App calls Convex mutation to create/update user in database
6. User ID is stored in AsyncStorage for persistence
7. User is redirected to home page

### Persistence:
- User authentication state is stored in AsyncStorage
- On app restart, the app checks AsyncStorage and loads the user
- User stays signed in until they explicitly sign out

### Protected Routes:
- Unauthenticated users are redirected to `/welcome`
- Authenticated users accessing auth pages are redirected to `/home`
- The confirmation page is accessible to both (for email verification flow)

## 4. Files Modified/Created

### New Files:
- `contexts/AuthContext.tsx` - Authentication context and provider
- `convex/schema.ts` - Database schema
- `convex/users.ts` - User management functions
- `app/home.tsx` - Home page for authenticated users

### Modified Files:
- `app/_layout.tsx` - Added ConvexProvider and AuthProvider
- `app/googlebutton.tsx` - Updated to use auth context
- `app/signup.tsx` - Updated to use new GoogleButton
- `app/login.tsx` - Added Google sign-in button
- `app/index.tsx` - Added auth-based routing

## 5. Testing

1. **Start the app**:
   ```bash
   npm start
   # or
   npx expo start
   ```

2. **Test on Android**:
   ```bash
   npm run android
   ```

3. **Test the flow**:
   - Go to welcome page
   - Click "Sign up with Google"
   - Sign in with Google
   - You should be redirected to home page
   - Close and reopen the app
   - You should still be signed in
   - Click "Sign Out" to test sign out

## 6. Troubleshooting

### "EXPO_PUBLIC_CONVEX_URL is not set" warning:
- Make sure you've created a `.env` file with your Convex URL
- Restart the Expo dev server after adding the environment variable

### Convex functions not found:
- Run `npx convex dev` to push your functions
- Make sure your Convex deployment is active

### Google Sign-In not working:
- Verify your Google OAuth client IDs are correct in `app/googlebutton.tsx`
- Make sure you've configured the OAuth consent screen in Google Cloud Console
- For Android: Ensure the SHA-1 fingerprint is added to your Google Cloud project

### User not persisting:
- Check that AsyncStorage is working (it should work automatically)
- Verify the user was created in Convex dashboard

## 7. Next Steps

You can now:
- Add more user profile fields
- Implement email verification (if needed)
- Add role-based access control
- Create protected API routes
- Add more authentication providers (Facebook, Apple, etc.)
