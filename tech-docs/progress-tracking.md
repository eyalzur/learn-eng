# Technical Design: Progress Tracking

## Overview

This document outlines the technical architecture for implementing a comprehensive progress tracking system in the learn-eng application. The system will record, persist, and visualize learning statistics across all games (Memory, Spelling, Flashcards, Hangman), enabling users to monitor their vocabulary acquisition journey over time.

The solution prioritizes simplicity, maintainability, and seamless integration with the existing React/TypeScript codebase while requiring no additional dependencies.

## Design Document Reference

Source: `/design-docs/progress-tracking.md` (Version 1.0, 2025-12-05)

---

## Requirements Summary

### Functional Requirements

1. **Overall Progress Tracking**: Track total words practiced, mastery percentage, accuracy rates
2. **Game-Specific Statistics**: Record performance metrics unique to each game type
3. **Word-Level Progress**: Track individual word mastery across all games
4. **Streak Tracking**: Daily practice streaks with best streak records
5. **Activity History**: Calendar-based activity log for visualization
6. **Data Persistence**: localStorage-based storage with migration support
7. **Dashboard UI**: Full dashboard with tabs for Overview, Games, and Words
8. **Progress Summary**: Quick-view summary card on the game menu

### Non-Functional Requirements

1. **Performance**: Handle 1000+ progress events without degradation
2. **Data Safety**: Zero data loss across browser sessions
3. **Accessibility**: WCAG 2.1 AA compliance, RTL support
4. **Responsive Design**: Mobile-first with tablet/desktop adaptations

---

## Architecture

### System Overview

```
+---------------------------------------------+
|                  App.tsx                    |
|  +---------------------------------------+  |
|  |            ProgressProvider           |  |
|  |  (React Context for global access)    |  |
|  +---------------------------------------+  |
|         |                    |              |
|    +---------+        +-------------+       |
|    |GameMenu |        | Game Views  |       |
|    +---------+        +-------------+       |
|         |                    |              |
|  +-------------+    +------------------+    |
|  |ProgressCard |    | useProgress Hook |    |
|  +-------------+    +------------------+    |
|         |                    |              |
|         v                    v              |
|  +---------------------------------------+  |
|  |          ProgressService              |  |
|  |  (Singleton - Business Logic Layer)   |  |
|  +---------------------------------------+  |
|                    |                        |
|  +---------------------------------------+  |
|  |          StorageAdapter               |  |
|  |  (localStorage abstraction)           |  |
|  +---------------------------------------+  |
+---------------------------------------------+
```

### Component Diagram

```
src/
+-- services/
|   +-- progress/
|       +-- ProgressService.ts      # Core service singleton
|       +-- StorageAdapter.ts       # localStorage abstraction
|       +-- migrations.ts           # Data migration logic
|       +-- index.ts                # Barrel export
|
+-- types/
|   +-- progress.ts                 # TypeScript interfaces
|
+-- context/
|   +-- ProgressContext.tsx         # React Context provider
|
+-- hooks/
|   +-- useProgress.ts              # Custom hook for components
|
+-- components/
|   +-- ProgressDashboard/
|   |   +-- ProgressDashboard.tsx   # Main dashboard container
|   |   +-- OverviewTab.tsx         # Overall stats view
|   |   +-- GamesTab.tsx            # Game-specific stats
|   |   +-- WordsTab.tsx            # Word mastery list
|   |   +-- ActivityCalendar.tsx    # Activity visualization
|   |   +-- StatCard.tsx            # Reusable stat card
|   |   +-- ProgressBar.tsx         # Animated progress bar
|   |   +-- MasteryBadge.tsx        # Word mastery indicator
|   |   +-- index.ts                # Barrel export
|   |
|   +-- GameMenu/
|   |   +-- GameMenu.tsx            # Modified - includes summary
|   |   +-- ProgressSummaryCard.tsx # Quick stats on menu
|   |   +-- index.ts
|   |
|   +-- shared/
|       +-- SentenceDisplay.tsx     # Existing
|       +-- QuickStatsPopover.tsx   # In-game stats popover
|
+-- utils/
    +-- dateUtils.ts                # Date formatting helpers
    +-- speech.ts                   # Existing
```

### Integration Points

| Component | Integration Type | Description |
|-----------|-----------------|-------------|
| MemoryGame | Event Reporter | Reports game completion and word matches |
| SpellingGame | Event Reporter | Reports word attempts and hint usage |
| FlashcardsGame | Event Reporter | Reports card reviews and box transitions |
| HangmanGame | Event Reporter | Reports game results and guesses |
| GameMenu | Consumer | Displays ProgressSummaryCard |
| App.tsx | Provider Host | Wraps app in ProgressProvider |

---

## Frontend Design

### Component Structure

#### ProgressProvider (Context)

```tsx
// src/context/ProgressContext.tsx

interface ProgressContextValue {
  // State
  progress: ProgressData | null;
  isLoading: boolean;
  error: string | null;

  // Overall stats
  getOverallStats: () => OverallStats;

  // Game-specific stats
  getGameStats: (game: GameType) => GameSpecificStats;

  // Word progress
  getWordProgress: (wordId: string) => WordProgress | null;
  getAllWordsProgress: () => WordProgress[];

  // Activity
  getActivityCalendar: (year: number, month: number) => ActivityDay[];

  // Recording (used by games)
  recordMemoryGame: (result: MemoryGameResult) => void;
  recordSpellingAttempt: (result: SpellingAttemptResult) => void;
  recordFlashcardReview: (result: FlashcardReviewResult) => void;
  recordHangmanGame: (result: HangmanGameResult) => void;

  // Management
  resetProgress: (scope: 'all' | GameType) => void;
}
```

#### ProgressDashboard Component Tree

