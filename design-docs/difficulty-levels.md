# Feature Design: Game Difficulty Levels

**Version**: 1.0
**Date Created**: 2025-12-05
**Status**: Design Complete

---

## 1. Feature Overview

### Feature Name
**Game Difficulty Levels** - Allow users to select easy, medium, or hard difficulty before starting any game.

### One-Line Description
A difficulty system that adjusts game parameters (grid size, time limits, hints, word complexity, and challenge modifiers) across all four games, enabling learners to start at their comfort level and progress as they improve.

### Problem Statement
Currently, all four games (Memory, Spelling, Flashcards, Hangman) operate at a single, fixed difficulty level. This creates several problems:

1. **Beginners feel overwhelmed**: New learners may find games too challenging, leading to frustration and abandonment
2. **Advanced learners get bored**: Users who have mastered basic words find no additional challenge
3. **No progression path**: Users cannot see or feel their skill improvement through the app
4. **One-size-fits-all approach**: Different learners have different needs based on age, prior knowledge, and learning goals
5. **Limited engagement**: Without difficulty progression, the app lacks the "mastery loop" that drives continued engagement

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Feature Adoption | >70% of users try at least 2 difficulty levels within first week | Track difficulty selections per user |
| Difficulty Distribution | Healthy spread: 30% easy, 45% medium, 25% hard | Track difficulty usage per game |
| Progression Rate | 50% of users who start on easy move to medium within 2 weeks | Track difficulty changes over time |
| Retention Impact | 15% increase in 7-day retention | Compare cohorts before/after feature |
| Session Length | 10% increase in average session length on medium/hard | Track time per difficulty level |
| Completion Rates | Easy: >85%, Medium: >70%, Hard: >55% | Track win rates per difficulty |

---

## 2. User Stories

### Primary User Stories

**US-1: Select Difficulty Before Playing**
> As a learner, I want to choose a difficulty level before starting a game so that I can play at a level appropriate for my skills.

**Acceptance Criteria:**
- Difficulty selector appears before each game starts
- Three clear options: Easy, Medium, Hard
- Visual differentiation between difficulty levels
- Selection is remembered per game (persisted)
- Can change difficulty without starting a new game

---

**US-2: Experience Scaled Challenges**
> As a learner, I want the game to be noticeably different based on my difficulty selection so that I feel appropriately challenged.

**Acceptance Criteria:**
- Each difficulty level has distinct, perceptible differences
- Easy mode provides more support (hints, time, fewer distractions)
- Hard mode provides genuine challenge (no hints, time pressure, more complexity)
- Medium mode is balanced between the two
- Differences are documented/visible to the user

---

**US-3: Progress Through Difficulties**
> As a learner, I want to see recommendations for when I should move to a harder difficulty so that I can track my improvement.

**Acceptance Criteria:**
- System tracks performance per difficulty level
- Recommendation appears when performance exceeds threshold
- Recommendation is encouraging, not pushy
- User can dismiss or accept recommendation
- No penalty for staying at current difficulty

---

**US-4: Understand What Changes**
> As a learner, I want to understand what will be different at each difficulty level so that I can make an informed choice.

**Acceptance Criteria:**
- Hover/tap on difficulty shows what changes
- Changes are described in learner-friendly terms
- Each game explains its specific difficulty adjustments
- No technical jargon in descriptions

---

**US-5: Maintain Separate Records**
> As a learner, I want my records and progress tracked separately for each difficulty level so that my achievements are meaningful.

**Acceptance Criteria:**
- Records (streaks, best scores) are tracked per difficulty
- Can view records for all difficulty levels
- Clear indication of which difficulty a record was achieved on
- Switching difficulty does not reset other difficulty records

---

### Secondary User Stories

**US-6: Quick Difficulty Change**
> As a learner, I want to quickly switch difficulty mid-session if I find it too easy or too hard.

**Acceptance Criteria:**
- Difficulty can be changed from game header/settings
- Changing difficulty starts a new game
- Confirmation if mid-game (to prevent accidental loss)

---

**US-7: Default Difficulty Memory**
> As a learner, I want the app to remember my preferred difficulty for each game so that I do not have to select it every time.

**Acceptance Criteria:**
- Last used difficulty is pre-selected on game start
- Each game remembers its own difficulty independently
- First-time users default to "Easy"

---

### Edge Cases

- **First-time user**: Default to Easy with brief explanation of difficulty system
- **Returning user after update**: Migrate existing records to "Medium" difficulty (grandfather clause)
- **User completes all words at a difficulty**: Encourage moving up, reshuffle same words if staying
- **User consistently fails**: Suggest moving down with supportive messaging (not shaming)
- **User jumps from Easy to Hard**: Allow it, show warning about challenge increase

