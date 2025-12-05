# Feature Design: Timer Mode Option

**Version**: 1.0
**Date Created**: 2025-12-05
**Status**: Design Complete

---

## 1. Feature Overview

### Feature Name
**Timer Mode Option** - Allow users to toggle a timer mode on/off before starting games for time-based challenges.

### One-Line Description
An optional timer mode that adds countdown timers to all four games, creating time-pressure challenges with speed-based scoring and performance feedback.

### Problem Statement
Currently, all games operate at the user's own pace without any time constraints. This creates several limitations:

1. **No urgency or excitement**: Games can feel slow or lack adrenaline without time pressure
2. **Limited challenge variety**: Users who have mastered content have no way to test speed mastery
3. **Missing fluency development**: Real-world language use requires quick recall; untimed practice does not build this skill
4. **No speed metrics**: Users cannot track how quickly they are learning to recognize and recall words
5. **Reduced engagement**: Power users may find games boring without additional challenge dimensions
6. **Incomplete skill assessment**: Knowing a word slowly is different from knowing it instantly

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Feature Adoption | >40% of users try timer mode at least once | Track timer toggle usage |
| Repeated Usage | >25% of timer-mode users play 5+ timed games | Track timed sessions per user |
| Time Improvement | 15% average improvement in response time over 2 weeks | Compare initial vs. later timed scores |
| Engagement Lift | 10% increase in session length for timer users | Compare timed vs. untimed session duration |
| Retention Impact | 8% higher 14-day retention for timer users | Cohort comparison |
| Completion Rate | Timed games: >60% completion rate | Track win/loss ratio in timed mode |

---

## 2. User Stories

### Primary User Stories

**US-1: Toggle Timer Mode Before Playing**
> As a learner, I want to enable or disable timer mode before starting a game so that I can choose whether to play with time pressure.

**Acceptance Criteria:**
- Timer toggle is clearly visible on game start screen
- Toggle state persists per game (remembered between sessions)
- Visual indication shows whether timer mode is on or off
- Default is OFF for new users (untimed is the comfortable default)

---

**US-2: See Countdown During Gameplay**
> As a learner, I want to see a clear countdown timer during gameplay so that I know how much time I have remaining.

**Acceptance Criteria:**
- Timer displays prominently but does not obstruct gameplay
- Timer updates in real-time (every second or sub-second)
- Visual warning when time is running low (color change, animation)
- Timer pauses appropriately (when showing feedback, between rounds)

---

**US-3: Receive Time-Out Consequences**
> As a learner, I want the game to respond appropriately when time runs out so that there is real consequence to the timer.

**Acceptance Criteria:**
- Clear feedback when time expires ("Time's up!")
- Time-out counts as incorrect answer (affects streak/score)
- Correct answer revealed on time-out
- Game continues to next item after time-out

---

**US-4: Earn Time Bonuses**
> As a learner, I want to earn time bonuses for fast correct answers so that speed is rewarded.

**Acceptance Criteria:**
- Bonus time added for quick correct answers
- Visual feedback shows bonus awarded ("+3s!")
- Bonus amount scaled by how fast the answer was given
- Bonus system explained to user on first use

---

**US-5: See Speed Performance Feedback**
> As a learner, I want to see feedback on my speed performance so that I can track my fluency improvement.

**Acceptance Criteria:**
- End-of-game summary shows average response time
- Comparison to personal best times
- "Fastest answer" highlight for exceptional speed
- Speed rating (e.g., "Lightning Fast", "Good Pace", "Keep Practicing")

---

### Secondary User Stories

**US-6: Quick Timer Toggle Mid-Session**
> As a learner, I want to toggle timer mode from the game header so that I can switch modes without returning to menu.

**Acceptance Criteria:**
- Timer icon/toggle in game header
- Switching timer mode starts a new game
- Confirmation if mid-game (to prevent accidental reset)

---

**US-7: Separate Records for Timed Mode**
> As a learner, I want my timed records tracked separately from untimed so that both achievements are meaningful.

**Acceptance Criteria:**
- Records display shows both timed and untimed records
- Clear distinction between record types
- Timed records include best time as well as best streak/score

---

### Edge Cases

- **Timer expires during animation**: Timer pauses during flip animations, match reveals
- **Very fast answer**: Minimum display time for feedback before moving on (500ms)
- **User tabs away**: Timer pauses when browser tab loses focus (resume on return)
- **Network delay**: Timer does not start until all assets loaded
- **Accessibility**: Timer can be configured with extended time for accessibility needs
- **First-time timer user**: Show brief explanation of timer rules before first timed game

---

## 3. User Experience Flow

### Entry Points

1. **Game Start Screen**
   - Primary: Timer toggle visible when selecting a game
   - Shows current timer state (on/off) with clear visual

2. **In-Game Header**
   - Secondary: Timer icon that can toggle mode
   - Requires confirmation if game in progress

3. **Settings Panel** (where applicable)
   - For games with settings (Flashcards), timer toggle in settings

### Main User Journey

