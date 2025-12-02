# Current State

## Last Updated
2025-12-02 15:30

## What's Working
- [x] Project setup (Webpack + React + TypeScript)
- [x] Game menu for selecting games
- [x] Memory game with card flip animation
- [x] Spelling game with drag-and-drop letters
- [x] Dictionary with 20 beginner words (English, Hebrew with nikud, transcription)
- [x] Text-to-speech for word pronunciation
- [x] Record tracking (localStorage)
- [x] Responsive design with RTL support
- [x] Dev server running on port 4000
- [x] Git repository initialized with GitHub remote

## Active Games

### Memory Game
- Match English-Hebrew word pairs
- Configurable word count: 4-10 pairs
- Center-out column layout
- Per-word-count record tracking
- Color-coded matched pairs

### Spelling Game
- Drag letters from basket to spell English words
- Streak-based scoring (correct in a row)
- 50% extra decoy letters
- Hint button (shows transcription + pronunciation)
- LTR direction for English letter boxes

## Running the App
```bash
npm start
# Opens http://localhost:4000
```

## Known Issues
- Git push to remote pending (SSH port 3022 timeout / HTTPS auth needed)

## Recent Changes (This Session)
- Initialized git repository
- Connected to GitHub remote: git@github.com:eyalzur/learn-eng.git
- Created initial commit with all source files
- Fixed .gitignore to exclude node_modules/ and dist/

## File Structure
```
src/
├── components/
│   ├── GameMenu/         # Game selection screen
│   ├── MemoryGame/       # Memory matching game
│   └── SpellingGame/     # Letter spelling game
├── data/
│   └── dictionary.ts     # Word database
├── utils/
│   └── speech.ts         # Text-to-speech utility
├── styles/
│   └── main.css          # All styles
├── App.tsx               # Main app with game routing
└── index.tsx             # Entry point
```