---

## 3. User Experience Flow

### Entry Points

1. **Game Start Screen**
   - Primary: Difficulty selector shown when entering any game
   - Default selection based on last played or "Easy" for new users

2. **In-Game Settings**
   - Secondary: Gear icon in game header opens settings with difficulty option
   - Requires confirmation to change (starts new game)

3. **Post-Game Recommendation**
   - Tertiary: After completing multiple successful games, recommend difficulty change
   - Non-blocking suggestion that can be dismissed

### Main User Journey

```
[Game Menu]
     |
     v
[Select Game] --> [Difficulty Selector Screen]
                          |
          +---------------+---------------+
          |               |               |
          v               v               v
       [Easy]         [Medium]         [Hard]
          |               |               |
          +---------------+---------------+
                          |
                          v
                   [Game Begins]
                          |
                          v
                   [Play Session]
                          |
          +---------------+---------------+
          |               |               |
          v               v               v
       [Win/Complete]  [Continue]     [Lose/Fail]
          |               |               |
          v               v               v
     [Check Threshold]  [Next Round]  [Retry/Menu]
          |
          v
    [Show Recommendation?]
          |
          +-- Yes --> [Suggest Difficulty Change]
          |
          +-- No  --> [Continue at Current Level]
```

### Difficulty Selector Screen

```
+------------------------------------------+
|  [<-]  Memory Game                       |
+------------------------------------------+
|                                          |
|           Choose Difficulty              |
|                                          |
|  +----------+  +----------+  +----------+|
|  |   Easy   |  |  Medium  |  |   Hard   ||
|  |          |  |          |  |          ||
|  |    *     |  |    **    |  |   ***    ||
|  |          |  |          |  |          ||
|  | Relaxed  |  | Balanced |  | Expert   ||
|  |  pace    |  | challenge|  |challenge ||
|  +----------+  +----------+  +----------+|
|                                          |
|  [See what changes at each level]        |
|                                          |
|         [ Start Playing ]                |
|                                          |
+------------------------------------------+
```

### Difficulty Details Expansion

```
+------------------------------------------+
|  Memory Game - Difficulty Levels         |
+------------------------------------------+
|                                          |
|  EASY                                    |
|  - 4 word pairs (8 cards)                |
|  - Cards stay flipped longer             |
|  - Same category words                   |
|                                          |
|  MEDIUM                                  |
|  - 6 word pairs (12 cards)               |
|  - Standard flip timing                  |
|  - Mixed categories                      |
|                                          |
|  HARD                                    |
|  - 8-10 word pairs (16-20 cards)         |
|  - Quick flip timing                     |
|  - Mixed categories + longer words       |
|                                          |
|              [ Got it ]                  |
|                                          |
+------------------------------------------+
```

### Exit Points

1. **Back to Menu**: Return to game selection
2. **Start Game**: Begin playing at selected difficulty
3. **Change Game**: Select different game (preserves difficulty preference)

### Error States and Recovery

| Error | User Message | Recovery Action |
|-------|--------------|-----------------|
| Invalid difficulty stored | Silent fallback | Default to "Medium" |
| Recommendation threshold not met | No message | Continue tracking |
| Migration from old version | "Your existing records are now Medium difficulty" | One-time toast notification |

---

## 4. UI/UX Specifications

### 4.1 Difficulty Selector Component

**Location**: Full-screen overlay when entering a game (before game board appears)

**Layout**:
```
+------------------------------------------+
|                                          |
|  [Back]        Game Title                |
|                                          |
|          Choose Your Challenge           |
|                                          |
|  +----------+  +----------+  +----------+|
|  |   EASY   |  |  MEDIUM  |  |   HARD   ||
|  |    *     |  |    **    |  |   ***    ||
|  | Beginner |  | Regular  |  |  Expert  ||
|  +----------+  +----------+  +----------+|
|       ^                                  |
|   (selected)                             |
|                                          |
|  What changes:                           |
|  - 4 word pairs                          |
|  - Hints always available                |
|  - Longer review time                    |
|                                          |
|         [  Start Game  ]                 |
|                                          |
+------------------------------------------+
```

**Elements:**
- Three difficulty cards arranged horizontally (stack vertically on narrow mobile)
- Star indicators (1, 2, 3 stars) for quick visual reference
- Hebrew labels: (Easy), (Medium), (Hard)
- Description text updates when selection changes
- Large "Start Game" button
- Subtle animation on selection change

