# Technical Design: Game Difficulty Levels

## Overview

This document provides a comprehensive technical specification for implementing a difficulty level system across all four games (Memory, Spelling, Flashcards, Hangman) in the learn-eng application. The system allows users to select Easy, Medium, or Hard difficulty before starting any game, with each level adjusting game parameters to provide an appropriately challenging learning experience.

## Design Document Reference

Source: `/design-docs/difficulty-levels.md` (Version 1.0, Status: Design Complete)

## Requirements Summary

### Functional Requirements

1. **Difficulty Selection**: Three-level system (Easy, Medium, Hard) presented before each game starts
2. **Persistence**: Remember last-used difficulty per game independently
3. **Per-Game Parameters**: Each game has unique parameter adjustments per difficulty
4. **Records Tracking**: Maintain separate records/statistics per difficulty level
5. **In-Game Indicator**: Show current difficulty during gameplay with option to change
6. **Progression Recommendations**: Suggest difficulty upgrades based on performance (Phase 2)

### Non-Functional Requirements

1. **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation, RTL support
2. **Performance**: No perceptible delay when switching difficulties
3. **Migration**: Existing records assigned to "Medium" difficulty
4. **First-Time Users**: Default to "Easy" difficulty

---

## Architecture

### System Overview

The difficulty system is implemented as a cross-cutting concern that integrates with each game component through:
1. A centralized configuration file defining all difficulty parameters
2. Custom React hooks for difficulty state management and persistence
3. Reusable UI components for difficulty selection and display
4. Game-specific integration patterns that consume difficulty parameters

### Component Diagram

```
+-------------------+     +----------------------+     +------------------+
|                   |     |                      |     |                  |
|   App.tsx         |---->|   Game Components    |---->|  DifficultySelector
|                   |     |   (Memory, Spelling, |     |  (shown first)   |
|                   |     |    Flashcards,       |     |                  |
|                   |     |    Hangman)          |     +------------------+
+-------------------+     |                      |
                          +----------+-----------+
                                     |
                                     v
                          +----------+-----------+
                          |                      |
                          |   useDifficulty      |<----+
                          |   (custom hook)      |     |
                          |                      |     |
                          +----------+-----------+     |
                                     |                 |
                                     v                 |
                          +----------+-----------+     |
                          |                      |     |
                          |  DIFFICULTY_CONFIG   |     |
                          |  (configuration)     |     |
                          |                      |     |
                          +----------+-----------+     |
                                     |                 |
                                     v                 |
                          +----------+-----------+     |
                          |                      |     |
                          |   localStorage       |-----+
                          |   (persistence)      |
                          |                      |
                          +----------------------+
```

### Integration Points

1. **App.tsx**: No changes required; games manage their own difficulty selection flow
2. **Game Components**: Each game receives difficulty parameters and shows selector on mount
3. **localStorage**: Persists difficulty settings and per-difficulty records
4. **dictionary.ts**: Enhanced with word filtering by length for difficulty-based word selection

### File Structure

```
src/
+-- components/
|   +-- DifficultySelector/
|   |   +-- DifficultySelector.tsx    # Main selector screen
|   |   +-- DifficultyCard.tsx        # Individual difficulty option card
|   |   +-- DifficultyDetails.tsx     # Expandable details for each level
|   |   +-- DifficultySelector.css    # Component-specific styles
|   |   +-- index.ts                  # Barrel export
|   |
|   +-- DifficultyIndicator/
|   |   +-- DifficultyIndicator.tsx   # In-game badge component
|   |   +-- index.ts
|   |
|   +-- MemoryGame/                   # Modified
|   +-- SpellingGame/                 # Modified
|   +-- FlashcardsGame/               # Modified
|   +-- HangmanGame/                  # Modified
|
+-- config/
|   +-- difficultyConfig.ts           # All difficulty parameters
|
+-- hooks/
|   +-- useDifficulty.ts              # Difficulty state and persistence
|
+-- types/
|   +-- difficulty.ts                 # TypeScript interfaces
|
+-- data/
|   +-- dictionary.ts                 # Enhanced with filtering functions
|
+-- styles/
    +-- main.css                      # Add difficulty-specific CSS variables
```

---

## Data Models and TypeScript Interfaces

### Core Types (`src/types/difficulty.ts`)

```typescript
/**
 * Difficulty levels available across all games
 */
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/**
 * Game identifiers matching the existing GameType
 */
export type GameType = 'memory' | 'spelling' | 'flashcards' | 'hangman';

/**
 * Per-game difficulty settings stored in localStorage
 */
export interface DifficultySettings {
  memory: DifficultyLevel;
  spelling: DifficultyLevel;
  flashcards: DifficultyLevel;
  hangman: DifficultyLevel;
}

/**
 * Default difficulty settings for new users
 */
export const DEFAULT_DIFFICULTY_SETTINGS: DifficultySettings = {
  memory: 'easy',
  spelling: 'easy',
  flashcards: 'easy',
  hangman: 'easy',
};

/**
 * Difficulty metadata for UI display
 */
export interface DifficultyInfo {
  level: DifficultyLevel;
  label: string;
  labelHe: string;
  description: string;
  descriptionHe: string;
  stars: number;
  color: string;
  colorLight: string;
}

/**
 * Static difficulty metadata
 */
export const DIFFICULTY_INFO: Record<DifficultyLevel, DifficultyInfo> = {
  easy: {
    level: 'easy',
    label: 'Easy',
    labelHe: 'קל',
    description: 'Relaxed pace',
    descriptionHe: 'קצב נינוח',
    stars: 1,
    color: '#4CAF50',
    colorLight: 'rgba(76, 175, 80, 0.15)',
  },
  medium: {
    level: 'medium',
    label: 'Medium',
    labelHe: 'בינוני',
    description: 'Balanced challenge',
    descriptionHe: 'אתגר מאוזן',
    stars: 2,
    color: '#FF9800',
    colorLight: 'rgba(255, 152, 0, 0.15)',
  },
  hard: {
    level: 'hard',
    label: 'Hard',
    labelHe: 'קשה',
    description: 'Expert challenge',
    descriptionHe: 'אתגר למומחים',
    stars: 3,
    color: '#F44336',
    colorLight: 'rgba(244, 67, 54, 0.15)',
  },
};
```

### Game-Specific Parameter Interfaces (`src/types/difficulty.ts` continued)

