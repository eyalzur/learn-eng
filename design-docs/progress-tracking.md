# Feature Design: Progress Tracking

**Version**: 1.0
**Date Created**: 2025-12-05
**Status**: Design Complete

---

## 1. Feature Overview

### Feature Name
**Learning Progress Tracker** - Track and visualize user learning progress across sessions and games.

### One-Line Description
A comprehensive progress tracking system that records, persists, and displays learning statistics across all games, enabling users to monitor their vocabulary acquisition journey over time.

### Problem Statement
Currently, each game in the application tracks only its own immediate performance metrics (current streak, session records), but users have no way to:
- See their overall learning progress across the entire application
- Track which specific words they have learned vs. struggled with
- View historical performance trends over time
- Understand their accuracy rates and time investment
- Maintain motivation through visible progress indicators

This fragmented experience makes it difficult for learners to appreciate their improvement and identify areas needing more practice.

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Feature Adoption | >80% of active users view dashboard at least once per week | Track dashboard open events |
| Engagement Increase | 15% increase in average session duration | Compare before/after metrics |
| Return Rate | 20% increase in 7-day retention | Track unique users returning |
| Progress Visibility | Users can identify their 5 weakest words | Survey/usability testing |
| Data Persistence | 0% data loss across browser sessions | Automated testing |

---

## 2. User Stories

### Primary User Stories

**US-1: View Overall Progress**
> As a learner, I want to see my overall learning progress at a glance so that I can feel motivated by my achievements.

**Acceptance Criteria:**
- Dashboard shows total words practiced
- Dashboard shows words mastered (>80% accuracy)
- Dashboard shows current learning streak (consecutive days)
- Progress is visible from the game menu

---

**US-2: Track Game-Specific Performance**
> As a learner, I want to see how I perform in each game so that I can identify which learning methods work best for me.

**Acceptance Criteria:**
- Each game has its own statistics section
- Shows games played, win rate, best streak
- Shows average performance metrics per game
- Can compare performance across games

---

**US-3: Review Word-Level Progress**
> As a learner, I want to see which words I know well and which I struggle with so that I can focus my practice effectively.

**Acceptance Criteria:**
- View all words with individual mastery levels
- Sort/filter words by mastery status
- See accuracy rate per word
- See how many times each word was practiced

---

**US-4: Persist Progress Across Sessions**
> As a learner, I want my progress to be saved when I close the browser so that I do not lose my learning history.

**Acceptance Criteria:**
- All progress data saved to localStorage
- Progress restored correctly when returning
- No data loss after browser restart
- Clear indication when data is being saved

---

**US-5: View Learning Trends**
> As a learner, I want to see my learning trends over time so that I can track my improvement.

**Acceptance Criteria:**
- Show activity calendar (days practiced)
- Show weekly/monthly statistics
- Display learning streak history
- Visualize improvement over time

---

### Secondary User Stories

**US-6: Reset Progress**
> As a learner, I want the option to reset my progress so that I can start fresh if needed.

**Acceptance Criteria:**
- Clear warning before reset
- Option to reset specific games or all data
- Confirmation required to prevent accidents

---

**US-7: Quick Stats Access**
> As a learner, I want to see quick stats without leaving the current game so that I can stay focused.

**Acceptance Criteria:**
- Mini stats visible in game header
- Tap to expand more details
- Does not interrupt gameplay

---

### Edge Cases

- **First-time user**: Show welcoming message, explain progress tracking
- **No activity**: Display encouraging message to start learning
- **Long absence**: Highlight returning after a break, do not shame
- **Browser data cleared**: Gracefully handle missing data, offer fresh start
- **Very high activity**: Ensure performance with large datasets (1000+ events)

---

## 3. User Experience Flow

### Entry Points

1. **Game Menu Dashboard**
   - Primary entry: Progress summary card on main menu
   - Tap to open full dashboard view

2. **In-Game Stats Button**
   - Secondary entry: Small stats icon in game header
   - Quick access to relevant game stats

3. **Post-Game Summary**
   - Tertiary entry: After completing a game session
   - Shows session stats with link to full dashboard

### Main User Journey

