# Current State

## Last Updated
2025-12-04 12:45

## What's Working
- [x] Project setup (Webpack + React + TypeScript)
- [x] Game menu for selecting games
- [x] Memory game with card flip animation
- [x] Spelling game with drag-and-drop letters
- [x] Spelling game with tap-to-place (mobile-friendly)
- [x] Dictionary with 20 beginner words (English, Hebrew with nikud, transcription)
- [x] Text-to-speech for word pronunciation
- [x] Record tracking (localStorage)
- [x] Responsive design with RTL support
- [x] Mobile-first CSS breakpoints
- [x] iOS Safari viewport height fix (dvh + JS fallback)
- [x] Safe-area-inset support for notched devices
- [x] 48px minimum tap targets throughout
- [x] Dev server running on port 4000
- [x] Production deployment on Render
- [x] App version display (v0.1.19)
- [x] Git repository with feature branches

## Active Games

### Memory Game
- Match English-Hebrew word pairs
- Configurable word count: 4-10 pairs
- Responsive grid: 2 columns (4-5 pairs), 4 columns (6+ pairs)
- Per-word-count record tracking
- Color-coded matched pairs

### Spelling Game
- Drag letters from basket to spell English words
- Tap-to-place interaction (mobile-friendly)
- Streak-based scoring (correct in a row)
- 50% extra decoy letters
- Hint button always available (shows transcription + pronunciation)
- Single-line letter boxes (no wrapping)
- LTR direction for English letter boxes

## Running the App
```bash
# Development
npm run dev
# Opens http://localhost:4000

# Production build
npm run build

# Production server
npm start
```

## Current Version
**v0.1.19** - Epic 1 (Mobile-First UX) complete

## Known Issues
- 13 commits ahead of origin/main (need to push)

## Recent Changes (This Session)
- Completed Epic 1: Mobile-First UX (all 8 tasks)
- Added mobile-first CSS breakpoints (480px, 768px, 1024px)
- Game Menu: single column on narrow screens (<480px)
- Increased all tap targets to 48px minimum
- Fixed iOS Safari viewport height (100dvh + JS fallback)
- Added safe-area-inset support for notched devices (iPhone X+)
- Added viewport-fit=cover meta tag
- Spelling Game: letter boxes now single line (no wrapping)
- Spelling Game: hint button always available

## File Structure
```
src/
├── components/
│   ├── GameMenu/         # Game selection screen
│   ├── MemoryGame/       # Memory matching game
│   └── SpellingGame/     # Letter spelling game
├── constants/
│   └── version.ts        # App version tracking
├── data/
│   └── dictionary.ts     # Word database
├── utils/
│   └── speech.ts         # Text-to-speech utility
├── styles/
│   └── main.css          # All styles (mobile-first)
├── App.tsx               # Main app with game routing + viewport fix
└── index.tsx             # Entry point
```