**Colors:**
```css
:root {
  /* Difficulty levels */
  --difficulty-easy: #4CAF50;      /* Green - encouraging */
  --difficulty-medium: #FF9800;    /* Orange - moderate */
  --difficulty-hard: #F44336;      /* Red - challenging */

  /* Backgrounds */
  --difficulty-easy-bg: rgba(76, 175, 80, 0.1);
  --difficulty-medium-bg: rgba(255, 152, 0, 0.1);
  --difficulty-hard-bg: rgba(244, 67, 54, 0.1);
}
```

**Interactions:**
- Tap/click to select difficulty
- Selected card has prominent border and background
- Tap "What changes" to expand/collapse details
- Tap "Start Game" to begin

---

### 4.2 In-Game Difficulty Indicator

**Location**: Game header, near the stats area

```
+------------------------------------------+
|  [<-]  Spelling Game    Streak: 5  [Med] |
+------------------------------------------+
```

**Elements:**
- Small badge showing current difficulty: [E], [M], [H]
- Color-coded to match difficulty
- Tappable to open difficulty change modal

**Difficulty Change Modal:**
```
+------------------------------------------+
|  Change Difficulty?                      |
+------------------------------------------+
|                                          |
|  Current: Medium                         |
|                                          |
|  [Easy]  [Medium]  [Hard]               |
|                                          |
|  Note: This will start a new game.       |
|                                          |
|  [Cancel]             [Change & Restart] |
|                                          |
+------------------------------------------+
```

---

### 4.3 Progression Recommendation Banner

**Location**: Bottom of game completion screen or after returning to menu

```
+------------------------------------------+
|  Ready for a Challenge?                  |
|                                          |
|  You've won 5 games in a row on Easy!    |
|  Try Medium for more challenge.          |
|                                          |
|  [Maybe Later]      [Let's Go!]          |
+------------------------------------------+
```

**Trigger Conditions:**
- Easy -> Medium: 5 consecutive wins OR 80%+ win rate over 10 games
- Medium -> Hard: 5 consecutive wins OR 80%+ win rate over 15 games
- Hard -> (none): Achievement celebration instead

**Design:**
- Non-intrusive banner, not blocking gameplay
- Can be dismissed permanently ("Don't show again")
- Encouraging tone, not pressuring

---

### 4.4 Records Display Update

**Current Records View:**
```
Record: 12 moves (5 pairs)
```

**New Records View:**
```
Records by Difficulty:
+----------+----------+----------+
|   Easy   |  Medium  |   Hard   |
|  8 moves | 12 moves | 18 moves |
|  (4 pr)  | (6 pr)   | (8 pr)   |
+----------+----------+----------+
```

Or inline:
```
Record: 12 moves [M]    Best: 8 [E] | 12 [M] | 18 [H]
```

---

### 4.5 Responsive Design

**Mobile (< 480px)**
- Difficulty cards stack vertically
- Full-width buttons
- Swipeable card selection
- Compact in-game indicator

**Tablet (480px - 1024px)**
- Horizontal difficulty cards
- Side-by-side records display

**Desktop (> 1024px)**
- Larger difficulty cards with more description
- Hover states for additional information

---

### 4.6 Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| WCAG 2.1 AA | 4.5:1 contrast on all difficulty indicators |
| Screen readers | ARIA labels: "Easy difficulty - best for beginners" |
| Keyboard navigation | Tab through difficulty options, Enter to select |
| Focus indicators | Visible focus ring on selected difficulty |
| Color independence | Stars and labels supplement color coding |
| RTL support | Full RTL layout for Hebrew text |
| Touch targets | 48x48px minimum on all difficulty buttons |

---

## 5. Difficulty Parameters Per Game

### 5.1 Memory Game

| Parameter | Easy | Medium | Hard |
|-----------|------|--------|------|
| Word pairs | 4 | 6 | 8-10 |
| Card flip time | 1.5s | 1.0s | 0.7s |
| Match reveal delay | 0.8s | 0.5s | 0.3s |
| Word selection | Same category | Mixed categories | Mixed + longer words |
| Hint system | Show category on hover | None | None |

**Implementation Notes:**
- Easy uses `getRandomWords(4, singleCategory)` to ensure related words
- Hard filters dictionary for words with `english.length >= 5`
- Flip timing controlled by CSS transition duration variable

---

### 5.2 Spelling Game

