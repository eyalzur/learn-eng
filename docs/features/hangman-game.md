# Feature Design: Hangman Game

## Summary
A classic Hangman word-guessing game where Hebrew-speaking players guess English words letter by letter. Players see the Hebrew translation and progressively reveal letters by tapping them. Wrong guesses build up a hangman figure, and players lose after 6 incorrect guesses. The game reinforces spelling, letter recognition, and word recall.

## Target Users
Hebrew speakers (primarily children) learning English vocabulary.

## Problem Solved
- Adds variety to learning methods (complements memory, spelling, and flashcards)
- Reinforces word spelling through letter-by-letter discovery
- Makes vocabulary learning more engaging through gamification
- Encourages strategic thinking about word structure and common letters

## User Experience

### Game Flow
1. **Game Start**: Player selects Hangman from game menu
2. **Word Display**: Hebrew word shown at top, English word shown as blank underscores
3. **Letter Selection**: A-Z letter buttons displayed below
4. **Guess**: Player taps a letter
   - **Correct**: Letter appears in all matching positions in the word
   - **Incorrect**: Hangman figure progresses one stage (6 stages total)
5. **Win Condition**: All letters revealed before 6 wrong guesses
6. **Lose Condition**: 6 wrong guesses made (hangman complete)
7. **Result**: Show result message, play English pronunciation, show next word button
8. **Continue**: Load next word or restart

### UI Screens & Layout

#### Main Game Screen
```
┌─────────────────────────────────┐
│  ← חזרה לתפריט     משחק תליין   │
│                                 │
│  רצף: 3        שיא: 12         │
│  [משחק חדש]                     │
├─────────────────────────────────┤
│                                 │
│    ┌───────┐                    │
│    │ 👤    │  [Hangman figure]  │
│    │ ┃○    │                    │
│    │ ┃│╱│  │                    │
│    │ ┃ │   │                    │
│    │━┻━    │                    │
│    └───────┘                    │
│                                 │
│  חֲזִיר (transcription: פִּיג)    │
│                                 │
│  P I G                          │
│  █ █ █                          │
│                                 │
│  A B C D E F G H I J K L M     │
│  N O P Q R S T U V W X Y Z     │
│                                 │
│  שגויים: T, R, S (3/6)          │
│                                 │
│  [רמז (הגייה)] [ניחוש מלא]      │
└─────────────────────────────────┘
```

#### Win Screen
```
┌─────────────────────────────────┐
│        ✓ כל הכבוד!              │
│                                 │
│    P I G                        │
│    █ █ █                        │
│                                 │
│  נכון! חֲזִיר = PIG             │
│                                 │
│  רצף נוכחי: 4                  │
│                                 │
│  [הבא →]                        │
└─────────────────────────────────┘
```

#### Lose Screen
```
┌─────────────────────────────────┐
│        ✗ אופס...               │
│                                 │
│    ┌───────┐                    │
│    │ 👤    │                    │
│    │ ┃○    │                    │
│    │ ┃│╱│╲ │                    │
│    │ ┃ │   │                    │
│    │━┻━    │                    │
│    └───────┘                    │
│                                 │
│  התשובה הנכונה: PIG            │
│  חֲזִיר = PIG                   │
│                                 │
│  [הבא →]                        │
└─────────────────────────────────┘
```

### UI Elements

1. **Game Header**
   - Back button (top left)
   - Game title "משחק תליין" (Hangman Game)
   - Stats: Current streak, Best record
   - New Game button

2. **Hangman Figure Display**
   - 7 stages: 0 (empty), 1 (head), 2 (body), 3 (+left arm), 4 (+right arm), 5 (+left leg), 6 (+right leg, game over)
   - Visual representation using Unicode/ASCII art or SVG paths
   - Centered display area

3. **Word Display**
   - Hebrew translation with transcription hint (always visible)
   - English word as underscores with spaces between letters
   - Correctly guessed letters revealed in uppercase
   - LTR direction for English letters

4. **Letter Keyboard**
   - A-Z buttons in alphabetical order
   - 2 rows: A-M, N-Z for mobile
   - Buttons change state:
     - Available: white/light background
     - Correct: green background
     - Incorrect: red background
     - Disabled: grayed out
   - Minimum 48px tap targets

5. **Wrong Guesses Counter**
   - Shows incorrect letters guessed
   - Shows progress: "שגויים: T, R, S (3/6)"

6. **Action Buttons**
   - **Hint Button**: Plays English pronunciation
   - **Full Guess Button**: Modal to type full word (optional feature)
   - **Next Button**: Appears after win/lose to load next word

