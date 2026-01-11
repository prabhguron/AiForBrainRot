# Firebase Setup Guide for 1v1 Multiplayer

To enable the 1v1 multiplayer feature, you need to set up Firebase Realtime Database.

## Quick Setup (5 minutes)

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project"
   - Enter project name (e.g., "BrainRotAI")
   - Disable Google Analytics (optional)
   - Click "Create Project"

2. **Enable Realtime Database**
   - In your Firebase project, go to "Realtime Database" in the left menu
   - Click "Create Database"
   - Choose a location (closest to your users)
   - Start in **Test Mode** (for hackathon demo)
   - Click "Enable"

3. **Get Your Firebase Config**
   - Go to Project Settings (gear icon) > General
   - Scroll down to "Your apps"
   - Click the web icon `</>`
   - Register app with a nickname (e.g., "BrainRotAI Extension")
   - Copy the `firebaseConfig` object

4. **Update `multiplayer.js`**
   - Open `multiplayer.js`
   - Find the `firebaseConfig` object at the top
   - Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...", // Your actual API key
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

5. **Set Database Rules (Important!)**
   - Go to Realtime Database > Rules
   - Replace with these rules for hackathon demo:

```json
{
  "rules": {
    "matchmaking": {
      ".read": true,
      ".write": true,
      ".indexOn": "timestamp"
    },
    "matches": {
      ".read": true,
      ".write": true
    }
  }
}
```

   - Click "Publish"

## Testing

1. Load the extension in Chrome
2. Visit a blocked site (e.g., youtube.com)
3. You should see the multiplayer matchmaking screen
4. Open another browser/incognito window to test with a second player

## Demo Mode

If you don't set up Firebase, the extension will work in "Demo Mode" with simulated opponents. This is perfect for hackathon demos if you can't set up Firebase quickly!

## Security Note

The rules above are for **hackathon/demo purposes only**. For production, you should:
- Add authentication
- Add validation rules
- Limit write access
- Add rate limiting

## Troubleshooting

- **"Firebase not configured" warning**: Make sure you updated the `firebaseConfig` in `multiplayer.js`
- **No matches found**: Make sure database rules allow read/write
- **Connection errors**: Check that your database URL is correct