```
ProgressDashboard
+-- DashboardHeader
|   +-- BackButton
|   +-- Title
|
+-- TabNavigation
|   +-- Tab (Overview)
|   +-- Tab (Games)
|   +-- Tab (Words)
|
+-- TabContent
    +-- OverviewTab
    |   +-- StatCardGrid
    |   |   +-- StatCard (Words Practiced)
    |   |   +-- StatCard (Words Mastered)
    |   |   +-- StatCard (Accuracy)
    |   |
    |   +-- MasteryProgressBar
    |   +-- StreakDisplay
    |   +-- ActivityCalendar
    |
    +-- GamesTab
    |   +-- GameStatCard (Memory)
    |   +-- GameStatCard (Spelling)
    |   +-- GameStatCard (Flashcards)
    |   +-- GameStatCard (Hangman)
    |
    +-- WordsTab
        +-- FilterControls
        +-- WordList (virtualized)
            +-- WordProgressRow
                +-- WordName
                +-- MasteryBadge
                +-- AccuracyBar
                +-- AttemptCount
```

### State Management Approach

**Pattern**: React Context + useReducer + Service Singleton

The architecture separates concerns into three layers:

1. **ProgressService (Singleton)**: Handles all business logic and localStorage operations
2. **ProgressContext (React Context)**: Provides React-friendly API and triggers re-renders
3. **useProgress (Hook)**: Provides typed access to context for components

```tsx
// State shape managed by context
interface ProgressState {
  data: ProgressData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number;
}

// Actions for reducer
type ProgressAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: ProgressData }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'UPDATE'; payload: ProgressData }
  | { type: 'RESET' };
```

**Rationale for this approach**:
- Service singleton provides consistent state management and debounced persistence
- Context enables component tree access without prop drilling
- Reducer pattern allows predictable state transitions and easy debugging
- Separation allows service to be used outside React if needed (e.g., in utilities)

### Key Interactions

#### Recording a Word Attempt (Example Flow)

```
1. User plays Spelling game and submits answer
2. SpellingGame calls context.recordSpellingAttempt({ wordId, correct, hintUsed })
3. Context delegates to ProgressService.recordSpellingAttempt()
4. ProgressService:
   a. Updates wordProgress for this word
   b. Updates gameStats.spelling
   c. Updates overall stats
   d. Updates streak data if needed
   e. Adds to activity log
   f. Debounced save to localStorage
5. ProgressService returns updated ProgressData
6. Context dispatches UPDATE action
7. React re-renders affected components
```

#### Dashboard Tab Navigation

```tsx
// ProgressDashboard.tsx
const [activeTab, setActiveTab] = useState<'overview' | 'games' | 'words'>('overview');

const renderTabContent = () => {
  switch (activeTab) {
    case 'overview':
      return <OverviewTab stats={getOverallStats()} />;
    case 'games':
      return <GamesTab gameStats={getGameStats} />;
    case 'words':
      return <WordsTab words={getAllWordsProgress()} />;
  }
};
```

### Responsive Design Considerations

| Breakpoint | Layout Changes |
|------------|---------------|
| Mobile (<480px) | Single column, stacked stat cards, full-width progress bars, collapsible sections |
| Tablet (480-1024px) | 2-column stat cards, side tabs, expanded calendar |
| Desktop (>1024px) | 3-column stat cards, sidebar navigation, larger visualizations |

```css
/* Example responsive grid */
.stat-cards-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 480px) {
  .stat-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .stat-cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## Backend Design

This application is entirely client-side; there is no backend server. All "backend" logic resides in the ProgressService.

### ProgressService Architecture

```typescript
// src/services/progress/ProgressService.ts

class ProgressService {
  private static instance: ProgressService;
  private data: ProgressData;
  private storage: StorageAdapter;
  private saveTimeout: number | null = null;
  private readonly SAVE_DEBOUNCE_MS = 500;

  private constructor() {
    this.storage = new StorageAdapter();
    this.data = this.loadOrInitialize();
  }

  public static getInstance(): ProgressService {
    if (!ProgressService.instance) {
      ProgressService.instance = new ProgressService();
    }
    return ProgressService.instance;
  }

  // === RECORDING METHODS ===

  public recordMemoryGame(result: MemoryGameResult): ProgressData {
    const { wordCount, moves, wordsUsed, completed } = result;

    // Update game stats
    this.data.gameStats.memory.gamesPlayed++;
    if (completed) {
      this.data.gameStats.memory.gamesCompleted++;
      this.data.gameStats.memory.totalMoves += moves;

      // Update best moves for this word count
      const current = this.data.gameStats.memory.bestMovesByWordCount[wordCount];
      if (!current || moves < current) {
        this.data.gameStats.memory.bestMovesByWordCount[wordCount] = moves;
      }

      // Recalculate average
      this.data.gameStats.memory.averageMoves =
        this.data.gameStats.memory.totalMoves / this.data.gameStats.memory.gamesCompleted;
    }

    // Update word progress for each word used
    wordsUsed.forEach(wordId => {
      this.recordWordAttempt(wordId, 'memory', completed);
    });

    this.updateStreak();
    this.updateActivityLog('memory');
    this.scheduleSave();

    return { ...this.data };
  }

  public recordSpellingAttempt(result: SpellingAttemptResult): ProgressData {
    const { wordId, correct, hintUsed } = result;

    // Update game stats
    this.data.gameStats.spelling.wordsAttempted++;
    if (correct) {
      this.data.gameStats.spelling.wordsCorrect++;
      this.data.gameStats.spelling.currentStreak++;
      if (this.data.gameStats.spelling.currentStreak > this.data.gameStats.spelling.bestStreak) {
        this.data.gameStats.spelling.bestStreak = this.data.gameStats.spelling.currentStreak;
      }
    } else {
      this.data.gameStats.spelling.currentStreak = 0;
    }
    if (hintUsed) {
      this.data.gameStats.spelling.hintsUsed++;
    }

    // Update word progress
    this.recordWordAttempt(wordId, 'spelling', correct);

    this.updateStreak();
    this.updateActivityLog('spelling');
    this.scheduleSave();

    return { ...this.data };
  }

  public recordFlashcardReview(result: FlashcardReviewResult): ProgressData {
    const { wordId, correct, boxBefore, boxAfter } = result;

    // Update game stats
    this.data.gameStats.flashcards.cardsReviewed++;
    if (correct) {
      this.data.gameStats.flashcards.correctAnswers++;
    } else {
      this.data.gameStats.flashcards.wrongAnswers++;
    }

    // Track cards that reached mastery (box 4+)
    if (boxAfter >= 4 && boxBefore < 4) {
      this.data.gameStats.flashcards.cardsMastered++;
    } else if (boxAfter < 4 && boxBefore >= 4) {
      this.data.gameStats.flashcards.cardsMastered--;
    }

    // Recalculate average accuracy
    const total = this.data.gameStats.flashcards.cardsReviewed;
    const correct_count = this.data.gameStats.flashcards.correctAnswers;
    this.data.gameStats.flashcards.averageAccuracy =
      Math.round((correct_count / total) * 100);

    // Update word progress
    this.recordWordAttempt(wordId, 'flashcards', correct);

    this.updateStreak();
    this.updateActivityLog('flashcards');
    this.scheduleSave();

    return { ...this.data };
  }

