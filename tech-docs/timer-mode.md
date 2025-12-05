# Technical Design: Timer Mode Option

## Overview

This document provides a comprehensive technical design for implementing the Timer Mode feature across all four games in the learn-eng application (Memory, Spelling, Flashcards, Hangman). The feature adds optional countdown timers to create time-based challenges with speed-based feedback and performance tracking.

**Design Document Reference:** `/design-docs/timer-mode.md`

---

## 1. Requirements Summary

### Functional Requirements (from Design Doc)

| ID | Requirement | Priority |
|----|-------------|----------|
| US-1 | Toggle timer mode on/off before starting a game | MVP |
| US-2 | Display countdown timer during gameplay | MVP |
| US-3 | Handle time-out as incorrect answer | MVP |
| US-4 | Award time bonuses for fast correct answers | Phase 2 |
| US-5 | Display speed performance feedback at game end | Phase 2 |
| US-6 | Quick timer toggle from game header | Phase 3 |
| US-7 | Separate timed/untimed records | Phase 2 |

### Non-Functional Requirements

- Timer updates must be smooth (100ms precision minimum)
- Timer must pause when browser tab loses focus
- Timer state must persist across sessions (per-game preference)
- Visual feedback must meet WCAG 2.1 AA contrast requirements
- Animations should be performant (CSS-based, not JS-driven)

---

## 2. Architecture Overview

### 2.1 System Context

```
+------------------------------------------+
|              App.tsx                      |
|  - Routes to game components              |
|  - Manages currentGame state              |
+------------------------------------------+
              |
              v
+------------------------------------------+
|           Game Components                 |
|  - MemoryGame                            |
|  - SpellingGame                          |
|  - FlashcardsGame                        |
|  - HangmanGame                           |
|                                          |
|  [NEW] Each game integrates:             |
|  - useGameTimer hook                     |
|  - TimerDisplay component                |
|  - TimerToggle (on start screen)         |
+------------------------------------------+
              |
              v
+------------------------------------------+
|         Timer Infrastructure              |
|  [NEW]                                   |
|  - useGameTimer (custom hook)            |
|  - useTimerSettings (persistence hook)   |
|  - TimerDisplay (UI component)           |
|  - TimerToggle (UI component)            |
|  - TimeBonusPopup (UI component)         |
|  - TimeUpOverlay (UI component)          |
|  - SpeedSummary (UI component)           |
+------------------------------------------+
              |
              v
+------------------------------------------+
|         Storage Layer                     |
|  - localStorage for timer settings       |
|  - localStorage for timed records        |
+------------------------------------------+
```

### 2.2 New File Structure

```
src/
+-- types/
|   +-- timer.ts                    [NEW] TypeScript interfaces
|
+-- config/
|   +-- timerConfig.ts              [NEW] Timer parameters per game
|
+-- hooks/
|   +-- useGameTimer.ts             [NEW] Core timer logic
|   +-- useTimerSettings.ts         [NEW] Settings persistence
|
+-- components/
|   +-- timer/                      [NEW] Timer-related components
|   |   +-- TimerDisplay.tsx
|   |   +-- TimerDisplay.css
|   |   +-- TimerToggle.tsx
|   |   +-- TimeBonusPopup.tsx
|   |   +-- TimeUpOverlay.tsx
|   |   +-- SpeedSummary.tsx
|   |   +-- index.ts
|   |
|   +-- MemoryGame/
|   |   +-- MemoryGame.tsx          [MODIFY] Add timer integration
|   |
|   +-- SpellingGame/
|   |   +-- SpellingGame.tsx        [MODIFY] Add timer integration
|   |
|   +-- FlashcardsGame/
|   |   +-- FlashcardsGame.tsx      [MODIFY] Add timer integration
|   |
|   +-- HangmanGame/
|       +-- HangmanGame.tsx         [MODIFY] Add timer integration
|
+-- styles/
    +-- main.css                    [MODIFY] Add timer styles
```

---

## 3. Data Models and TypeScript Interfaces

### 3.1 Core Timer Types (`src/types/timer.ts`)

```typescript
/**
 * Timer mode configuration for a single game
 */
export interface TimerSettings {
  /** Whether timer mode is enabled for this game */
  enabled: boolean;
  /** Accessibility multiplier for extended time (future) */
  durationMultiplier?: number;
}

/**
 * Timer settings for all games, stored in localStorage
 */
export interface GameTimerSettings {
  memory: TimerSettings;
  spelling: TimerSettings;
  flashcards: TimerSettings;
  hangman: TimerSettings;
}

/**
 * Game type identifier (matches existing GameType but without null)
 */
export type TimerGameType = 'memory' | 'spelling' | 'flashcards' | 'hangman';

/**
 * Timer state during active gameplay
 */
export interface TimerState {
  /** Whether timer is currently counting down */
  isRunning: boolean;
  /** Whether timer is paused (e.g., during feedback) */
  isPaused: boolean;
  /** Total time allocated for this round/game in milliseconds */
  totalTime: number;
  /** Current remaining time in milliseconds */
  remainingTime: number;
  /** Total bonus time earned this session */
  bonusEarned: number;
  /** Time when current item/question started */
  itemStartTime: number;
}

/**
 * Timer display state for UI rendering
 */
export type TimerDisplayState = 'normal' | 'warning' | 'critical';

/**
 * Response time data for a single answer
 */
export interface ResponseTimeData {
  /** Time taken to answer in milliseconds */
  responseTime: number;
  /** Whether the answer was correct */
  wasCorrect: boolean;
  /** Bonus time awarded (if any) */
  bonusAwarded: number;
}

/**
 * Speed performance data for end-of-game summary
 */
export interface SpeedPerformance {
  /** Average response time in milliseconds */
  averageTime: number;
  /** Fastest response time in milliseconds */
  fastestTime: number;
  /** Number of timeouts */
  timeoutCount: number;
  /** All response times for detailed analysis */
  responseTimes: ResponseTimeData[];
}

/**
 * Speed rating thresholds and labels
 */
export interface SpeedRating {
  /** Maximum time for this rating (ms) */
  maxTime: number;
  /** Display label */
  label: string;
  /** Hebrew label */
  labelHe: string;
  /** Associated color */
  color: string;
}

/**
 * Timed records structure for persistence
 */
export interface TimedRecords {
  memory: {
    [wordCount: number]: {
      bestRemainingTime: number;
      bestMoves: number;
      achievedAt: number; // timestamp
    };
  };
  spelling: {
    bestStreak: number;
    bestAverageTime: number;
    achievedAt: number;
  };
  flashcards: {
    bestAverageTime: number;
    achievedAt: number;
  };
  hangman: {
    bestStreak: number;
    bestAverageTime: number;
    achievedAt: number;
  };
}

/**
 * Configuration for a specific game's timer behavior
 */
export interface GameTimerConfig {
  /** Base time in milliseconds */
  baseTime: number;
  /** Additional time per item (pairs for Memory, etc.) */
  timePerItem?: number;
  /** Maximum bonus time awardable */
  maxBonus: number;
  /** Divisor for bonus calculation: bonus = remaining / divisor */
  bonusDivisor: number;
  /** Time threshold for warning state (ms) */
  warningThreshold: number;
  /** Time threshold for critical state (ms) */
  criticalThreshold: number;
  /** For Memory: threshold for quick match bonus (ms) */
  quickMatchThreshold?: number;
  /** For Hangman: bonus per correct letter (ms) */
  correctLetterBonus?: number;
}
```