```typescript
/**
 * Memory Game difficulty parameters
 */
export interface MemoryDifficultyParams {
  /** Number of word pairs (4, 6, or 8-10) */
  wordCount: number;
  /** Time cards stay flipped before auto-flip back (ms) */
  flipDuration: number;
  /** Delay after match before cards are marked matched (ms) */
  matchDelay: number;
  /** Whether to filter words from same category */
  useSameCategory: boolean;
  /** Word length filter range */
  wordLengthRange: { min: number; max: number };
}

/**
 * Spelling Game difficulty parameters
 */
export interface SpellingDifficultyParams {
  /** Word length filter range */
  wordLengthRange: { min: number; max: number };
  /** Multiplier for extra decoy letters (0.25, 0.5, 0.75) */
  decoyMultiplier: number;
  /** Hint availability mode */
  hintMode: 'always' | 'free' | 'penalty';
  /** Whether to auto-pronounce on word display */
  autoPronounce: boolean;
}

/**
 * Flashcards Game difficulty parameters
 */
export interface FlashcardsDifficultyParams {
  /** Number of answer choices (2, 4, or 6) */
  choiceCount: number;
  /** Time limit per card in ms (null = no limit) */
  timeLimit: number | null;
  /** How distractors are selected */
  distractorMode: 'random' | 'category' | 'similar';
  /** When transcription is shown */
  transcriptionMode: 'always' | 'question' | 'hidden';
  /** Box progression on correct/incorrect */
  boxProgression: { correct: number; incorrect: number };
}

/**
 * Hangman Game difficulty parameters
 */
export interface HangmanDifficultyParams {
  /** Word length filter range */
  wordLengthRange: { min: number; max: number };
  /** Maximum wrong guesses allowed */
  maxWrongGuesses: number;
  /** Keyboard mode: limited letters or full alphabet */
  keyboardMode: 'limited' | 'full';
  /** Number of extra decoy letters (for limited mode) */
  decoyCount: number;
  /** Whether hints are allowed */
  hintAllowed: boolean;
  /** Maximum hints per game */
  hintLimit: number;
  /** When transcription is visible */
  transcriptionMode: 'always' | 'progressive' | 'hidden';
  /** Number of wrong guesses before showing transcription (for progressive) */
  transcriptionRevealAt: number;
}

/**
 * Union type for all game parameters
 */
export type GameDifficultyParams =
  | MemoryDifficultyParams
  | SpellingDifficultyParams
  | FlashcardsDifficultyParams
  | HangmanDifficultyParams;
```

### Records Interfaces (`src/types/difficulty.ts` continued)

```typescript
/**
 * Memory Game records per difficulty
 */
export interface MemoryRecords {
  /** Map of wordCount -> best moves */
  [wordCount: number]: number;
}

/**
 * Spelling Game records per difficulty
 */
export interface SpellingRecords {
  bestStreak: number;
}

/**
 * Flashcards Game records per difficulty
 */
export interface FlashcardsRecords {
  gamesPlayed: number;
  totalCorrect: number;
  totalAnswered: number;
}

/**
 * Hangman Game records per difficulty
 */
export interface HangmanRecords {
  bestStreak: number;
}

/**
 * Complete records structure per difficulty level
 */
export interface DifficultyRecords {
  memory: {
    easy: MemoryRecords;
    medium: MemoryRecords;
    hard: MemoryRecords;
  };
  spelling: {
    easy: SpellingRecords;
    medium: SpellingRecords;
    hard: SpellingRecords;
  };
  flashcards: {
    easy: FlashcardsRecords;
    medium: FlashcardsRecords;
    hard: FlashcardsRecords;
  };
  hangman: {
    easy: HangmanRecords;
    medium: HangmanRecords;
    hard: HangmanRecords;
  };
}

/**
 * Default empty records structure
 */
export const DEFAULT_DIFFICULTY_RECORDS: DifficultyRecords = {
  memory: {
    easy: {},
    medium: {},
    hard: {},
  },
  spelling: {
    easy: { bestStreak: 0 },
    medium: { bestStreak: 0 },
    hard: { bestStreak: 0 },
  },
  flashcards: {
    easy: { gamesPlayed: 0, totalCorrect: 0, totalAnswered: 0 },
    medium: { gamesPlayed: 0, totalCorrect: 0, totalAnswered: 0 },
    hard: { gamesPlayed: 0, totalCorrect: 0, totalAnswered: 0 },
  },
  hangman: {
    easy: { bestStreak: 0 },
    medium: { bestStreak: 0 },
    hard: { bestStreak: 0 },
  },
};
```

---

## Difficulty Configuration File

### Configuration Structure (`src/config/difficultyConfig.ts`)

```typescript
import {
  DifficultyLevel,
  MemoryDifficultyParams,
  SpellingDifficultyParams,
  FlashcardsDifficultyParams,
  HangmanDifficultyParams,
} from '../types/difficulty';

/**
 * Memory Game difficulty configuration
 */
export const MEMORY_CONFIG: Record<DifficultyLevel, MemoryDifficultyParams> = {
  easy: {
    wordCount: 4,
    flipDuration: 1500,
    matchDelay: 800,
    useSameCategory: true,
    wordLengthRange: { min: 2, max: 5 },
  },
  medium: {
    wordCount: 6,
    flipDuration: 1000,
    matchDelay: 500,
    useSameCategory: false,
    wordLengthRange: { min: 2, max: 8 },
  },
  hard: {
    wordCount: 8,
    flipDuration: 700,
    matchDelay: 300,
    useSameCategory: false,
    wordLengthRange: { min: 5, max: 12 },
  },
};

/**
 * Spelling Game difficulty configuration
 */
export const SPELLING_CONFIG: Record<DifficultyLevel, SpellingDifficultyParams> = {
  easy: {
    wordLengthRange: { min: 2, max: 4 },
    decoyMultiplier: 0.25,
    hintMode: 'always',
    autoPronounce: true,
  },
  medium: {
    wordLengthRange: { min: 4, max: 6 },
    decoyMultiplier: 0.5,
    hintMode: 'free',
    autoPronounce: false,
  },
  hard: {
    wordLengthRange: { min: 5, max: 12 },
    decoyMultiplier: 0.75,
    hintMode: 'penalty',
    autoPronounce: false,
  },
};

/**
 * Flashcards Game difficulty configuration
 */
export const FLASHCARDS_CONFIG: Record<DifficultyLevel, FlashcardsDifficultyParams> = {
  easy: {
    choiceCount: 2,
    timeLimit: null,
    distractorMode: 'random',
    transcriptionMode: 'always',
    boxProgression: { correct: 2, incorrect: -1 },
  },
  medium: {
    choiceCount: 4,
    timeLimit: null,
    distractorMode: 'category',
    transcriptionMode: 'question',
    boxProgression: { correct: 1, incorrect: -1 },
  },
  hard: {
    choiceCount: 6,
    timeLimit: 10000,
    distractorMode: 'similar',
    transcriptionMode: 'hidden',
    boxProgression: { correct: 1, incorrect: -2 },
  },
};

/**
 * Hangman Game difficulty configuration
 */
export const HANGMAN_CONFIG: Record<DifficultyLevel, HangmanDifficultyParams> = {
  easy: {
    wordLengthRange: { min: 2, max: 4 },
    maxWrongGuesses: 8,
    keyboardMode: 'limited',
    decoyCount: 4,
    hintAllowed: true,
    hintLimit: 99,
    transcriptionMode: 'always',
    transcriptionRevealAt: 0,
  },
  medium: {
    wordLengthRange: { min: 4, max: 6 },
    maxWrongGuesses: 6,
    keyboardMode: 'limited',
    decoyCount: 8,
    hintAllowed: true,
    hintLimit: 1,
    transcriptionMode: 'always',
    transcriptionRevealAt: 0,
  },
  hard: {
    wordLengthRange: { min: 5, max: 12 },
    maxWrongGuesses: 4,
    keyboardMode: 'full',
    decoyCount: 0,
    hintAllowed: false,
    hintLimit: 0,
    transcriptionMode: 'progressive',
    transcriptionRevealAt: 3,
  },
};

/**
 * Unified difficulty configuration export
 */
export const DIFFICULTY_CONFIG = {
  memory: MEMORY_CONFIG,
  spelling: SPELLING_CONFIG,
  flashcards: FLASHCARDS_CONFIG,
  hangman: HANGMAN_CONFIG,
} as const;

/**
 * Game-specific descriptions of what changes at each difficulty
 * Used in the DifficultyDetails component
 */
export const DIFFICULTY_DESCRIPTIONS = {
  memory: {
    easy: [
      '4 זוגות מילים',
      'זמן צפייה ארוך יותר',
      'מילים מאותה קטגוריה',
    ],
    medium: [
      '6 זוגות מילים',
      'זמן צפייה רגיל',
      'מילים מקטגוריות שונות',
    ],
    hard: [
      '8-10 זוגות מילים',
      'זמן צפייה קצר',
      'מילים ארוכות יותר',
    ],
  },
  spelling: {
    easy: [
      'מילים קצרות (2-4 אותיות)',
      'מעט אותיות נוספות',
      'רמז תמיד זמין',
    ],
    medium: [
      'מילים בינוניות (4-6 אותיות)',
      'יותר אותיות נוספות',
      'רמז זמין לבקשה',
    ],
    hard: [
      'מילים ארוכות (5+ אותיות)',
      'הרבה אותיות נוספות',
      'רמז עולה בנקודות',
    ],
  },
  flashcards: {
    easy: [
      '2 אפשרויות בלבד',
      'ללא הגבלת זמן',
      'תעתיק תמיד מוצג',
    ],
    medium: [
      '4 אפשרויות',
      'ללא הגבלת זמן',
      'תעתיק בשאלה בלבד',
    ],
    hard: [
      '6 אפשרויות',
      '10 שניות לתשובה',
      'ללא תעתיק',
    ],
  },
  hangman: {
    easy: [
      'מילים קצרות (2-4 אותיות)',
      '8 טעויות מותרות',
      'רמז ללא הגבלה',
    ],
    medium: [
      'מילים בינוניות (4-6 אותיות)',
      '6 טעויות מותרות',
      'רמז אחד למשחק',
    ],
    hard: [
      'מילים ארוכות (5+ אותיות)',
      '4 טעויות בלבד',
      'ללא רמזים',
    ],
  },
} as const;
```

