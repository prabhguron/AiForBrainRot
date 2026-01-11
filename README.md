# BrainRotAI - Stop Scrolling 🧠
A Chrome extension that combats endless scrolling by earning your access to time-wasting websites.

##  Quick Start
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

## Inspiration
We realized that willpower alone isn't enough to resist the dopamine hits from social media. Instead of blocking sites completely, we wanted to create a system that rewards mental effort—solve a quick math problem, quizz, you name it! to earn time to browse guilt-free. It's a fun way to make productivity feel like a game.

## What it does
- Blocks addictive sites (YouTube, Instagram, TikTok, Twitter, Reddit, Facebook) by default
- When you try to visit a blocked site, you're redirected to a challenge
- Solve the challenge correctly and earn 5 minutes (or more...) of browsing time as a reward
- Keeps track of your challenge score and current streak to motivate you
- Configure question intervals, reward time, and manage your blocked sites list
- Fun, playful interface that makes productivity feel less like punishment

## How we built it
**Tech Stack:**
- Chrome Extension API (manifest.json, background script, content script)
- JavaScript (vanilla, no frameworks)
- HTML5 + CSS3
- Chrome Storage API for persisting user data

**Architecture:**
- `manifest.json` - Extension configuration
- `background.js` - Timer countdown, website blocking logic, message routing
- `challenge.html/js` - Math challenge UI with cartoony styling
- `popup.html/js` - Settings panel for users to customize experience
- `style.css` - Unified cartoon-themed styling
- `content.js` - Page injection logic

**Key Features:**
- Real-time countdown timer stored in Chrome storage
- Math problem generation with multiple difficulty levels
- Dynamic site blocking based on user configuration
- Redirect system to send users back to original site after challenge completion

## Challenges we ran into
**Redirect Logic** - Storing the original blocked site URL and redirecting after challenge completion involved managing window/tab states

**UI Polish** - Creating a visually appealing, cartoony interface while maintaining usability across different popup sizes

**State Management** - Tracking score, streak, and settings across multiple pages and extension contexts

## Accomplishments that we're proud of

- Created a cohesive, playful design with cartoon boxes, bold borders, and fun colors that makes productivity feel like a game
- Score and streak systems that genuinely motivate users to solve challenges
- No external dependencies, pure vanilla JS, minimal performance impact
- Seamlessly returns users to the exact site they were trying to visit after completing a challenge
- Works on different screen sizes; challenge page and popup both feel polished and intentional

## What we learned
- Chrome Extension API is powerful but requires careful state management
- User customization (blocking specific sites, adjusting time rewards) is critical for adoption
- Small UX details (animations, emojis, visual feedback) make the difference between a tool that feels janky and one that feels delightful

## What's next for Stop Scrolling
**AI-Powered Difficulty Scaling** - Adjust math problem difficulty based on user performance

**Leaderboards** - Share scores with friends and create friendly competition

**Pomodoro Integration** - Built-in pomodoro timer that syncs with browsing time rewards

**Achievements & Badges** - Unlock badges for milestones (100 correct answers, 7-day streak, etc.)

**Focus Mode** - "Iron Will" mode that locks users out completely during focus sessions

 **Customizable Challenges** - Let users choose between math problems, trivia, or coding challenges
