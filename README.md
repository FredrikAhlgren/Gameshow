# 🎄 Christmas Game Show 🎅

An interactive, multi-screen game show application perfect for Christmas parties, family gatherings, or any festive event! Built with real-time synchronization, this Jeopardy-style trivia game supports multiple teams, custom questions, and three different question types.

## ✨ Features

### Three Synchronized Views
- **📺 Big Screen Display** - Show the game board, questions, scores, and buzzer alerts on your TV/projector
- **📱 Mobile Buzzer** - Players use their phones to buzz in and answer questions
- **⚖️ Judge Panel** - Host controls the game, manages teams, and scores answers

### Game Features
- **2-8 Team Support** - Fully customizable teams with colors, names, scores, and profile pictures
- **3 Question Types**:
  - 📝 **Standard Q&A** - Traditional trivia with exact answers
  - 🎯 **Closest Number** - Teams guess a number, closest wins
  - 💡 **Creative/Funny** - Judge picks the best/funniest answer
- **25 Customizable Questions** - 5 categories × 5 questions (100-500 points)
- **Real-time Synchronization** - All screens update instantly via WebSocket
- **Sound Effects** - Buzzer sounds, correct/wrong chimes, timer ticks
- **Visual Animations** - Spotlight effects, smooth transitions, popup overlays
- **Partial Credit Scoring** - Award 0-100% of points for partially correct answers
- **Answer History** - Track all responses and results
- **Score Override** - Manually adjust team scores if needed
- **Persistent Player Names** - Auto-saved in browser localStorage

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or download this repository**
```bash
cd Gameshow
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the server**
```bash
npm start
```

4. **Open in browsers**
The server will start on `http://localhost:3000`. You'll see:
```
🎄 Christmas Game Show Server running on http://localhost:3000
📺 Big Screen: http://localhost:3000/big-screen
📱 Mobile Buzzer: http://localhost:3000/buzzer
⚖️  Judge Panel: http://localhost:3000/judge
```

## 🎮 How to Play

### Setup (5-10 minutes)

1. **Host - Open Judge Panel** (`/judge`)
   - Configure teams (names, colors, activate 2-8 teams)
   - Upload team profile pictures (optional)
   - Customize questions and categories
   - Click "Apply Team Changes" and "Apply Questions to Game Board"

2. **Display - Open Big Screen** (`/big-screen`) on TV/Projector
   - Full-screen for best experience (F11)
   - Adjust sound settings using controls in bottom-right corner

3. **Players - Open Mobile Buzzer** (`/buzzer`) on Phones
   - Enter your name (saved automatically)
   - Select your team from dropdown
   - Ready to buzz in!

### Playing

1. **Host selects a question** from the game board (click any value)
2. **Question appears** on big screen with 15-second countdown timer
3. **Players buzz in** by tapping the big green button on their phone
4. **First buzzer locks** all other buzzers
5. **Judge reviews** the question and answer on their panel
6. **Judge awards points** (Correct/Incorrect, with optional partial credit)
7. **Scores update** in real-time across all screens
8. **Repeat** until all questions are answered!

## 📱 Screen Details

### Big Screen Display (`/big-screen`)
- Game board with all categories and questions
- Live scoreboard with team names, icons, and scores
- Question popup with countdown timer
- Buzzer indicator showing who buzzed in
- Correct/Incorrect overlay animations
- Sound effects and visual feedback

### Mobile Buzzer (`/buzzer`)
- Simple, thumb-friendly interface
- Player name input
- Team selection dropdown
- Large buzzer button (250px diameter)
- Status indicator (locked/active)
- Haptic feedback (vibration on compatible devices)
- Real-time buzzer lock status

### Judge Panel (`/judge`)
- **Team Setup Section**
  - Configure 2-8 teams with toggle switches
  - Upload profile pictures
  - Manually adjust scores
- **Question Setup Section**
  - Edit all 25 questions and answers
  - Choose question type for each
  - Customize category names
- **Live Judging Interface**
  - See who buzzed in
  - View current question and correct answer
  - Award points with partial credit slider (0-100%)
  - Manual score override for any team
- **Answer History**
  - See last 10 answers
  - Color-coded correct/incorrect
- **Reset Game Button**
  - Clear all scores and reset board

## 🎨 Customization

### Teams
- Support for 2-8 teams
- Pre-configured with festive colors and emojis
- Upload custom team pictures (JPG, PNG)
- Toggle teams on/off without losing data