7. **Feedback Messages**
   - Win: "כל הכבוד!" (Great job!) with celebration
   - Lose: "אופס..." (Oops...) with encouragement
   - Show correct answer on lose

### Interactions

1. **Letter Tap**
   - Tap any available letter button
   - Instant visual feedback (button color change)
   - If correct: letter(s) appear in word, button turns green
   - If incorrect: wrong guess count increases, hangman progresses, button turns red
   - Button becomes disabled (grayed out)

2. **Hint**
   - Tap "רמז (הגייה)" button
   - Plays English word pronunciation via Web Speech API
   - Always available (no penalties)

3. **New Game**
   - Resets streak to 0
   - Loads new random word
   - Resets hangman figure

4. **Next Word**
   - Maintains streak if won, resets if lost
   - Loads next word from pool
   - Resets letter keyboard and hangman

### Accessibility
- Minimum 48px tap targets for all interactive elements
- High contrast colors for letter states
- Clear visual feedback for all actions
- Text-to-speech support via hint button

## Technical Design

### Components

#### 1. HangmanGame Component
**File**: `/src/components/HangmanGame/HangmanGame.tsx`

**Responsibilities**:
- Main game logic and state management
- Word selection and progression
- Letter guessing validation
- Win/lose detection
- Streak and record tracking
- Integration with dictionary and speech APIs

**State**:
```typescript
interface HangmanGameState {
  words: Word[];                    // Pool of words
  currentIndex: number;             // Current word index
  currentWord: Word;                // Current word being guessed
  guessedLetters: Set<string>;      // All guessed letters (correct + incorrect)
  correctLetters: Set<string>;      // Only correct guesses
  wrongGuesses: string[];           // Incorrect letters in order
  wrongGuessCount: number;          // Number of wrong guesses (0-6)
  gameStatus: 'playing' | 'won' | 'lost';
  streak: number;                   // Current correct streak
  record: number;                   // Best streak from localStorage
  isNewRecord: boolean;             // Flag for celebration
}
```

**Key Methods**:
- `initializeGame()`: Load word pool, reset state
- `setupWord(word)`: Set up new word for guessing
- `handleLetterGuess(letter)`: Process letter guess
- `checkWin()`: Check if all letters revealed
- `checkLose()`: Check if 6 wrong guesses
- `handleNextWord()`: Load next word, update streak
- `handleHint()`: Play pronunciation
- `handleNewGame()`: Reset everything

**Props**:
```typescript
interface HangmanGameProps {
  onBack?: () => void;
}
```

#### 2. HangmanFigure Component
**File**: `/src/components/HangmanGame/HangmanFigure.tsx`

**Responsibilities**:
- Render hangman visual based on wrong guess count
- Animate stage transitions (optional)

**Props**:
```typescript
interface HangmanFigureProps {
  wrongGuessCount: number; // 0-6
}
```

**Implementation**:
- Use CSS-based rendering with Unicode characters or
- SVG paths for cleaner visuals
- 7 stages mapped to wrongGuessCount

#### 3. LetterKeyboard Component
**File**: `/src/components/HangmanGame/LetterKeyboard.tsx`

**Responsibilities**:
- Render A-Z letter buttons
- Show letter states (available, correct, incorrect)
- Handle tap events

**Props**:
```typescript
interface LetterKeyboardProps {
  guessedLetters: Set<string>;
  correctLetters: Set<string>;
  onLetterSelect: (letter: string) => void;
  disabled: boolean;
}
```

**Implementation**:
- 26 buttons for A-Z
- Layout: 2 rows (A-M, N-Z) for mobile, can expand to 3 rows on larger screens
- Minimum 48px tap targets
- State-based styling

#### 4. WordDisplay Component
**File**: `/src/components/HangmanGame/WordDisplay.tsx`

**Responsibilities**:
- Show Hebrew word and transcription
- Show English word with blanks/revealed letters
- LTR direction for English

**Props**:
```typescript
interface WordDisplayProps {
  word: Word;
  guessedLetters: Set<string>;
}
```

**Implementation**:
- Top: Hebrew + transcription (always visible)
- Bottom: English letters as underscores or uppercase letters
- Map through word.english, show letter if in guessedLetters

### Data Models

#### Game State (extends Word interface)
```typescript
import { Word } from '../../data/dictionary';

interface GameState {
  guessedLetters: Set<string>;
  correctLetters: Set<string>;
  wrongGuesses: string[];
  wrongGuessCount: number;
  status: 'playing' | 'won' | 'lost';
}
```

