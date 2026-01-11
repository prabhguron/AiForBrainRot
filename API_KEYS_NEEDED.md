# API Keys Needed for Multiplayer

## Firebase Configuration

You need **Firebase Realtime Database** credentials. Here's what you need:

### Required Values:
1. **API Key** - `FIREBASE_API_KEY`
2. **Project ID** - `FIREBASE_PROJECT_ID`  
3. **Database URL** - `FIREBASE_DATABASE_URL`
4. **Messaging Sender ID** - `FIREBASE_MESSAGING_SENDER_ID`
5. **App ID** - `FIREBASE_APP_ID`

### How to Get Them:

1. Go to https://console.firebase.google.com/
2. Create a new project (or use existing)
3. Enable **Realtime Database**:
   - Click "Realtime Database" in left menu
   - Click "Create Database"
   - Choose location
   - Start in **Test Mode**
4. Get your config:
   - Click gear icon ⚙️ > Project Settings
   - Scroll to "Your apps"
   - Click web icon `</>`
   - Register app (if needed)
   - Copy the config values

### Setup Methods:

#### Method 1: Environment Variables (Recommended)
```bash
# Create .env file
FIREBASE_API_KEY=AIzaSy...
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abc123

# Generate config
node setup-firebase.js
```

#### Method 2: Extension Popup (Easier)
1. Open extension popup
2. Click "🔑 Firebase Configuration"
3. Enter your credentials
4. Click "Save Settings"

### Demo Mode (No API Keys Needed!)

If you don't set up Firebase, the extension works in **Demo Mode** with simulated opponents. Perfect for hackathon demos!

### Testing

After setup, reload the extension and visit a blocked site. You should see:
- **With Firebase**: Real matchmaking with other players
- **Without Firebase**: Demo mode with simulated opponent
