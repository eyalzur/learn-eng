# Current State

## Last Updated
2025-12-04 22:15

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
- Responsive grid: 2 cols (4 pairs), 3 cols (5 pairs), 4 cols (6-8 pairs), 5 cols (9-10 pairs)
- Fixed-width columns ensure cards fit all mobile viewports
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
**v0.1.20** - Epic 1 (Mobile-First UX) complete

## Known Issues
- Commits ahead of origin/main (need to push)

## Recent Changes (This Session)
- BUG-003: Fixed Memory Game vertical overflow on mobile
  - Implemented fixed-width grid columns (not 1fr)
  - 4 pairs: 2 cols × 80px, 5 pairs: 3 cols × 80px
  - 6-8 pairs: 4 cols × 75px, 9-10 pairs: 5 cols × 60px
  - Cards use aspect-ratio 4/5 for consistent proportions
  - Responsive sizes for tablet (90-100px) and desktop (100-110px)
  - Grid uses width: fit-content to center naturally

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

.claude/commands/
├── bug-report.md         # Document bugs with QA investigation
├── next-task.md          # Get top priority task with context
├── prioritize-backlog.md # Review priorities as PM/QA/Tech Lead
├── save-proj.md          # Save project state to docs
├── start-session.md      # Initialize session with project context
└── ...                   # Other commands
```