#### No new Word interface changes needed
The existing `Word` interface from `dictionary.ts` is sufficient:
```typescript
interface Word {
  id: string;
  english: string;
  hebrew: string;
  transcription: string;
  category: Category;
}
```

### File Changes

#### New Files
1. `/src/components/HangmanGame/HangmanGame.tsx` - Main game component
2. `/src/components/HangmanGame/HangmanFigure.tsx` - Hangman visual component (optional, can inline)
3. `/src/components/HangmanGame/LetterKeyboard.tsx` - Letter selection keyboard (optional, can inline)
4. `/src/components/HangmanGame/WordDisplay.tsx` - Word display component (optional, can inline)
5. `/src/components/HangmanGame/index.ts` - Export barrel file

**Recommendation**: Start with single-file implementation in `HangmanGame.tsx`, then refactor to sub-components if needed (similar to SpellingGame pattern).

#### Modified Files
1. `/src/App.tsx`
   - Import `HangmanGame` component
   - Add game routing for `currentGame === 'hangman'`

2. `/src/components/GameMenu/GameMenu.tsx`
   - Update `GameType`: Add `'hangman'` to union type
   - Update `GAMES` array: Change Quiz entry to Hangman or add new entry
   - Set `available: true` for Hangman

3. `/src/styles/main.css`
   - Add `.hangman-game` styles
   - Add `.hangman-figure` styles
   - Add `.letter-keyboard` and `.letter-button` styles
   - Add `.word-blanks` styles
   - Add win/lose animation styles

4. `/src/constants/version.ts`
   - Increment version after implementation

### Storage

#### localStorage Keys
```typescript
const STORAGE_KEY = 'learn-eng-hangman-streak-record';
```

**Stored Data**:
- `learn-eng-hangman-streak-record`: Best streak (number)

**Functions**:
```typescript
const getRecord = (): number => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? parseInt(stored, 10) : 0;
};

const saveRecord = (streak: number): boolean => {
  const currentRecord = getRecord();
  if (streak > currentRecord) {
    localStorage.setItem(STORAGE_KEY, streak.toString());
    return true; // New record!
  }
  return false;
};
```

### Dependencies

**No new dependencies required!**

All necessary libraries are already in the project:
- React (UI)
- TypeScript (types)
- Web Speech API (pronunciation via existing `speak()` utility)
- Dictionary data (existing `dictionary.ts`)

### Integration Points

1. **Dictionary** (`src/data/dictionary.ts`)
   - Use `getRandomWords(count)` to get word pool
   - Access `word.english`, `word.hebrew`, `word.transcription`

2. **Speech API** (`src/utils/speech.ts`)
   - Use `speak(word.english, 'en')` for hints

3. **App Routing** (`src/App.tsx`)
   - Add `hangman` to `GameType`
   - Add conditional render for HangmanGame

4. **Game Menu** (`src/components/GameMenu/GameMenu.tsx`)
   - Add Hangman to games list with icon (suggested: 🎮 or 🎯 or 👤)

### CSS Styling

Follow existing patterns from `main.css`:

```css
/* Hangman Game Container */
.hangman-game {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Hangman Figure */
.hangman-figure {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 1.2rem;
  font-family: 'Courier New', monospace;
  color: white;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Word Display */
.word-display {
  text-align: center;
  margin-bottom: 20px;
}

.hebrew-hint {
  font-size: 1.5rem;
  color: white;
  margin-bottom: 10px;
}

.transcription-hint {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 15px;
}

.word-blanks {
  display: flex;
  justify-content: center;
  gap: 8px;
  direction: ltr;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  letter-spacing: 4px;
}

/* Letter Keyboard */
.letter-keyboard {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  margin-bottom: 15px;
}

.letter-button {
  background: rgba(255, 255, 255, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  padding: 10px;
  min-width: 48px;
  min-height: 48px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.letter-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.5);
  transform: scale(1.05);
}

.letter-button.correct {
  background: rgba(76, 175, 80, 0.6);
  border-color: rgba(76, 175, 80, 0.8);
}

.letter-button.incorrect {
  background: rgba(244, 67, 54, 0.6);
  border-color: rgba(244, 67, 54, 0.8);
}

.letter-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Wrong Guesses Display */
.wrong-guesses {
  text-align: center;
  color: white;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.wrong-guesses .count {
  color: #ff6b6b;
  font-weight: bold;
}

/* Responsive */
@media (min-width: 480px) {
  .letter-keyboard {
    grid-template-columns: repeat(13, 1fr);
  }
}
```

