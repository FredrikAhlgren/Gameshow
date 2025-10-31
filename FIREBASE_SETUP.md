# Firebase Setup Guide

This application now runs on Firebase! Follow these steps to deploy your own Christmas Game Show.

## Prerequisites
- A Google account
- Node.js and npm installed
- Firebase CLI installed globally: `npm install -g firebase-tools`

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `christmas-game-show` (or your preferred name)
4. Disable Google Analytics (optional, not needed for this app)
5. Click "Create project"

## Step 2: Enable Firebase Realtime Database

1. In your Firebase project, click "Realtime Database" in the left sidebar
2. Click "Create Database"
3. Choose a location (select one closest to your users)
4. Start in **Test mode** for now (we'll set rules later)
5. Click "Enable"

## Step 3: Get Your Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the Web icon (`</>`) to add a web app
4. Register app with nickname: "Game Show Web"
5. Copy the `firebaseConfig` object

It will look like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

## Step 4: Update Firebase Configuration

1. Open `public/js/firebase-config.js`
2. Replace the placeholder values with your actual Firebase config:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 5: Deploy to Firebase Hosting

1. Login to Firebase CLI:
```bash
firebase login
```

2. Initialize Firebase in your project directory:
```bash
cd Gameshow
firebase init
```

3. Select these options:
   - Choose "Hosting" and "Realtime Database"
   - Select your existing project
   - Public directory: `public`
   - Configure as single-page app: `Yes`
   - Set up automatic builds: `No`
   - Don't overwrite existing files

4. Deploy:
```bash
firebase deploy
```

5. Your app will be live at: `https://YOUR_PROJECT_ID.firebaseapp.com`

## Step 6: Update Database Rules (Security)

For a production game, update your database rules in Firebase Console:

1. Go to Realtime Database > Rules
2. Replace with these rules:

```json
{
  "rules": {
    "gameState": {
      ".read": true,
      ".write": true
    }
  }
}
```

For **better security** (recommended):
```json
{
  "rules": {
    "gameState": {
      ".read": true,
      ".write": "auth != null || !data.exists()"
    }
  }
}
```

This allows anyone to read but restricts writes.

## Step 7: Test Local Development

Before deploying, test locally:

```bash
firebase serve
```

Then open: `http://localhost:5000`

## Using Your Deployed App

Once deployed, share these URLs with players:

- **Big Screen**: `https://YOUR_PROJECT.firebaseapp.com/big-screen.html`
- **Mobile Buzzer**: `https://YOUR_PROJECT.firebaseapp.com/buzzer.html`
- **Judge Panel**: `https://YOUR_PROJECT.firebaseapp.com/judge.html`

## Troubleshooting

### "Permission denied" errors
- Check your database rules in Firebase Console
- Make sure database URL is correct in firebase-config.js

### App not updating in real-time
- Verify Firebase is initialized correctly
- Check browser console for errors
- Ensure all devices are connected to internet

### Can't deploy
- Run `firebase login` again
- Check you have the correct project selected: `firebase use YOUR_PROJECT_ID`
- Verify firebase.json is in your project root

## Multiple Game Sessions

To run multiple independent games:

1. Create different database paths:
```javascript
const sessionId = 'game-' + Date.now();
const gameStateRef = database.ref(`sessions/${sessionId}/gameState`);
```

2. Share the session ID with all players
3. Each session maintains its own state

## Costs

Firebase Realtime Database has a generous free tier:
- **Free tier**: 1GB storage, 10GB/month downloads
- **Concurrent connections**: 100 simultaneous
- For a party game: **Completely FREE!**

A typical game session uses <1MB of data.

## Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Realtime Database Guide](https://firebase.google.com/docs/database)
- Check browser console for errors
- Verify network connectivity

---

**Ready to play!** 🎄🎅🎁