| Parameter | Easy | Medium | Hard |
|-----------|------|--------|------|
| Word length | 3-4 letters | 4-6 letters | 6+ letters |
| Extra decoy letters | 25% extra (1-2) | 50% extra (2-3) | 75% extra (4-5) |
| Hint availability | Always visible | On request (free) | On request (costs 1 point) |
| Auto-pronunciation | On word display | On request | On request |
| Letter arrangement | Alphabetical order | Shuffled | Shuffled + similar letters |

**Implementation Notes:**
- Filter dictionary by `english.length` for word selection
- Hard mode adds visually similar letters (b/d, p/q, m/n) as decoys
- Point penalty for hints tracked separately for scoring

---

### 5.3 Flashcards Game

| Parameter | Easy | Medium | Hard |
|-----------|------|--------|------|
| Answer choices | 2 | 4 | 6 |
| Time limit per card | None | None | 10 seconds |
| Distractor similarity | Random words | Same category | Similar spelling/sound |
| Transcription visible | Always | On question | Hidden |
| Box progression | +2 on correct | +1 on correct | +1 on correct, -2 on wrong |

**Implementation Notes:**
- Hard mode distractors selected by phonetic similarity or spelling pattern
- Timer component with visual countdown
- Modified spaced repetition progression rates

---

### 5.4 Hangman Game

| Parameter | Easy | Medium | Hard |
|-----------|------|--------|------|
| Word length | 3-4 letters | 4-6 letters | 6+ letters |
| Wrong guesses allowed | 8 | 6 | 4 |
| Decoy letters | 4 extra | 8 extra | Full A-Z keyboard |
| Hint (first letter) | Free, unlimited | Free, 1 per game | Not available |
| Transcription | Always visible | Always visible | Hidden until 3 wrong |

**Implementation Notes:**
- Hard mode uses full alphabet keyboard instead of limited letters
- Hint button reveals first unrevealed letter
- Progressive transcription reveal adds strategic element

---

### 5.5 Difficulty Parameter Summary Table

| Game | Easy Focus | Medium Focus | Hard Focus |
|------|------------|--------------|------------|
| Memory | Fewer cards, longer viewing | Standard parameters | More cards, quick timing |
| Spelling | Short words, few decoys | Medium words, standard decoys | Long words, many similar decoys |
| Flashcards | Binary choices, no pressure | Multiple choices, spaced rep | Many choices, time pressure |
| Hangman | More guesses, limited keyboard | Standard rules | Fewer guesses, full keyboard |

---

## 6. Learning Design Considerations

### Alignment with Language Learning Methodologies

| Methodology | Easy Implementation | Medium Implementation | Hard Implementation |
|-------------|---------------------|----------------------|---------------------|
| Scaffolding | Maximum support, hints always available | Moderate support, hints available | Minimal support, independent recall |
| Comprehensible Input | Simplified, shorter words | Standard vocabulary | Advanced vocabulary |
| Active Recall | Supported recall with hints | Balanced recall | Pure recall without support |
| Spaced Repetition | Gentle progression | Standard Leitner | Aggressive demotion on errors |
| Zone of Proximal Development | Stretch within comfort | Push beyond comfort | Challenge at edge of ability |

### Gamification Elements

**Difficulty-Based Achievements:**
- "First Steps" - Complete 10 games on Easy
- "Rising Star" - Move from Easy to Medium
- "Challenge Accepted" - Play 5 games on Hard
- "Master of All" - Win games at all difficulty levels in one session
- "Difficulty Explorer" - Try each game at each difficulty

**Visual Progress Indicators:**
```
Your Journey:
[Easy] ====== [Medium] ====== [Hard]
    10 wins        5 wins      0 wins
```

### Progress Tracking Per Difficulty

**Data Structure:**
```typescript
interface DifficultyProgress {
  easy: {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    bestStreak: number;
    wordsLearned: string[];
  };
  medium: { /* same structure */ };
  hard: { /* same structure */ };
}
```

### Feedback Philosophy by Difficulty

| Level | On Success | On Failure |
|-------|------------|------------|
| Easy | Celebratory, encouraging ("Great job!") | Supportive ("Good try! The answer was...") |
| Medium | Acknowledging ("Correct!") | Instructive ("Not quite. Remember...") |
| Hard | Minimal ("Correct") | Brief ("Incorrect") |

This graduated feedback matches user expectations - beginners need more encouragement, experts expect efficient feedback.

---

## 7. Technical Considerations

### 7.1 Data Model

#### DifficultyLevel Type
```typescript
type DifficultyLevel = 'easy' | 'medium' | 'hard';
```

#### Game Settings Interface
```typescript
interface GameDifficultySettings {
  memory: DifficultyLevel;
  spelling: DifficultyLevel;
  flashcards: DifficultyLevel;
  hangman: DifficultyLevel;
}
```