## Implementation Plan

### Task Breakdown

#### Task 1: Create HangmanGame Component Structure (Small)
- Create `/src/components/HangmanGame/HangmanGame.tsx`
- Create basic component with props interface
- Import dependencies (React, Word, dictionary, speech)
- Set up initial state structure
- Add export in `/src/components/HangmanGame/index.ts`
- **Estimated Time**: 30 minutes

#### Task 2: Implement Core Game Logic (Medium)
- Implement `initializeGame()` - load words, reset state
- Implement `setupWord()` - prepare new word
- Implement `handleLetterGuess()` - validate and update state
- Implement `checkWin()` and `checkLose()` logic
- Implement `handleNextWord()` - progression logic
- Add streak tracking and localStorage integration
- **Estimated Time**: 1-2 hours

#### Task 3: Build UI Components (Medium)
- Create header with back button, title, stats
- Create hangman figure display (7 stages)
- Create word display with Hebrew/transcription/blanks
- Create letter keyboard (A-Z buttons)
- Create wrong guesses counter
- Create action buttons (hint, next)
- Create win/lose feedback messages
- **Estimated Time**: 1-2 hours

#### Task 4: Add CSS Styling (Small)
- Add `.hangman-game` container styles
- Add `.hangman-figure` styles with stage variants
- Add `.word-display` and `.word-blanks` styles
- Add `.letter-keyboard` and `.letter-button` styles
- Add state-based styles (correct, incorrect, disabled)
- Add responsive breakpoints
- Add win/lose animation effects
- **Estimated Time**: 1 hour

#### Task 5: Integrate with App (Small)
- Update `GameType` in `GameMenu.tsx`
- Add Hangman entry to `GAMES` array with icon and description
- Update `App.tsx` to import and route to HangmanGame
- **Estimated Time**: 15 minutes

#### Task 6: Testing & Polish (Small)
- Test full game flow (guess letters, win, lose, next word)
- Test edge cases (single letter words, repeated letters)
- Test streak tracking and record saving
- Test on mobile viewport
- Test with different word lengths
- Verify speech/hint functionality
- Polish animations and transitions
- **Estimated Time**: 30-45 minutes

#### Task 7: Update Documentation (Small)
- Update `/docs/state.md` with Hangman game details
- Update `/docs/backlog.md` to mark Hangman as completed
- Increment app version in `/src/constants/version.ts`
- **Estimated Time**: 15 minutes

### Total Estimated Time: 4-6 hours

### Task Order
1. Task 1 (Component Structure) - Foundation
2. Task 2 (Core Logic) - Game mechanics
3. Task 3 (UI Components) - Visual elements
4. Task 4 (CSS Styling) - Visual polish
5. Task 5 (Integration) - Connect to app
6. Task 6 (Testing) - Quality assurance
7. Task 7 (Documentation) - Project updates

### Complexity Assessment
- **Overall Complexity**: Medium
- **Similar to**: SpellingGame (letter-based, streak tracking)
- **Simpler than**: FlashcardsGame (no spaced repetition)
- **More complex than**: MemoryGame (more game states)

## Design Decisions

### 1. Hangman Figure Rendering
**Decision**: Use Unicode/ASCII art initially, consider SVG in future
**Rationale**:
- Faster to implement
- No new dependencies
- Sufficient for MVP
- Can upgrade to SVG later for smoother animations

**Alternative Considered**: SVG paths with animated transitions
**Why Not**: Adds complexity, not critical for MVP

### 2. Letter Keyboard Layout
**Decision**: A-Z in alphabetical order, 7 columns on mobile
**Rationale**:
- Familiar to learners
- Easy to find letters
- Fits mobile viewport well
- Expands to 13 columns on larger screens

**Alternative Considered**: QWERTY layout
**Why Not**: Target audience (children) may not know QWERTY

### 3. Hint Availability
**Decision**: Hint button always available, no penalties
**Rationale**:
- Aligns with SpellingGame pattern
- Educational app should support learning, not punish
- Encourages pronunciation practice
- Reduces frustration

**Alternative Considered**: Limited hints or penalties
**Why Not**: Goes against educational-first philosophy

### 4. Streak Tracking
**Decision**: Track consecutive wins, reset on loss
**Rationale**:
- Motivates continued play
- Consistent with SpellingGame pattern
- Simple to understand
- Encourages improvement