```
[Game Menu]
     |
     v
[Progress Summary Card] -- Tap --> [Full Dashboard]
     |                                    |
     v                                    v
[Quick Stats]                    [Detailed Statistics]
  - Words learned                  - Overall Progress Tab
  - Current streak                 - Game Stats Tab
  - Today's activity              - Word Mastery Tab
                                   - Activity History Tab
```

### Dashboard Navigation Flow

```
Dashboard
    |
    +-- Overall Progress (default view)
    |       |-- Total stats summary
    |       |-- Mastery progress bar
    |       |-- Learning streak
    |       +-- Activity calendar
    |
    +-- Game Statistics
    |       |-- Memory Game stats
    |       |-- Spelling Game stats
    |       |-- Flashcards stats
    |       +-- Hangman stats
    |
    +-- Word Mastery
    |       |-- Word list with filters
    |       |-- Mastery levels
    |       +-- Review weak words
    |
    +-- Settings
            |-- Reset progress
            +-- Export data (future)
```

### Exit Points

1. **Back to Menu**: Return to game selection
2. **Jump to Game**: Start specific game from dashboard
3. **Practice Weak Words**: Launch focused practice mode (future)

### Error States and Recovery

| Error | User Message | Recovery Action |
|-------|--------------|-----------------|
| localStorage unavailable | "Cannot save progress. Browser storage disabled." | Offer to continue without saving |
| Corrupted data | "Progress data could not be loaded." | Offer to reset or continue |
| Missing word in dictionary | Silent skip | Log error, exclude from display |

---

## 4. UI/UX Specifications

### 4.1 Progress Summary Card (Game Menu)

**Location**: Above game selection buttons on main menu

```
+------------------------------------------+
|  Progress Summary                    [>] |
+------------------------------------------+
|                                          |
|  85 words practiced    |   42 mastered   |
|  [====75%====    ]                       |
|                                          |
|  7-day streak!                           |
|  Today: 15 min  |  This week: 2.5 hrs    |
|                                          |
+------------------------------------------+
```

**Elements:**
- Title with expand arrow
- Words practiced / mastered counters
- Overall mastery progress bar
- Current streak badge
- Session time summary

**Interactions:**
- Tap anywhere to open full dashboard
- Streak badge has subtle pulse animation

---

### 4.2 Full Dashboard View

**Layout**: Full-screen modal or page

#### Header
```
+------------------------------------------+
|  [<-]  My Progress                       |
+------------------------------------------+
```

#### Tab Navigation
```
+------------------------------------------+
| [Overview] | [Games] | [Words] | [?]     |
+------------------------------------------+
```

#### Overview Tab
```
+------------------------------------------+
|  Learning Journey                        |
+------------------------------------------+
|                                          |
|  +--------+  +--------+  +--------+     |
|  |   85   |  |   42   |  |   67%  |     |
|  | words  |  |mastered|  |accuracy|     |
|  +--------+  +--------+  +--------+     |
|                                          |
|  Overall Mastery                         |
|  [==========75%==========          ]     |
|                                          |
+------------------------------------------+
|  Current Streak: 7 days                  |
|  Best Streak: 14 days                    |
|  Total Time: 12.5 hours                  |
+------------------------------------------+
|  Activity This Month                     |
|  [Calendar grid with activity dots]     |
|                                          |
|  Dec 2024                                |
|  S  M  T  W  T  F  S                    |
|  1  2  3  4  5  6  7                    |
|  o  o  *  *  *  o  *     (* = active)   |
|  ...                                     |
+------------------------------------------+
```

#### Games Tab
```
+------------------------------------------+
|  Game Performance                        |
+------------------------------------------+
|                                          |
|  Memory Game                             |
|  +------------------------------------+ |
|  | Games: 45  |  Win Rate: 89%        | |
|  | Best: 12 moves (5 pairs)           | |
|  | Avg: 18 moves                       | |
|  +------------------------------------+ |
|                                          |
|  Spelling Game                           |
|  +------------------------------------+ |
|  | Games: 120  |  Accuracy: 78%       | |
|  | Best Streak: 23                     | |
|  | Words Spelled: 156                  | |
|  +------------------------------------+ |
|                                          |
|  Flashcards                              |
|  +------------------------------------+ |
|  | Sessions: 35  |  Cards Reviewed: 890| |
|  | Mastered (Box 4-5): 42 words        | |
|  | Avg Accuracy: 81%                   | |
|  +------------------------------------+ |
|                                          |
|  Hangman                                 |
|  +------------------------------------+ |
|  | Games: 67  |  Win Rate: 72%        | |
|  | Best Streak: 8                      | |
|  | Total Wins: 48                      | |
|  +------------------------------------+ |
|                                          |
+------------------------------------------+
```

