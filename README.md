# BrainRotAI - 1v1 Multiplayer Extension

A Chrome extension that blocks distracting websites and rewards you with browsing time by competing in 1v1 trivia battles!

## 🎮 Features

### 1v1 Multiplayer Mode (NEW!)
- **Real-time matchmaking** - Find opponents instantly
- **Competitive trivia** - Answer questions faster than your opponent
- **Time rewards** - Winners get 10 minutes, losers get 2 minutes
- **Live score tracking** - See your progress in real-time
- **30+ questions** - Mix of math, geography, science, and general knowledge

### Single Player Mode
- Traditional math challenges
- Solve problems to earn browsing time
- Track your score and streak

## 🚀 Quick Start

1. **Load the Extension**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select this folder

2. **Configure Settings**
   - Click the extension icon
   - Set your question interval and reward time
   - Choose between "1v1 Multiplayer" or "Single Player" mode
   - Add websites to block

3. **Enable Multiplayer (Optional)**
   - See `FIREBASE_SETUP.md` for Firebase setup
   - Or use Demo Mode (works without Firebase!)

## 🎯 How It Works

1. Visit a blocked site (YouTube, Instagram, TikTok, etc.)
2. If you're out of time, you'll be redirected to a challenge
3. In **Multiplayer Mode**: Find an opponent and compete in real-time
4. Answer questions correctly and faster than your opponent
5. Win rounds to earn browsing time
6. Continue browsing once you have time!

## 🏆 Hackathon Features

- **Impressive Demo**: 1v1 multiplayer is visually engaging
- **Real-time Sync**: Firebase integration for live matches
- **Demo Mode**: Works without setup for quick demos
- **Beautiful UI**: Modern, colorful design
- **Competitive Element**: Makes productivity fun!

## 📝 Files

- `multiplayer.html` - 1v1 battle interface
- `multiplayer.js` - Game logic and Firebase integration
- `challenge.html` - Single player mode
- `challenge.js` - Single player logic
- `content.js` - Site blocking logic
- `background.js` - Time management
- `popup.html/js` - Settings interface

## 🔧 Setup Firebase (Optional)

For full multiplayer functionality, see `FIREBASE_SETUP.md`. The extension works in demo mode without Firebase!

## 💡 Tips for Hackathon Demo

1. **Use Demo Mode**: Works immediately without setup
2. **Show Both Modes**: Switch between single and multiplayer
3. **Highlight Competition**: Show the real-time battle aspect
4. **Emphasize Fun**: Make productivity competitive and engaging
5. **Show Time Rewards**: Demonstrate the incentive system

## 🎨 Design

- Colorful, modern UI
- Smooth animations
- Clear feedback
- Mobile-friendly

Good luck with your hackathon! 🚀