```
[Game Menu]
     |
     v
[Select Game] --> [Game Start Screen]
                          |
                  +-------+-------+
                  |               |
             [Timer OFF]     [Timer ON]
                  |               |
                  v               v
          [Standard Game]  [Timed Game]
                  |               |
                  |       +-------+-------+
                  |       |               |
                  |   [Answer in time] [Time expires]
                  |       |               |
                  |   [+Bonus time]   [Mark wrong]
                  |       |               |
                  +-------+-------+-------+
                          |
                          v
                   [Next Question]
                          |
                          v
                   [Game Complete]
                          |
                          v
               [Speed Performance Summary]
```

### Timer Toggle Interface

```
+------------------------------------------+
|  [<-]  Memory Game                       |
+------------------------------------------+
|                                          |
|           Select Word Count              |
|              [4] [5] [6]                 |
|                                          |
|  +------------------------------------+  |
|  |                                    |  |
|  |   Timer Mode                       |  |
|  |                                    |  |
|  |   [========O    ]  OFF             |  |
|  |                                    |  |
|  |   Play at your own pace            |  |
|  |                                    |  |
|  +------------------------------------+  |
|                                          |
|         [ Start Playing ]                |
|                                          |
+------------------------------------------+
```

When Timer is ON:

```
+------------------------------------------+
|  Timer Mode                              |
|                                          |
|   [    O========]  ON                    |
|                                          |
|   30 seconds per word                    |
|   Earn bonus time for fast answers       |
|                                          |
+------------------------------------------+
```

### In-Game Timer Display

```
+------------------------------------------+
|  [<-]  Memory   Moves: 5   Pairs: 2/6    |
|                            [0:25]        |
+------------------------------------------+
|                     ^                    |
|                     |                    |
|            Timer countdown               |
|          (changes color at 10s)          |
```

### Exit Points

1. **Game Complete**: Show speed summary, return to menu or play again
2. **Timer Toggle**: Change mode starts new game
3. **Back to Menu**: Abandon current game, return to game selection

### Error States and Recovery

| Error | User Message | Recovery Action |
|-------|--------------|-----------------|
| Timer expires | "Time's up!" | Show correct answer, continue to next |
| Browser tab hidden | Timer pauses | Resume countdown when tab active |
| Invalid timer state | Silent fallback | Default to untimed mode |

---

## 4. UI/UX Specifications

### 4.1 Timer Toggle Component

**Location**: Game start screen, before "Start" button

**Layout**:
```
+------------------------------------+
|                                    |
|   Timer Mode                       |
|                                    |
|   [    O========]  OFF             |
|      ^                             |
|   Toggle switch                    |
|                                    |
|   Play at your own pace            |
|   ^                                |
|   Description text changes         |
|                                    |
+------------------------------------+
```

**Elements:**
- Toggle switch (iOS-style) with clear on/off states
- Label showing current state
- Description text that changes based on state
- Timer icon when enabled

**Colors:**
```css
:root {
  /* Timer mode colors */
  --timer-off-bg: #e0e0e0;
  --timer-off-handle: #ffffff;
  --timer-on-bg: #4CAF50;
  --timer-on-handle: #ffffff;

  /* Timer display colors */
  --timer-normal: #333333;
  --timer-warning: #FF9800;
  --timer-critical: #F44336;

  /* Speed rating colors */
  --speed-lightning: #FFD700;
  --speed-fast: #4CAF50;
  --speed-good: #2196F3;
  --speed-slow: #9E9E9E;
}
```

**Interactions:**
- Tap/click toggle to switch state
- State change animates smoothly
- Description text updates immediately

---

### 4.2 In-Game Timer Display

**Location**: Game header, right side near stats

**Layout - Normal State**:
```
+------------------------------------------+
|  [<-]  Game Title    Stats    [0:25]     |
+------------------------------------------+
```

**Layout - Warning State (10s remaining)**:
```
+------------------------------------------+
|  [<-]  Game Title    Stats    [0:10]     |
|                              ^^^^^^^^    |
|                              Orange,     |
|                              pulsing     |
+------------------------------------------+
```

**Layout - Critical State (5s remaining)**:
```
+------------------------------------------+
|  [<-]  Game Title    Stats    [0:05]     |
|                              ^^^^^^^^    |
|                              Red,        |
|                              fast pulse  |
+------------------------------------------+
```

**Elements:**
- Digital clock format [M:SS] or just [SS] for short timers
- Background pill shape for visibility
- Color transitions: normal -> warning -> critical
- Pulse animation at warning and critical thresholds
- Optional: circular progress indicator around timer

**Timer States:**
| Remaining Time | Color | Animation |
|----------------|-------|-----------|
| >10 seconds | Normal (dark) | None |
| 5-10 seconds | Warning (orange) | Slow pulse |
| 0-5 seconds | Critical (red) | Fast pulse |
| 0 seconds | Critical | Flash + "Time's up!" |

---

### 4.3 Time Bonus Indicator

**Location**: Appears near timer when bonus earned