  public recordHangmanGame(result: HangmanGameResult): ProgressData {
    const { wordId, won, wrongGuesses, lettersGuessed } = result;

    // Update game stats
    this.data.gameStats.hangman.gamesPlayed++;
    this.data.gameStats.hangman.lettersGuessed += lettersGuessed;
    this.data.gameStats.hangman.wrongGuesses += wrongGuesses;

    if (won) {
      this.data.gameStats.hangman.gamesWon++;
      this.data.gameStats.hangman.currentStreak++;
      if (this.data.gameStats.hangman.currentStreak > this.data.gameStats.hangman.bestStreak) {
        this.data.gameStats.hangman.bestStreak = this.data.gameStats.hangman.currentStreak;
      }
    } else {
      this.data.gameStats.hangman.gamesLost++;
      this.data.gameStats.hangman.currentStreak = 0;
    }

    // Update word progress
    this.recordWordAttempt(wordId, 'hangman', won);

    this.updateStreak();
    this.updateActivityLog('hangman');
    this.scheduleSave();

    return { ...this.data };
  }

  // === QUERY METHODS ===

  public getProgress(): ProgressData {
    return { ...this.data };
  }

  public getOverallStats(): OverallStats {
    const totalAttempts = this.data.totalWordsAttempted;
    const totalCorrect = this.data.totalCorrectAttempts;
    const accuracy = totalAttempts > 0
      ? Math.round((totalCorrect / totalAttempts) * 100)
      : 0;

    const wordProgressList = Object.values(this.data.wordProgress);
    const masteredWords = wordProgressList.filter(w => w.masteryLevel === 'mastered').length;
    const totalWords = wordProgressList.length;
    const masteryPercentage = totalWords > 0
      ? Math.round((masteredWords / totalWords) * 100)
      : 0;

    return {
      totalWordsAttempted: totalAttempts,
      totalCorrectAttempts: totalCorrect,
      accuracy,
      masteredWords,
      totalWords,
      masteryPercentage,
      currentStreak: this.data.streakData.currentStreak,
      bestStreak: this.data.streakData.bestStreak,
      totalTimeSpentMs: this.data.totalTimeSpentMs,
    };
  }

  public getWordProgress(wordId: string): WordProgress | null {
    return this.data.wordProgress[wordId] || null;
  }

  public getAllWordsProgress(): WordProgress[] {
    return Object.values(this.data.wordProgress);
  }

  public getActivityCalendar(year: number, month: number): ActivityDay[] {
    // Returns array of days with activity data for the given month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result: ActivityDay[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const activity = this.data.activityLog.find(a => a.date === dateStr);

      result.push({
        date: dateStr,
        hasActivity: !!activity,
        sessionsCount: activity?.sessionsCount || 0,
        wordsAttempted: activity?.wordsAttempted || 0,
      });
    }

    return result;
  }

  // === MANAGEMENT METHODS ===

  public reset(scope: 'all' | GameType = 'all'): ProgressData {
    if (scope === 'all') {
      this.data = this.initializeProgress();
    } else {
      // Reset specific game stats
      this.resetGameStats(scope);
    }

    this.storage.save(this.data);
    return { ...this.data };
  }

  // === PRIVATE METHODS ===

  private recordWordAttempt(wordId: string, game: GameType, correct: boolean): void {
    // Initialize word progress if not exists
    if (!this.data.wordProgress[wordId]) {
      this.data.wordProgress[wordId] = this.initializeWordProgress(wordId);
    }

    const wp = this.data.wordProgress[wordId];
    wp.timesAttempted++;
    wp.lastAttemptedAt = Date.now();

    if (correct) {
      wp.timesCorrect++;
    }

    // Update game-specific counts
    const gameAttemptKey = `${game}Attempts` as keyof WordProgress;
    const gameCorrectKey = `${game}Correct` as keyof WordProgress;
    (wp[gameAttemptKey] as number)++;
    if (correct) {
      (wp[gameCorrectKey] as number)++;
    }

    // Recalculate mastery level
    wp.masteryLevel = this.calculateMasteryLevel(wp);

    // Update overall stats
    this.data.totalWordsAttempted++;
    if (correct) {
      this.data.totalCorrectAttempts++;
    }
    this.data.lastUpdatedAt = Date.now();
  }

  private calculateMasteryLevel(wp: WordProgress): MasteryLevel {
    const accuracy = wp.timesAttempted > 0
      ? wp.timesCorrect / wp.timesAttempted
      : 0;

    if (wp.timesAttempted === 0) return 'new';
    if (wp.timesAttempted < 3) return 'learning';
    if (accuracy >= 0.8 && wp.timesAttempted >= 5) return 'mastered';
    if (accuracy >= 0.5) return 'practicing';
    return 'learning';
  }

  private updateStreak(): void {
    const today = this.getDateString(new Date());
    const yesterday = this.getDateString(new Date(Date.now() - 24 * 60 * 60 * 1000));

    if (this.data.streakData.lastActiveDate === today) {
      // Already active today, no change
      return;
    }

    if (this.data.streakData.lastActiveDate === yesterday) {
      // Continuing streak
      this.data.streakData.currentStreak++;
    } else if (this.data.streakData.lastActiveDate !== today) {
      // Streak broken, start new
      this.data.streakData.currentStreak = 1;
      this.data.streakData.streakStartDate = today;
    }

    this.data.streakData.lastActiveDate = today;

    if (this.data.streakData.currentStreak > this.data.streakData.bestStreak) {
      this.data.streakData.bestStreak = this.data.streakData.currentStreak;
    }
  }

  private updateActivityLog(game: GameType): void {
    const today = this.getDateString(new Date());
    let todayLog = this.data.activityLog.find(a => a.date === today);

    if (!todayLog) {
      todayLog = {
        date: today,
        sessionsCount: 0,
        timeSpentMs: 0,
        wordsAttempted: 0,
        wordsCorrect: 0,
        gamesPlayed: [],
      };
      this.data.activityLog.push(todayLog);
    }

    todayLog.wordsAttempted++;
    if (!todayLog.gamesPlayed.includes(game)) {
      todayLog.gamesPlayed.push(game);
    }

    // Clean up old logs (keep last 12 months)
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - 12);
    const cutoffStr = this.getDateString(cutoffDate);
    this.data.activityLog = this.data.activityLog.filter(a => a.date >= cutoffStr);
  }

  private scheduleSave(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = window.setTimeout(() => {
      this.storage.save(this.data);
      this.saveTimeout = null;
    }, this.SAVE_DEBOUNCE_MS);
  }

  private getDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private loadOrInitialize(): ProgressData {
    const stored = this.storage.load();
    if (stored) {
      return this.migrateIfNeeded(stored);
    }

    // Check for legacy data to migrate
    const legacyData = this.migrateLegacyData();
    if (legacyData) {
      this.storage.save(legacyData);
      return legacyData;
    }

    return this.initializeProgress();
  }

  // Additional helper methods...
}