### 3.2 Hook Return Types

```typescript
/**
 * Return type for useGameTimer hook
 */
export interface UseGameTimerReturn {
  /** Current remaining time in milliseconds */
  remainingTime: number;
  /** Whether timer is actively counting down */
  isRunning: boolean;
  /** Whether timer is in warning state */
  isWarning: boolean;
  /** Whether timer is in critical state */
  isCritical: boolean;
  /** Current display state for styling */
  displayState: TimerDisplayState;
  /** Start the timer */
  start: () => void;
  /** Pause the timer (preserves remaining time) */
  pause: () => void;
  /** Resume a paused timer */
  resume: () => void;
  /** Reset timer to initial or specified time */
  reset: (newTime?: number) => void;
  /** Add bonus time to remaining */
  addBonus: (bonus: number) => number; // returns actual bonus added
  /** Get elapsed time since start/reset */
  getElapsedTime: () => number;
  /** Get time since item started (for response time tracking) */
  getItemTime: () => number;
  /** Mark start of new item (for per-item timing) */
  startItem: () => void;
}

/**
 * Return type for useTimerSettings hook
 */
export interface UseTimerSettingsReturn {
  /** Current settings for all games */
  settings: GameTimerSettings;
  /** Get setting for a specific game */
  isTimerEnabled: (game: TimerGameType) => boolean;
  /** Toggle timer for a specific game */
  toggleTimer: (game: TimerGameType) => void;
  /** Set timer state for a specific game */
  setTimerEnabled: (game: TimerGameType, enabled: boolean) => void;
  /** Get timed records */
  timedRecords: TimedRecords;
  /** Update a timed record */
  updateTimedRecord: (game: TimerGameType, data: Partial<TimedRecords[TimerGameType]>) => boolean;
}
```

---

## 4. Timer Configuration (`src/config/timerConfig.ts`)

```typescript
import { GameTimerConfig, SpeedRating, GameTimerSettings, TimedRecords } from '../types/timer';

/**
 * Timer configuration per game
 * All times in milliseconds
 */
export const TIMER_CONFIG: Record<string, GameTimerConfig> = {
  memory: {
    baseTime: 60000,           // 60 seconds base
    timePerItem: 10000,        // +10 seconds per pair
    maxBonus: 5000,            // +5 seconds for quick match
    bonusDivisor: 1,           // Full bonus for quick matches
    warningThreshold: 20000,   // 20 seconds
    criticalThreshold: 10000,  // 10 seconds
    quickMatchThreshold: 3000, // Match within 3s of first flip
  },

  spelling: {
    baseTime: 30000,           // 30 seconds per word
    maxBonus: 10000,           // +10 seconds max
    bonusDivisor: 3,           // Bonus = remaining / 3
    warningThreshold: 10000,   // 10 seconds
    criticalThreshold: 5000,   // 5 seconds
  },

  flashcards: {
    baseTime: 15000,           // 15 seconds per card
    maxBonus: 5000,            // +5 seconds max
    bonusDivisor: 3,           // Bonus = remaining / 3
    warningThreshold: 5000,    // 5 seconds
    criticalThreshold: 3000,   // 3 seconds
  },

  hangman: {
    baseTime: 45000,           // 45 seconds per word
    maxBonus: 0,               // No time bonus (gets letter bonus instead)
    bonusDivisor: 1,
    warningThreshold: 15000,   // 15 seconds
    criticalThreshold: 8000,   // 8 seconds
    correctLetterBonus: 3000,  // +3 seconds per correct letter
  },
} as const;

/**
 * Speed rating thresholds (based on average response time)
 */
export const SPEED_RATINGS: SpeedRating[] = [
  { maxTime: 2000, label: 'Lightning Fast', labelHe: 'מהירות ברק', color: '#FFD700' },
  { maxTime: 4000, label: 'Quick Reflexes', labelHe: 'רפלקסים מהירים', color: '#4CAF50' },
  { maxTime: 6000, label: 'Good Pace', labelHe: 'קצב טוב', color: '#2196F3' },
  { maxTime: 10000, label: 'Keep Practicing', labelHe: 'המשך להתאמן', color: '#9E9E9E' },
  { maxTime: Infinity, label: 'Take Your Time', labelHe: 'קח את הזמן', color: '#757575' },
];

/**
 * Get speed rating based on average response time
 */
export function getSpeedRating(averageTimeMs: number): SpeedRating {
  return SPEED_RATINGS.find(rating => averageTimeMs <= rating.maxTime) || SPEED_RATINGS[SPEED_RATINGS.length - 1];
}

/**
 * Calculate bonus time based on remaining time
 */
export function calculateBonus(remainingTime: number, config: GameTimerConfig): number {
  const rawBonus = Math.floor(remainingTime / config.bonusDivisor);
  return Math.min(rawBonus, config.maxBonus);
}

/**
 * Calculate total time for Memory game based on pair count
 */
export function calculateMemoryTotalTime(pairCount: number): number {
  const config = TIMER_CONFIG.memory;
  return config.baseTime + (pairCount * (config.timePerItem || 0));
}

/**
 * localStorage keys
 */
export const STORAGE_KEYS = {
  TIMER_SETTINGS: 'learn-eng-timer-settings',
  TIMED_RECORDS: 'learn-eng-timed-records',
} as const;

/**
 * Default timer settings (all disabled by default)
 */
export const DEFAULT_TIMER_SETTINGS: GameTimerSettings = {
  memory: { enabled: false },
  spelling: { enabled: false },
  flashcards: { enabled: false },
  hangman: { enabled: false },
};

/**
 * Default timed records structure
 */
export const DEFAULT_TIMED_RECORDS: TimedRecords = {
  memory: {},
  spelling: { bestStreak: 0, bestAverageTime: Infinity, achievedAt: 0 },
  flashcards: { bestAverageTime: Infinity, achievedAt: 0 },
  hangman: { bestStreak: 0, bestAverageTime: Infinity, achievedAt: 0 },
};

/**
 * Format time for display (mm:ss or ss format)
 */
export function formatTime(ms: number, showMinutes: boolean = true): string {
  const totalSeconds = Math.ceil(ms / 1000);
  if (!showMinutes || totalSeconds < 60) {
    return `${totalSeconds}`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Format time with milliseconds for detailed display
 */
export function formatTimeDetailed(ms: number): string {
  const seconds = (ms / 1000).toFixed(1);
  return `${seconds}s`;
}
```

---

## 5. Custom Hooks

### 5.1 useGameTimer Hook (`src/hooks/useGameTimer.ts`)