---

## Custom Hooks Architecture

### useDifficulty Hook (`src/hooks/useDifficulty.ts`)

```typescript
import { useState, useCallback, useEffect } from 'react';
import {
  DifficultyLevel,
  DifficultySettings,
  DEFAULT_DIFFICULTY_SETTINGS,
  GameType,
} from '../types/difficulty';

const SETTINGS_STORAGE_KEY = 'learn-eng-difficulty-settings';

/**
 * Get stored difficulty settings from localStorage
 */
const getStoredSettings = (): DifficultySettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate the stored settings
      const validLevels: DifficultyLevel[] = ['easy', 'medium', 'hard'];
      const games: GameType[] = ['memory', 'spelling', 'flashcards', 'hangman'];

      for (const game of games) {
        if (!validLevels.includes(parsed[game])) {
          // Invalid stored value, return defaults
          return DEFAULT_DIFFICULTY_SETTINGS;
        }
      }
      return parsed;
    }
  } catch (error) {
    console.warn('Failed to parse difficulty settings:', error);
  }
  return DEFAULT_DIFFICULTY_SETTINGS;
};

/**
 * Save difficulty settings to localStorage
 */
const saveSettings = (settings: DifficultySettings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save difficulty settings:', error);
  }
};

/**
 * Hook for managing difficulty state for a specific game
 */
export function useDifficulty(game: GameType) {
  const [difficulty, setDifficultyState] = useState<DifficultyLevel>(() => {
    return getStoredSettings()[game];
  });

  const setDifficulty = useCallback((newDifficulty: DifficultyLevel) => {
    setDifficultyState(newDifficulty);

    // Update stored settings
    const currentSettings = getStoredSettings();
    const updatedSettings: DifficultySettings = {
      ...currentSettings,
      [game]: newDifficulty,
    };
    saveSettings(updatedSettings);
  }, [game]);

  return {
    difficulty,
    setDifficulty,
  };
}

/**
 * Hook return type for type safety
 */
export interface UseDifficultyReturn {
  difficulty: DifficultyLevel;
  setDifficulty: (level: DifficultyLevel) => void;
}
```

### useDifficultyRecords Hook (`src/hooks/useDifficultyRecords.ts`)

```typescript
import { useState, useCallback } from 'react';
import {
  DifficultyLevel,
  DifficultyRecords,
  DEFAULT_DIFFICULTY_RECORDS,
  GameType,
  MemoryRecords,
  SpellingRecords,
  FlashcardsRecords,
  HangmanRecords,
} from '../types/difficulty';

const RECORDS_STORAGE_KEY = 'learn-eng-difficulty-records';
const MIGRATION_FLAG_KEY = 'learn-eng-difficulty-migrated';

// Legacy storage keys for migration
const LEGACY_KEYS = {
  memoryRecords: 'learn-eng-records',
  spellingStreak: 'learn-eng-spelling-streak-record',
  hangmanStreak: 'learn-eng-hangman-streak-record',
};

/**
 * Migrate existing records to the new per-difficulty structure
 * Assigns all existing records to "medium" difficulty
 */
const migrateExistingRecords = (): DifficultyRecords => {
  const records = { ...DEFAULT_DIFFICULTY_RECORDS };

  try {
    // Migrate Memory records
    const memoryStored = localStorage.getItem(LEGACY_KEYS.memoryRecords);
    if (memoryStored) {
      records.memory.medium = JSON.parse(memoryStored);
    }

    // Migrate Spelling streak
    const spellingStored = localStorage.getItem(LEGACY_KEYS.spellingStreak);
    if (spellingStored) {
      records.spelling.medium.bestStreak = parseInt(spellingStored, 10) || 0;
    }

    // Migrate Hangman streak
    const hangmanStored = localStorage.getItem(LEGACY_KEYS.hangmanStreak);
    if (hangmanStored) {
      records.hangman.medium.bestStreak = parseInt(hangmanStored, 10) || 0;
    }
  } catch (error) {
    console.warn('Error during records migration:', error);
  }

  return records;
};

/**
 * Get stored difficulty records from localStorage
 */
const getStoredRecords = (): DifficultyRecords => {
  try {
    // Check if migration has been done
    const migrated = localStorage.getItem(MIGRATION_FLAG_KEY);

    if (!migrated) {
      // First time with new system - migrate existing records
      const migratedRecords = migrateExistingRecords();
      localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(migratedRecords));
      localStorage.setItem(MIGRATION_FLAG_KEY, 'true');
      return migratedRecords;
    }

    const stored = localStorage.getItem(RECORDS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to parse difficulty records:', error);
  }
  return DEFAULT_DIFFICULTY_RECORDS;
};

/**
 * Save difficulty records to localStorage
 */
const saveRecords = (records: DifficultyRecords): void => {
  try {
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.warn('Failed to save difficulty records:', error);
  }
};

/**
 * Hook for managing per-difficulty records
 */
export function useDifficultyRecords<T extends GameType>(game: T) {
  const [allRecords, setAllRecords] = useState<DifficultyRecords>(getStoredRecords);

  const getRecord = useCallback((difficulty: DifficultyLevel) => {
    return allRecords[game][difficulty];
  }, [allRecords, game]);

  const updateRecord = useCallback((
    difficulty: DifficultyLevel,
    updater: (current: any) => any
  ) => {
    setAllRecords(prev => {
      const newRecords = {
        ...prev,
        [game]: {
          ...prev[game],
          [difficulty]: updater(prev[game][difficulty]),
        },
      };
      saveRecords(newRecords);
      return newRecords;
    });
  }, [game]);

  // Game-specific record helpers
  const saveMemoryRecord = useCallback((
    difficulty: DifficultyLevel,
    wordCount: number,
    moves: number
  ): boolean => {
    const currentRecords = allRecords.memory[difficulty] as MemoryRecords;
    if (!currentRecords[wordCount] || moves < currentRecords[wordCount]) {
      updateRecord(difficulty, (current: MemoryRecords) => ({
        ...current,
        [wordCount]: moves,
      }));
      return true;
    }
    return false;
  }, [allRecords, updateRecord]);

  const saveStreakRecord = useCallback((
    difficulty: DifficultyLevel,
    streak: number
  ): boolean => {
    const gameRecords = allRecords[game][difficulty];
    if ('bestStreak' in gameRecords && streak > gameRecords.bestStreak) {
      updateRecord(difficulty, (current: { bestStreak: number }) => ({
        ...current,
        bestStreak: streak,
      }));
      return true;
    }
    return false;
  }, [allRecords, game, updateRecord]);

  return {
    getRecord,
    updateRecord,
    saveMemoryRecord,
    saveStreakRecord,
    allRecords: allRecords[game],
  };
}
```