export const progressService = ProgressService.getInstance();
```

### Business Logic

#### Mastery Level Calculation

Words progress through mastery levels based on accuracy and attempt count:

| Level | Criteria |
|-------|----------|
| new | 0 attempts |
| learning | 1-2 attempts OR accuracy < 50% |
| practicing | 3+ attempts AND 50-79% accuracy |
| mastered | 5+ attempts AND 80%+ accuracy |

```typescript
const MASTERY_THRESHOLDS = {
  minAttemptsForMastered: 5,
  minAccuracyForMastered: 0.8,
  minAccuracyForPracticing: 0.5,
  minAttemptsForPracticing: 3,
};
```

#### Streak Calculation

Daily streaks track consecutive days of activity:

```typescript
// Streak rules:
// 1. Activity on day N after day N-1 continues streak
// 2. Activity on day N after day N-2+ resets streak to 1
// 3. Multiple activities on same day count as 1 day
// 4. Day boundary is midnight local time
```

---

## Data Model

### TypeScript Interfaces

```typescript
// src/types/progress.ts

export type GameType = 'memory' | 'spelling' | 'flashcards' | 'hangman';
export type MasteryLevel = 'new' | 'learning' | 'practicing' | 'mastered';

export interface ProgressData {
  version: number;
  userId: string;
  createdAt: number;
  lastUpdatedAt: number;

  totalWordsAttempted: number;
  totalCorrectAttempts: number;
  totalTimeSpentMs: number;

  streakData: StreakData;
  wordProgress: Record<string, WordProgress>;
  gameStats: GameStats;
  activityLog: ActivityLog[];
}

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string;  // YYYY-MM-DD
  streakStartDate: string; // YYYY-MM-DD
}

export interface WordProgress {
  wordId: string;
  timesAttempted: number;
  timesCorrect: number;
  lastAttemptedAt: number;
  masteryLevel: MasteryLevel;

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

export interface GameStats {
  memory: MemoryGameStats;
  spelling: SpellingGameStats;
  flashcards: FlashcardsGameStats;
  hangman: HangmanGameStats;
}

export interface MemoryGameStats {
  gamesPlayed: number;
  gamesCompleted: number;
  totalMoves: number;
  bestMovesByWordCount: Record<number, number>;
  averageMoves: number;
}

export interface SpellingGameStats {
  wordsAttempted: number;
  wordsCorrect: number;
  currentStreak: number;
  bestStreak: number;
  hintsUsed: number;
}

export interface FlashcardsGameStats {
  cardsReviewed: number;
  correctAnswers: number;
  wrongAnswers: number;
  cardsMastered: number;
  averageAccuracy: number;
}

export interface HangmanGameStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  currentStreak: number;
  bestStreak: number;
  lettersGuessed: number;
  wrongGuesses: number;
}

export interface ActivityLog {
  date: string;  // YYYY-MM-DD
  sessionsCount: number;
  timeSpentMs: number;
  wordsAttempted: number;
  wordsCorrect: number;
  gamesPlayed: GameType[];
}

// Query result types
export interface OverallStats {
  totalWordsAttempted: number;
  totalCorrectAttempts: number;
  accuracy: number;
  masteredWords: number;
  totalWords: number;
  masteryPercentage: number;
  currentStreak: number;
  bestStreak: number;
  totalTimeSpentMs: number;
}

export interface ActivityDay {
  date: string;
  hasActivity: boolean;
  sessionsCount: number;
  wordsAttempted: number;
}

// Event types for recording
export interface MemoryGameResult {
  wordCount: number;
  moves: number;
  wordsUsed: string[];  // word IDs
  completed: boolean;
}

export interface SpellingAttemptResult {
  wordId: string;
  correct: boolean;
  hintUsed: boolean;
}

export interface FlashcardReviewResult {
  wordId: string;
  correct: boolean;
  boxBefore: number;
  boxAfter: number;
}

export interface HangmanGameResult {
  wordId: string;
  won: boolean;
  wrongGuesses: number;
  lettersGuessed: number;
}
```

### localStorage Schema

```typescript
// Storage key
const STORAGE_KEY = 'learn-eng-progress';

// Current schema version
const CURRENT_VERSION = 1;