#### Difficulty Records Interface
```typescript
interface DifficultyRecords {
  memory: {
    easy: Record<number, number>;    // wordCount -> bestMoves
    medium: Record<number, number>;
    hard: Record<number, number>;
  };
  spelling: {
    easy: number;   // bestStreak
    medium: number;
    hard: number;
  };
  flashcards: {
    easy: { gamesPlayed: number; accuracy: number };
    medium: { gamesPlayed: number; accuracy: number };
    hard: { gamesPlayed: number; accuracy: number };
  };
  hangman: {
    easy: number;   // bestStreak
    medium: number;
    hard: number;
  };
}
```

#### Difficulty Parameters Configuration
```typescript
interface MemoryDifficultyParams {
  wordCount: number;
  flipDuration: number;
  matchDelay: number;
  categoryFilter: boolean;
  wordLengthFilter: { min: number; max: number };
}

interface SpellingDifficultyParams {
  wordLengthRange: { min: number; max: number };
  decoyMultiplier: number;
  hintMode: 'always' | 'free' | 'penalty';
  autoPronounce: boolean;
}

interface FlashcardsDifficultyParams {
  choiceCount: number;
  timeLimit: number | null;
  distractorMode: 'random' | 'category' | 'similar';
  transcriptionMode: 'always' | 'question' | 'hidden';
  boxProgression: { correct: number; incorrect: number };
}

interface HangmanDifficultyParams {
  wordLengthRange: { min: number; max: number };
  maxWrongGuesses: number;
  keyboardMode: 'limited' | 'full';
  hintAllowed: boolean;
  hintLimit: number;
  transcriptionMode: 'always' | 'progressive' | 'hidden';
}
```

### 7.2 Storage Approach

**LocalStorage Keys:**
```typescript
const DIFFICULTY_SETTINGS_KEY = 'learn-eng-difficulty-settings';
const DIFFICULTY_RECORDS_KEY = 'learn-eng-difficulty-records';
const DIFFICULTY_STATS_KEY = 'learn-eng-difficulty-stats';
```

**Migration from Existing Data:**
```typescript
const migrateExistingRecords = (): DifficultyRecords => {
  // Read existing records
  const memoryRecords = localStorage.getItem('learn-eng-records');
  const spellingRecord = localStorage.getItem('learn-eng-spelling-streak-record');
  const hangmanRecord = localStorage.getItem('learn-eng-hangman-streak-record');

  // Assign existing records to "medium" difficulty
  const difficultyRecords: DifficultyRecords = {
    memory: {
      easy: {},
      medium: memoryRecords ? JSON.parse(memoryRecords) : {},
      hard: {}
    },
    spelling: {
      easy: 0,
      medium: spellingRecord ? parseInt(spellingRecord, 10) : 0,
      hard: 0
    },
    flashcards: {
      easy: { gamesPlayed: 0, accuracy: 0 },
      medium: { gamesPlayed: 0, accuracy: 0 },
      hard: { gamesPlayed: 0, accuracy: 0 }
    },
    hangman: {
      easy: 0,
      medium: hangmanRecord ? parseInt(hangmanRecord, 10) : 0,
      hard: 0
    }
  };

  return difficultyRecords;
};
```

### 7.3 Component Architecture

#### New Components
```
src/
├── components/
│   ├── DifficultySelector/
│   │   ├── DifficultySelector.tsx    # Main selector component
│   │   ├── DifficultyCard.tsx        # Individual difficulty option
│   │   ├── DifficultyDetails.tsx     # Expandable details view
│   │   └── index.ts
│   │
│   ├── DifficultyIndicator/
│   │   ├── DifficultyIndicator.tsx   # In-game badge component
│   │   └── index.ts
│   │
│   └── DifficultyRecommendation/
│       ├── DifficultyRecommendation.tsx  # Progress recommendation banner
│       └── index.ts
│
├── hooks/
│   ├── useDifficulty.ts              # Difficulty state and persistence
│   └── useDifficultyParams.ts        # Get params for current difficulty
│
├── config/
│   └── difficultyConfig.ts           # All difficulty parameters
│
└── types/
    └── difficulty.ts                 # TypeScript interfaces
```

#### Modified Components
```
src/components/
├── MemoryGame/
│   └── MemoryGame.tsx       # Accept difficulty prop, use params
├── SpellingGame/
│   └── SpellingGame.tsx     # Accept difficulty prop, use params
├── FlashcardsGame/
│   └── FlashcardsGame.tsx   # Accept difficulty prop, use params
└── HangmanGame/
    └── HangmanGame.tsx      # Accept difficulty prop, use params
```