**Alternative Considered**: Track win rate percentage
**Why Not**: Less motivating, harder to understand for children

### 5. Wrong Guess Limit
**Decision**: 6 wrong guesses (classic hangman)
**Rationale**:
- Standard hangman rules
- Balanced difficulty
- 7 visual stages (0 errors → 6 errors)
- Recognizable game pattern

### 6. Component Structure
**Decision**: Start with single-file component, refactor if needed
**Rationale**:
- Faster initial development
- Follows SpellingGame pattern
- Can extract sub-components later
- Simpler to reason about initially

**Alternative Considered**: Multiple sub-components from start
**Why Not**: Premature abstraction, can add later if needed

### 7. Full Word Guess Feature
**Decision**: Defer to future iteration (not in MVP)
**Rationale**:
- Not essential for core gameplay
- Adds UI complexity (modal/input)
- Validation complexity
- Can add later if requested

### 8. Word Selection
**Decision**: Random words from full dictionary, 20-word pool
**Rationale**:
- Consistent with other games
- Good variety
- Simple implementation
- Reshuffles when pool exhausted

**Alternative Considered**: Category filtering
**Why Not**: Can add in settings later, keep MVP simple

## Open Questions

### 1. Hangman Figure Visual Style
**Question**: Should we use Unicode art, ASCII art, or invest in SVG from the start?
**Options**:
- Unicode characters (quick, simple)
- ASCII art (retro, familiar)
- SVG paths (professional, animatable)

**Recommendation**: Start with Unicode, gather user feedback, consider SVG in future update if users want more visual polish.

### 2. Game Icon
**Question**: What icon should represent Hangman in the game menu?
**Options**:
- 🎮 (generic game)
- 🎯 (target/goal)
- 👤 (person silhouette)
- 🧩 (puzzle piece)
- ✏️ (pencil, but may conflict with spelling)

**Recommendation**: 👤 (person silhouette) - directly represents the hangman figure.

### 3. Letter Reveal Animation
**Question**: Should letters appear instantly or with animation when guessed correctly?
**Recommendation**: Start without animation (instant), can add subtle fade-in later if desired.

### 4. Difficulty Levels
**Question**: Should we add difficulty levels (easy/medium/hard)?
**Options**:
- Easy: More wrong guesses allowed (8), shorter words
- Medium: Standard 6 wrong guesses
- Hard: Fewer guesses (4), longer words

**Recommendation**: Defer to future iteration. Start with standard difficulty, gather feedback on whether users want more control.

### 5. Category Selection
**Question**: Should players be able to filter words by category?
**Recommendation**: Defer to future iteration. Consistent with other games that don't have category filtering yet. Can add to settings later as part of broader category feature across all games.

### 6. Multiplayer/Competitive Features
**Question**: Should we add any competitive features (leaderboards, time limits)?
**Recommendation**: No for MVP. Keep focused on educational single-player experience. Can explore in future based on user demand.

## Future Enhancements

### Phase 2 (Post-MVP)
1. **SVG Hangman Figure** - Smoother animations, professional look
2. **Full Word Guess** - Allow typing full word at any time
3. **Difficulty Levels** - Easy/Medium/Hard with different guess limits
4. **Category Filtering** - Play with specific word categories
5. **Hint Levels** - Show first letter, or vowels
6. **Sound Effects** - Correct/incorrect letter sounds
7. **Timer Mode** - Optional time pressure for advanced players
8. **Custom Word Lists** - User-submitted words

### Phase 3 (Advanced)
1. **Multiplayer** - Take turns guessing
2. **Leaderboards** - Compete with other players
3. **Achievement System** - Unlock badges for milestones
4. **Word Definitions** - Show word meaning after completion
5. **Animation Polish** - Letter reveal animations, celebration effects

## Success Metrics

### Qualitative
- User feedback on game enjoyment
- Observed learning outcomes
- Engagement duration per session

### Quantitative
- Average streak length
- Win rate percentage
- Number of hints used per game
- Session length (time spent playing)
- Return rate (how often users replay)

## Notes

- This game complements the existing suite well:
  - **Memory**: Recognition and matching
  - **Spelling**: Active construction from letters
  - **Flashcards**: Multiple choice recognition
  - **Hangman**: Deductive letter-by-letter discovery

- The hangman mechanic adds gamification (stakes/pressure) while maintaining educational value

- The Hebrew hint + English spelling reinforces both vocabulary and letter knowledge

- Consider A/B testing the initial difficulty (6 vs 8 wrong guesses) to optimize learning vs frustration balance