#### Words Tab
```
+------------------------------------------+
|  Word Mastery                            |
+------------------------------------------+
|  Filter: [All v] [Struggling] [Mastered] |
+------------------------------------------+
|                                          |
|  dog                                     |
|  [====================] 95% (23 times)   |
|  Mastered                                |
|                                          |
|  elephant                                |
|  [========            ] 45% (8 times)    |
|  Learning                                |
|                                          |
|  breakfast                               |
|  [===                 ] 20% (3 times)    |
|  Needs Practice                          |
|                                          |
|  ... (scrollable list)                   |
|                                          |
+------------------------------------------+
```

---

### 4.3 In-Game Quick Stats

**Location**: Top-right corner of game header, next to existing stats

```
Current Game Header (before):
+------------------------------------------+
|  [<-]  Game Title          Streak: 5     |
+------------------------------------------+

New Game Header (after):
+------------------------------------------+
|  [<-]  Game Title    Streak: 5   [chart] |
+------------------------------------------+
```

**Behavior:**
- Small chart/progress icon
- Tap to show mini stats popover
- Does not interrupt gameplay

---

### 4.4 Post-Game Summary

**Displayed**: After completing a game session or returning to menu

```
+------------------------------------------+
|  Session Complete!                       |
+------------------------------------------+
|                                          |
|  This Session                            |
|  +--------+  +--------+  +--------+     |
|  |   12   |  |   9    |  |   75%  |     |
|  | words  |  | correct|  |accuracy|     |
|  +--------+  +--------+  +--------+     |
|                                          |
|  Words Practiced:                        |
|  dog +  cat +  bird +  fish -  elephant -|
|  (+ = correct, - = incorrect)            |
|                                          |
|  [Continue Playing]  [View Dashboard]    |
|                                          |
+------------------------------------------+
```

---

### 4.5 Responsive Design

#### Mobile (< 480px)
- Single column layout
- Stacked stat cards
- Swipeable tabs
- Full-width progress bars
- Collapsible sections

#### Tablet (480px - 1024px)
- Two-column stat cards
- Side tabs navigation
- Expanded calendar view

#### Desktop (> 1024px)
- Three-column stat cards
- Dashboard with sidebar
- Larger visualizations

---

### 4.6 Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| WCAG 2.1 AA | Minimum contrast ratios 4.5:1 |
| Screen readers | ARIA labels on all statistics |
| Keyboard navigation | Tab through all interactive elements |
| Focus indicators | Visible focus rings on all buttons |
| Color independence | Use patterns/shapes in addition to color |
| RTL support | Full RTL layout for Hebrew content |
| Touch targets | Minimum 48x48px tap areas |

---

## 5. Learning Design Considerations

### Alignment with Language Learning Methodologies

| Methodology | Implementation |
|-------------|----------------|
| Spaced Repetition | Integrate with Flashcards box system, surface "due" words |
| Active Recall | Track recall accuracy per word across all games |
| Comprehensible Input | Show which words user knows well for reading suggestions |
| Mastery Learning | Progress only after demonstrating competency |

### Gamification Elements

1. **Streak System**
   - Daily practice streaks with visual calendar
   - Best streak record with celebration
   - Streak recovery (1 free skip per week - future)

2. **Mastery Levels**
   - Words progress through levels: New -> Learning -> Practicing -> Mastered
   - Visual badges for milestones (10 words, 50 words, 100 words)

3. **Progress Visualization**
   - Animated progress bars
   - Achievement unlocks with celebrations
   - Weekly summary notifications (future)

### Progress Tracking Philosophy

- **Encourage, do not shame**: Focus on progress made, not failures
- **Celebrate small wins**: Acknowledge every session completed
- **Show improvement**: Emphasize growth over absolute numbers
- **Support review**: Make it easy to revisit challenging words
- **Respect pace**: Allow personal learning speed without pressure