### 7.4 Difficulty Configuration File

```typescript
// src/config/difficultyConfig.ts

export const DIFFICULTY_CONFIG = {
  memory: {
    easy: {
      wordCount: 4,
      flipDuration: 1500,
      matchDelay: 800,
      categoryFilter: true,
      wordLengthFilter: { min: 2, max: 5 }
    },
    medium: {
      wordCount: 6,
      flipDuration: 1000,
      matchDelay: 500,
      categoryFilter: false,
      wordLengthFilter: { min: 2, max: 8 }
    },
    hard: {
      wordCount: 8,
      flipDuration: 700,
      matchDelay: 300,
      categoryFilter: false,
      wordLengthFilter: { min: 5, max: 12 }
    }
  },

  spelling: {
    easy: {
      wordLengthRange: { min: 2, max: 4 },
      decoyMultiplier: 0.25,
      hintMode: 'always',
      autoPronounce: true
    },
    medium: {
      wordLengthRange: { min: 4, max: 6 },
      decoyMultiplier: 0.5,
      hintMode: 'free',
      autoPronounce: false
    },
    hard: {
      wordLengthRange: { min: 5, max: 12 },
      decoyMultiplier: 0.75,
      hintMode: 'penalty',
      autoPronounce: false
    }
  },

  flashcards: {
    easy: {
      choiceCount: 2,
      timeLimit: null,
      distractorMode: 'random',
      transcriptionMode: 'always',
      boxProgression: { correct: 2, incorrect: -1 }
    },
    medium: {
      choiceCount: 4,
      timeLimit: null,
      distractorMode: 'category',
      transcriptionMode: 'question',
      boxProgression: { correct: 1, incorrect: -1 }
    },
    hard: {
      choiceCount: 6,
      timeLimit: 10000,
      distractorMode: 'similar',
      transcriptionMode: 'hidden',
      boxProgression: { correct: 1, incorrect: -2 }
    }
  },

  hangman: {
    easy: {
      wordLengthRange: { min: 2, max: 4 },
      maxWrongGuesses: 8,
      keyboardMode: 'limited',
      decoyCount: 4,
      hintAllowed: true,
      hintLimit: 99,
      transcriptionMode: 'always'
    },
    medium: {
      wordLengthRange: { min: 4, max: 6 },
      maxWrongGuesses: 6,
      keyboardMode: 'limited',
      decoyCount: 8,
      hintAllowed: true,
      hintLimit: 1,
      transcriptionMode: 'always'
    },
    hard: {
      wordLengthRange: { min: 5, max: 12 },
      maxWrongGuesses: 4,
      keyboardMode: 'full',
      decoyCount: 0,
      hintAllowed: false,
      hintLimit: 0,
      transcriptionMode: 'progressive'
    }
  }
} as const;
```

### 7.5 Custom Hook: useDifficulty

```typescript
// src/hooks/useDifficulty.ts

import { useState, useEffect } from 'react';
import { DifficultyLevel, GameType } from '../types/difficulty';

const STORAGE_KEY = 'learn-eng-difficulty-settings';

const getStoredSettings = (): Record<GameType, DifficultyLevel> => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    memory: 'easy',
    spelling: 'easy',
    flashcards: 'easy',
    hangman: 'easy'
  };
};

export const useDifficulty = (game: GameType) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(() => {
    return getStoredSettings()[game];
  });

  const updateDifficulty = (newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);

    const settings = getStoredSettings();
    settings[game] = newDifficulty;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  };

  return { difficulty, setDifficulty: updateDifficulty };
};
```

### 7.6 Integration Pattern

```typescript
// Example: MemoryGame integration

import { useDifficulty } from '../../hooks/useDifficulty';
import { DIFFICULTY_CONFIG } from '../../config/difficultyConfig';

export const MemoryGame: React.FC<MemoryGameProps> = ({ onBack }) => {
  const { difficulty, setDifficulty } = useDifficulty('memory');
  const params = DIFFICULTY_CONFIG.memory[difficulty];

  const [showDifficultySelector, setShowDifficultySelector] = useState(true);

  // Use params.wordCount instead of hardcoded value
  const [wordCount, setWordCount] = useState<number>(params.wordCount);

  // ... rest of game logic using params

  if (showDifficultySelector) {
    return (
      <DifficultySelector
        game="memory"
        currentDifficulty={difficulty}
        onSelect={(d) => {
          setDifficulty(d);
          setShowDifficultySelector(false);
        }}
        onBack={onBack}
      />
    );
  }

  // ... render game
};
```