**Layout**:
```
+------------------------------------------+
|                             [0:25] +5s!  |
|                                   ^^^^   |
|                            Bonus popup   |
|                            (fades out)   |
+------------------------------------------+
```

**Animation:**
1. Bonus text appears with scale-up animation
2. Floats upward slightly
3. Fades out over 1 second
4. Timer value animates to new total

---

### 4.4 Time-Out Feedback

**Location**: Center of game area, overlay

**Layout**:
```
+------------------------------------------+
|                                          |
|          +-------------------+           |
|          |                   |           |
|          |    Time's Up!     |           |
|          |                   |           |
|          |  The answer was:  |           |
|          |      APPLE        |           |
|          |                   |           |
|          +-------------------+           |
|                                          |
+------------------------------------------+
```

**Elements:**
- Semi-transparent overlay
- Central card with timeout message
- Correct answer displayed
- Auto-dismiss after 2 seconds or tap to continue
- Uses same incorrect styling as wrong answers

---

### 4.5 Speed Performance Summary

**Location**: End of game completion screen

**Layout**:
```
+------------------------------------------+
|                                          |
|           Game Complete!                 |
|                                          |
|  +------------------------------------+  |
|  |  Speed Performance                 |  |
|  +------------------------------------+  |
|  |                                    |  |
|  |  Average Response: 3.2s            |  |
|  |  Fastest Answer: 1.1s              |  |
|  |  Timeouts: 2                       |  |
|  |                                    |  |
|  |  Rating: Good Pace                 |  |
|  |                                    |  |
|  |  Best Average: 2.8s                |  |
|  |                                    |  |
|  +------------------------------------+  |
|                                          |
|         [ Play Again ]                   |
|                                          |
+------------------------------------------+
```

**Speed Ratings:**
| Average Time | Rating | Color |
|--------------|--------|-------|
| <2 seconds | Lightning Fast | Gold |
| 2-4 seconds | Quick Reflexes | Green |
| 4-6 seconds | Good Pace | Blue |
| >6 seconds | Keep Practicing | Gray |

---

### 4.6 Responsive Design

**Mobile (< 480px)**
- Timer display in header, compact format [SS]
- Toggle switch full width
- Speed summary in scrollable card
- Larger tap targets for timer toggle

**Tablet (480px - 1024px)**
- Timer display [M:SS] format
- Toggle inline with other settings
- Speed summary side-by-side layout

**Desktop (> 1024px)**
- Larger timer display with circular progress
- Hover states on toggle
- Keyboard shortcut to toggle timer (T key)

---

### 4.7 Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| WCAG 2.1 AA | Timer color changes meet contrast requirements |
| Screen readers | ARIA live region announces time warnings ("10 seconds remaining") |
| Keyboard navigation | Toggle accessible via Tab + Space/Enter |
| Motion sensitivity | Option to disable pulse animations |
| Extended time | Accessibility setting for 1.5x or 2x timer duration |
| Color independence | Timer uses size/animation in addition to color |
| RTL support | Timer display works in RTL layout |
| Audio cues | Optional sound for warnings (can be disabled) |

---

## 5. Timer Parameters Per Game

### 5.1 Memory Game

| Parameter | Value | Notes |
|-----------|-------|-------|
| Base time per round | 60 seconds | Total time to complete all matches |
| Time per pair | +10 seconds | Added to total for each pair (e.g., 6 pairs = 60s + 60s = 120s) |
| Bonus for quick match | +5 seconds | Match within 3 seconds of flipping first card |
| Time-out penalty | Game ends | Timer reaching 0 ends the game |
| Timer pause | On match reveal | Paused during 500ms match animation |

**Timer Formula:**
```
Total Time = 60 + (pairs * 10) seconds
4 pairs = 100 seconds
6 pairs = 120 seconds
8 pairs = 140 seconds
10 pairs = 160 seconds
```

**Scoring in Timer Mode:**
- Standard: Track moves and pairs
- Timed bonus: Track remaining time at completion
- Record: Best remaining time for each pair count

---

### 5.2 Spelling Game

| Parameter | Value | Notes |
|-----------|-------|-------|
| Time per word | 30 seconds | Reset on each new word |
| Bonus for fast answer | +3 to +10 seconds | Scaled by remaining time |
| Time-out penalty | Counts as wrong | Streak resets, show correct answer |
| Timer pause | During feedback | Paused while showing correct/incorrect |
| Warning threshold | 10 seconds | Orange color |
| Critical threshold | 5 seconds | Red color, fast pulse |

**Bonus Formula:**
```
Bonus = floor(remaining_time / 3) seconds
30s remaining = +10s bonus
15s remaining = +5s bonus
6s remaining = +2s bonus
```

**Scoring in Timer Mode:**
- Track streak (same as untimed)
- Track average response time
- Record: Best streak AND best average time

---

### 5.3 Flashcards Game