// Example stored data structure
{
  "version": 1,
  "userId": "uuid-v4-string",
  "createdAt": 1701792000000,
  "lastUpdatedAt": 1701795600000,
  "totalWordsAttempted": 245,
  "totalCorrectAttempts": 198,
  "totalTimeSpentMs": 7200000,
  "streakData": {
    "currentStreak": 7,
    "bestStreak": 14,
    "lastActiveDate": "2024-12-05",
    "streakStartDate": "2024-11-29"
  },
  "wordProgress": {
    "animal-1": {
      "wordId": "animal-1",
      "timesAttempted": 23,
      "timesCorrect": 21,
      "lastAttemptedAt": 1701795600000,
      "masteryLevel": "mastered",
      "memoryAttempts": 8,
      "memoryCorrect": 8,
      "spellingAttempts": 10,
      "spellingCorrect": 9,
      "flashcardsAttempts": 3,
      "flashcardsCorrect": 2,
      "hangmanAttempts": 2,
      "hangmanCorrect": 2
    }
    // ... more words
  },
  "gameStats": {
    "memory": {
      "gamesPlayed": 45,
      "gamesCompleted": 42,
      "totalMoves": 756,
      "bestMovesByWordCount": { "5": 12, "6": 15, "7": 20 },
      "averageMoves": 18
    },
    "spelling": {
      "wordsAttempted": 120,
      "wordsCorrect": 94,
      "currentStreak": 5,
      "bestStreak": 23,
      "hintsUsed": 18
    },
    "flashcards": {
      "cardsReviewed": 890,
      "correctAnswers": 721,
      "wrongAnswers": 169,
      "cardsMastered": 42,
      "averageAccuracy": 81
    },
    "hangman": {
      "gamesPlayed": 67,
      "gamesWon": 48,
      "gamesLost": 19,
      "currentStreak": 3,
      "bestStreak": 8,
      "lettersGuessed": 456,
      "wrongGuesses": 89
    }
  },
  "activityLog": [
    {
      "date": "2024-12-05",
      "sessionsCount": 2,
      "timeSpentMs": 1800000,
      "wordsAttempted": 35,
      "wordsCorrect": 28,
      "gamesPlayed": ["spelling", "flashcards"]
    }
    // ... more days (up to 12 months)
  ]
}
```

### Entity Relationships

```
ProgressData (1)
    |
    +-- StreakData (1:1)
    |
    +-- WordProgress (1:N)
    |       |
    |       +-- Per-game attempt counts
    |       +-- Mastery level (computed)
    |
    +-- GameStats (1:1)
    |       |
    |       +-- MemoryGameStats (1:1)
    |       +-- SpellingGameStats (1:1)
    |       +-- FlashcardsGameStats (1:1)
    |       +-- HangmanGameStats (1:1)
    |
    +-- ActivityLog (1:N)
            |
            +-- Daily aggregated data
```

---

## Integration Hooks for Existing Games

### MemoryGame Integration

```tsx
// src/components/MemoryGame/MemoryGame.tsx

import { useProgress } from '../../hooks/useProgress';

export const MemoryGame: React.FC<MemoryGameProps> = ({ onBack }) => {
  const { recordMemoryGame } = useProgress();

  // Existing state...
  const [words, setWords] = useState<Word[]>([]);

  // Modify the useEffect that handles game completion
  useEffect(() => {
    if (matchedPairs === wordCount && matchedPairs > 0) {
      // Existing record logic...
      const isNew = saveRecord(wordCount, moves);
      if (isNew) {
        setRecord(moves);
        setIsNewRecord(true);
      }

      // NEW: Report to progress tracking
      recordMemoryGame({
        wordCount,
        moves,
        wordsUsed: words.map(w => w.id),
        completed: true,
      });
    }
  }, [matchedPairs, wordCount, moves, words, recordMemoryGame]);

  // Rest of component unchanged...
};
```

### SpellingGame Integration

```tsx
// src/components/SpellingGame/SpellingGame.tsx

import { useProgress } from '../../hooks/useProgress';

export const SpellingGame: React.FC<SpellingGameProps> = ({ onBack }) => {
  const { recordSpellingAttempt } = useProgress();

  // Track if hint was used for current word
  const [hintUsedForCurrent, setHintUsedForCurrent] = useState(false);

  const handleHint = () => {
    setShowHint(true);
    setHintUsedForCurrent(true);  // NEW: Track hint usage
    speak(currentWord.english, 'en');
  };

  const checkAnswer = () => {
    // Existing logic...
    const isCorrect = answer === correct;

    // NEW: Report to progress tracking
    recordSpellingAttempt({
      wordId: currentWord.id,
      correct: isCorrect,
      hintUsed: hintUsedForCurrent,
    });

    // Rest of existing logic...
  };

  const nextWord = () => {
    setHintUsedForCurrent(false);  // NEW: Reset hint tracking
    // Rest of existing logic...
  };

  // Rest of component unchanged...
};
```

### FlashcardsGame Integration

```tsx
// src/components/FlashcardsGame/FlashcardsGame.tsx

import { useProgress } from '../../hooks/useProgress';

export const FlashcardsGame: React.FC<FlashcardsGameProps> = ({ onBack }) => {
  const { recordFlashcardReview } = useProgress();

  const handleAnswer = useCallback((selectedWord: Word) => {
    if (isAnswered || !currentCard) return;

    const isCorrect = selectedWord.id === currentCard.word.id;
    const boxBefore = currentCard.box;  // Capture before update

    // Existing logic updates allCards...
    const newBox = isCorrect ? Math.min(5, currentCard.box + 1) : 1;

    // NEW: Report to progress tracking
    recordFlashcardReview({
      wordId: currentCard.word.id,
      correct: isCorrect,
      boxBefore,
      boxAfter: newBox,
    });

    // Rest of existing logic...
  }, [isAnswered, currentCard, allCards, questionLang, recordFlashcardReview]);

  // Rest of component unchanged...
};
```

### HangmanGame Integration

```tsx
// src/components/HangmanGame/HangmanGame.tsx

import { useProgress } from '../../hooks/useProgress';

export const HangmanGame: React.FC<HangmanGameProps> = ({ onBack }) => {
  const { recordHangmanGame } = useProgress();

  // Track if game result was already reported
  const [resultReported, setResultReported] = useState(false);

  const handleLetterGuess = (letter: string) => {
    // Existing logic...

    if (!isCorrect) {
      const newWrongGuesses = [...wrongGuesses, letter];
      setWrongGuesses(newWrongGuesses);

      if (newWrongGuesses.length >= MAX_WRONG_GUESSES) {
        setGameStatus('lost');

        // NEW: Report loss to progress tracking
        recordHangmanGame({
          wordId: currentWord.id,
          won: false,
          wrongGuesses: newWrongGuesses.length,
          lettersGuessed: guessedLetters.size + 1,
        });
        setResultReported(true);

        // Rest of existing logic...
      }
    } else {
      if (allLettersGuessed) {
        setGameStatus('won');

        // NEW: Report win to progress tracking
        recordHangmanGame({
          wordId: currentWord.id,
          won: true,
          wrongGuesses: wrongGuesses.length,
          lettersGuessed: guessedLetters.size + 1,
        });
        setResultReported(true);

        // Rest of existing logic...
      }
    }
  };

  const handleNextWord = () => {
    setResultReported(false);  // Reset for next word
    // Rest of existing logic...
  };

  // Rest of component unchanged...
};
```

### useProgress Hook Implementation

```tsx
// src/hooks/useProgress.ts