### 7.7 Performance Considerations

| Concern | Solution |
|---------|----------|
| Initial load | Difficulty config is static, import at build time |
| Storage reads | Cache settings in state, sync to localStorage on change |
| Word filtering | Pre-filter dictionary at component mount, not every render |
| Timer accuracy | Use requestAnimationFrame for hard mode timer |
| Memory usage | Difficulty params are small objects, negligible impact |

### 7.8 File Structure Summary

```
src/
├── components/
│   ├── DifficultySelector/
│   │   ├── DifficultySelector.tsx
│   │   ├── DifficultyCard.tsx
│   │   ├── DifficultyDetails.tsx
│   │   └── index.ts
│   ├── DifficultyIndicator/
│   │   ├── DifficultyIndicator.tsx
│   │   └── index.ts
│   ├── DifficultyRecommendation/
│   │   ├── DifficultyRecommendation.tsx
│   │   └── index.ts
│   ├── MemoryGame/          (modified)
│   ├── SpellingGame/        (modified)
│   ├── FlashcardsGame/      (modified)
│   └── HangmanGame/         (modified)
│
├── config/
│   └── difficultyConfig.ts
│
├── hooks/
│   ├── useDifficulty.ts
│   └── useDifficultyParams.ts
│
├── types/
│   └── difficulty.ts
│
└── styles/
    └── main.css             (add difficulty-specific styles)
```

---

## 8. MVP vs Future Iterations

### MVP Scope (Phase 1)

**Must Have:**
1. Difficulty selector screen for each game
2. Three difficulty levels: Easy, Medium, Hard
3. Basic parameter adjustments per game (see table below)
4. Difficulty persistence per game
5. Updated records system (per-difficulty tracking)
6. In-game difficulty indicator badge

**MVP Parameter Focus:**

| Game | Easy Change | Medium (default) | Hard Change |
|------|-------------|------------------|-------------|
| Memory | 4 pairs only | Current behavior | 8+ pairs, shorter flip |
| Spelling | 3-4 letter words, fewer decoys | Current behavior | 6+ letter words, more decoys |
| Flashcards | 2 choices only | Current behavior | 6 choices + timer |
| Hangman | 8 wrong guesses | Current behavior | 4 wrong guesses, full keyboard |

**Implementation Priority:**
1. Types and configuration file
2. useDifficulty hook
3. DifficultySelector component
4. Integrate with Memory Game (simplest)
5. Integrate with Spelling Game
6. Integrate with Hangman Game
7. Integrate with Flashcards Game (most complex)
8. Update records/storage system

**Estimated Effort:** 4-5 development days

---

### Phase 2 Enhancements

**Should Have:**
1. Difficulty change from in-game header
2. Progression recommendations
3. Detailed "What changes" explanations
4. Category-based word filtering for Easy mode
5. Similar-word distractors for Hard mode Flashcards
6. Progressive transcription reveal for Hard mode Hangman

**Estimated Effort:** 2-3 development days

---

### Phase 3: Advanced Features

**Nice to Have:**
1. Achievement system tied to difficulty
2. Difficulty progress visualization
3. Auto-suggest difficulty based on performance
4. Custom difficulty (adjust individual parameters)
5. "Challenge Mode" - increasing difficulty per streak
6. Per-category difficulty settings

**Estimated Effort:** 3-4 development days

---

### Long-term Vision

1. **Adaptive Difficulty**: AI-driven difficulty that adjusts in real-time based on performance
2. **Difficulty Profiles**: Save and share custom difficulty configurations
3. **Competitive Modes**: Compare scores at same difficulty level
4. **Learning Path**: Guided progression through difficulty levels
5. **Instructor Controls**: Teachers can lock students to specific difficulty

---

## 9. Open Questions

### Assumptions Made

1. **Three levels is sufficient**: Assumed Easy/Medium/Hard covers all needs without overwhelming users with choices

2. **Existing records map to Medium**: Assumed current behavior most closely matches "Medium" difficulty

3. **Difficulty is per-game**: Assumed users want different difficulties for different games (not a global setting)

4. **New users start on Easy**: Assumed beginners benefit from Easy, but advanced users will quickly change

5. **Word length correlates with difficulty**: Assumed longer English words are harder to learn (may not always be true)

### Questions for Stakeholders

1. **Default for returning users**: Should existing users see a one-time "try the new difficulty system" prompt, or silently default to Medium?

2. **Record display priority**: Should we show best overall record or best record per difficulty? Both?

