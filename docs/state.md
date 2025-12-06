# Current State

## Last Updated
2025-12-06 08:00

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
- [x] App version display (v0.1.27)
- [x] Agent-based slash commands for parallel development
- [x] Git repository with feature branches
- [x] Example sentences feature (Flashcards & Hangman)
- [x] Unified game layout (header/content/footer structure)
- [x] Word teaching modal with example sentences

## Active Games

### Memory Game
- Match English-Hebrew word pairs
- Configurable word count: 4-10 pairs
- Responsive grid: 2 cols (4 pairs), 3 cols (5 pairs), 4 cols (6-8 pairs), 5 cols (9-10 pairs)
- Fixed-width columns ensure cards fit all mobile viewports
- Per-word-count record tracking
- Color-coded matched pairs
- *Note: Does not yet have unified layout or word teaching modal*

### Spelling Game
- Drag letters from basket to spell English words
- Tap-to-place interaction (mobile-friendly)
- Streak-based scoring (correct in a row)
- 50% extra decoy letters
- Hint button always available (shows transcription + pronunciation)
- Single-line letter boxes (no wrapping)
- LTR direction for English letter boxes
- Unified layout with header (back, progress) and footer (status, next)
- Word teaching modal after each answer

### Flashcards Game
- Multiple choice quiz to learn English words
- Configurable number of answer choices (2-6)
- Question language toggle (Hebrew or English)
- Speaker button plays English pronunciation
- Spaced repetition with 5-box Leitner system
- Continuous play (no session/round limits)
- Overall mastery progress tracking
- Settings panel in header
- Unified layout with header (back, progress, settings) and footer (status, next)
- Word teaching modal after each answer

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
- Unified layout with header (back, progress) and footer (status, next)
- Word teaching modal after win/loss

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
**v0.1.27** - Unified game layout + word teaching modal

## Known Issues
- 90/110 words still need example sentences added
- Memory Game needs separate modal design (different from other games)

## Recent Changes (This Session)
- Implemented unified game layout feature
  - Created GameLayout shared component (header/content/footer structure)
  - Created GameHeader component (back button, progress, settings)
  - Created GameFooter component (status message, next button)
  - Created WordTeachingModal component (word card + example sentence)
  - Refactored Spelling Game to use new layout + modal
  - Refactored Flashcards Game to use new layout + modal
  - Refactored Hangman Game to use new layout + modal
  - Modal displays English word, Hebrew translation, and example sentence
  - Speaker buttons for all text (word + sentence in both languages)
  - Success/failure state with green checkmark or red X
- Added Memory Game modal task to backlog (needs separate design)

## File Structure
```
src/
├── components/
│   ├── GameMenu/         # Game selection screen
│   ├── MemoryGame/       # Memory matching game
│   ├── SpellingGame/     # Letter spelling game (uses GameLayout)
│   ├── FlashcardsGame/   # Spaced repetition flashcards (uses GameLayout)
│   ├── HangmanGame/      # Hangman word guessing game (uses GameLayout)
│   └── shared/           # Shared components
│       ├── GameLayout/   # Unified game layout wrapper
│       ├── GameHeader/   # Header with back, progress, settings
│       ├── GameFooter/   # Footer with status, next button
│       ├── SentenceDisplay/ # Example sentence display
│       └── WordTeachingModal/ # Teaching modal with word + sentence
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

design-docs/              # UX/Product design documents
├── unified-game-layout.md # Unified layout + word teaching modal design

tech-docs/                # Technical design documents
```