| Parameter | Value | Notes |
|-----------|-------|-------|
| Time per card | 15 seconds | Short timer for quick recall |
| Bonus for fast answer | +2 to +5 seconds | Scaled by remaining time |
| Time-out penalty | Counts as wrong | Box demoted, show correct answer |
| Timer pause | During feedback | Paused during answer reveal |
| Warning threshold | 5 seconds | Orange color |
| Critical threshold | 3 seconds | Red color |

**Bonus Formula:**
```
Bonus = floor(remaining_time / 3) seconds
15s remaining = +5s bonus
9s remaining = +3s bonus
3s remaining = +1s bonus
```

**Spaced Repetition Interaction:**
- Time-out treated same as wrong answer (box reset to 1)
- Fast correct answer does not affect box progression (only correct/incorrect matters)
- Speed stats tracked separately from mastery progress

**Scoring in Timer Mode:**
- Track accuracy (same as untimed)
- Track average response time per session
- Record: Best average response time

---

### 5.4 Hangman Game

| Parameter | Value | Notes |
|-----------|-------|-------|
| Time per word | 45 seconds | Total time to guess the word |
| Bonus for correct letter | +3 seconds | Each correct letter guess |
| Wrong letter penalty | -0 seconds | No time penalty (already has wrong guess penalty) |
| Time-out penalty | Game over (loss) | Same as 6 wrong guesses |
| Timer pause | During feedback | Paused during win/loss reveal |
| Warning threshold | 15 seconds | Orange color |
| Critical threshold | 8 seconds | Red color |

**Timer Interaction with Guesses:**
- Each correct letter adds +3 seconds
- Wrong guesses do not affect time (hangman progression is penalty)
- If timer expires, counts as loss (resets streak)

**Scoring in Timer Mode:**
- Track streak (same as untimed)
- Track average time to solve
- Record: Best streak AND fastest average solve time

---

### 5.5 Timer Parameters Summary Table

| Game | Base Time | Bonus Max | Time-out Penalty | Record Metric |
|------|-----------|-----------|------------------|---------------|
| Memory | 60s + (pairs*10s) | +5s per match | Game ends | Time remaining |
| Spelling | 30s per word | +10s | Wrong answer | Streak + avg time |
| Flashcards | 15s per card | +5s | Wrong answer | Avg response time |
| Hangman | 45s per word | +3s per letter | Loss | Streak + avg solve time |

---

## 6. Scoring Adjustments Based on Time Performance

### 6.1 Speed-Based Scoring Philosophy

Timer mode introduces a secondary dimension to scoring:

1. **Correctness remains primary**: A slow correct answer beats a fast timeout
2. **Speed is rewarded**: Faster answers earn time bonuses and better ratings
3. **Records are separate**: Timed and untimed records coexist
4. **Improvement is tracked**: Average times compared over time

### 6.2 Memory Game Scoring

**Untimed Mode (existing):**
- Score = Number of moves
- Lower is better
- Record per pair count

**Timed Mode:**
- Primary score = Number of moves (same)
- Secondary score = Time remaining at completion
- Bonus: Time remaining adds to speed rating
- Record: Best remaining time per pair count

**Display:**
```
Game Complete!
Moves: 12
Time Remaining: 0:45
Speed Bonus: 45 points

Record: 0:52 remaining (6 pairs)
```

### 6.3 Spelling Game Scoring

**Untimed Mode (existing):**
- Score = Current streak
- Record = Highest streak achieved

**Timed Mode:**
- Primary score = Current streak (same)
- Secondary score = Average response time
- Accumulated bonus time adds to next word's timer
- Record: Highest streak AND best average time (tracked separately)

**Display:**
```
Word Complete!
Streak: 7
Response Time: 4.2s
Bonus: +4s

Records:
- Best Streak (Timed): 12
- Best Avg Time: 3.1s
```

### 6.4 Flashcards Game Scoring

**Untimed Mode (existing):**
- Track mastery progress (box levels)
- No explicit score

**Timed Mode:**
- Mastery progress unchanged
- Track average response time per session
- Fast responses do not accelerate box progression
- Record: Best average response time

**Display:**
```
Session Stats
Cards Reviewed: 15
Correct: 12 (80%)
Average Response: 3.8s

Best Avg Response: 2.9s
```

### 6.5 Hangman Game Scoring

**Untimed Mode (existing):**
- Score = Current streak
- Record = Highest streak achieved

**Timed Mode:**
- Primary score = Current streak (same)
- Secondary score = Average time to solve
- Bonus time extends survival
- Record: Highest streak AND best average solve time

**Display:**
```
Word Solved!
Streak: 5
Solve Time: 22.3s
Bonus: +9s (3 correct letters)

Records:
- Best Streak (Timed): 8
- Best Avg Solve: 18.5s
```

### 6.6 Speed Rating System

All games use a consistent speed rating system based on average response/solve time:

| Rating | Threshold | Feedback | Badge Color |
|--------|-----------|----------|-------------|
| Lightning | <2s | "Incredible speed!" | Gold |
| Fast | 2-4s | "Quick reflexes!" | Green |
| Good | 4-6s | "Good pace!" | Blue |
| Steady | 6-10s | "Keep practicing!" | Gray |
| Slow | >10s | "Try to go faster!" | - |