```typescript
import { useState, useEffect, useCallback, useRef } from 'react';
import { UseGameTimerReturn, TimerDisplayState } from '../types/timer';

export interface UseGameTimerOptions {
  /** Total time for the timer in milliseconds */
  totalTime: number;
  /** Callback when timer reaches zero */
  onTimeUp: () => void;
  /** Callback when timer enters warning state */
  onWarning?: () => void;
  /** Callback when timer enters critical state */
  onCritical?: () => void;
  /** Time threshold for warning state (ms) */
  warningThreshold?: number;
  /** Time threshold for critical state (ms) */
  criticalThreshold?: number;
  /** Whether timer should start paused */
  startPaused?: boolean;
  /** Whether timer mode is enabled */
  enabled?: boolean;
}

const UPDATE_INTERVAL = 100; // Update every 100ms for smooth countdown

export function useGameTimer({
  totalTime,
  onTimeUp,
  onWarning,
  onCritical,
  warningThreshold = 10000,
  criticalThreshold = 5000,
  startPaused = true,
  enabled = true,
}: UseGameTimerOptions): UseGameTimerReturn {
  const [remainingTime, setRemainingTime] = useState(totalTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(startPaused);

  // Refs for callback stability and tracking
  const itemStartTimeRef = useRef<number>(Date.now());
  const hasCalledWarningRef = useRef(false);
  const hasCalledCriticalRef = useRef(false);
  const onTimeUpRef = useRef(onTimeUp);
  const onWarningRef = useRef(onWarning);
  const onCriticalRef = useRef(onCritical);

  // Update callback refs
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
    onWarningRef.current = onWarning;
    onCriticalRef.current = onCritical;
  }, [onTimeUp, onWarning, onCritical]);

  // Computed state
  const isWarning = remainingTime <= warningThreshold && remainingTime > criticalThreshold;
  const isCritical = remainingTime <= criticalThreshold && remainingTime > 0;

  const displayState: TimerDisplayState =
    isCritical ? 'critical' :
    isWarning ? 'warning' :
    'normal';

  // Handle visibility change (pause when tab hidden)
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) {
        setIsPaused(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, isRunning]);

  // Main timer effect
  useEffect(() => {
    if (!enabled || !isRunning || isPaused) return;

    const interval = setInterval(() => {
      setRemainingTime(prev => {
        const newTime = Math.max(0, prev - UPDATE_INTERVAL);

        // Check for warning threshold crossing
        if (prev > warningThreshold && newTime <= warningThreshold && !hasCalledWarningRef.current) {
          hasCalledWarningRef.current = true;
          onWarningRef.current?.();
        }

        // Check for critical threshold crossing
        if (prev > criticalThreshold && newTime <= criticalThreshold && !hasCalledCriticalRef.current) {
          hasCalledCriticalRef.current = true;
          onCriticalRef.current?.();
        }

        // Check for time up
        if (newTime === 0) {
          setIsRunning(false);
          // Use setTimeout to avoid state update during render
          setTimeout(() => onTimeUpRef.current(), 0);
        }

        return newTime;
      });
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [enabled, isRunning, isPaused, warningThreshold, criticalThreshold]);

  const start = useCallback(() => {
    if (!enabled) return;
    setIsRunning(true);
    setIsPaused(false);
    itemStartTimeRef.current = Date.now();
  }, [enabled]);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (!enabled) return;
    setIsPaused(false);
  }, [enabled]);

  const reset = useCallback((newTime?: number) => {
    const time = newTime ?? totalTime;
    setRemainingTime(time);
    setIsRunning(false);
    setIsPaused(true);
    hasCalledWarningRef.current = false;
    hasCalledCriticalRef.current = false;
    itemStartTimeRef.current = Date.now();
  }, [totalTime]);

  const addBonus = useCallback((bonus: number): number => {
    const actualBonus = Math.max(0, bonus);
    setRemainingTime(prev => prev + actualBonus);
    return actualBonus;
  }, []);

  const getElapsedTime = useCallback((): number => {
    return totalTime - remainingTime;
  }, [totalTime, remainingTime]);

  const getItemTime = useCallback((): number => {
    return Date.now() - itemStartTimeRef.current;
  }, []);

  const startItem = useCallback(() => {
    itemStartTimeRef.current = Date.now();
  }, []);

  return {
    remainingTime,
    isRunning,
    isWarning,
    isCritical,
    displayState,
    start,
    pause,
    resume,
    reset,
    addBonus,
    getElapsedTime,
    getItemTime,
    startItem,
  };
}
```

### 5.2 useTimerSettings Hook (`src/hooks/useTimerSettings.ts`)

```typescript
import { useState, useCallback, useEffect } from 'react';
import {
  GameTimerSettings,
  TimerGameType,
  TimedRecords,
  UseTimerSettingsReturn
} from '../types/timer';
import {
  STORAGE_KEYS,
  DEFAULT_TIMER_SETTINGS,
  DEFAULT_TIMED_RECORDS
} from '../config/timerConfig';

/**
 * Load settings from localStorage with fallback to defaults
 */
function loadSettings(): GameTimerSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TIMER_SETTINGS);
    if (stored) {
      return { ...DEFAULT_TIMER_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn('Failed to load timer settings:', e);
  }
  return DEFAULT_TIMER_SETTINGS;
}

/**
 * Load timed records from localStorage with fallback to defaults
 */
function loadTimedRecords(): TimedRecords {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TIMED_RECORDS);
    if (stored) {
      return { ...DEFAULT_TIMED_RECORDS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn('Failed to load timed records:', e);
  }
  return DEFAULT_TIMED_RECORDS;
}

/**
 * Save settings to localStorage
 */
function saveSettings(settings: GameTimerSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TIMER_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save timer settings:', e);
  }
}

/**
 * Save timed records to localStorage
 */
function saveTimedRecords(records: TimedRecords): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TIMED_RECORDS, JSON.stringify(records));
  } catch (e) {
    console.warn('Failed to save timed records:', e);
  }
}

/**
 * Hook for managing timer settings and timed records
 */
export function useTimerSettings(): UseTimerSettingsReturn {
  const [settings, setSettings] = useState<GameTimerSettings>(loadSettings);
  const [timedRecords, setTimedRecords] = useState<TimedRecords>(loadTimedRecords);

  // Persist settings changes
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Persist record changes
  useEffect(() => {
    saveTimedRecords(timedRecords);
  }, [timedRecords]);

  const isTimerEnabled = useCallback((game: TimerGameType): boolean => {
    return settings[game]?.enabled ?? false;
  }, [settings]);

  const toggleTimer = useCallback((game: TimerGameType): void => {
    setSettings(prev => ({
      ...prev,
      [game]: {
        ...prev[game],
        enabled: !prev[game].enabled,
      },
    }));
  }, []);

  const setTimerEnabled = useCallback((game: TimerGameType, enabled: boolean): void => {
    setSettings(prev => ({
      ...prev,
      [game]: {
        ...prev[game],
        enabled,
      },
    }));
  }, []);

  const updateTimedRecord = useCallback((
    game: TimerGameType,
    data: Partial<TimedRecords[TimerGameType]>
  ): boolean => {
    let isNewRecord = false;

    setTimedRecords(prev => {
      const current = prev[game];
      const updated = { ...current, ...data, achievedAt: Date.now() };

      // Check if this is actually a new record
      if (game === 'memory') {
        // Memory has per-wordCount records, handled differently
        isNewRecord = true;
      } else if ('bestStreak' in updated && 'bestStreak' in current) {
        isNewRecord = updated.bestStreak > (current as any).bestStreak;
      } else if ('bestAverageTime' in updated && 'bestAverageTime' in current) {
        isNewRecord = updated.bestAverageTime < (current as any).bestAverageTime;
      }

      return {
        ...prev,
        [game]: updated,
      };
    });

    return isNewRecord;
  }, []);

  return {
    settings,
    isTimerEnabled,
    toggleTimer,
    setTimerEnabled,
    timedRecords,
    updateTimedRecord,
  };
}
```