3. **Progression threshold**: What win rate / streak length should trigger "try harder difficulty" recommendation?
   - Current assumption: 5 consecutive wins OR 80% win rate over 10+ games

4. **Hard mode timer (Flashcards)**: Is 10 seconds appropriate? Should there be visual countdown?

5. **Hint penalty (Spelling Hard)**: Should hints cost points/streak, or should they be completely disabled?

### Areas Requiring User Research

1. **Difficulty perception**: Do users find the Easy/Medium/Hard differences meaningful and appropriate?

2. **Selection friction**: Does requiring difficulty selection before each game feel tedious?

3. **Progression motivation**: Do difficulty recommendations encourage or pressure users?

4. **Label preferences**: Are "Easy/Medium/Hard" the best labels? Alternatives: "Beginner/Regular/Expert" or stars?

5. **Child appropriateness**: Is "Hard" label discouraging for young learners? Consider "Challenge" instead?

### Technical Questions

1. **Flashcards spaced repetition**: Should difficulty affect the Leitner box system intervals, or just immediate game parameters?

2. **Category filtering**: How to handle when a category has too few words for the required count at a difficulty level?

3. **Word length distribution**: Do we have enough 6+ letter words for sustained Hard mode play?
   - Current dictionary: Need to verify distribution

4. **Timer implementation**: For Hard mode Flashcards, should timeout be "wrong answer" or "skip and no penalty"?

---

## Appendix A: Word Length Distribution

Based on current dictionary (110 words):

| Length | Count | Examples |
|--------|-------|----------|
| 2 letters | 2 | go, to |
| 3 letters | 28 | cat, dog, sun, red |
| 4 letters | 35 | fish, bird, milk, head |
| 5 letters | 22 | apple, horse, water, green |
| 6 letters | 14 | orange, rabbit, yellow, window |
| 7+ letters | 9 | chicken, elephant, bathroom, seventeen |

**Analysis:**
- Easy mode (2-4 letters): 65 words available
- Medium mode (4-6 letters): 71 words available
- Hard mode (6+ letters): 23 words available - may need to expand dictionary for sustained hard mode play

---

## Appendix B: Hebrew UI Labels

| English | Hebrew |
|---------|--------|
| Difficulty | רמת קושי |
| Easy | קל |
| Medium | בינוני |
| Hard | קשה |
| Beginner | מתחיל |
| Expert | מומחה |
| Challenge | אתגר |
| Choose your difficulty | בחר רמת קושי |
| What changes | מה משתנה |
| Start Game | התחל משחק |
| Change difficulty | שנה קושי |
| This will start a new game | פעולה זו תתחיל משחק חדש |
| Ready for a challenge? | מוכן לאתגר? |
| Try Medium for more challenge | נסה בינוני לאתגר נוסף |
| Maybe Later | אולי אחר כך |
| Let's Go! | קדימה! |

---

## Appendix C: CSS Variables for Difficulty

```css
/* Add to main.css */

:root {
  /* Difficulty Colors */
  --difficulty-easy: #4CAF50;
  --difficulty-easy-light: rgba(76, 175, 80, 0.15);
  --difficulty-easy-dark: #388E3C;

  --difficulty-medium: #FF9800;
  --difficulty-medium-light: rgba(255, 152, 0, 0.15);
  --difficulty-medium-dark: #F57C00;

  --difficulty-hard: #F44336;
  --difficulty-hard-light: rgba(244, 67, 54, 0.15);
  --difficulty-hard-dark: #D32F2F;

  /* Difficulty Timing */
  --flip-duration-easy: 1500ms;
  --flip-duration-medium: 1000ms;
  --flip-duration-hard: 700ms;
}

/* Difficulty Selector */
.difficulty-card {
  min-width: 100px;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.difficulty-card.easy {
  border: 2px solid var(--difficulty-easy);
  background: var(--difficulty-easy-light);
}

.difficulty-card.medium {
  border: 2px solid var(--difficulty-medium);
  background: var(--difficulty-medium-light);
}

.difficulty-card.hard {
  border: 2px solid var(--difficulty-hard);
  background: var(--difficulty-hard-light);
}

.difficulty-card.selected {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Difficulty Indicator Badge */
.difficulty-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
}

.difficulty-badge.easy {
  background: var(--difficulty-easy);
  color: white;
}

.difficulty-badge.medium {
  background: var(--difficulty-medium);
  color: white;
}

.difficulty-badge.hard {
  background: var(--difficulty-hard);
  color: white;
}
```

---

*End of Design Document*