**Speed Rating Display:**
```
+------------------------------------------+
|                                          |
|    Speed Rating: Quick Reflexes          |
|                                          |
|         [GREEN BADGE ICON]               |
|                                          |
|      Average: 3.2 seconds                |
|                                          |
+------------------------------------------+
```

---

## 7. Learning Design Considerations

### Alignment with Language Learning Methodologies

| Methodology | Timer Mode Implementation |
|-------------|---------------------------|
| Automaticity Training | Time pressure encourages automatic recall vs. conscious retrieval |
| Fluency Building | Speed practice builds processing fluency |
| Challenge Point | Timer adds challenge for learners who have mastered accuracy |
| Productive Struggle | Time pressure creates desirable difficulty |
| Self-Efficacy | Beating personal best times builds confidence |

### Pedagogical Rationale

**Why time pressure helps language learning:**

1. **Moves knowledge from declarative to procedural**: Knowing a word definition vs. instantly recognizing it
2. **Simulates real conversation**: Real-world language use requires quick responses
3. **Prevents over-reliance on translation**: Forces direct word-meaning connections
4. **Identifies weak spots**: Words that require extra time need more practice
5. **Builds confidence**: Demonstrating speed mastery is motivating

### When Timer Mode Should Be Avoided

Timer mode is optional because:
1. **Beginners need time**: New learners should focus on accuracy first
2. **Anxiety can impair learning**: Some users perform worse under pressure
3. **Accessibility**: Users with processing differences may need more time
4. **Exploration mode**: Sometimes users want to explore without pressure

### Timer Mode Best Practices (User Guidance)

**Recommend timer mode when:**
- User has high accuracy (>80%) on a game
- User has completed multiple untimed sessions
- User explicitly seeks more challenge

**Recommend untimed mode when:**
- Learning new words
- Returning after a break
- Building foundational vocabulary

---

## 8. Technical Considerations

### 8.1 Data Model

#### Timer Settings Type
```typescript
interface TimerSettings {
  enabled: boolean;
  // Future: custom duration multiplier for accessibility
  durationMultiplier?: number;
}
```

#### Per-Game Timer Settings
```typescript
interface GameTimerSettings {
  memory: TimerSettings;
  spelling: TimerSettings;
  flashcards: TimerSettings;
  hangman: TimerSettings;
}
```

#### Timer State During Game
```typescript
interface TimerState {
  isRunning: boolean;
  totalTime: number;      // Total time allocated (ms)
  remainingTime: number;  // Current remaining time (ms)
  bonusEarned: number;    // Total bonus earned this session
  responseTime: number;   // Time taken for current item
}
```

#### Timed Records
```typescript
interface TimedRecords {
  memory: {
    [wordCount: number]: {
      bestRemainingTime: number; // Best time remaining at completion
      bestMoves: number;         // Best moves (may differ from untimed)
    };
  };
  spelling: {
    bestStreak: number;
    bestAverageTime: number;
  };
  flashcards: {
    bestAverageTime: number;
  };
  hangman: {
    bestStreak: number;
    bestAverageTime: number;
  };
}
```

### 8.2 Storage Approach

**LocalStorage Keys:**
```typescript
const TIMER_SETTINGS_KEY = 'learn-eng-timer-settings';
const TIMED_RECORDS_KEY = 'learn-eng-timed-records';
```

**Default Settings:**
```typescript
const DEFAULT_TIMER_SETTINGS: GameTimerSettings = {
  memory: { enabled: false },
  spelling: { enabled: false },
  flashcards: { enabled: false },
  hangman: { enabled: false }
};
```

### 8.3 Timer Configuration

```typescript
// src/config/timerConfig.ts

export const TIMER_CONFIG = {
  memory: {
    baseTime: 60000,           // 60 seconds
    timePerPair: 10000,        // +10 seconds per pair
    matchBonus: 5000,          // +5 seconds for quick match
    quickMatchThreshold: 3000, // Match within 3s of first flip
    warningThreshold: 20000,   // 20 seconds
    criticalThreshold: 10000   // 10 seconds
  },

  spelling: {
    timePerWord: 30000,        // 30 seconds
    maxBonus: 10000,           // +10 seconds max
    bonusDivisor: 3,           // Bonus = remaining / 3
    warningThreshold: 10000,   // 10 seconds
    criticalThreshold: 5000    // 5 seconds
  },

  flashcards: {
    timePerCard: 15000,        // 15 seconds
    maxBonus: 5000,            // +5 seconds max
    bonusDivisor: 3,           // Bonus = remaining / 3
    warningThreshold: 5000,    // 5 seconds
    criticalThreshold: 3000    // 3 seconds
  },

  hangman: {
    timePerWord: 45000,        // 45 seconds
    correctLetterBonus: 3000,  // +3 seconds per correct letter
    warningThreshold: 15000,   // 15 seconds
    criticalThreshold: 8000    // 8 seconds
  }
} as const;

export const SPEED_RATINGS = {
  lightning: { maxTime: 2000, label: 'Lightning Fast', color: '#FFD700' },
  fast: { maxTime: 4000, label: 'Quick Reflexes', color: '#4CAF50' },
  good: { maxTime: 6000, label: 'Good Pace', color: '#2196F3' },
  steady: { maxTime: 10000, label: 'Keep Practicing', color: '#9E9E9E' },
  slow: { maxTime: Infinity, label: 'Try to go faster', color: '#757575' }
} as const;
```