---

## 6. Timer UI Components

### 6.1 TimerDisplay Component (`src/components/timer/TimerDisplay.tsx`)

```typescript
import React, { memo } from 'react';
import { TimerDisplayState } from '../../types/timer';
import { formatTime } from '../../config/timerConfig';
import './TimerDisplay.css';

export interface TimerDisplayProps {
  /** Remaining time in milliseconds */
  remainingTime: number;
  /** Current display state */
  displayState: TimerDisplayState;
  /** Whether to show minutes in display */
  showMinutes?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Whether timer is visible (for conditional rendering) */
  visible?: boolean;
}

/**
 * Displays the countdown timer with state-based styling
 */
export const TimerDisplay: React.FC<TimerDisplayProps> = memo(({
  remainingTime,
  displayState,
  showMinutes = true,
  className = '',
  visible = true,
}) => {
  if (!visible) return null;

  const timeString = formatTime(remainingTime, showMinutes);

  return (
    <div
      className={`timer-display ${displayState} ${className}`}
      role="timer"
      aria-live="polite"
      aria-label={`${Math.ceil(remainingTime / 1000)} seconds remaining`}
    >
      <span className="timer-icon">&#x23F1;</span>
      <span className="timer-value">{timeString}</span>
    </div>
  );
});

TimerDisplay.displayName = 'TimerDisplay';
```

### 6.2 TimerDisplay Styles (`src/components/timer/TimerDisplay.css`)

```css
/* Timer Display Component Styles */

.timer-display {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.1s ease;
  user-select: none;
}

.timer-icon {
  font-size: 0.9em;
}

.timer-value {
  min-width: 2.5ch;
  text-align: center;
}

/* Normal state */
.timer-display.normal {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

/* Warning state (10s remaining) */
.timer-display.warning {
  background: rgba(255, 152, 0, 0.25);
  color: #FFB74D;
  animation: timer-pulse-warning 1s ease-in-out infinite;
}

/* Critical state (5s remaining) */
.timer-display.critical {
  background: rgba(244, 67, 54, 0.25);
  color: #EF5350;
  animation: timer-pulse-critical 0.5s ease-in-out infinite;
}

@keyframes timer-pulse-warning {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes timer-pulse-critical {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.85;
  }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .timer-display.warning,
  .timer-display.critical {
    animation: none;
  }
}
```

### 6.3 TimerToggle Component (`src/components/timer/TimerToggle.tsx`)

```typescript
import React, { memo } from 'react';

export interface TimerToggleProps {
  /** Whether timer is currently enabled */
  enabled: boolean;
  /** Callback when toggle is clicked */
  onToggle: () => void;
  /** Description text when disabled */
  offDescription?: string;
  /** Description text when enabled */
  onDescription?: string;
  /** Additional CSS class */
  className?: string;
  /** Whether the toggle is disabled */
  disabled?: boolean;
}

/**
 * Toggle switch for enabling/disabling timer mode
 */
export const TimerToggle: React.FC<TimerToggleProps> = memo(({
  enabled,
  onToggle,
  offDescription = 'שחק בקצב שלך',
  onDescription = 'אתגר מבוסס זמן',
  className = '',
  disabled = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) onToggle();
    }
  };

  return (
    <div className={`timer-toggle-container ${className}`}>
      <div
        className={`timer-toggle ${enabled ? 'on' : 'off'} ${disabled ? 'disabled' : ''}`}
        onClick={disabled ? undefined : onToggle}
        onKeyDown={handleKeyDown}
        role="switch"
        aria-checked={enabled}
        aria-label="Timer mode"
        tabIndex={disabled ? -1 : 0}
      >
        <span className="timer-toggle-label">
          <span className="timer-toggle-icon">&#x23F1;</span>
          <span className="timer-toggle-text">מצב טיימר</span>
        </span>

        <div className="timer-toggle-switch">
          <div className="timer-toggle-handle" />
        </div>

        <span className="timer-toggle-state">
          {enabled ? 'פעיל' : 'כבוי'}
        </span>
      </div>

      <p className="timer-toggle-description">
        {enabled ? onDescription : offDescription}
      </p>
    </div>
  );
});

TimerToggle.displayName = 'TimerToggle';
```

### 6.4 TimeBonusPopup Component (`src/components/timer/TimeBonusPopup.tsx`)

```typescript
import React, { useEffect, useState, memo } from 'react';

export interface TimeBonusPopupProps {
  /** Bonus amount in milliseconds */
  bonus: number;
  /** Unique key to trigger new animation */
  triggerKey: number;
  /** Position relative to timer */
  position?: 'left' | 'right';
}

/**
 * Animated popup showing time bonus awarded
 */
export const TimeBonusPopup: React.FC<TimeBonusPopupProps> = memo(({
  bonus,
  triggerKey,
  position = 'right',
}) => {
  const [visible, setVisible] = useState(false);
  const [displayBonus, setDisplayBonus] = useState(0);

  useEffect(() => {
    if (bonus > 0 && triggerKey > 0) {
      setDisplayBonus(bonus);
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [bonus, triggerKey]);

  if (!visible) return null;

  const seconds = Math.round(bonus / 1000);

  return (
    <div
      className={`time-bonus-popup ${position}`}
      aria-live="polite"
      aria-label={`Plus ${seconds} seconds bonus`}
    >
      +{seconds}s!
    </div>
  );
});

TimeBonusPopup.displayName = 'TimeBonusPopup';
```

### 6.5 TimeUpOverlay Component (`src/components/timer/TimeUpOverlay.tsx`)

```typescript
import React, { useEffect, memo } from 'react';

export interface TimeUpOverlayProps {
  /** Whether overlay is visible */
  visible: boolean;
  /** The correct answer to display */
  correctAnswer: string;
  /** Callback when overlay should dismiss */
  onDismiss: () => void;
  /** Auto-dismiss delay in ms (0 to disable) */
  autoDismissDelay?: number;
}

/**
 * Overlay shown when timer expires
 */
export const TimeUpOverlay: React.FC<TimeUpOverlayProps> = memo(({
  visible,
  correctAnswer,
  onDismiss,
  autoDismissDelay = 2000,
}) => {
  useEffect(() => {
    if (visible && autoDismissDelay > 0) {
      const timer = setTimeout(onDismiss, autoDismissDelay);
      return () => clearTimeout(timer);
    }
  }, [visible, autoDismissDelay, onDismiss]);

  if (!visible) return null;

  return (
    <div
      className="time-up-overlay"
      onClick={onDismiss}
      role="alertdialog"
      aria-labelledby="time-up-title"
      aria-describedby="time-up-answer"
    >
      <div className="time-up-card">
        <h2 id="time-up-title" className="time-up-title">
          נגמר הזמן!
        </h2>
        <p className="time-up-label">התשובה הנכונה:</p>
        <p id="time-up-answer" className="time-up-answer">
          {correctAnswer}
        </p>
        <p className="time-up-hint">לחץ להמשיך</p>
      </div>
    </div>
  );
});

TimeUpOverlay.displayName = 'TimeUpOverlay';
```

