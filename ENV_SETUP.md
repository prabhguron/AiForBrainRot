# Environment Variable Setup for Firebase

## Quick Setup

### Option 1: Using Environment Variables (Recommended for Development)

1. **Create a `.env` file** (copy from `.env.example`):
```bash
cp .env.example .env
```

2. **Fill in your Firebase credentials** in `.env`:
```env
FIREBASE_API_KEY=AIzaSy...
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abc123
```

3. **Generate the config file**:
```bash
node setup-firebase.js
```

This will create `firebase-config.js` with your credentials.

### Option 2: Using Extension Popup (Easier for End Users)

1. Open the extension popup
2. Click "🔑 Firebase Configuration" to expand
3. Enter your Firebase credentials
4. Click "Save Settings"

The config will be stored in Chrome's local storage.

### Option 3: Manual Setup

Edit `firebase-config.js` directly with your Firebase credentials.

## Getting Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon ⚙️ > Project Settings
4. Scroll to "Your apps" section
5. Click the web icon `</>`
6. Register your app (if not already done)
7. Copy the `firebaseConfig` values

## Required Firebase Setup

1. **Enable Realtime Database**:
   - Go to Realtime Database in Firebase Console
   - Click "Create Database"
   - Choose location and start in **Test Mode**

2. **Set Database Rules**:
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

## Testing

After setting up:
1. Reload the extension in Chrome
2. Visit a blocked site (e.g., youtube.com)
3. You should see multiplayer matchmaking (not demo mode)

## Demo Mode

If Firebase is not configured, the extension automatically uses **Demo Mode** with simulated opponents. This works perfectly for hackathon demos!