import { useContext } from 'react';
import { ProgressContext } from '../context/ProgressContext';

export function useProgress() {
  const context = useContext(ProgressContext);

  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }

  return context;
}
```

---

## Migration Strategy

### Current localStorage Keys

| Key | Current Usage | Migration Action |
|-----|---------------|------------------|
| `learn-eng-word-count` | Memory game preference | Keep as settings (no change) |
| `learn-eng-records` | Memory best moves per word count | Import into `gameStats.memory.bestMovesByWordCount` |
| `learn-eng-spelling-streak-record` | Spelling best streak | Import into `gameStats.spelling.bestStreak` |
| `learn-eng-flashcards-progress` | Spaced repetition state | Import box levels into `wordProgress`, keep original for game state |
| `learn-eng-flashcards-settings` | Flashcards preferences | Keep as settings (no change) |
| `learn-eng-hangman-streak-record` | Hangman best streak | Import into `gameStats.hangman.bestStreak` |

### Migration Implementation

```typescript
// src/services/progress/migrations.ts

export function migrateLegacyData(): ProgressData | null {
  const progress = initializeProgress();
  let hasMigratedData = false;

  // === Memory Game Records ===
  const memoryRecords = localStorage.getItem('learn-eng-records');
  if (memoryRecords) {
    try {
      const records = JSON.parse(memoryRecords) as Record<number, number>;
      progress.gameStats.memory.bestMovesByWordCount = records;

      // Estimate games played from records
      const wordCounts = Object.keys(records);
      progress.gameStats.memory.gamesCompleted = wordCounts.length;
      progress.gameStats.memory.gamesPlayed = wordCounts.length;

      hasMigratedData = true;
    } catch (e) {
      console.warn('Failed to migrate memory records:', e);
    }
  }

  // === Spelling Streak Record ===
  const spellingRecord = localStorage.getItem('learn-eng-spelling-streak-record');
  if (spellingRecord) {
    const streak = parseInt(spellingRecord, 10);
    if (!isNaN(streak)) {
      progress.gameStats.spelling.bestStreak = streak;
      hasMigratedData = true;
    }
  }

  // === Hangman Streak Record ===
  const hangmanRecord = localStorage.getItem('learn-eng-hangman-streak-record');
  if (hangmanRecord) {
    const streak = parseInt(hangmanRecord, 10);
    if (!isNaN(streak)) {
      progress.gameStats.hangman.bestStreak = streak;
      hasMigratedData = true;
    }
  }

  // === Flashcards Progress ===
  const flashcardsProgress = localStorage.getItem('learn-eng-flashcards-progress');
  if (flashcardsProgress) {
    try {
      const cards = JSON.parse(flashcardsProgress) as FlashcardStoredState[];

      cards.forEach((card) => {
        // Create word progress entry from flashcard state
        progress.wordProgress[card.word.id] = {
          wordId: card.word.id,
          timesAttempted: card.box > 1 ? card.box - 1 : 0,
          timesCorrect: card.box > 1 ? card.box - 1 : 0,
          lastAttemptedAt: card.lastSeen || 0,
          masteryLevel: calculateMasteryFromBox(card.box),

          // Attribute all existing progress to flashcards
          memoryAttempts: 0,
          memoryCorrect: 0,
          spellingAttempts: 0,
          spellingCorrect: 0,
          flashcardsAttempts: card.box > 1 ? card.box - 1 : 0,
          flashcardsCorrect: card.box > 1 ? card.box - 1 : 0,
          hangmanAttempts: 0,
          hangmanCorrect: 0,
        };
      });

      // Update flashcards stats
      progress.gameStats.flashcards.cardsMastered =
        cards.filter((c) => c.box >= 4).length;

      // Estimate reviews from average box level
      const totalBoxes = cards.reduce((sum, c) => sum + c.box, 0);
      progress.gameStats.flashcards.cardsReviewed = totalBoxes;

      hasMigratedData = true;
    } catch (e) {
      console.warn('Failed to migrate flashcards progress:', e);
    }
  }

  // Calculate overall stats from migrated word progress
  if (hasMigratedData) {
    const wordProgressList = Object.values(progress.wordProgress);
    progress.totalWordsAttempted = wordProgressList.reduce(
      (sum, wp) => sum + wp.timesAttempted,
      0
    );
    progress.totalCorrectAttempts = wordProgressList.reduce(
      (sum, wp) => sum + wp.timesCorrect,
      0
    );

    // Set created date to now since we don't know original
    progress.createdAt = Date.now();
    progress.lastUpdatedAt = Date.now();

    return progress;
  }

  return null;
}

function calculateMasteryFromBox(box: number): MasteryLevel {
  if (box >= 4) return 'mastered';
  if (box >= 2) return 'practicing';
  return 'learning';
}

interface FlashcardStoredState {
  word: { id: string };
  box: number;
  lastSeen: number;
}
```

### Version Migration Framework

```typescript
// src/services/progress/migrations.ts

const MIGRATIONS: Record<number, (data: ProgressData) => ProgressData> = {
  // Version 1 -> 2 migration (example for future)
  // 2: (data) => {
  //   return {
  //     ...data,
  //     version: 2,
  //     newField: defaultValue,
  //   };
  // },
};