### Feedback Mechanisms

| Action | Feedback |
|--------|----------|
| Complete a word correctly | Word mastery increases, brief positive indicator |
| Miss a word | Word marked for review, encouraging message |
| Maintain streak | Streak counter update with animation |
| Reach milestone | Celebration animation, achievement unlocked |
| Master a word | Word moves to mastered, congratulation |

---

## 6. Technical Considerations

### 6.1 Data Model

#### ProgressData (Root)
```typescript
interface ProgressData {
  version: number;                    // Schema version for migrations
  userId: string;                     // Unique identifier (UUID)
  createdAt: number;                  // First use timestamp
  lastUpdatedAt: number;              // Last activity timestamp

  // Overall stats
  totalWordsAttempted: number;
  totalCorrectAttempts: number;
  totalTimeSpentMs: number;

  // Streak tracking
  streakData: StreakData;

  // Per-word tracking
  wordProgress: Record<string, WordProgress>;

  // Per-game tracking
  gameStats: GameStats;

  // Daily activity log (for calendar)
  activityLog: ActivityLog[];
}
```

#### StreakData
```typescript
interface StreakData {
  currentStreak: number;              // Current consecutive days
  bestStreak: number;                 // All-time best streak
  lastActiveDate: string;             // YYYY-MM-DD format
  streakStartDate: string;            // When current streak began
}
```

#### WordProgress
```typescript
interface WordProgress {
  wordId: string;
  timesAttempted: number;
  timesCorrect: number;
  lastAttemptedAt: number;
  masteryLevel: 'new' | 'learning' | 'practicing' | 'mastered';

  // Per-game breakdown
  memoryAttempts: number;
  memoryCorrect: number;
  spellingAttempts: number;
  spellingCorrect: number;
  flashcardsAttempts: number;
  flashcardsCorrect: number;
  hangmanAttempts: number;
  hangmanCorrect: number;
}
```

#### GameStats
```typescript
interface GameStats {
  memory: MemoryGameStats;
  spelling: SpellingGameStats;
  flashcards: FlashcardsGameStats;
  hangman: HangmanGameStats;
}

interface MemoryGameStats {
  gamesPlayed: number;
  gamesCompleted: number;
  totalMoves: number;
  bestMovesByWordCount: Record<number, number>;  // wordCount -> best moves
  averageMoves: number;
}

interface SpellingGameStats {
  wordsAttempted: number;
  wordsCorrect: number;
  currentStreak: number;
  bestStreak: number;
  hintsUsed: number;
}

interface FlashcardsGameStats {
  cardsReviewed: number;
  correctAnswers: number;
  wrongAnswers: number;
  cardsMastered: number;  // Box 4-5
  averageAccuracy: number;
}

interface HangmanGameStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  currentStreak: number;
  bestStreak: number;
  lettersGuessed: number;
  wrongGuesses: number;
}
```

#### ActivityLog
```typescript
interface ActivityLog {
  date: string;                       // YYYY-MM-DD
  sessionsCount: number;
  timeSpentMs: number;
  wordsAttempted: number;
  wordsCorrect: number;
  gamesPlayed: string[];              // Game types played
}
```

### 6.2 Storage Approach

**Primary Storage**: localStorage

```typescript
const STORAGE_KEY = 'learn-eng-progress';
const STORAGE_VERSION = 1;

// Save progress
const saveProgress = (data: ProgressData): void => {
  data.lastUpdatedAt = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Load progress
const loadProgress = (): ProgressData | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const data = JSON.parse(stored) as ProgressData;
    return migrateIfNeeded(data);
  } catch {
    console.error('Failed to parse progress data');
    return null;
  }
};

// Initialize new progress
const initializeProgress = (): ProgressData => {
  return {
    version: STORAGE_VERSION,
    userId: generateUUID(),
    createdAt: Date.now(),
    lastUpdatedAt: Date.now(),
    totalWordsAttempted: 0,
    totalCorrectAttempts: 0,
    totalTimeSpentMs: 0,
    streakData: {
      currentStreak: 0,
      bestStreak: 0,
      lastActiveDate: '',
      streakStartDate: ''
    },
    wordProgress: {},
    gameStats: {
      memory: { gamesPlayed: 0, gamesCompleted: 0, totalMoves: 0, bestMovesByWordCount: {}, averageMoves: 0 },
      spelling: { wordsAttempted: 0, wordsCorrect: 0, currentStreak: 0, bestStreak: 0, hintsUsed: 0 },
      flashcards: { cardsReviewed: 0, correctAnswers: 0, wrongAnswers: 0, cardsMastered: 0, averageAccuracy: 0 },
      hangman: { gamesPlayed: 0, gamesWon: 0, gamesLost: 0, currentStreak: 0, bestStreak: 0, lettersGuessed: 0, wrongGuesses: 0 }
    },
    activityLog: []
  };
};
```