### 6.6 SpeedSummary Component (`src/components/timer/SpeedSummary.tsx`)

```typescript
import React, { memo } from 'react';
import { SpeedPerformance } from '../../types/timer';
import { getSpeedRating, formatTimeDetailed } from '../../config/timerConfig';

export interface SpeedSummaryProps {
  /** Speed performance data */
  performance: SpeedPerformance;
  /** Personal best average time (for comparison) */
  bestAverageTime?: number;
  /** Whether this session set a new record */
  isNewRecord?: boolean;
  /** Additional CSS class */
  className?: string;
}

/**
 * End-of-game speed performance summary
 */
export const SpeedSummary: React.FC<SpeedSummaryProps> = memo(({
  performance,
  bestAverageTime,
  isNewRecord = false,
  className = '',
}) => {
  const rating = getSpeedRating(performance.averageTime);

  return (
    <div className={`speed-summary ${className}`}>
      <h3 className="speed-summary-title">ביצועי מהירות</h3>

      <div className="speed-stats">
        <div className="speed-stat">
          <span className="speed-stat-label">זמן תגובה ממוצע</span>
          <span className="speed-stat-value">
            {formatTimeDetailed(performance.averageTime)}
          </span>
        </div>

        <div className="speed-stat">
          <span className="speed-stat-label">תשובה מהירה ביותר</span>
          <span className="speed-stat-value highlight">
            {formatTimeDetailed(performance.fastestTime)}
          </span>
        </div>

        {performance.timeoutCount > 0 && (
          <div className="speed-stat timeout">
            <span className="speed-stat-label">זמן שנגמר</span>
            <span className="speed-stat-value">{performance.timeoutCount}</span>
          </div>
        )}
      </div>

      <div
        className="speed-rating-badge"
        style={{ '--rating-color': rating.color } as React.CSSProperties}
      >
        <span className="rating-label">{rating.labelHe}</span>
      </div>

      {bestAverageTime && bestAverageTime < Infinity && (
        <div className={`personal-best ${isNewRecord ? 'new-record' : ''}`}>
          <span className="best-label">
            {isNewRecord ? 'שיא חדש!' : 'השיא שלך:'}
          </span>
          <span className="best-value">
            {formatTimeDetailed(isNewRecord ? performance.averageTime : bestAverageTime)}
          </span>
        </div>
      )}
    </div>
  );
});

SpeedSummary.displayName = 'SpeedSummary';
```

### 6.7 Component Index (`src/components/timer/index.ts`)

```typescript
export { TimerDisplay } from './TimerDisplay';
export { TimerToggle } from './TimerToggle';
export { TimeBonusPopup } from './TimeBonusPopup';
export { TimeUpOverlay } from './TimeUpOverlay';
export { SpeedSummary } from './SpeedSummary';

export type { TimerDisplayProps } from './TimerDisplay';
export type { TimerToggleProps } from './TimerToggle';
export type { TimeBonusPopupProps } from './TimeBonusPopup';
export type { TimeUpOverlayProps } from './TimeUpOverlay';
export type { SpeedSummaryProps } from './SpeedSummary';
```

---

## 7. Game Integration Patterns

### 7.1 Integration Pattern Overview

Each game requires modifications to:
1. Add timer toggle to start/settings screen
2. Integrate useGameTimer hook
3. Add TimerDisplay to game header
4. Handle timeout events
5. Track response times (Phase 2)
6. Show SpeedSummary at game end (Phase 2)

### 7.2 SpellingGame Integration Example

The Spelling Game has the simplest timer model (per-word timer reset) and serves as the reference implementation:

```typescript
// In SpellingGame.tsx - Key integration points

import { useGameTimer } from '../../hooks/useGameTimer';
import { useTimerSettings } from '../../hooks/useTimerSettings';
import { TimerDisplay, TimerToggle, TimeUpOverlay } from '../timer';
import { TIMER_CONFIG, calculateBonus } from '../../config/timerConfig';

export const SpellingGame: React.FC<SpellingGameProps> = ({ onBack }) => {
  // Existing state...

  // Timer integration
  const { isTimerEnabled, toggleTimer } = useTimerSettings();
  const timerEnabled = isTimerEnabled('spelling');
  const [showTimeUp, setShowTimeUp] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const config = TIMER_CONFIG.spelling;

  const handleTimeUp = useCallback(() => {
    // Time ran out - treat as incorrect
    setShowTimeUp(true);
    setFeedback('incorrect');
    // Record will be saved, streak will reset on nextWord
  }, []);

  const timer = useGameTimer({
    totalTime: config.baseTime,
    onTimeUp: handleTimeUp,
    warningThreshold: config.warningThreshold,
    criticalThreshold: config.criticalThreshold,
    enabled: timerEnabled && gameStarted,
  });

  // Modify setupWord to reset timer
  const setupWord = useCallback((word: Word) => {
    // ... existing setup logic ...

    // Reset timer for new word
    if (timerEnabled) {
      timer.reset(config.baseTime);
      timer.start();
    }
  }, [timerEnabled, timer, config.baseTime]);

  // Modify checkAnswer to pause timer and award bonus
  const checkAnswer = () => {
    if (!currentWord || feedback) return;
    if (letterBoxes.some(box => box === null)) return;

    // Pause timer during feedback
    timer.pause();

    const answer = letterBoxes.join('').toLowerCase().trim();
    const correct = currentWord.english.toLowerCase().trim();
    const isCorrect = answer === correct;

    if (isCorrect) {
      setFeedback('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);
      speak(currentWord.english, 'en');

      // Award time bonus in timed mode
      if (timerEnabled) {
        const bonus = calculateBonus(timer.remainingTime, config);
        timer.addBonus(bonus);
      }

      // ... existing record logic ...
    } else {
      setFeedback('incorrect');
      // ... existing logic ...
    }
  };

  // Handle time-up overlay dismiss
  const handleTimeUpDismiss = useCallback(() => {
    setShowTimeUp(false);
    nextWord();
  }, [nextWord]);

  // Start screen (when game not started)
  if (!gameStarted) {
    return (
      <div className="spelling-game">
        <div className="game-header">
          {onBack && (
            <button className="back-button" onClick={onBack}>
              -> חזרה לתפריט
            </button>
          )}
          <h1>משחק איות</h1>
        </div>

        <div className="game-start-screen">
          <TimerToggle
            enabled={timerEnabled}
            onToggle={() => toggleTimer('spelling')}
            onDescription={`${config.baseTime / 1000} שניות למילה`}
          />

          <button
            className="start-button"
            onClick={() => setGameStarted(true)}
          >
            התחל לשחק
          </button>
        </div>
      </div>
    );
  }

  // Main game render
  return (
    <div className="spelling-game">
      <div className="game-header">
        {onBack && (
          <button className="back-button" onClick={onBack}>
            -> חזרה לתפריט
          </button>
        )}
        <h1>משחק איות</h1>
        <div className="game-stats">
          <span className="stat">
            רצף: <strong>{streak}</strong>
          </span>
          <span className={`stat record ${isNewRecord ? 'new-record-glow' : ''}`}>
            שיא: <strong>{record}</strong>
          </span>

          {/* Timer display */}
          <TimerDisplay
            remainingTime={timer.remainingTime}
            displayState={timer.displayState}
            visible={timerEnabled}
            showMinutes={false}
          />
        </div>
        {/* ... rest of header ... */}
      </div>

      {/* Time-up overlay */}
      <TimeUpOverlay
        visible={showTimeUp}
        correctAnswer={currentWord?.english.toUpperCase() || ''}
        onDismiss={handleTimeUpDismiss}
      />

      {/* ... rest of game content ... */}
    </div>
  );
};
```