export function migrateToLatest(data: ProgressData): ProgressData {
  let migrated = { ...data };

  while (migrated.version < CURRENT_VERSION) {
    const nextVersion = migrated.version + 1;
    const migration = MIGRATIONS[nextVersion];

    if (migration) {
      migrated = migration(migrated);
      console.log(`Migrated progress data from v${migrated.version - 1} to v${migrated.version}`);
    } else {
      console.warn(`No migration found for version ${nextVersion}`);
      break;
    }
  }

  return migrated;
}
```

---

## Technical Considerations

### Performance

| Concern | Solution |
|---------|----------|
| Large dataset (1000+ events) | Lazy load word details, paginate/virtualize lists |
| Frequent saves | Debounce saves (500ms delay) |
| Initial load blocking | Load async with skeleton UI |
| Calendar rendering | Limit to current month + navigation |
| Memory usage | Clean up activity logs older than 12 months |
| Word list rendering | Virtual scrolling for 100+ items |

```typescript
// Debounced save implementation
private scheduleSave(): void {
  if (this.saveTimeout) {
    clearTimeout(this.saveTimeout);
  }
  this.saveTimeout = window.setTimeout(() => {
    this.storage.save(this.data);
    this.saveTimeout = null;
  }, this.SAVE_DEBOUNCE_MS);
}
```

### Security

| Concern | Implementation |
|---------|---------------|
| Data sensitivity | Low - learning data only, no PII |
| localStorage access | Standard browser security model |
| XSS protection | React's default escaping |
| Data validation | Type checking on load, fallback to defaults |

### Scalability

| Dimension | Limit | Notes |
|-----------|-------|-------|
| Words tracked | ~500 | Dictionary size, manageable |
| Activity log | 12 months | Automatic cleanup |
| localStorage | ~5MB | Current estimate: 50-100KB |
| Concurrent games | 1 | Single-player, single-game design |

### Error Handling

```typescript
// StorageAdapter with error handling
export class StorageAdapter {
  private readonly STORAGE_KEY = 'learn-eng-progress';

  public load(): ProgressData | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const data = JSON.parse(stored);

      // Validate basic structure
      if (!this.isValidProgressData(data)) {
        console.error('Invalid progress data structure');
        return null;
      }

      return data as ProgressData;
    } catch (error) {
      console.error('Failed to load progress data:', error);
      return null;
    }
  }

  public save(data: ProgressData): boolean {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(this.STORAGE_KEY, serialized);
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded');
        // Could trigger cleanup of old activity logs
      } else {
        console.error('Failed to save progress data:', error);
      }
      return false;
    }
  }

  public isAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  private isValidProgressData(data: unknown): boolean {
    if (typeof data !== 'object' || data === null) return false;
    const d = data as Record<string, unknown>;
    return (
      typeof d.version === 'number' &&
      typeof d.userId === 'string' &&
      typeof d.wordProgress === 'object' &&
      typeof d.gameStats === 'object'
    );
  }
}
```

### Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Screen reader support | ARIA labels on all stats, progress bars, and interactive elements |
| Keyboard navigation | Tab order through dashboard tabs, stat cards, word list |
| Focus indicators | Visible focus rings matching existing app style |
| Color independence | Use icons/text labels alongside color coding |
| RTL support | Full RTL layout using existing CSS direction |
| Touch targets | Minimum 48x48px for all interactive elements |

```tsx
// Example accessible StatCard
<div
  className="stat-card"
  role="group"
  aria-label={`${label}: ${value}`}
>
  <span className="stat-value" aria-hidden="true">{value}</span>
  <span className="stat-label">{label}</span>
</div>
```

---

## Testing Strategy

### Unit Tests

**ProgressService Tests**

```typescript
// src/services/progress/__tests__/ProgressService.test.ts