**Migration Strategy**:
```typescript
const migrateIfNeeded = (data: ProgressData): ProgressData => {
  if (data.version < STORAGE_VERSION) {
    // Apply migrations sequentially
    // v1 -> v2: Add new fields with defaults
    // v2 -> v3: Transform data structure
    // etc.
  }
  return data;
};
```

**Storage Considerations**:
- localStorage limit: ~5MB per origin (sufficient for our needs)
- Estimated data size: ~50KB for 100 words, 100 sessions
- No encryption needed (non-sensitive learning data)
- Consider IndexedDB for future if data grows significantly

### 6.3 Integration with Existing Games

#### Memory Game Integration
```typescript
// After game completion in MemoryGame.tsx
const reportGameComplete = (wordCount: number, moves: number, wordsUsed: Word[]) => {
  progressService.recordMemoryGame({
    wordCount,
    moves,
    wordsUsed: wordsUsed.map(w => w.id),
    completed: true
  });
};
```

#### Spelling Game Integration
```typescript
// After each word attempt in SpellingGame.tsx
const reportWordAttempt = (word: Word, isCorrect: boolean, hintUsed: boolean) => {
  progressService.recordSpellingAttempt({
    wordId: word.id,
    correct: isCorrect,
    hintUsed
  });
};
```

#### Flashcards Integration
```typescript
// After each answer in FlashcardsGame.tsx
const reportFlashcardAnswer = (word: Word, isCorrect: boolean, fromBox: number, toBox: number) => {
  progressService.recordFlashcardReview({
    wordId: word.id,
    correct: isCorrect,
    boxBefore: fromBox,
    boxAfter: toBox
  });
};
```

#### Hangman Integration
```typescript
// After game result in HangmanGame.tsx
const reportHangmanResult = (word: Word, won: boolean, wrongGuesses: number) => {
  progressService.recordHangmanGame({
    wordId: word.id,
    won,
    wrongGuesses,
    lettersGuessed: guessedLetters.size
  });
};
```

### 6.4 Progress Service Architecture

```typescript
// src/services/progressService.ts

class ProgressService {
  private data: ProgressData;
  private saveDebounce: number | null = null;

  constructor() {
    this.data = loadProgress() || initializeProgress();
  }

  // Core methods
  recordWordAttempt(wordId: string, game: GameType, correct: boolean): void
  recordGameSession(game: GameType, stats: GameSessionStats): void
  updateStreak(): void

  // Query methods
  getOverallStats(): OverallStats
  getGameStats(game: GameType): GameSpecificStats
  getWordProgress(wordId: string): WordProgress
  getAllWordProgress(): WordProgress[]
  getActivityCalendar(month: number, year: number): ActivityDay[]

  // Persistence
  private save(): void
  reset(): void
  exportData(): string  // Future: JSON export
}

export const progressService = new ProgressService();
```

### 6.5 Performance Considerations

| Concern | Solution |
|---------|----------|
| Large dataset | Lazy load word details, paginate lists |
| Frequent saves | Debounce saves (500ms delay) |
| Initial load | Load async, show skeleton UI |
| Calendar rendering | Virtualize long lists, limit to 12 months |
| Memory usage | Clean up old activity logs (keep 12 months) |

### 6.6 File Structure