### 7.3 Game-Specific Integration Notes

#### Memory Game
- Uses total time for entire game (not per-move)
- Timer formula: `60s + (pairs * 10s)`
- Timer pauses during match reveal animation
- Timeout ends the game entirely
- Track remaining time as score metric

```typescript
// Memory-specific timer calculation
const totalTime = calculateMemoryTotalTime(wordCount);

// On match, optionally award quick-match bonus
const timeSinceFirstFlip = Date.now() - firstFlipTimeRef.current;
if (timeSinceFirstFlip < config.quickMatchThreshold) {
  timer.addBonus(config.maxBonus);
}
```

#### Flashcards Game
- 15 seconds per card
- Timer pauses during answer reveal
- Timeout counts as wrong (box resets to 1)
- Track average response time per session

```typescript
// Flashcards timer resets each card
useEffect(() => {
  if (currentCard && timerEnabled) {
    timer.reset();
    timer.start();
    timer.startItem(); // Track response time
  }
}, [currentCard]);

// On answer
const responseTime = timer.getItemTime();
// Store for average calculation
```

#### Hangman Game
- 45 seconds per word
- Correct letter guess adds +3 seconds
- Wrong guess has no time penalty (already has hangman penalty)
- Timeout counts as loss (same as 6 wrong guesses)

```typescript
// On correct letter
if (isCorrect) {
  timer.addBonus(config.correctLetterBonus);
}
// Wrong guesses don't affect timer
```

---

## 8. CSS Additions to main.css

```css
/* ===================================
   TIMER COMPONENTS
   =================================== */

/* Timer Toggle Container */
.timer-toggle-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 15px;
  margin: 15px 0;
}

.timer-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.timer-toggle:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.25);
}

.timer-toggle:focus {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

.timer-toggle.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.timer-toggle-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 1rem;
}

.timer-toggle-icon {
  font-size: 1.2rem;
}

.timer-toggle-switch {
  width: 50px;
  height: 28px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 14px;
  position: relative;
  transition: background-color 0.3s ease;
}

.timer-toggle.on .timer-toggle-switch {
  background: #4CAF50;
}

.timer-toggle-handle {
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.timer-toggle.on .timer-toggle-handle {
  transform: translateX(22px);
}

.timer-toggle-state {
  color: white;
  font-size: 0.9rem;
  min-width: 40px;
}

.timer-toggle-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  text-align: center;
}

/* Time Bonus Popup */
.time-bonus-popup {
  position: absolute;
  color: #4CAF50;
  font-weight: bold;
  font-size: 1.1rem;
  pointer-events: none;
  animation: bonus-float 1s ease-out forwards;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.time-bonus-popup.left {
  right: 100%;
  margin-right: 8px;
}

.time-bonus-popup.right {
  left: 100%;
  margin-left: 8px;
}

@keyframes bonus-float {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-25px) scale(1.2);
  }
}

/* Time Up Overlay */
.time-up-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fade-in 0.3s ease-out;
  cursor: pointer;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.time-up-card {
  background: white;
  padding: 30px 40px;
  border-radius: 20px;
  text-align: center;
  max-width: 300px;
  animation: scale-in 0.3s ease-out;
}

@keyframes scale-in {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.time-up-title {
  color: #F44336;
  font-size: 1.8rem;
  margin-bottom: 15px;
}

.time-up-label {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.time-up-answer {
  color: #333;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 15px;
  direction: ltr;
}

.time-up-hint {
  color: #999;
  font-size: 0.8rem;
}

/* Speed Summary */
.speed-summary {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  margin: 15px 0;
  color: white;
  text-align: center;
}

.speed-summary-title {
  font-size: 1.1rem;
  margin-bottom: 15px;
  opacity: 0.9;
}

.speed-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.speed-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.speed-stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.speed-stat-value {
  font-weight: bold;
  font-size: 1rem;
}

.speed-stat-value.highlight {
  color: #FFD700;
}

.speed-stat.timeout .speed-stat-value {
  color: #EF5350;
}

.speed-rating-badge {
  display: inline-flex;
  align-items: center;
  padding: 10px 25px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 25px;
  border: 2px solid var(--rating-color, #4CAF50);
  margin-bottom: 15px;
}

.rating-label {
  font-weight: bold;
  color: var(--rating-color, #4CAF50);
}

.personal-best {
  font-size: 0.9rem;
  padding: 8px 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.personal-best.new-record {
  background: rgba(255, 215, 0, 0.2);
  border: 1px solid rgba(255, 215, 0, 0.5);
  animation: glow 1s ease-in-out infinite alternate;
}

.best-label {
  margin-left: 8px;
}

.best-value {
  font-weight: bold;
}

/* Game Start Screen */
.game-start-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 20px;
}

.start-button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 1.2rem;
  font-family: 'Rubik', sans-serif;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  min-height: 50px;
}

.start-button:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

/* Timer in game stats */
.game-stats .timer-display {
  margin-right: auto;
}

/* Timer position wrapper for bonus popup */
.timer-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}
```

---

## 9. Testing Strategy

### 9.1 Unit Tests

#### useGameTimer Hook Tests