describe('ProgressService', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset singleton instance
  });

  describe('recordSpellingAttempt', () => {
    it('should increment total attempts on word progress', () => {
      const service = ProgressService.getInstance();
      const result = service.recordSpellingAttempt({
        wordId: 'animal-1',
        correct: true,
        hintUsed: false,
      });

      expect(result.wordProgress['animal-1'].timesAttempted).toBe(1);
      expect(result.wordProgress['animal-1'].spellingAttempts).toBe(1);
    });

    it('should update spelling game stats', () => {
      const service = ProgressService.getInstance();
      service.recordSpellingAttempt({ wordId: 'animal-1', correct: true, hintUsed: false });
      service.recordSpellingAttempt({ wordId: 'animal-2', correct: false, hintUsed: true });

      const stats = service.getProgress().gameStats.spelling;
      expect(stats.wordsAttempted).toBe(2);
      expect(stats.wordsCorrect).toBe(1);
      expect(stats.hintsUsed).toBe(1);
    });

    it('should track spelling streak correctly', () => {
      const service = ProgressService.getInstance();

      // Build streak
      service.recordSpellingAttempt({ wordId: 'animal-1', correct: true, hintUsed: false });
      service.recordSpellingAttempt({ wordId: 'animal-2', correct: true, hintUsed: false });
      service.recordSpellingAttempt({ wordId: 'animal-3', correct: true, hintUsed: false });

      expect(service.getProgress().gameStats.spelling.currentStreak).toBe(3);

      // Break streak
      service.recordSpellingAttempt({ wordId: 'animal-4', correct: false, hintUsed: false });

      expect(service.getProgress().gameStats.spelling.currentStreak).toBe(0);
      expect(service.getProgress().gameStats.spelling.bestStreak).toBe(3);
    });
  });

  describe('mastery level calculation', () => {
    it('should mark word as mastered after 5+ correct attempts with 80%+ accuracy', () => {
      const service = ProgressService.getInstance();

      // 5 correct attempts
      for (let i = 0; i < 5; i++) {
        service.recordSpellingAttempt({ wordId: 'animal-1', correct: true, hintUsed: false });
      }

      expect(service.getWordProgress('animal-1')?.masteryLevel).toBe('mastered');
    });

    it('should keep word at practicing level if accuracy below 80%', () => {
      const service = ProgressService.getInstance();

      // 3 correct, 2 incorrect = 60% accuracy
      for (let i = 0; i < 3; i++) {
        service.recordSpellingAttempt({ wordId: 'animal-1', correct: true, hintUsed: false });
      }
      for (let i = 0; i < 2; i++) {
        service.recordSpellingAttempt({ wordId: 'animal-1', correct: false, hintUsed: false });
      }

      expect(service.getWordProgress('animal-1')?.masteryLevel).toBe('practicing');
    });
  });

  describe('streak tracking', () => {
    it('should increment streak for consecutive days', () => {
      // Test requires mocking Date
    });

    it('should reset streak after missing a day', () => {
      // Test requires mocking Date
    });
  });
});
```

**Migration Tests**

```typescript
describe('migrations', () => {
  it('should migrate legacy memory records', () => {
    localStorage.setItem('learn-eng-records', JSON.stringify({ 5: 12, 6: 15 }));

    const migrated = migrateLegacyData();

    expect(migrated?.gameStats.memory.bestMovesByWordCount).toEqual({ 5: 12, 6: 15 });
  });

  it('should migrate legacy flashcards progress', () => {
    const flashcardsData = [
      { word: { id: 'animal-1' }, box: 4, lastSeen: Date.now() },
      { word: { id: 'animal-2' }, box: 2, lastSeen: Date.now() },
    ];
    localStorage.setItem('learn-eng-flashcards-progress', JSON.stringify(flashcardsData));

    const migrated = migrateLegacyData();

    expect(migrated?.wordProgress['animal-1'].masteryLevel).toBe('mastered');
    expect(migrated?.wordProgress['animal-2'].masteryLevel).toBe('practicing');
    expect(migrated?.gameStats.flashcards.cardsMastered).toBe(1);
  });
});
```

### Integration Tests

```typescript
describe('Game Integration', () => {
  it('should record memory game completion with all words', () => {
    // Render MemoryGame with ProgressProvider
    // Complete a game
    // Verify progress was recorded for all words
  });

  it('should persist progress across page reloads', () => {
    // Record some progress
    // Simulate page reload (re-render with fresh localStorage load)
    // Verify progress is restored
  });
});
```

### Component Tests

```typescript
describe('ProgressDashboard', () => {
  it('should display correct overall stats', () => {
    // Mock useProgress with known data
    // Render OverviewTab
    // Verify stat cards show correct values
  });

  it('should switch between tabs', () => {
    // Render dashboard
    // Click Games tab
    // Verify GamesTab is shown
  });

  it('should filter words by mastery level', () => {
    // Render WordsTab with mock data
    // Select "Mastered" filter
    // Verify only mastered words shown
  });
});
```

### Manual Testing Checklist

- [ ] Progress persists after browser close/reopen
- [ ] Progress shows on game menu after playing games
- [ ] Dashboard opens and displays all tabs
- [ ] Activity calendar shows correct activity dots
- [ ] Word mastery levels update correctly
- [ ] Streak increments on new day activity
- [ ] Streak resets after missing a day
- [ ] Reset progress works (with confirmation)
- [ ] Mobile layout is usable
- [ ] RTL layout displays correctly
- [ ] Screen reader announces stats correctly

---

## Implementation Plan

### Phase 1: Core Infrastructure (3-4 days)

**Deliverables:**
1. TypeScript interfaces (`src/types/progress.ts`)
2. StorageAdapter (`src/services/progress/StorageAdapter.ts`)
3. ProgressService (`src/services/progress/ProgressService.ts`)
4. Migration logic (`src/services/progress/migrations.ts`)
5. ProgressContext and useProgress hook
6. Unit tests for ProgressService

**Dependencies:** None

**Risks:**
- Data migration edge cases from legacy data
- Mitigation: Thorough testing with various legacy data states

### Phase 2: Game Integrations (2 days)

**Deliverables:**
1. MemoryGame integration
2. SpellingGame integration
3. FlashcardsGame integration
4. HangmanGame integration

**Dependencies:** Phase 1 complete

**Risks:**
- Breaking existing game functionality
- Mitigation: Small, isolated changes; test each game after integration

### Phase 3: Progress Summary Card (1 day)

**Deliverables:**
1. ProgressSummaryCard component
2. GameMenu modification to include summary
3. Styling matching existing app theme

**Dependencies:** Phase 2 complete (for real data)

### Phase 4: Dashboard UI (3-4 days)

**Deliverables:**
1. ProgressDashboard container
2. OverviewTab with stat cards
3. GamesTab with game-specific stats
4. WordsTab with filterable list
5. ActivityCalendar component
6. Responsive styling
7. Navigation from menu to dashboard

**Dependencies:** Phase 3 complete

**Risks:**
- Performance with large word lists
- Mitigation: Virtual scrolling for lists > 50 items

### Phase 5: Polish and Testing (2 days)

**Deliverables:**
1. Accessibility audit and fixes
2. RTL layout verification
3. Integration tests
4. Manual testing across devices
5. Performance optimization if needed
6. Documentation updates

**Dependencies:** Phase 4 complete

### Total Estimated Effort: 11-13 days

---

## Open Questions

1. **Time Tracking Precision**: The design doc mentions time tracking but doesn't specify implementation. Should we track:
   - Session duration (start/end timestamps)?
   - Active game time only?
   - Skip for MVP and add later?

   **Recommendation**: Skip for MVP, add basic session tracking in Phase 2 enhancements.

2. **Reset Granularity**: Design doc mentions "reset specific games or all data." Current implementation plan supports both. Confirm this is desired.

3. **Word List Data Source**: Should the word list in WordsTab show all dictionary words or only words that have been attempted?

   **Recommendation**: Show only attempted words, with option to "View all words" for future expansion.

4. **Flashcards Dual Storage**: Flashcards game maintains its own spaced repetition state. Should we:
   - Keep both systems separate (current plan)?
   - Migrate Flashcards to use ProgressService exclusively?

   **Recommendation**: Keep separate for MVP to avoid breaking Flashcards game logic. Consider unification in future.

---

## Assumptions

1. **localStorage Availability**: Assumed localStorage is available. Feature degrades gracefully if not (shows error, continues without persistence).

2. **Single User**: No multi-user support. Progress is tied to browser/device.

3. **Dictionary Stability**: Word IDs in dictionary are stable. If a word ID changes, its progress history would be orphaned.

4. **Browser Compatibility**: Targeting modern browsers (Chrome, Safari, Firefox, Edge). No IE11 support.

5. **Mastery Thresholds**: Using 80% accuracy with 5+ attempts for "mastered" status. Can be adjusted based on user feedback.

6. **Activity Log Retention**: 12 months of activity history is sufficient. Older data is automatically cleaned up.

7. **No Backend**: All features implemented client-side only. Cloud sync is out of scope.

---

*End of Technical Design Document*