```
src/
├── services/
│   └── progressService.ts       # Core progress tracking logic
│
├── components/
│   ├── ProgressDashboard/
│   │   ├── ProgressDashboard.tsx    # Main dashboard container
│   │   ├── OverviewTab.tsx          # Overall stats view
│   │   ├── GamesTab.tsx             # Game-specific stats
│   │   ├── WordsTab.tsx             # Word mastery list
│   │   ├── ActivityCalendar.tsx     # Activity visualization
│   │   ├── StatCard.tsx             # Reusable stat card
│   │   ├── ProgressBar.tsx          # Animated progress bar
│   │   └── index.ts                 # Barrel export
│   │
│   └── GameMenu/
│       ├── GameMenu.tsx             # (Modified) Add progress summary
│       └── ProgressSummary.tsx      # New summary card component
│
├── hooks/
│   └── useProgress.ts               # Custom hook for progress access
│
├── types/
│   └── progress.ts                  # TypeScript interfaces
│
└── utils/
    └── dateUtils.ts                 # Date formatting helpers
```

### 6.7 Dependencies

**No new dependencies required!**

All functionality can be implemented with existing stack:
- React (UI components)
- TypeScript (type safety)
- localStorage (persistence)
- CSS (styling, animations)

**Optional future dependencies:**
- Chart.js or Recharts (for advanced visualizations)
- date-fns (for date manipulation, if complex logic needed)

---

## 7. MVP vs Future Iterations

### MVP Scope (Phase 1)

**Must Have:**
1. Progress data model and persistence service
2. Basic game integrations (record attempts/results)
3. Progress summary card on game menu
4. Simple dashboard with overview tab
5. Total words practiced/mastered counters
6. Current streak tracking
7. Per-game basic stats (games played, accuracy)

**Implementation Priority:**
1. ProgressService with data model
2. Game integrations (one at a time)
3. ProgressSummary component
4. Basic ProgressDashboard
5. Streak tracking logic

**Estimated Effort:** 3-4 development days

---

### Phase 2 Enhancements

**Should Have:**
1. Word mastery tab with filterable list
2. Activity calendar visualization
3. Post-game session summary
4. Mastery level indicators (new/learning/practicing/mastered)
5. Best streak tracking
6. Time spent tracking

**Estimated Effort:** 2-3 development days

---

### Phase 3: Advanced Features

**Nice to Have:**
1. In-game quick stats popover
2. Weekly/monthly trend charts
3. Achievement/badge system
4. "Practice weak words" mode
5. Data export functionality
6. Animated celebrations for milestones

**Estimated Effort:** 3-5 development days

---

### Long-term Vision

1. **Cloud Sync**: Optional account creation for cross-device sync
2. **Social Features**: Compare progress with friends
3. **Personalized Recommendations**: AI-suggested focus areas
4. **Parent/Teacher Dashboard**: Monitor learner progress
5. **Learning Analytics**: Identify optimal learning times, patterns
6. **Gamification 2.0**: Leaderboards, challenges, rewards

---

## 8. Open Questions

### Assumptions Made

1. **localStorage is sufficient**: Assumed users will use single device/browser. Cloud sync is out of scope for MVP.

2. **110 words is manageable**: Current dictionary size fits comfortably in localStorage and UI lists.

3. **No user accounts needed**: Anonymous local progress is acceptable for MVP.

4. **Daily streaks are motivating**: Assumed streak gamification is positive; some users may find it stressful.

5. **80% accuracy = mastered**: Assumed threshold for word mastery; may need tuning.

### Questions for Stakeholders

1. **Streak pressure**: Should we allow "streak freezes" or grace periods to reduce stress?

2. **Reset granularity**: Should users be able to reset specific games or only all progress?

3. **Word mastery algorithm**: What accuracy threshold and attempt count indicates mastery?

4. **Time tracking precision**: Should we track exact time or just session counts?

5. **Activity calendar scope**: How many months of history should we display?

### Areas Requiring User Research

1. **Dashboard engagement**: Do users actually check progress dashboards?

2. **Motivational messaging**: What feedback language is most encouraging?

3. **Information density**: Is the proposed dashboard too overwhelming?

4. **Mobile UX**: Is tab navigation optimal, or would a different pattern work better?

5. **Word list utility**: How often would users actually review the word mastery list?

### Technical Questions

1. **Existing localStorage keys**: Should we migrate existing game records into the new unified progress system?

2. **Data backup**: Should we offer local export/import before cloud sync?

3. **Performance testing**: At what data size does performance degrade?

---

## Appendix: Migration from Existing Storage

