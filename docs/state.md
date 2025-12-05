# Current State

## Last Updated
2025-12-05 18:30

## What's Working
- [x] Project setup (Webpack + React + TypeScript)
- [x] Game menu for selecting games
- [x] Memory game with card flip animation
- [x] Spelling game with drag-and-drop letters
- [x] Spelling game with tap-to-place (mobile-friendly)
- [x] Flashcards game with spaced repetition
- [x] Hangman game with letter guessing
- [x] Dictionary with 110 words across 8 categories
- [x] Text-to-speech for word pronunciation
- [x] Record tracking (localStorage)
- [x] Responsive design with RTL support
- [x] Mobile-first CSS breakpoints
- [x] iOS Safari viewport height fix (dvh + JS fallback)
- [x] Safe-area-inset support for notched devices
- [x] 48px minimum tap targets throughout
- [x] Dev server running on port 4000
- [x] Production deployment on Render
- [x] App version display (v0.1.26)
- [x] Agent-based slash commands for parallel development
- [x] Git repository with feature branches
- [x] Example sentences feature (Flashcards & Hangman)

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
- Continuous play (no session/round limits)
- Overall mastery progress tracking
- Settings and progress persisted in localStorage
- Example sentences displayed after answering (replaces question card)

### Hangman Game
- Classic word-guessing game with letter-by-letter discovery
- 6 wrong guesses allowed before losing
- ASCII/Unicode hangman figure with 7 stages
- Limited letter keyboard (word letters + 8 decoys, not full A-Z)
- Hebrew word and transcription always visible with speaker button
- English word revealed letter by letter (green on win, red on loss)
- Streak tracking with best record in localStorage
- Compact mobile-friendly UI with proper viewport handling
- Mobile-first design with 48px minimum tap targets
- Example sentences displayed after win/loss (replaces hangman figure)

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
**v0.1.26** - Example sentences feature

## Known Issues
- 90/110 words still need example sentences added

## Recent Changes (This Session)
- Implemented vocabulary-expansion-sentences feature
  - Added SentenceDisplay shared component
  - 20 words have example sentences (English + Hebrew)
  - Flashcards: sentence replaces question card after answering
  - Hangman: sentence replaces hangman figure after win/loss
  - Blue card styling matching app theme
  - Speaker buttons for TTS on both languages
  - Fixed localStorage bug (merge stored progress with fresh dictionary)

## File Structure
```
src/
├── components/
│   ├── GameMenu/         # Game selection screen
│   ├── MemoryGame/       # Memory matching game
│   ├── SpellingGame/     # Letter spelling game
│   ├── FlashcardsGame/   # Spaced repetition flashcards
│   ├── HangmanGame/      # Hangman word guessing game
│   └── shared/           # Shared components (SentenceDisplay)
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
├── bug-report-agent.md   # Spawn agent for bug documentation
├── feature-design.md     # Design new features
├── feature-design-agent.md # Spawn agent for feature design
├── implement-agent.md    # Spawn agent to implement bug/feature
├── next-task.md          # Get top priority task with context
├── prioritize-backlog.md # Review priorities as PM/QA/Tech Lead
├── save-proj.md          # Save project state to docs
├── start-session.md      # Initialize session with project context
└── ...                   # Other commands

docs/features/            # Feature design documents (for implement-agent)
```