### 8.4 Custom Hook: useGameTimer

```typescript
// src/hooks/useGameTimer.ts

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseGameTimerOptions {
  totalTime: number;
  onTimeUp: () => void;
  onWarning?: () => void;
  onCritical?: () => void;
  warningThreshold?: number;
  criticalThreshold?: number;
  isPaused?: boolean;
}

interface UseGameTimerReturn {
  remainingTime: number;
  isRunning: boolean;
  isWarning: boolean;
  isCritical: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: (newTime?: number) => void;
  addBonus: (bonus: number) => void;
  getElapsedTime: () => number;
}

export const useGameTimer = ({
  totalTime,
  onTimeUp,
  onWarning,
  onCritical,
  warningThreshold = 10000,
  criticalThreshold = 5000,
  isPaused = false
}: UseGameTimerOptions): UseGameTimerReturn => {
  const [remainingTime, setRemainingTime] = useState(totalTime);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  const isWarning = remainingTime <= warningThreshold && remainingTime > criticalThreshold;
  const isCritical = remainingTime <= criticalThreshold;

  useEffect(() => {
    if (!isRunning || isPaused) return;

    const interval = setInterval(() => {
      setRemainingTime(prev => {
        const newTime = prev - 100; // Update every 100ms

        if (newTime <= 0) {
          setIsRunning(false);
          onTimeUp();
          return 0;
        }

        // Trigger callbacks at thresholds
        if (prev > warningThreshold && newTime <= warningThreshold) {
          onWarning?.();
        }
        if (prev > criticalThreshold && newTime <= criticalThreshold) {
          onCritical?.();
        }

        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, onTimeUp, onWarning, onCritical, warningThreshold, criticalThreshold]);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    pausedTimeRef.current = remainingTime;
    setIsRunning(false);
  }, [remainingTime]);

  const resume = useCallback(() => {
    setIsRunning(true);
  }, []);

  const reset = useCallback((newTime?: number) => {
    setRemainingTime(newTime ?? totalTime);
    setIsRunning(false);
    startTimeRef.current = 0;
  }, [totalTime]);

  const addBonus = useCallback((bonus: number) => {
    setRemainingTime(prev => prev + bonus);
  }, []);

  const getElapsedTime = useCallback(() => {
    return totalTime - remainingTime;
  }, [totalTime, remainingTime]);

  return {
    remainingTime,
    isRunning,
    isWarning,
    isCritical,
    start,
    pause,
    resume,
    reset,
    addBonus,
    getElapsedTime
  };
};
```

### 8.5 Component Architecture

#### New Components
```
src/
├── components/
│   ├── TimerToggle/
│   │   ├── TimerToggle.tsx        # Toggle switch component
│   │   └── index.ts
│   │
│   ├── TimerDisplay/
│   │   ├── TimerDisplay.tsx       # In-game timer display
│   │   ├── TimerDisplay.css       # Timer-specific styles
│   │   └── index.ts
│   │
│   ├── TimeBonusPopup/
│   │   ├── TimeBonusPopup.tsx     # "+5s!" floating popup
│   │   └── index.ts
│   │
│   ├── TimeUpOverlay/
│   │   ├── TimeUpOverlay.tsx      # "Time's up!" overlay
│   │   └── index.ts
│   │
│   └── SpeedSummary/
│       ├── SpeedSummary.tsx       # End-of-game speed stats
│       └── index.ts
│
├── hooks/
│   ├── useGameTimer.ts            # Timer logic hook
│   └── useTimerSettings.ts        # Timer settings persistence
│
├── config/
│   └── timerConfig.ts             # Timer parameters
│
└── types/
    └── timer.ts                   # TypeScript interfaces
```

#### Modified Components
```
src/components/
├── MemoryGame/
│   └── MemoryGame.tsx     # Add timer integration
├── SpellingGame/
│   └── SpellingGame.tsx   # Add timer integration
├── FlashcardsGame/
│   └── FlashcardsGame.tsx # Add timer integration
└── HangmanGame/
    └── HangmanGame.tsx    # Add timer integration
```

### 8.6 Performance Considerations

| Concern | Solution |
|---------|----------|
| Timer accuracy | Use `setInterval` with 100ms precision, track drift |
| Re-renders | Timer state isolated in hook, memoize display component |
| Tab visibility | Use `visibilitychange` event to pause/resume timer |
| Memory leaks | Clean up intervals in useEffect cleanup |
| Animation performance | Use CSS animations, not JS-driven |
| Mobile battery | Reduce timer precision when in background |