### Current localStorage Keys

| Key | Data | Migration Plan |
|-----|------|----------------|
| `learn-eng-word-count` | Memory game preference | Keep separate (settings) |
| `learn-eng-records` | Memory best moves per word count | Import into gameStats.memory.bestMovesByWordCount |
| `learn-eng-spelling-streak-record` | Spelling best streak | Import into gameStats.spelling.bestStreak |
| `learn-eng-flashcards-progress` | Spaced repetition state | Import box levels into wordProgress, keep separate for game state |
| `learn-eng-flashcards-settings` | Flashcards preferences | Keep separate (settings) |
| `learn-eng-hangman-streak-record` | Hangman best streak | Import into gameStats.hangman.bestStreak |

### Migration Strategy

1. **Non-destructive**: Keep existing keys, copy data to new structure
2. **One-time migration**: Run on first load if new progress key is empty
3. **Fallback**: If migration fails, start fresh with new structure
4. **Cleanup (optional)**: After successful migration, remove old keys (phase 2)

```typescript
const migrateFromLegacy = (): ProgressData => {
  const progress = initializeProgress();

  // Import Memory records
  const memoryRecords = localStorage.getItem('learn-eng-records');
  if (memoryRecords) {
    progress.gameStats.memory.bestMovesByWordCount = JSON.parse(memoryRecords);
  }

  // Import Spelling record
  const spellingRecord = localStorage.getItem('learn-eng-spelling-streak-record');
  if (spellingRecord) {
    progress.gameStats.spelling.bestStreak = parseInt(spellingRecord, 10);
  }

  // Import Hangman record
  const hangmanRecord = localStorage.getItem('learn-eng-hangman-streak-record');
  if (hangmanRecord) {
    progress.gameStats.hangman.bestStreak = parseInt(hangmanRecord, 10);
  }

  // Import Flashcards progress
  const flashcardsProgress = localStorage.getItem('learn-eng-flashcards-progress');
  if (flashcardsProgress) {
    const cards = JSON.parse(flashcardsProgress);
    cards.forEach((card: any) => {
      progress.wordProgress[card.word.id] = {
        wordId: card.word.id,
        timesAttempted: card.lastSeen > 0 ? 1 : 0,
        timesCorrect: card.box > 1 ? 1 : 0,
        lastAttemptedAt: card.lastSeen,
        masteryLevel: card.box >= 4 ? 'mastered' : card.box >= 2 ? 'practicing' : 'learning',
        flashcardsAttempts: card.lastSeen > 0 ? 1 : 0,
        flashcardsCorrect: card.box > 1 ? 1 : 0,
        // Initialize other game counts to 0
        memoryAttempts: 0, memoryCorrect: 0,
        spellingAttempts: 0, spellingCorrect: 0,
        hangmanAttempts: 0, hangmanCorrect: 0
      };
    });

    progress.gameStats.flashcards.cardsMastered =
      cards.filter((c: any) => c.box >= 4).length;
  }

  return progress;
};
```

---

## Appendix: CSS Guidelines

### Color Palette for Progress States

```css
:root {
  /* Mastery levels */
  --mastery-new: #9e9e9e;           /* Gray - Not yet attempted */
  --mastery-learning: #ff9800;       /* Orange - Just started */
  --mastery-practicing: #2196f3;     /* Blue - Making progress */
  --mastery-mastered: #4caf50;       /* Green - Fully learned */

  /* Progress bars */
  --progress-bg: rgba(255, 255, 255, 0.2);
  --progress-fill: #4caf50;

  /* Streak */
  --streak-active: #ff9800;
  --streak-inactive: rgba(255, 255, 255, 0.3);

  /* Activity calendar */
  --activity-none: rgba(255, 255, 255, 0.1);
  --activity-low: rgba(76, 175, 80, 0.3);
  --activity-medium: rgba(76, 175, 80, 0.6);
  --activity-high: rgba(76, 175, 80, 1);
}
```

### Animations

```css
/* Progress bar fill animation */
@keyframes progressFill {
  from { width: 0; }
  to { width: var(--target-width); }
}

/* Streak pulse */
@keyframes streakPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Milestone celebration */
@keyframes celebratePop {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}
```

---

*End of Design Document*