```typescript
// __tests__/hooks/useGameTimer.test.ts

import { renderHook, act } from '@testing-library/react';
import { useGameTimer } from '../../hooks/useGameTimer';

describe('useGameTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with correct default values', () => {
    const onTimeUp = jest.fn();
    const { result } = renderHook(() => useGameTimer({
      totalTime: 30000,
      onTimeUp,
    }));

    expect(result.current.remainingTime).toBe(30000);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.displayState).toBe('normal');
  });

  it('should countdown when started', () => {
    const onTimeUp = jest.fn();
    const { result } = renderHook(() => useGameTimer({
      totalTime: 30000,
      onTimeUp,
    }));

    act(() => {
      result.current.start();
    });

    expect(result.current.isRunning).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.remainingTime).toBe(29000);
  });

  it('should call onTimeUp when timer reaches zero', () => {
    const onTimeUp = jest.fn();
    const { result } = renderHook(() => useGameTimer({
      totalTime: 1000,
      onTimeUp,
    }));

    act(() => {
      result.current.start();
    });

    act(() => {
      jest.advanceTimersByTime(1100);
    });

    expect(onTimeUp).toHaveBeenCalledTimes(1);
    expect(result.current.remainingTime).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });

  it('should pause and resume correctly', () => {
    const onTimeUp = jest.fn();
    const { result } = renderHook(() => useGameTimer({
      totalTime: 30000,
      onTimeUp,
    }));

    act(() => {
      result.current.start();
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.remainingTime).toBe(25000);

    act(() => {
      result.current.pause();
      jest.advanceTimersByTime(5000);
    });

    // Should not have changed while paused
    expect(result.current.remainingTime).toBe(25000);

    act(() => {
      result.current.resume();
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.remainingTime).toBe(20000);
  });

  it('should add bonus time correctly', () => {
    const onTimeUp = jest.fn();
    const { result } = renderHook(() => useGameTimer({
      totalTime: 30000,
      onTimeUp,
    }));

    act(() => {
      result.current.start();
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.remainingTime).toBe(20000);

    act(() => {
      result.current.addBonus(5000);
    });

    expect(result.current.remainingTime).toBe(25000);
  });

  it('should transition through warning and critical states', () => {
    const onTimeUp = jest.fn();
    const onWarning = jest.fn();
    const onCritical = jest.fn();

    const { result } = renderHook(() => useGameTimer({
      totalTime: 15000,
      onTimeUp,
      onWarning,
      onCritical,
      warningThreshold: 10000,
      criticalThreshold: 5000,
    }));

    act(() => {
      result.current.start();
    });

    expect(result.current.displayState).toBe('normal');

    act(() => {
      jest.advanceTimersByTime(5100);
    });

    expect(result.current.displayState).toBe('warning');
    expect(onWarning).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(5100);
    });

    expect(result.current.displayState).toBe('critical');
    expect(onCritical).toHaveBeenCalledTimes(1);
  });

  it('should reset to specified time', () => {
    const onTimeUp = jest.fn();
    const { result } = renderHook(() => useGameTimer({
      totalTime: 30000,
      onTimeUp,
    }));

    act(() => {
      result.current.start();
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.remainingTime).toBe(20000);

    act(() => {
      result.current.reset(15000);
    });

    expect(result.current.remainingTime).toBe(15000);
    expect(result.current.isRunning).toBe(false);
  });
});
```

#### useTimerSettings Hook Tests

```typescript
// __tests__/hooks/useTimerSettings.test.ts

import { renderHook, act } from '@testing-library/react';
import { useTimerSettings } from '../../hooks/useTimerSettings';

describe('useTimerSettings', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return default settings when localStorage is empty', () => {
    const { result } = renderHook(() => useTimerSettings());

    expect(result.current.isTimerEnabled('spelling')).toBe(false);
    expect(result.current.isTimerEnabled('memory')).toBe(false);
  });

  it('should toggle timer setting', () => {
    const { result } = renderHook(() => useTimerSettings());

    expect(result.current.isTimerEnabled('spelling')).toBe(false);

    act(() => {
      result.current.toggleTimer('spelling');
    });

    expect(result.current.isTimerEnabled('spelling')).toBe(true);

    act(() => {
      result.current.toggleTimer('spelling');
    });

    expect(result.current.isTimerEnabled('spelling')).toBe(false);
  });

  it('should persist settings to localStorage', () => {
    const { result } = renderHook(() => useTimerSettings());

    act(() => {
      result.current.setTimerEnabled('flashcards', true);
    });

    // Check localStorage
    const stored = JSON.parse(localStorage.getItem('learn-eng-timer-settings') || '{}');
    expect(stored.flashcards.enabled).toBe(true);
  });

  it('should load persisted settings', () => {
    // Pre-populate localStorage
    localStorage.setItem('learn-eng-timer-settings', JSON.stringify({
      memory: { enabled: true },
      spelling: { enabled: false },
      flashcards: { enabled: true },
      hangman: { enabled: false },
    }));

    const { result } = renderHook(() => useTimerSettings());

    expect(result.current.isTimerEnabled('memory')).toBe(true);
    expect(result.current.isTimerEnabled('flashcards')).toBe(true);
    expect(result.current.isTimerEnabled('spelling')).toBe(false);
  });
});
```

### 9.2 Component Tests

```typescript
// __tests__/components/TimerDisplay.test.tsx

import { render, screen } from '@testing-library/react';
import { TimerDisplay } from '../../components/timer/TimerDisplay';

describe('TimerDisplay', () => {
  it('should display time in seconds format', () => {
    render(
      <TimerDisplay
        remainingTime={25000}
        displayState="normal"
        showMinutes={false}
      />
    );

    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('should display time in minutes:seconds format', () => {
    render(
      <TimerDisplay
        remainingTime={125000}
        displayState="normal"
        showMinutes={true}
      />
    );

    expect(screen.getByText('2:05')).toBeInTheDocument();
  });

  it('should apply warning class when in warning state', () => {
    const { container } = render(
      <TimerDisplay
        remainingTime={8000}
        displayState="warning"
      />
    );

    expect(container.querySelector('.timer-display.warning')).toBeInTheDocument();
  });

  it('should apply critical class when in critical state', () => {
    const { container } = render(
      <TimerDisplay
        remainingTime={3000}
        displayState="critical"
      />
    );

    expect(container.querySelector('.timer-display.critical')).toBeInTheDocument();
  });

  it('should not render when visible is false', () => {
    const { container } = render(
      <TimerDisplay
        remainingTime={25000}
        displayState="normal"
        visible={false}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
```

### 9.3 Integration Tests

```typescript
// __tests__/integration/SpellingGameTimer.test.tsx

import { render, screen, fireEvent, act } from '@testing-library/react';
import { SpellingGame } from '../../components/SpellingGame/SpellingGame';

jest.useFakeTimers();

describe('SpellingGame with Timer', () => {
  beforeEach(() => {
    localStorage.clear();
    // Enable timer for spelling
    localStorage.setItem('learn-eng-timer-settings', JSON.stringify({
      memory: { enabled: false },
      spelling: { enabled: true },
      flashcards: { enabled: false },
      hangman: { enabled: false },
    }));
  });

  it('should show timer when enabled', async () => {
    render(<SpellingGame />);

    // Start the game
    fireEvent.click(screen.getByText('התחל לשחק'));

    // Timer should be visible
    expect(screen.getByRole('timer')).toBeInTheDocument();
  });

  it('should show time-up overlay when timer expires', async () => {
    render(<SpellingGame />);

    fireEvent.click(screen.getByText('התחל לשחק'));

    // Advance timer to expiration
    act(() => {
      jest.advanceTimersByTime(31000);
    });

    // Time-up overlay should appear
    expect(screen.getByText('נגמר הזמן!')).toBeInTheDocument();
  });

  it('should pause timer during feedback', async () => {
    render(<SpellingGame />);

    fireEvent.click(screen.getByText('התחל לשחק'));

    // Submit correct answer (implementation depends on game logic)
    // ... fill letters and click check ...

    // During feedback, timer should be paused
    // Verify by checking that time doesn't decrease
  });
});
```