### 8.7 Browser Tab Handling

```typescript
// Handle tab visibility changes
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      pause();
    } else {
      resume();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, [pause, resume]);
```

---

## 9. MVP vs Future Iterations

### MVP Scope (Phase 1)

**Must Have:**
1. Timer toggle on game start screen for all 4 games
2. Basic countdown timer display in game header
3. Time-up handling (counts as wrong answer)
4. Timer settings persistence per game
5. Warning color states (normal -> warning -> critical)

**MVP Parameter Simplification:**
- Use fixed times (no bonus system yet)
- No speed ratings or performance summary
- No separate timed records (just enable/disable timer)

| Game | MVP Timer |
|------|-----------|
| Memory | 120 seconds total |
| Spelling | 30 seconds per word |
| Flashcards | 15 seconds per card |
| Hangman | 45 seconds per word |

**Implementation Priority:**
1. `useGameTimer` hook
2. `TimerDisplay` component
3. `TimerToggle` component
4. Integrate with Spelling Game (simplest, per-word timer)
5. Integrate with Flashcards Game
6. Integrate with Hangman Game
7. Integrate with Memory Game (total timer)
8. Timer settings persistence

**Estimated Effort:** 3-4 development days

---

### Phase 2 Enhancements

**Should Have:**
1. Time bonus system for fast answers
2. `TimeBonusPopup` component
3. Speed performance summary at end of game
4. Separate timed/untimed records
5. Speed ratings (Lightning, Fast, Good, etc.)
6. Average response time tracking

**Estimated Effort:** 2-3 development days

---

### Phase 3: Advanced Features

**Nice to Have:**
1. Accessibility time multiplier setting
2. Audio cues for warnings (optional)
3. Visual pulse animations
4. In-game timer toggle
5. Personal best time notifications
6. Time improvement trends over sessions

**Estimated Effort:** 2-3 development days

---

### Long-term Vision

1. **Adaptive Timer**: Adjust time based on word difficulty and user history
2. **Challenge Modes**: "Speed Run" - all words, fastest total time
3. **Leaderboards**: Compare timed scores with other users
4. **Daily Time Challenges**: Beat your yesterday's average
5. **Time-based Achievements**: "Lightning Learner" - 10 answers under 2s

---

## 10. Open Questions

### Assumptions Made

1. **Timer is per-game, not global**: Each game has its own timer on/off setting
2. **Untimed is default**: New users should not feel pressured by timer
3. **Time-out = wrong answer**: Consistent penalty across all games
4. **Tab switching pauses timer**: Fair treatment for multitaskers
5. **No time penalty for wrong guesses (Hangman)**: Already has wrong-guess penalty

### Questions for Stakeholders

1. **Timer persistence scope**: Should timer setting persist per game or globally?
   - Current assumption: Per game

2. **Time-out strictness**: Should time-out end the entire Memory Game, or just count as a "virtual miss"?
   - Current assumption: Game ends when timer reaches 0

3. **Bonus system priority**: Is bonus time system essential for MVP or Phase 2?
   - Current assumption: Phase 2 (MVP is simpler fixed times)

4. **Record separation**: Should timed and untimed records be completely separate?
   - Current assumption: Yes, separate records

5. **Accessibility default**: Should there be an "extended time" accessibility option from day 1?
   - Current assumption: Phase 3 (MVP assumes standard times)

### Areas Requiring User Research

1. **Timer anxiety**: Do users feel stressed by timer? Does it hurt engagement?

2. **Optimal durations**: Are the proposed times (30s, 15s, 45s) appropriate for the target audience?

3. **Bonus effectiveness**: Does bonus time motivation outweigh complexity?

4. **Speed rating impact**: Do speed ratings motivate or discourage users?

5. **Discovery of timer toggle**: Is the toggle placement discoverable enough?

### Technical Questions

1. **Timer precision**: Is 100ms update frequency sufficient, or do users expect smoother countdown?

2. **Memory Game timer scope**: Total time vs. per-flip time - which is more engaging?

3. **Flashcards interaction**: How does timer mode interact with spaced repetition? Should fast answers increase box level faster?
   - Current assumption: No, only affects speed tracking

4. **Offline resilience**: If connection drops mid-game, should timer pause?

---

## Appendix A: Hebrew UI Labels

| English | Hebrew |
|---------|--------|
| Timer Mode | מצב טיימר |
| Timer | טיימר |
| On | פעיל |
| Off | כבוי |
| Time's Up! | נגמר הזמן! |
| seconds | שניות |
| Bonus | בונוס |
| Speed | מהירות |
| Average Response | זמן תגובה ממוצע |
| Fastest Answer | תשובה מהירה ביותר |
| Time Remaining | זמן שנותר |
| Play at your own pace | שחק בקצב שלך |
| Time-based challenge | אתגר מבוסס זמן |
| Lightning Fast | מהירות ברק |
| Quick Reflexes | רפלקסים מהירים |
| Good Pace | קצב טוב |
| Keep Practicing | המשך להתאמן |
| Speed Performance | ביצועי מהירות |