---

## React Component Architecture

### DifficultySelector Component (`src/components/DifficultySelector/DifficultySelector.tsx`)

```typescript
import React, { useState } from 'react';
import { DifficultyCard } from './DifficultyCard';
import { DifficultyDetails } from './DifficultyDetails';
import {
  DifficultyLevel,
  DIFFICULTY_INFO,
  GameType,
} from '../../types/difficulty';
import { DIFFICULTY_DESCRIPTIONS } from '../../config/difficultyConfig';
import './DifficultySelector.css';

interface DifficultySelectorProps {
  /** Current game type */
  game: GameType;
  /** Currently selected difficulty */
  currentDifficulty: DifficultyLevel;
  /** Callback when user selects a difficulty and starts */
  onSelect: (difficulty: DifficultyLevel) => void;
  /** Callback to go back to menu */
  onBack: () => void;
}

const GAME_TITLES: Record<GameType, string> = {
  memory: 'משחק זיכרון',
  spelling: 'משחק איות',
  flashcards: 'כרטיסיות',
  hangman: 'משחק תליין',
};

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  game,
  currentDifficulty,
  onSelect,
  onBack,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(currentDifficulty);
  const [showDetails, setShowDetails] = useState(false);

  const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard'];
  const descriptions = DIFFICULTY_DESCRIPTIONS[game];

  const handleStart = () => {
    onSelect(selectedDifficulty);
  };

  return (
    <div className="difficulty-selector">
      <div className="difficulty-header">
        <button className="back-button" onClick={onBack}>
          &rarr; חזרה לתפריט
        </button>
        <h1>{GAME_TITLES[game]}</h1>
        <h2 className="difficulty-title">בחר רמת קושי</h2>
      </div>

      <div className="difficulty-cards">
        {difficulties.map((level) => (
          <DifficultyCard
            key={level}
            info={DIFFICULTY_INFO[level]}
            isSelected={selectedDifficulty === level}
            onClick={() => setSelectedDifficulty(level)}
          />
        ))}
      </div>

      <button
        className="details-toggle"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? 'הסתר פרטים' : 'מה משתנה בכל רמה?'}
      </button>

      {showDetails && (
        <DifficultyDetails
          descriptions={descriptions}
          selectedLevel={selectedDifficulty}
        />
      )}

      <div className="current-selection">
        <span className="selection-label">נבחר:</span>
        <span
          className="selection-value"
          style={{ color: DIFFICULTY_INFO[selectedDifficulty].color }}
        >
          {DIFFICULTY_INFO[selectedDifficulty].labelHe}
        </span>
      </div>

      <button className="start-button" onClick={handleStart}>
        התחל משחק
      </button>
    </div>
  );
};
```

### DifficultyCard Component (`src/components/DifficultySelector/DifficultyCard.tsx`)

```typescript
import React from 'react';
import { DifficultyInfo } from '../../types/difficulty';

interface DifficultyCardProps {
  info: DifficultyInfo;
  isSelected: boolean;
  onClick: () => void;
}

export const DifficultyCard: React.FC<DifficultyCardProps> = ({
  info,
  isSelected,
  onClick,
}) => {
  const stars = Array(info.stars).fill('*').join('');

  return (
    <button
      className={`difficulty-card ${info.level} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      style={{
        borderColor: isSelected ? info.color : undefined,
        backgroundColor: isSelected ? info.colorLight : undefined,
      }}
      aria-pressed={isSelected}
      aria-label={`${info.labelHe} - ${info.descriptionHe}`}
    >
      <span className="difficulty-stars">{stars}</span>
      <span className="difficulty-label">{info.labelHe}</span>
      <span className="difficulty-label-en">{info.label}</span>
      <span className="difficulty-description">{info.descriptionHe}</span>
    </button>
  );
};
```

### DifficultyDetails Component (`src/components/DifficultySelector/DifficultyDetails.tsx`)

```typescript
import React from 'react';
import { DifficultyLevel, DIFFICULTY_INFO } from '../../types/difficulty';

interface DifficultyDetailsProps {
  descriptions: {
    easy: string[];
    medium: string[];
    hard: string[];
  };
  selectedLevel: DifficultyLevel;
}

