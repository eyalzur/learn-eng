# Current State

## Last Updated
2025-12-02

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
- None currently

## Recent Changes (This Session)
- Fixed spelling game RTL bug (letters now display left-to-right)
- Added justDropped guard to prevent click after drop
- Added defensive trim() to answer comparison
- Removed debug code after fix confirmed

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