### Questions
- 5 categories × 5 questions (25 total)
- Point values: 100, 200, 300, 400, 500
- Three question types per question
- Fully editable on judge panel

### Categories
Default categories:
- Science
- History
- Pop Culture
- Geography
- Sports

All categories and questions are fully customizable!

## 🔊 Sound Effects

The app includes Web Audio API-generated sound effects:
- **Buzzer** - Quick beep when someone buzzes in
- **Correct** - Ascending chime for correct answers
- **Wrong** - Descending buzz for incorrect answers
- **Timer Tick** - Subtle tick in last 10 seconds
- **Click** - Satisfying click when selecting questions

Toggle sound on/off using the sound controls (bottom-right on big screen).

## 🌐 Network Setup

### Local Network (Recommended for Parties)
1. Find your computer's IP address:
   - **Windows**: `ipconfig` (look for IPv4 Address)
   - **Mac/Linux**: `ifconfig` or `ip addr` (look for inet)
2. Start the server: `npm start`
3. Players connect to: `http://YOUR_IP:3000/buzzer`
4. Big screen: `http://YOUR_IP:3000/big-screen`
5. Judge: `http://YOUR_IP:3000/judge`

Example: If your IP is `192.168.1.100`:
- Big Screen: `http://192.168.1.100:3000/big-screen`
- Buzzer: `http://192.168.1.100:3000/buzzer`
- Judge: `http://192.168.1.100:3000/judge`

### Port Configuration
Change the port by setting the `PORT` environment variable:
```bash
PORT=8080 npm start
```

## 🛠️ Technical Details

### Tech Stack
- **Backend**: Node.js + Express
- **Real-time**: Socket.io (WebSocket)
- **Frontend**: Vanilla JavaScript (no framework dependencies)
- **Styling**: Pure CSS with gradients and animations
- **Audio**: Web Audio API

### File Structure
```
Gameshow/
├── server.js              # Express + Socket.io server
├── package.json           # Dependencies
├── public/
│   ├── index.html         # Entry page with view selection
│   ├── big-screen.html    # Display view
│   ├── buzzer.html        # Mobile buzzer view
│   ├── judge.html         # Judge control panel
│   ├── css/
│   │   └── style.css      # All styles
│   └── js/
│       └── sound-effects.js  # Sound generation
└── README.md
```

### Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 11+)
- Mobile browsers: ✅ Full support with haptic feedback

### Requirements
- Modern browser with JavaScript enabled
- WebSocket support
- Same network for all devices (local play)

## 🎯 Tips for Best Experience

1. **Use Full-Screen** on the big screen display (press F11)
2. **Test sound** before starting the game
3. **Keep judge panel** on a separate device from the big screen
4. **Save team pictures** beforehand for faster setup
5. **Customize questions** for your audience (family-friendly, inside jokes, etc.)
6. **Use WiFi** instead of cellular data for better connection
7. **Position buzzer devices** comfortably for quick tapping
8. **Assign a dedicated judge** who isn't playing

## 🎪 Game Variations

### Speed Round
- Set timer to 5 seconds instead of 15
- No partial credit (all or nothing)
- Double points

### Closest Wins
- Use only "Closest Number" questions
- Great for estimation challenges
- Award points based on accuracy

### Creative Challenge
- Use only "Creative/Funny" questions
- Judge picks best answer
- Audience can vote

### Daily Double
- Mark certain questions as "Daily Double"
- Team can wager their points
- High risk, high reward!

## 🐛 Troubleshooting

### Players can't connect
- Ensure all devices are on the same WiFi network
- Check firewall settings (allow port 3000)
- Verify IP address is correct

### Buzzer not responding
- Check that a question is active
- Verify team is selected
- Refresh the buzzer page

### Scores not updating
- Check connection status (top of page)
- Refresh all screens
- Restart the server if needed

### Sound not playing
- Check sound toggle (should show 🔊)
- Increase device volume
- Click anywhere to initialize audio context

## 📝 Development

### Run in development mode with auto-reload
```bash
npm install -g nodemon
npm run dev
```

### Customize default questions
Edit the `initializeQuestions()` function in `server.js`

### Modify team colors
Edit the `defaultTeams` array in `judge.html`

### Adjust timer duration
Change `popupTimeLeft = 15` in `big-screen.html` and `server.js`

## 📄 License

MIT License - Feel free to use, modify, and distribute!

## 🎁 Credits

Created for Christmas parties and festive gatherings. Enjoy and have fun! 🎄

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements!

---

**Merry Christmas and Happy Gaming! 🎅🎄🎁**