export const DifficultyDetails: React.FC<DifficultyDetailsProps> = ({
  descriptions,
  selectedLevel,
}) => {
  const levels: DifficultyLevel[] = ['easy', 'medium', 'hard'];

  return (
    <div className="difficulty-details">
      {levels.map((level) => (
        <div
          key={level}
          className={`details-section ${level} ${selectedLevel === level ? 'highlighted' : ''}`}
        >
          <h4 style={{ color: DIFFICULTY_INFO[level].color }}>
            {DIFFICULTY_INFO[level].labelHe}
          </h4>
          <ul>
            {descriptions[level].map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
```

### DifficultyIndicator Component (`src/components/DifficultyIndicator/DifficultyIndicator.tsx`)

```typescript
import React from 'react';
import { DifficultyLevel, DIFFICULTY_INFO } from '../../types/difficulty';

interface DifficultyIndicatorProps {
  difficulty: DifficultyLevel;
  onClick?: () => void;
}

const BADGE_LABELS: Record<DifficultyLevel, string> = {
  easy: 'ק',
  medium: 'ב',
  hard: 'ק',
};

export const DifficultyIndicator: React.FC<DifficultyIndicatorProps> = ({
  difficulty,
  onClick,
}) => {
  const info = DIFFICULTY_INFO[difficulty];

  return (
    <button
      className={`difficulty-indicator ${difficulty}`}
      onClick={onClick}
      style={{ backgroundColor: info.color }}
      title={`רמת קושי: ${info.labelHe}`}
      aria-label={`רמת קושי: ${info.labelHe}. לחץ לשינוי`}
    >
      {BADGE_LABELS[difficulty]}
    </button>
  );
};
```

### DifficultySelector CSS (`src/components/DifficultySelector/DifficultySelector.css`)

```css
.difficulty-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  color: white;
  height: 100%;
  overflow-y: auto;
}

.difficulty-header {
  text-align: center;
  margin-bottom: 20px;
  width: 100%;
}

.difficulty-header h1 {
  font-size: 1.4rem;
  margin-bottom: 8px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.difficulty-title {
  font-size: 1.2rem;
  opacity: 0.9;
  font-weight: 400;
}

.difficulty-cards {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.difficulty-card {
  min-width: 100px;
  padding: 16px 12px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-family: 'Rubik', sans-serif;
}

.difficulty-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.difficulty-card.selected {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.difficulty-stars {
  font-size: 1.5rem;
  letter-spacing: 4px;
}

.difficulty-label {
  font-size: 1.1rem;
  font-weight: 700;
}

.difficulty-label-en {
  font-size: 0.8rem;
  opacity: 0.7;
}

.difficulty-description {
  font-size: 0.75rem;
  opacity: 0.8;
  text-align: center;
}

.details-toggle {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-family: 'Rubik', sans-serif;
  font-size: 0.9rem;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.details-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}

.difficulty-details {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
  width: 100%;
  max-width: 600px;
}

.details-section {
  flex: 1;
  min-width: 150px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.details-section.highlighted {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.02);
}

.details-section h4 {
  margin-bottom: 8px;
  font-size: 1rem;
}

.details-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.details-section li {
  font-size: 0.85rem;
  opacity: 0.9;
  margin-bottom: 4px;
  padding-right: 12px;
  position: relative;
}

.details-section li::before {
  content: '>';
  position: absolute;
  right: 0;
  opacity: 0.5;
}

.current-selection {
  margin-bottom: 15px;
  font-size: 1rem;
}

.selection-label {
  opacity: 0.8;
  margin-left: 8px;
}

.selection-value {
  font-weight: 700;
  font-size: 1.2rem;
}

.start-button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 1.2rem;
  font-family: 'Rubik', sans-serif;
  font-weight: 700;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  min-height: 54px;
}

.start-button:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

/* Difficulty Indicator Badge */
.difficulty-indicator {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Rubik', sans-serif;
  min-width: 32px;
  min-height: 28px;
}

.difficulty-indicator:hover {
  transform: scale(1.1);
  opacity: 0.9;
}

/* Responsive: Stack cards vertically on very narrow screens */
@media (max-width: 400px) {
  .difficulty-cards {
    flex-direction: column;
    align-items: center;
  }

  .difficulty-card {
    width: 100%;
    max-width: 200px;
  }

  .difficulty-details {
    flex-direction: column;
  }
}
```

---

## Integration with Existing Games

### Memory Game Integration

**Modified File: `src/components/MemoryGame/MemoryGame.tsx`**

Key changes:
1. Add difficulty selector screen state
2. Use `useDifficulty` hook for difficulty management
3. Use `useDifficultyRecords` hook for per-difficulty records
4. Apply difficulty parameters from configuration
5. Enhanced word filtering based on difficulty

```typescript
// Key integration points (pseudocode/highlights)

import { useDifficulty } from '../../hooks/useDifficulty';
import { useDifficultyRecords } from '../../hooks/useDifficultyRecords';
import { MEMORY_CONFIG } from '../../config/difficultyConfig';
import { DifficultySelector } from '../DifficultySelector';
import { DifficultyIndicator } from '../DifficultyIndicator';
import { getRandomWordsByLength, getRandomWordsFromCategory } from '../../data/dictionary';

export const MemoryGame: React.FC<MemoryGameProps> = ({ onBack }) => {
  // Difficulty state
  const { difficulty, setDifficulty } = useDifficulty('memory');
  const { saveMemoryRecord, getRecord } = useDifficultyRecords('memory');
  const [showDifficultySelector, setShowDifficultySelector] = useState(true);

  // Get params for current difficulty
  const params = MEMORY_CONFIG[difficulty];

  // Use params.wordCount instead of stored/default value
  const [wordCount, setWordCount] = useState<number>(params.wordCount);

  // Get record for current difficulty and word count
  const currentRecords = getRecord(difficulty) as MemoryRecords;
  const record = currentRecords[wordCount] || null;

  // Initialize game with difficulty-aware word selection
  const initializeGame = useCallback(() => {
    let words: Word[];

    if (params.useSameCategory) {
      // Easy mode: words from same category
      const categories = getCategories();
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      words = getRandomWordsFromCategory(randomCategory, params.wordCount);
    } else {
      // Medium/Hard: filtered by word length
      words = getRandomWordsByLength(
        params.wordCount,
        params.wordLengthRange.min,
        params.wordLengthRange.max
      );
    }

    // ... rest of initialization using params.flipDuration, params.matchDelay
  }, [difficulty, params]);

  // Handle difficulty change
  const handleDifficultySelect = (newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);
    setShowDifficultySelector(false);
  };

  // Save record with difficulty
  useEffect(() => {
    if (matchedPairs === wordCount && matchedPairs > 0) {
      const isNew = saveMemoryRecord(difficulty, wordCount, moves);
      if (isNew) {
        setIsNewRecord(true);
      }
    }
  }, [matchedPairs, wordCount, moves, difficulty, saveMemoryRecord]);

  // Show difficulty selector first
  if (showDifficultySelector) {
    return (
      <DifficultySelector
        game="memory"
        currentDifficulty={difficulty}
        onSelect={handleDifficultySelect}
        onBack={onBack}
      />
    );
  }

  // In game header, add DifficultyIndicator
  return (
    <div className="memory-game">
      <div className="game-header">
        {/* ... existing header content ... */}
        <div className="game-stats">
          {/* ... existing stats ... */}
          <DifficultyIndicator
            difficulty={difficulty}
            onClick={() => setShowDifficultySelector(true)}
          />
        </div>
      </div>
      {/* ... rest of game ... */}
    </div>
  );
};
```

### Spelling Game Integration

**Modified File: `src/components/SpellingGame/SpellingGame.tsx`**

Key changes:
1. Filter words by length based on difficulty
2. Adjust decoy letter count using `decoyMultiplier`
3. Control hint visibility based on `hintMode`
4. Auto-pronounce on `easy` mode

```typescript
// Key integration changes

const params = SPELLING_CONFIG[difficulty];

// Word selection with length filter
const gameWords = getRandomWordsByLength(
  20,
  params.wordLengthRange.min,
  params.wordLengthRange.max
);

// Decoy letter calculation
const setupWord = useCallback((word: Word) => {
  const letters = word.english.toLowerCase().split('');
  const extraCount = Math.max(
    2,
    Math.floor(letters.length * params.decoyMultiplier)
  );
  // ...
}, [params.decoyMultiplier]);

// Hint mode handling
const handleHint = () => {
  if (params.hintMode === 'penalty') {
    // Deduct from potential score or streak
    setHintPenalty(prev => prev + 1);
  }
  setShowHint(true);
  speak(currentWord.english, 'en');
};

// Auto-pronounce on easy
useEffect(() => {
  if (params.autoPronounce && currentWord) {
    speak(currentWord.english, 'en');
  }
}, [currentWord, params.autoPronounce]);

// Hint button visibility
{params.hintMode !== 'hidden' && (
  <button className="hint-button" onClick={handleHint}>
    רמז (הגייה)
    {params.hintMode === 'penalty' && ' (-1)'}
  </button>
)}
```

### Flashcards Game Integration

**Modified File: `src/components/FlashcardsGame/FlashcardsGame.tsx`**

Key changes:
1. Adjust `choiceCount` based on difficulty
2. Implement timer for hard mode
3. Control transcription visibility
4. Modify box progression rates

```typescript
// Key integration changes

const params = FLASHCARDS_CONFIG[difficulty];

// Choice count from params
const [choiceCount, setChoiceCount] = useState(params.choiceCount);

// Timer state for hard mode
const [timeRemaining, setTimeRemaining] = useState<number | null>(
  params.timeLimit
);

// Timer effect for hard mode
useEffect(() => {
  if (params.timeLimit && !isAnswered && currentCard) {
    setTimeRemaining(params.timeLimit);

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 0) {
          // Time's up - treat as wrong answer
          handleTimeout();
          return null;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }
}, [currentCard, params.timeLimit, isAnswered]);

// Transcription visibility
const showTranscription =
  params.transcriptionMode === 'always' ||
  (params.transcriptionMode === 'question' && !isAnswered);

// Box progression from params
const updatedCards = allCards.map((card) => {
  if (card.word.id === currentCard.word.id) {
    const boxChange = isCorrect
      ? params.boxProgression.correct
      : params.boxProgression.incorrect;
    const newBox = Math.max(1, Math.min(5, card.box + boxChange));
    return { ...card, box: newBox, lastSeen: Date.now() };
  }
  return card;
});

// Timer display in UI (for hard mode)
{params.timeLimit && timeRemaining !== null && (
  <div className="timer-display">
    <div
      className="timer-bar"
      style={{ width: `${(timeRemaining / params.timeLimit) * 100}%` }}
    />
    <span className="timer-text">
      {Math.ceil(timeRemaining / 1000)}s
    </span>
  </div>
)}
```

### Hangman Game Integration

**Modified File: `src/components/HangmanGame/HangmanGame.tsx`**

Key changes:
1. Adjust `maxWrongGuesses` from params
2. Switch between limited/full keyboard
3. Control hint availability
4. Progressive transcription reveal for hard mode

```typescript
// Key integration changes

const params = HANGMAN_CONFIG[difficulty];

// Max wrong guesses from params
const MAX_WRONG_GUESSES = params.maxWrongGuesses;

// Keyboard mode
const setupWord = useCallback((word: Word) => {
  if (params.keyboardMode === 'full') {
    // Full alphabet keyboard
    setAvailableLetters('abcdefghijklmnopqrstuvwxyz'.split(''));
  } else {
    // Limited keyboard with decoys
    const wordLetters = new Set(word.english.toLowerCase().split('').filter(c => c !== ' '));
    const extraLetters = getExtraLetters(params.decoyCount, wordLetters);
    const allLetters = shuffleArray([...wordLetters, ...extraLetters]);
    setAvailableLetters(allLetters);
  }
  // ...
}, [params.keyboardMode, params.decoyCount]);

// Hint tracking
const [hintsUsed, setHintsUsed] = useState(0);

const handleHint = () => {
  if (!params.hintAllowed || hintsUsed >= params.hintLimit) return;
  setHintsUsed(prev => prev + 1);
  speak(currentWord.english, 'en');
};

// Progressive transcription for hard mode
const showTranscription =
  params.transcriptionMode === 'always' ||
  (params.transcriptionMode === 'progressive' &&
    wrongGuesses.length >= params.transcriptionRevealAt);

// Hint button in UI
{params.hintAllowed && (
  <button
    className="hint-button"
    onClick={handleHint}
    disabled={hintsUsed >= params.hintLimit}
  >
    רמז ({params.hintLimit === 99 ? 'ללא הגבלה' : `${params.hintLimit - hintsUsed} נותרו`})
  </button>
)}

// Transcription display
{showTranscription && (
  <span className="transcription-hint">({currentWord.transcription})</span>
)}
```

---

## Dictionary Enhancements

**Modified File: `src/data/dictionary.ts`**

Add new utility functions for difficulty-based word filtering:

```typescript
/**
 * Get random words filtered by English word length
 */
export function getRandomWordsByLength(
  count: number,
  minLength: number,
  maxLength: number
): Word[] {
  const filtered = dictionary.filter(
    word => word.english.length >= minLength && word.english.length <= maxLength
  );

  if (filtered.length < count) {
    console.warn(
      `Not enough words in range ${minLength}-${maxLength}. ` +
      `Requested ${count}, available ${filtered.length}`
    );
    // Fall back to all words if not enough in range
    return getRandomWords(Math.min(count, filtered.length));
  }

  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get random words from a specific category
 */
export function getRandomWordsFromCategory(
  category: Category,
  count: number
): Word[] {
  const categoryWords = getWordsByCategory(category);

  if (categoryWords.length < count) {
    // Not enough words in category, supplement from others
    const remaining = count - categoryWords.length;
    const otherWords = dictionary
      .filter(w => w.category !== category)
      .sort(() => Math.random() - 0.5)
      .slice(0, remaining);
    return [...categoryWords, ...otherWords].sort(() => Math.random() - 0.5);
  }

  const shuffled = [...categoryWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get word length distribution for analysis
 */
export function getWordLengthDistribution(): Record<number, number> {
  const distribution: Record<number, number> = {};

  for (const word of dictionary) {
    const length = word.english.length;
    distribution[length] = (distribution[length] || 0) + 1;
  }

  return distribution;
}
```

---

## State Management and Persistence

### Storage Keys

```typescript
// Centralized storage key definitions
export const STORAGE_KEYS = {
  // Difficulty settings per game
  DIFFICULTY_SETTINGS: 'learn-eng-difficulty-settings',

  // Per-difficulty records
  DIFFICULTY_RECORDS: 'learn-eng-difficulty-records',

  // Migration flag
  DIFFICULTY_MIGRATED: 'learn-eng-difficulty-migrated',

  // Legacy keys (for migration)
  LEGACY_MEMORY_RECORDS: 'learn-eng-records',
  LEGACY_SPELLING_STREAK: 'learn-eng-spelling-streak-record',
  LEGACY_HANGMAN_STREAK: 'learn-eng-hangman-streak-record',
  LEGACY_MEMORY_WORD_COUNT: 'learn-eng-word-count',
  LEGACY_FLASHCARDS_PROGRESS: 'learn-eng-flashcards-progress',
  LEGACY_FLASHCARDS_SETTINGS: 'learn-eng-flashcards-settings',
} as const;
```

### Migration Strategy

On first load after update:
1. Check for migration flag in localStorage
2. If not migrated, read existing legacy records
3. Assign all legacy records to "medium" difficulty
4. Save to new records structure
5. Set migration flag
6. Keep legacy keys intact (for rollback safety)

### Data Flow

```
User Selects Difficulty
         |
         v
useDifficulty Hook
         |
         +---> Update React State
         |
         +---> Save to localStorage (DIFFICULTY_SETTINGS)
         |
         v
Game Component Re-renders
         |
         +---> Read params from DIFFICULTY_CONFIG
         |
         +---> Initialize game with new parameters
         |
         v
User Plays Game
         |
         v
Game Completion
         |
         v
useDifficultyRecords Hook
         |
         +---> Check if new record
         |
         +---> Update React State
         |
         +---> Save to localStorage (DIFFICULTY_RECORDS)
```

---

## CSS Variables for Difficulty

**Add to `src/styles/main.css`:**

```css
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

  /* Difficulty Timing (for Memory game) */
  --flip-duration-easy: 1500ms;
  --flip-duration-medium: 1000ms;
  --flip-duration-hard: 700ms;
}
```

---

## Technical Considerations

### Performance

1. **Configuration Loading**: `DIFFICULTY_CONFIG` is imported at build time as a static object - no runtime overhead
2. **localStorage Access**: Cached in React state on mount, synced on change only
3. **Word Filtering**: Pre-filter dictionary when difficulty changes, not on every render
4. **Timer Accuracy**: Use `requestAnimationFrame` for smooth countdown display in hard mode Flashcards

### Security

1. **Data Validation**: Validate localStorage data on read, fall back to defaults on corruption
2. **Input Sanitization**: Difficulty level is constrained to enum values, no arbitrary input
3. **No Sensitive Data**: Only game preferences and scores stored locally

### Scalability

1. **Adding New Difficulties**: Add new level to `DifficultyLevel` type and corresponding configs
2. **Adding New Games**: Add game to `GameType` and create config entry
3. **Parameter Changes**: Centralized config allows easy tuning without code changes

### Error Handling

1. **Invalid Stored Difficulty**: Fall back to 'easy' for new users, 'medium' for existing
2. **localStorage Unavailable**: Graceful degradation to in-memory state (no persistence)
3. **Migration Errors**: Log warning, proceed with empty records structure

### Accessibility

1. **Focus Management**: Keyboard navigation through difficulty cards with arrow keys
2. **Screen Readers**: ARIA labels on all interactive elements
3. **Color Independence**: Stars and text labels supplement color coding
4. **Touch Targets**: Minimum 48x48px on all buttons

---

## Testing Strategy

### Unit Tests

**Types and Configuration**
```typescript
// __tests__/types/difficulty.test.ts
describe('Difficulty Types', () => {
  it('should have valid default settings for all games', () => {
    const games: GameType[] = ['memory', 'spelling', 'flashcards', 'hangman'];
    games.forEach(game => {
      expect(DEFAULT_DIFFICULTY_SETTINGS[game]).toBeDefined();
      expect(['easy', 'medium', 'hard']).toContain(DEFAULT_DIFFICULTY_SETTINGS[game]);
    });
  });

  it('should have configuration for all difficulty levels', () => {
    const levels: DifficultyLevel[] = ['easy', 'medium', 'hard'];
    levels.forEach(level => {
      expect(MEMORY_CONFIG[level]).toBeDefined();
      expect(SPELLING_CONFIG[level]).toBeDefined();
      expect(FLASHCARDS_CONFIG[level]).toBeDefined();
      expect(HANGMAN_CONFIG[level]).toBeDefined();
    });
  });
});
```

**Hooks**
```typescript
// __tests__/hooks/useDifficulty.test.ts
describe('useDifficulty', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return default difficulty for new users', () => {
    const { result } = renderHook(() => useDifficulty('memory'));
    expect(result.current.difficulty).toBe('easy');
  });

  it('should persist difficulty changes', () => {
    const { result } = renderHook(() => useDifficulty('memory'));
    act(() => {
      result.current.setDifficulty('hard');
    });
    expect(result.current.difficulty).toBe('hard');
    expect(JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY)!).memory).toBe('hard');
  });

  it('should maintain separate difficulty per game', () => {
    const { result: memory } = renderHook(() => useDifficulty('memory'));
    const { result: spelling } = renderHook(() => useDifficulty('spelling'));

    act(() => {
      memory.current.setDifficulty('hard');
    });

    expect(memory.current.difficulty).toBe('hard');
    expect(spelling.current.difficulty).toBe('easy');
  });
});
```

**Dictionary Functions**
```typescript
// __tests__/data/dictionary.test.ts
describe('getRandomWordsByLength', () => {
  it('should filter words by length range', () => {
    const words = getRandomWordsByLength(5, 3, 4);
    words.forEach(word => {
      expect(word.english.length).toBeGreaterThanOrEqual(3);
      expect(word.english.length).toBeLessThanOrEqual(4);
    });
  });

  it('should return requested count when available', () => {
    const words = getRandomWordsByLength(5, 3, 6);
    expect(words.length).toBe(5);
  });
});
```

### Component Tests

```typescript
// __tests__/components/DifficultySelector.test.tsx
describe('DifficultySelector', () => {
  it('should render all difficulty options', () => {
    render(
      <DifficultySelector
        game="memory"
        currentDifficulty="easy"
        onSelect={jest.fn()}
        onBack={jest.fn()}
      />
    );

    expect(screen.getByText('קל')).toBeInTheDocument();
    expect(screen.getByText('בינוני')).toBeInTheDocument();
    expect(screen.getByText('קשה')).toBeInTheDocument();
  });

  it('should call onSelect with selected difficulty', () => {
    const onSelect = jest.fn();
    render(
      <DifficultySelector
        game="memory"
        currentDifficulty="easy"
        onSelect={onSelect}
        onBack={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText('קשה'));
    fireEvent.click(screen.getByText('התחל משחק'));

    expect(onSelect).toHaveBeenCalledWith('hard');
  });

  it('should show game-specific descriptions', () => {
    render(
      <DifficultySelector
        game="memory"
        currentDifficulty="easy"
        onSelect={jest.fn()}
        onBack={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText('מה משתנה בכל רמה?'));

    expect(screen.getByText('4 זוגות מילים')).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
// __tests__/integration/memoryGameDifficulty.test.tsx
describe('Memory Game Difficulty Integration', () => {
  it('should show difficulty selector on game start', () => {
    render(<MemoryGame onBack={jest.fn()} />);
    expect(screen.getByText('בחר רמת קושי')).toBeInTheDocument();
  });

  it('should start game with correct word count for easy', async () => {
    render(<MemoryGame onBack={jest.fn()} />);

    fireEvent.click(screen.getByText('קל'));
    fireEvent.click(screen.getByText('התחל משחק'));

    await waitFor(() => {
      // 4 pairs = 8 cards
      const cards = screen.getAllByRole('button', { name: /card/i });
      expect(cards.length).toBe(8);
    });
  });

  it('should save record with difficulty context', async () => {
    localStorage.clear();
    render(<MemoryGame onBack={jest.fn()} />);

    // Select hard difficulty
    fireEvent.click(screen.getByText('קשה'));
    fireEvent.click(screen.getByText('התחל משחק'));

    // Complete game (mock)
    // ...

    const records = JSON.parse(localStorage.getItem(RECORDS_STORAGE_KEY)!);
    expect(records.memory.hard).toBeDefined();
  });
});
```

### E2E Tests (Cypress)

```typescript
// cypress/e2e/difficulty.cy.ts
describe('Difficulty System', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('should allow selecting difficulty before each game', () => {
    cy.contains('משחק זיכרון').click();
    cy.contains('בחר רמת קושי').should('be.visible');
    cy.contains('קל').click();
    cy.contains('התחל משחק').click();
    cy.contains('זוגות: 0/4').should('be.visible');
  });

  it('should remember difficulty per game', () => {
    // Set memory to hard
    cy.contains('משחק זיכרון').click();
    cy.contains('קשה').click();
    cy.contains('התחל משחק').click();
    cy.contains('חזרה לתפריט').click();

    // Set spelling to easy
    cy.contains('איות').click();
    cy.contains('קל').click();
    cy.contains('התחל משחק').click();
    cy.contains('חזרה לתפריט').click();

    // Verify memory still hard
    cy.contains('משחק זיכרון').click();
    cy.get('[aria-pressed="true"]').should('contain', 'קשה');
  });

  it('should persist difficulty across sessions', () => {
    cy.contains('משחק זיכרון').click();
    cy.contains('בינוני').click();
    cy.contains('התחל משחק').click();

    cy.reload();

    cy.contains('משחק זיכרון').click();
    cy.get('[aria-pressed="true"]').should('contain', 'בינוני');
  });
});
```

---

## Implementation Plan

### Phase 1: Core Infrastructure (2-3 days)

**Priority: P0 - Required for all subsequent work**

1. **Create Type Definitions** (`src/types/difficulty.ts`)
   - All interfaces and types
   - Default values and constants
   - Complexity: Low

2. **Create Configuration File** (`src/config/difficultyConfig.ts`)
   - All game parameters per difficulty
   - Difficulty descriptions
   - Complexity: Low

3. **Implement `useDifficulty` Hook** (`src/hooks/useDifficulty.ts`)
   - State management
   - localStorage persistence
   - Complexity: Medium

4. **Implement `useDifficultyRecords` Hook** (`src/hooks/useDifficultyRecords.ts`)
   - Per-difficulty records management
   - Migration logic for existing records
   - Complexity: Medium

5. **Update Dictionary** (`src/data/dictionary.ts`)
   - Add `getRandomWordsByLength` function
   - Add `getRandomWordsFromCategory` function
   - Complexity: Low

### Phase 2: UI Components (2 days)

**Priority: P0 - Required for user interaction**

1. **Create DifficultySelector Component**
   - Main selector screen
   - DifficultyCard subcomponent
   - DifficultyDetails subcomponent
   - CSS styling
   - Complexity: Medium

2. **Create DifficultyIndicator Component**
   - In-game badge
   - Complexity: Low

3. **Add CSS Variables**
   - Difficulty colors
   - Timing variables
   - Complexity: Low

### Phase 3: Game Integration (3-4 days)

**Priority: P0 - Core feature delivery**

1. **Memory Game Integration** (1 day)
   - Simplest integration, good template
   - Dependencies: Phase 1 + 2
   - Complexity: Medium

2. **Spelling Game Integration** (0.5 days)
   - Similar pattern to Memory
   - Dependencies: Memory done
   - Complexity: Medium

3. **Hangman Game Integration** (0.5 days)
   - Similar pattern with hint logic
   - Dependencies: Spelling done
   - Complexity: Medium

4. **Flashcards Game Integration** (1.5 days)
   - Most complex: timer, box progression
   - Dependencies: Others done
   - Complexity: High

### Phase 4: Testing and Polish (2 days)

**Priority: P1 - Quality assurance**

1. **Unit Tests**
   - Types, config, hooks, dictionary
   - Complexity: Medium

2. **Component Tests**
   - DifficultySelector, DifficultyIndicator
   - Complexity: Medium

3. **Integration Tests**
   - Each game with difficulty
   - Complexity: Medium

4. **Accessibility Audit**
   - Keyboard navigation
   - Screen reader testing
   - Complexity: Low

5. **Bug Fixes and Polish**
   - Edge cases
   - Visual refinements
   - Complexity: Variable

### Phase 5: Future Enhancements (Post-MVP)

**Priority: P2 - Nice to have**

1. **In-Game Difficulty Change Modal** (Phase 2 from design doc)
   - Change difficulty from game header
   - Confirm restart
   - Estimated: 1 day

2. **Progression Recommendations** (Phase 2 from design doc)
   - Track performance per difficulty
   - Show upgrade suggestions
   - Estimated: 2 days

3. **Enhanced Distractors for Hard Flashcards**
   - Phonetically similar words
   - Same category words
   - Estimated: 1 day

### Dependencies Graph

```
Phase 1 (Types & Hooks)
         |
         v
Phase 2 (UI Components)
         |
         v
Phase 3.1 (Memory Game)
         |
    +----+----+
    |         |
    v         v
Phase 3.2  Phase 3.3
(Spelling) (Hangman)
    |         |
    +----+----+
         |
         v
Phase 3.4 (Flashcards)
         |
         v
Phase 4 (Testing)
         |
         v
Phase 5 (Enhancements)
```

### Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Not enough long words in dictionary | Cannot sustain hard mode | Medium | Audit word distribution; expand dictionary if needed |
| localStorage quota exceeded | Data loss | Low | Monitor storage size; implement cleanup for old data |
| Timer accuracy issues on mobile | Poor UX on hard Flashcards | Medium | Use requestAnimationFrame; test on real devices |
| Migration breaks existing records | User frustration | Medium | Keep legacy keys; implement rollback capability |
| Accessibility issues discovered late | Delays launch | Medium | Include a11y testing in each phase |

---

## Open Questions

1. **Timer Timeout Behavior**: Should timeout in hard Flashcards count as wrong answer or skip without penalty?
   - Current assumption: Wrong answer (to maintain challenge)

2. **Records Display**: Show best record across all difficulties or only current difficulty?
   - Current assumption: Show current difficulty record, with option to view all in settings

3. **Word Pool for Hard Mode**: The dictionary analysis shows only 23 words with 6+ letters. Is this sufficient?
   - Recommendation: May need to expand dictionary for sustained hard mode play

4. **First-Time User Experience**: Should there be an onboarding tooltip explaining the difficulty system?
   - Current assumption: Selector screen is self-explanatory; defer to user research

---

## Assumptions

1. **Three levels sufficient**: Easy/Medium/Hard covers user needs without overwhelming choices
2. **Existing records map to Medium**: Current game behavior most closely matches medium difficulty
3. **Difficulty is per-game**: Users want independent difficulty settings per game
4. **New users start on Easy**: Beginners benefit from easy mode, advanced users will quickly change
5. **Word length correlates with difficulty**: Longer words are generally harder to learn
6. **No server-side persistence**: All data stored in localStorage (consistent with existing architecture)
7. **No multiplayer/leaderboards**: Records are personal, not competitive

---

## Appendix: Word Length Distribution Analysis

Based on current dictionary (110 words):

| Length | Count | Examples | Difficulty Suitability |
|--------|-------|----------|------------------------|
| 2 letters | 2 | go, to | Easy only |
| 3 letters | 28 | cat, dog, sun | Easy |
| 4 letters | 35 | fish, bird, milk | Easy/Medium |
| 5 letters | 22 | apple, horse, water | Medium |
| 6 letters | 14 | orange, rabbit, yellow | Medium/Hard |
| 7+ letters | 9 | chicken, elephant, bathroom | Hard |

**Analysis:**
- Easy mode (2-4 letters): 65 words available - sufficient
- Medium mode (4-6 letters): 71 words available - sufficient
- Hard mode (6+ letters): 23 words available - may need expansion for variety

**Recommendation:** Consider adding more 7+ letter words to the dictionary before Phase 3.4 (Flashcards hard mode).

---

*End of Technical Design Document*