---

## Appendix B: CSS Variables for Timer

```css
/* Add to main.css */

:root {
  /* Timer Toggle */
  --timer-toggle-off-bg: #e0e0e0;
  --timer-toggle-off-handle: #ffffff;
  --timer-toggle-on-bg: #4CAF50;
  --timer-toggle-on-handle: #ffffff;

  /* Timer Display States */
  --timer-normal: #333333;
  --timer-normal-bg: rgba(0, 0, 0, 0.05);
  --timer-warning: #FF9800;
  --timer-warning-bg: rgba(255, 152, 0, 0.15);
  --timer-critical: #F44336;
  --timer-critical-bg: rgba(244, 67, 54, 0.15);

  /* Speed Ratings */
  --speed-lightning: #FFD700;
  --speed-fast: #4CAF50;
  --speed-good: #2196F3;
  --speed-steady: #9E9E9E;

  /* Bonus Popup */
  --bonus-color: #4CAF50;
}

/* Timer Display */
.timer-display {
  display: flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  font-size: 1.1rem;
  transition: background-color 0.3s, color 0.3s;
}

.timer-display.normal {
  background: var(--timer-normal-bg);
  color: var(--timer-normal);
}

.timer-display.warning {
  background: var(--timer-warning-bg);
  color: var(--timer-warning);
  animation: pulse-warning 1s ease-in-out infinite;
}

.timer-display.critical {
  background: var(--timer-critical-bg);
  color: var(--timer-critical);
  animation: pulse-critical 0.5s ease-in-out infinite;
}

@keyframes pulse-warning {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes pulse-critical {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

/* Timer Toggle */
.timer-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--card-background);
  border-radius: 12px;
  cursor: pointer;
}

.timer-toggle-switch {
  width: 50px;
  height: 28px;
  background: var(--timer-toggle-off-bg);
  border-radius: 14px;
  position: relative;
  transition: background-color 0.3s;
}

.timer-toggle-switch.on {
  background: var(--timer-toggle-on-bg);
}

.timer-toggle-handle {
  width: 24px;
  height: 24px;
  background: var(--timer-toggle-off-handle);
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.timer-toggle-switch.on .timer-toggle-handle {
  transform: translateX(22px);
}

/* Bonus Popup */
.bonus-popup {
  position: absolute;
  color: var(--bonus-color);
  font-weight: bold;
  font-size: 1.2rem;
  animation: bonus-float 1s ease-out forwards;
}

@keyframes bonus-float {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-30px) scale(1.2);
  }
}

/* Time Up Overlay */
.time-up-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fade-in 0.3s ease-out;
}

.time-up-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  max-width: 300px;
}

.time-up-title {
  color: var(--timer-critical);
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

/* Speed Rating Badge */
.speed-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
}

.speed-badge.lightning {
  background: rgba(255, 215, 0, 0.2);
  color: #B8860B;
}

.speed-badge.fast {
  background: rgba(76, 175, 80, 0.2);
  color: #2E7D32;
}

.speed-badge.good {
  background: rgba(33, 150, 243, 0.2);
  color: #1565C0;
}

.speed-badge.steady {
  background: rgba(158, 158, 158, 0.2);
  color: #616161;
}
```

---

## Appendix C: Timer Flow Diagrams

### Spelling Game Timer Flow

```
[New Word Shown]
       |
       v
[Start Timer: 30s]
       |
       +---> [User places letters]
       |            |
       |            v
       |     [User clicks "Check"]
       |            |
       |     +------+------+
       |     |             |
       |  [Correct]    [Incorrect]
       |     |             |
       |     v             v
       | [Pause Timer] [Pause Timer]
       |     |             |
       |     v             v
       | [Show bonus] [Show correct]
       |     |             |
       |     v             v
       | [+Bonus time]  [Reset streak]
       |     |             |
       |     +------+------+
       |            |
       |            v
       |     [Next Word]
       |            |
       +------------+
       |
[Timer reaches 0]
       |
       v
[Time's Up! - Wrong]
       |
       v
[Show correct answer]
       |
       v
[Next Word with fresh timer]
```

### Memory Game Timer Flow

```
[Game Start]
       |
       v
[Calculate total time: 60 + (pairs * 10)]
       |
       v
[Start Timer]
       |
       +---> [User flips cards]
       |            |
       |     [2 cards flipped?]
       |            |
       |     +------+------+
       |     |             |
       |  [Match]      [No Match]
       |     |             |
       |     v             v
       | [+Bonus if fast] [No penalty]
       |     |             |
       |     v             v
       | [Check: all matched?]
       |            |
       |     +------+------+
       |     |             |
       |   [Yes]         [No]
       |     |             |
       |     v             |
       | [Game Complete]  |
       | [Stop Timer]     |
       | [Record time]    |
       |                  |
       +------------------+
       |
[Timer reaches 0]
       |
       v
[Game Over - Incomplete]
       |
       v
[Show "Time's Up!"]
       |
       v
[Display final progress]
```

---

*End of Design Document*