### 9.4 Manual Testing Checklist

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Timer toggle persists | Enable timer, refresh page | Timer should still be enabled |
| Timer countdown | Start timed game | Timer counts down smoothly |
| Warning state | Wait until 10s remaining | Timer turns orange, pulses |
| Critical state | Wait until 5s remaining | Timer turns red, pulses faster |
| Time-up | Let timer reach 0 | Overlay appears, answer shown |
| Tab switching | Switch tab during game | Timer pauses, resumes on return |
| Bonus award | Answer quickly | "+Xs!" popup appears |
| Reset on new word | Complete word, get next | Timer resets to full |

---

## 10. Implementation Plan

### Phase 1: MVP (Estimated: 3-4 days)

#### Day 1: Foundation
- [ ] Create type definitions (`src/types/timer.ts`)
- [ ] Create timer configuration (`src/config/timerConfig.ts`)
- [ ] Implement `useGameTimer` hook
- [ ] Implement `useTimerSettings` hook
- [ ] Write unit tests for hooks

#### Day 2: UI Components
- [ ] Create `TimerDisplay` component with CSS
- [ ] Create `TimerToggle` component
- [ ] Create `TimeUpOverlay` component
- [ ] Add timer CSS to main.css
- [ ] Write component tests

#### Day 3: Game Integration - Spelling & Flashcards
- [ ] Add start screen with timer toggle to SpellingGame
- [ ] Integrate timer into SpellingGame gameplay
- [ ] Add start screen with timer toggle to FlashcardsGame
- [ ] Integrate timer into FlashcardsGame gameplay

#### Day 4: Game Integration - Memory & Hangman
- [ ] Integrate timer into MemoryGame (total time model)
- [ ] Integrate timer into HangmanGame
- [ ] End-to-end testing all games
- [ ] Fix bugs and polish

### Phase 2: Enhanced Features (Estimated: 2-3 days)

#### Day 5: Bonus System
- [ ] Implement `TimeBonusPopup` component
- [ ] Add bonus calculation to all games
- [ ] Track response times per answer
- [ ] Add bonus animations

#### Day 6: Speed Summary & Records
- [ ] Implement `SpeedSummary` component
- [ ] Add speed performance tracking to games
- [ ] Implement separate timed records
- [ ] Display speed ratings at game end

### Phase 3: Polish (Estimated: 2-3 days)

#### Day 7: Accessibility & UX
- [ ] Add keyboard support for timer toggle
- [ ] Add ARIA attributes for screen readers
- [ ] Implement reduced motion preference
- [ ] Add optional audio cues (warning beeps)

#### Day 8: Advanced Features
- [ ] In-game timer toggle with confirmation
- [ ] Extended time accessibility setting
- [ ] Personal best notifications
- [ ] Additional testing and bug fixes

---

## 11. Technical Considerations

### 11.1 Performance

| Concern | Mitigation |
|---------|------------|
| Timer re-renders | Use `memo` on display components, isolate timer state |
| Animation jank | Use CSS animations, avoid JS-driven animations |
| Memory leaks | Clean up intervals in useEffect cleanup |
| Battery drain | Pause timer when tab hidden |

### 11.2 Browser Compatibility

- `document.hidden` API - Supported in all modern browsers
- `requestAnimationFrame` - Not needed, using setInterval
- `Intl` for time formatting - Supported, but using simple string formatting

### 11.3 Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Screen reader support | ARIA live regions for time announcements |
| Keyboard navigation | Tab + Enter/Space for toggle |
| Color contrast | WCAG AA compliant colors |
| Motion sensitivity | `prefers-reduced-motion` media query |
| Extended time | Future: durationMultiplier setting |

### 11.4 State Management

The timer feature uses local component state and localStorage for persistence. This approach was chosen because:
- Timer state is game-specific, not shared
- Settings persistence is simple key-value
- No complex state synchronization needed
- Avoids adding global state management complexity

### 11.5 Error Handling

| Scenario | Handling |
|----------|----------|
| localStorage unavailable | Fall back to in-memory defaults |
| Invalid stored settings | Merge with defaults, ignore invalid keys |
| Timer drift | Use Date.now() reference for accuracy checks |
| Rapid pause/resume | Debounce state changes |

---

## 12. Open Questions and Assumptions

### Assumptions Made

1. **Per-game settings**: Timer preference is stored separately for each game
2. **Untimed default**: New users start with timer disabled
3. **Tab pause behavior**: Timer pauses when tab loses focus
4. **Timeout = wrong**: All games treat timeout as incorrect answer
5. **No negative time**: Timer cannot go below zero

### Open Questions (Requiring Stakeholder Input)

1. **Audio feedback**: Should there be optional warning sounds at thresholds?
   - Current assumption: Audio is Phase 3, optional

2. **Extended time for accessibility**: What multiplier values should be offered?
   - Current assumption: 1.5x and 2x in Phase 3

3. **First-time explanation**: Should there be a tutorial for first-time timer users?
   - Current assumption: The toggle description is sufficient for MVP

4. **Timed vs untimed records**: Should they be displayed side-by-side or in separate tabs?
   - Current assumption: Side-by-side display in Phase 2

---

## 13. Dependencies and Prerequisites

### External Dependencies
- None required - feature uses only React and browser APIs

### Internal Dependencies
- Existing game components (MemoryGame, SpellingGame, FlashcardsGame, HangmanGame)
- Existing CSS structure (main.css)
- localStorage API wrapper (implicit)

### Prerequisites Before Implementation
- [ ] Design approval from stakeholder
- [ ] Confirm timer values (30s, 15s, 45s, etc.) are appropriate
- [ ] Confirm bonus calculation formulas
- [ ] Confirm speed rating thresholds

---

## 14. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Timer drift on low-end devices | Medium | Low | Track actual elapsed time, not just intervals |
| User frustration with tight timers | Medium | High | Careful UX testing, adjust times if needed |
| Complex game integration | Medium | Medium | Start with simplest game (Spelling), extract patterns |
| localStorage quota exceeded | Low | Medium | Minimal data storage, graceful fallback |
| Accessibility complaints | Medium | High | Early ARIA implementation, user testing |

---

## Appendix A: Hebrew UI Labels Reference

| English | Hebrew | Context |
|---------|--------|---------|
| Timer Mode | מצב טיימר | Toggle label |
| On | פעיל | Toggle state |
| Off | כבוי | Toggle state |
| Time's Up! | נגמר הזמן! | Timeout overlay |
| seconds | שניות | Time description |
| Bonus | בונוס | Bonus popup |
| Speed | מהירות | Summary section |
| Average Response | זמן תגובה ממוצע | Summary stat |
| Fastest Answer | תשובה מהירה ביותר | Summary stat |
| Time Remaining | זמן שנותר | Game stat |
| Play at your own pace | שחק בקצב שלך | Toggle description (off) |
| Time-based challenge | אתגר מבוסס זמן | Toggle description (on) |
| Lightning Fast | מהירות ברק | Speed rating |
| Quick Reflexes | רפלקסים מהירים | Speed rating |
| Good Pace | קצב טוב | Speed rating |
| Keep Practicing | המשך להתאמן | Speed rating |
| Speed Performance | ביצועי מהירות | Summary title |
| The correct answer | התשובה הנכונה | Timeout overlay |
| Click to continue | לחץ להמשיך | Timeout overlay |
| New record! | שיא חדש! | Record notification |
| Your record | השיא שלך | Record display |

---

*End of Technical Design Document*
