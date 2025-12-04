# Current State

## Last Updated
2025-12-04 22:45

## What's Working
- [x] Project setup (Webpack + React + TypeScript)
- [x] Game menu for selecting games
- [x] Memory game with card flip animation
- [x] Spelling game with drag-and-drop letters
- [x] Spelling game with tap-to-place (mobile-friendly)
- [x] Flashcards game with spaced repetition
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
- [x] App version display (v0.1.22)
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

### Flashcards Game
- Multiple choice quiz to learn English words
- Configurable number of answer choices (2-6)
- Question language toggle (Hebrew or English)
- Speaker button plays English pronunciation
- Spaced repetition with 5-box Leitner system
- 10 cards per session
- Overall mastery progress tracking
- Settings and progress persisted in localStorage

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
**v0.1.22** - Flashcards game with multiple choice quiz

## Known Issues
- Commits ahead of origin/main (need to push)

## Recent Changes (This Session)
- Completed Flashcards game with multiple choice quiz
  - Multiple choice answers (2-6 configurable)
  - Question language toggle (Hebrew/English)
  - Speaker button always plays English pronunciation
  - 5-box Leitner spaced repetition system
  - Settings panel for configuration
  - Viewport-constrained layout (no overflow)

## File Structure
```
src/
├── components/
│   ├── GameMenu/         # Game selection screen
│   ├── MemoryGame/       # Memory matching game
│   ├── SpellingGame/     # Letter spelling game
│   └── FlashcardsGame/   # Spaced repetition flashcards
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
