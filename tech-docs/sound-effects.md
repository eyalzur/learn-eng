# Technical Design: Sound Effects for Feedback

## Overview

This document details the technical implementation plan for adding an audio feedback system to the Learn English application. The system will provide pleasant, non-intrusive sound effects for game events (correct/incorrect answers, game completion, streaks, achievements) across all four games (Memory, Spelling, Flashcards, Hangman), with user-configurable settings and visual alternatives for accessibility.

The implementation uses the Web Audio API for low-latency playback, a singleton AudioService for centralized audio management, and a custom React hook (`useSound`) for seamless integration with game components.

## Design Document Reference

Source: `/design-docs/sound-effects.md`
Version: 1.0
Status: Design Complete

---

## Requirements Summary

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | Play distinct sounds for correct/incorrect answers | MVP |
| FR-2 | Sound toggle button visible in game menu header | MVP |
| FR-3 | Toggle state persists across sessions (localStorage) | MVP |
| FR-4 | Integration with all four games | MVP |
| FR-5 | Visual feedback alternatives when sound disabled | MVP |
| FR-6 | Game completion sounds | Phase 2 |
| FR-7 | Streak milestone sounds (5, 10, 15+) | Phase 2 |
| FR-8 | New record celebration sound | Phase 2 |
| FR-9 | In-game sound toggle (game headers) | Phase 2 |
| FR-10 | Volume slider control | Phase 3 |
| FR-11 | Sound category toggles | Phase 3 |

### Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Playback latency | <50ms |
| Sound adoption rate | >60% users keep sounds enabled |
| Total audio bundle size | <300KB |
| Browser compatibility | Chrome 66+, Firefox 60+, Safari 14+, Edge 79+ |
| Accessibility | WCAG 2.1 AA compliant |

---

## Architecture

### System Overview

The sound effects system follows a layered architecture with clear separation of concerns:

```
+------------------+     +------------------+     +------------------+
|   UI Components  |     |   Custom Hook    |     |   Audio Service  |
|   (Games, Menu)  | --> |   (useSound)     | --> |   (AudioService) |
+------------------+     +------------------+     +------------------+
         |                       |                        |
         v                       v                        v
+------------------+     +------------------+     +------------------+
|  SoundToggle     |     |  React Context   |     |  Web Audio API   |
|  Component       |     |  (SoundContext)  |     |  + AudioBuffers  |
+------------------+     +------------------+     +------------------+
                                 |
                                 v
                         +------------------+
                         |   localStorage   |
                         +------------------+
```

### Component Diagram

```
src/
+-- services/
|   +-- audioService.ts          # Core audio service singleton
|
+-- contexts/
|   +-- SoundContext.tsx         # React context for sound state
|
+-- hooks/
|   +-- useSound.ts              # Custom hook for sound playback
|
+-- components/
|   +-- SoundToggle/
|   |   +-- SoundToggle.tsx      # Toggle button component
|   |   +-- SoundToggle.css      # Toggle styles
|   |   +-- index.ts             # Barrel export
|   |
|   +-- GameMenu/
|   |   +-- GameMenu.tsx         # Modified: Add SoundToggle
|   |
|   +-- MemoryGame/
|   |   +-- MemoryGame.tsx       # Modified: Add sound hooks
|   |
|   +-- SpellingGame/
|   |   +-- SpellingGame.tsx     # Modified: Add sound hooks
|   |
|   +-- FlashcardsGame/
|   |   +-- FlashcardsGame.tsx   # Modified: Add sound hooks
|   |
|   +-- HangmanGame/
|       +-- HangmanGame.tsx      # Modified: Add sound hooks
|
+-- styles/
    +-- main.css                 # Modified: Add sound toggle styles

public/
+-- sounds/
    +-- correct.mp3
    +-- correct.ogg
    +-- incorrect.mp3
    +-- incorrect.ogg
    +-- game-complete.mp3        # Phase 2
    +-- game-complete.ogg        # Phase 2
    +-- game-over.mp3            # Phase 2
    +-- game-over.ogg            # Phase 2
    +-- streak.mp3               # Phase 2
    +-- streak.ogg               # Phase 2
    +-- new-record.mp3           # Phase 2
    +-- new-record.ogg           # Phase 2
```

### Integration Points

1. **App.tsx**: Wraps application with SoundProvider context
2. **GameMenu.tsx**: Adds SoundToggle component to header
3. **Each Game Component**: Imports and uses `useSound` hook for audio feedback
4. **localStorage**: Persists sound enabled/disabled preference
5. **Web Audio API**: Handles low-latency audio playback

---

## Data Model

### TypeScript Interfaces

```typescript
// src/types/audio.ts

/**
 * Sound type identifiers for all available sound effects
 */
export type SoundType =
  | 'correct'
  | 'incorrect'
  | 'gameComplete'
  | 'gameOver'
  | 'streak'
  | 'newRecord';

/**
 * Sound file configuration for a single sound effect
 */
export interface SoundConfig {
  /** Unique identifier matching SoundType */
  id: SoundType;
  /** Display name for debugging/logging */
  name: string;
  /** Base path without extension (e.g., '/sounds/correct') */
  basePath: string;
  /** Relative volume (0.0 - 1.0) */
  volume: number;
  /** Duration in milliseconds (for documentation) */
  duration: number;
  /** Sound category for future category toggles */
  category: SoundCategory;
}

/**
 * Sound categories for grouped enable/disable (Phase 3)
 */
export type SoundCategory = 'feedback' | 'celebration' | 'ui';

/**
 * User's audio preferences stored in localStorage
 */
export interface AudioSettings {
  /** Master enable/disable toggle */
  enabled: boolean;
  /** Master volume (0.0 - 1.0) - Phase 3 */
  volume: number;
  /** Category-specific toggles - Phase 3 */
  categories: Record<SoundCategory, boolean>;
  /** First-time user flag for intro toast */
  hasSeenIntro: boolean;
}

/**
 * AudioService initialization state
 */
export interface AudioServiceState {
  /** Whether AudioContext has been created */
  initialized: boolean;
  /** Whether all sounds have been preloaded */
  preloaded: boolean;
  /** Whether audio is currently enabled */
  enabled: boolean;
  /** Any initialization errors */
  error: Error | null;
}

/**
 * Sound context value provided to React components
 */
export interface SoundContextValue {
  /** Current enabled state */
  soundEnabled: boolean;
  /** Toggle sound on/off */
  toggleSound: () => void;
  /** Play a specific sound by type */
  playSound: (sound: SoundType) => void;
  /** Convenience methods for common sounds */
  playCorrect: () => void;
  playIncorrect: () => void;
  playGameComplete: () => void;
  playGameOver: () => void;
  playStreak: () => void;
  playNewRecord: () => void;
  /** Service state for UI feedback */
  isReady: boolean;
}
```

### Sound Configuration Registry

```typescript
// src/config/sounds.ts

import { SoundConfig, SoundType } from '../types/audio';

/**
 * Registry of all available sound effects with their configurations
 */
export const SOUND_CONFIGS: Record<SoundType, SoundConfig> = {
  correct: {
    id: 'correct',
    name: 'Correct Answer',
    basePath: '/sounds/correct',
    volume: 0.7,
    duration: 300,
    category: 'feedback',
  },
  incorrect: {
    id: 'incorrect',
    name: 'Incorrect Answer',
    basePath: '/sounds/incorrect',
    volume: 0.6,
    duration: 400,
    category: 'feedback',
  },
  gameComplete: {
    id: 'gameComplete',
    name: 'Game Complete',
    basePath: '/sounds/game-complete',
    volume: 0.9,
    duration: 1000,
    category: 'celebration',
  },
  gameOver: {
    id: 'gameOver',
    name: 'Game Over',
    basePath: '/sounds/game-over',
    volume: 0.5,
    duration: 600,
    category: 'celebration',
  },
  streak: {
    id: 'streak',
    name: 'Streak Milestone',
    basePath: '/sounds/streak',
    volume: 0.8,
    duration: 500,
    category: 'celebration',
  },
  newRecord: {
    id: 'newRecord',
    name: 'New Record',
    basePath: '/sounds/new-record',
    volume: 1.0,
    duration: 1200,
    category: 'celebration',
  },
};

/**
 * Supported audio formats in order of preference
 */
export const AUDIO_FORMATS = [
  { extension: 'ogg', mimeType: 'audio/ogg' },
  { extension: 'mp3', mimeType: 'audio/mpeg' },
] as const;

/**
 * localStorage key for audio settings
 */
export const AUDIO_SETTINGS_KEY = 'learn-eng-audio-settings';

/**
 * Default audio settings for new users
 */
export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  enabled: true,
  volume: 0.7,
  categories: {
    feedback: true,
    celebration: true,
    ui: true,
  },
  hasSeenIntro: false,
};
```

### Storage Schema

```typescript
// localStorage structure

// Key: 'learn-eng-audio-settings'
// Value: JSON string of AudioSettings
{
  "enabled": true,
  "volume": 0.7,
  "categories": {
    "feedback": true,
    "celebration": true,
    "ui": true
  },
  "hasSeenIntro": false
}
```

---

## Frontend Design

### AudioService Class Architecture

```typescript
// src/services/audioService.ts

import {
  SoundType,
  AudioServiceState,
  AudioSettings,
} from '../types/audio';
import {
  SOUND_CONFIGS,
  AUDIO_FORMATS,
  AUDIO_SETTINGS_KEY,
  DEFAULT_AUDIO_SETTINGS,
} from '../config/sounds';

/**
 * Singleton service for managing audio playback using Web Audio API.
 *
 * Features:
 * - Low-latency playback via pre-decoded AudioBuffers
 * - Graceful degradation when audio unavailable
 * - Automatic format selection based on browser support
 * - Settings persistence via localStorage
 * - Browser autoplay policy compliance
 */
class AudioService {
  private static instance: AudioService | null = null;

  private audioContext: AudioContext | null = null;
  private soundBuffers: Map<SoundType, AudioBuffer> = new Map();
  private gainNode: GainNode | null = null;
  private settings: AudioSettings;
  private state: AudioServiceState = {
    initialized: false,
    preloaded: false,
    enabled: true,
    error: null,
  };

  private constructor() {
    this.settings = this.loadSettings();
    this.state.enabled = this.settings.enabled;
  }

  /**
   * Get singleton instance of AudioService
   */
  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  /**
   * Initialize the AudioContext. Must be called after user interaction
   * due to browser autoplay policies.
   */
  public async initialize(): Promise<void> {
    if (this.state.initialized) {
      return;
    }

    try {
      // Handle Safari webkit prefix
      const AudioContextClass =
        window.AudioContext ||
        (window as any).webkitAudioContext;

      if (!AudioContextClass) {
        throw new Error('Web Audio API not supported');
      }

      this.audioContext = new AudioContextClass();

      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = this.settings.volume;

      // Resume if suspended (browser autoplay policy)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.state.initialized = true;

      // Preload sounds after initialization
      await this.preloadSounds();
    } catch (error) {
      this.state.error = error as Error;
      console.warn('[AudioService] Initialization failed:', error);
    }
  }

  /**
   * Preload all sound files into AudioBuffers for instant playback
   */
  private async preloadSounds(): Promise<void> {
    if (!this.audioContext || this.state.preloaded) {
      return;
    }

    const loadPromises = Object.values(SOUND_CONFIGS).map(async (config) => {
      try {
        const buffer = await this.loadSoundBuffer(config.basePath);
        if (buffer) {
          this.soundBuffers.set(config.id, buffer);
        }
      } catch (error) {
        console.warn(`[AudioService] Failed to load sound: ${config.id}`, error);
        // Continue loading other sounds - graceful degradation
      }
    });

    await Promise.all(loadPromises);
    this.state.preloaded = true;
  }

  /**
   * Load a sound file and decode it to an AudioBuffer
   */
  private async loadSoundBuffer(basePath: string): Promise<AudioBuffer | null> {
    if (!this.audioContext) {
      return null;
    }

    // Try formats in order of preference
    for (const format of AUDIO_FORMATS) {
      try {
        const url = `${basePath}.${format.extension}`;
        const response = await fetch(url);

        if (!response.ok) {
          continue; // Try next format
        }

        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        return audioBuffer;
      } catch (error) {
        // Try next format
        continue;
      }
    }

    return null;
  }

  /**
   * Play a sound effect by type
   */
  public play(soundType: SoundType): void {
    // Check if audio is enabled
    if (!this.state.enabled || !this.audioContext || !this.gainNode) {
      return;
    }

    // Check if sound is loaded
    const buffer = this.soundBuffers.get(soundType);
    if (!buffer) {
      console.warn(`[AudioService] Sound not loaded: ${soundType}`);
      return;
    }

    // Get sound config for volume
    const config = SOUND_CONFIGS[soundType];

    // Check category setting (Phase 3)
    if (!this.settings.categories[config.category]) {
      return;
    }

    try {
      // Resume context if suspended (can happen on mobile tab switch)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      // Create a new buffer source for each play (they are one-shot)
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;

      // Create individual gain node for this sound's volume
      const soundGain = this.audioContext.createGain();
      soundGain.gain.value = config.volume;

      // Connect: source -> soundGain -> masterGain -> destination
      source.connect(soundGain);
      soundGain.connect(this.gainNode);

      source.start(0);
    } catch (error) {
      console.warn(`[AudioService] Failed to play sound: ${soundType}`, error);
    }
  }

  /**
   * Enable or disable sound effects
   */
  public setEnabled(enabled: boolean): void {
    this.state.enabled = enabled;
    this.settings.enabled = enabled;
    this.saveSettings();
  }

  /**
   * Check if sound effects are currently enabled
   */
  public isEnabled(): boolean {
    return this.state.enabled;
  }

  /**
   * Set master volume (0.0 - 1.0)
   */
  public setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.settings.volume = clampedVolume;

    if (this.gainNode) {
      this.gainNode.gain.value = clampedVolume;
    }

    this.saveSettings();
  }

  /**
   * Get current master volume
   */
  public getVolume(): number {
    return this.settings.volume;
  }

  /**
   * Set category enabled state (Phase 3)
   */
  public setCategoryEnabled(category: SoundCategory, enabled: boolean): void {
    this.settings.categories[category] = enabled;
    this.saveSettings();
  }

  /**
   * Mark intro as seen
   */
  public markIntroSeen(): void {
    this.settings.hasSeenIntro = true;
    this.saveSettings();
  }

  /**
   * Check if user has seen intro
   */
  public hasSeenIntro(): boolean {
    return this.settings.hasSeenIntro;
  }

  /**
   * Get current service state
   */
  public getState(): AudioServiceState {
    return { ...this.state };
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): AudioSettings {
    try {
      const stored = localStorage.getItem(AUDIO_SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to handle new properties
        return { ...DEFAULT_AUDIO_SETTINGS, ...parsed };
      }
    } catch (error) {
      console.warn('[AudioService] Failed to load settings:', error);
    }
    return { ...DEFAULT_AUDIO_SETTINGS };
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    try {
      localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.warn('[AudioService] Failed to save settings:', error);
    }
  }

  /**
   * Clean up resources (call on app unmount if needed)
   */
  public dispose(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.soundBuffers.clear();
    this.gainNode = null;
    this.state.initialized = false;
    this.state.preloaded = false;
  }
}

// Export singleton instance
export const audioService = AudioService.getInstance();
```

### React Context for Sound State

```typescript
// src/contexts/SoundContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { SoundContextValue, SoundType } from '../types/audio';
import { audioService } from '../services/audioService';

const SoundContext = createContext<SoundContextValue | null>(null);

interface SoundProviderProps {
  children: ReactNode;
}

export const SoundProvider: React.FC<SoundProviderProps> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() =>
    audioService.isEnabled()
  );
  const [isReady, setIsReady] = useState<boolean>(false);

  // Initialize audio on first user interaction
  useEffect(() => {
    let mounted = true;

    const initAudio = async () => {
      await audioService.initialize();
      if (mounted) {
        setIsReady(audioService.getState().preloaded);
      }
    };

    const handleFirstInteraction = () => {
      initAudio();
      // Remove listeners after first interaction
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    // Add listeners for first interaction
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      mounted = false;
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  const toggleSound = useCallback(() => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    audioService.setEnabled(newState);
  }, [soundEnabled]);

  const playSound = useCallback((sound: SoundType) => {
    if (soundEnabled) {
      audioService.play(sound);
    }
  }, [soundEnabled]);

  // Convenience methods
  const playCorrect = useCallback(() => playSound('correct'), [playSound]);
  const playIncorrect = useCallback(() => playSound('incorrect'), [playSound]);
  const playGameComplete = useCallback(() => playSound('gameComplete'), [playSound]);
  const playGameOver = useCallback(() => playSound('gameOver'), [playSound]);
  const playStreak = useCallback(() => playSound('streak'), [playSound]);
  const playNewRecord = useCallback(() => playSound('newRecord'), [playSound]);

  const value = useMemo<SoundContextValue>(() => ({
    soundEnabled,
    toggleSound,
    playSound,
    playCorrect,
    playIncorrect,
    playGameComplete,
    playGameOver,
    playStreak,
    playNewRecord,
    isReady,
  }), [
    soundEnabled,
    toggleSound,
    playSound,
    playCorrect,
    playIncorrect,
    playGameComplete,
    playGameOver,
    playStreak,
    playNewRecord,
    isReady,
  ]);

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};

/**
 * Hook to access sound context
 * @throws Error if used outside SoundProvider
 */
export const useSoundContext = (): SoundContextValue => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSoundContext must be used within a SoundProvider');
  }
  return context;
};
```

### useSound Custom Hook

```typescript
// src/hooks/useSound.ts

import { useSoundContext } from '../contexts/SoundContext';
import { SoundContextValue } from '../types/audio';

/**
 * Custom hook for accessing sound functionality in components.
 *
 * @example
 * ```tsx
 * const { playCorrect, playIncorrect, soundEnabled, toggleSound } = useSound();
 *
 * const handleAnswer = (isCorrect: boolean) => {
 *   if (isCorrect) {
 *     playCorrect();
 *   } else {
 *     playIncorrect();
 *   }
 * };
 * ```
 */
export const useSound = (): SoundContextValue => {
  return useSoundContext();
};
```

### SoundToggle Component

```typescript
// src/components/SoundToggle/SoundToggle.tsx

import React, { useState, useCallback } from 'react';
import { useSound } from '../../hooks/useSound';
import './SoundToggle.css';

interface SoundToggleProps {
  /** Size variant for different contexts */
  size?: 'small' | 'medium' | 'large';
  /** Optional additional class name */
  className?: string;
}

/**
 * Toggle button for enabling/disabling sound effects.
 * Displays speaker icon when enabled, muted icon when disabled.
 */
export const SoundToggle: React.FC<SoundToggleProps> = ({
  size = 'medium',
  className = '',
}) => {
  const { soundEnabled, toggleSound } = useSound();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = useCallback(() => {
    toggleSound();

    // Trigger pulse animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
  }, [toggleSound]);

  const sizeClass = `sound-toggle--${size}`;
  const stateClass = soundEnabled ? 'sound-toggle--enabled' : 'sound-toggle--disabled';
  const animatingClass = isAnimating ? 'sound-toggle--animating' : '';

  return (
    <button
      className={`sound-toggle ${sizeClass} ${stateClass} ${animatingClass} ${className}`}
      onClick={handleClick}
      aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
      aria-pressed={soundEnabled}
      title={soundEnabled ? 'Sound on (click to mute)' : 'Sound off (click to enable)'}
      type="button"
    >
      {soundEnabled ? <SpeakerIcon /> : <MutedIcon />}
    </button>
  );
};

/**
 * Speaker icon (sound enabled state)
 */
const SpeakerIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

/**
 * Muted icon (sound disabled state)
 */
const MutedIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

export default SoundToggle;
```

```css
/* src/components/SoundToggle/SoundToggle.css */

.sound-toggle {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: transform 0.1s ease, background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.9);
  /* Minimum touch target */
  min-width: 48px;
  min-height: 48px;
}

.sound-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sound-toggle:active {
  transform: scale(0.95);
}

.sound-toggle:focus {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

.sound-toggle:focus:not(:focus-visible) {
  outline: none;
}

.sound-toggle:focus-visible {
  outline: 2px solid #ffd700;
  outline-offset: 2px;
}

/* Size variants */
.sound-toggle--small svg {
  width: 20px;
  height: 20px;
}

.sound-toggle--medium svg {
  width: 24px;
  height: 24px;
}

.sound-toggle--large svg {
  width: 32px;
  height: 32px;
}

/* State variants */
.sound-toggle--enabled {
  color: rgba(255, 255, 255, 0.9);
}

.sound-toggle--disabled {
  color: rgba(255, 255, 255, 0.5);
}

/* Animation */
.sound-toggle--animating {
  animation: soundTogglePulse 0.2s ease;
}

@keyframes soundTogglePulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
```

```typescript
// src/components/SoundToggle/index.ts

export { SoundToggle } from './SoundToggle';
export { default } from './SoundToggle';
```

### State Management

The sound system uses a combination of:

1. **React Context** (`SoundContext`): Provides sound state and methods to all components
2. **Singleton Service** (`AudioService`): Manages Web Audio API, buffers, and settings
3. **localStorage**: Persists user preferences across sessions

State Flow:
```
User toggles sound
       |
       v
SoundContext.toggleSound()
       |
       v
AudioService.setEnabled()
       |
       +---> Update internal state
       |
       +---> Save to localStorage
       |
       v
React re-renders with new state
```

---

## Backend Design

This feature is entirely client-side and does not require backend changes. All audio files are served as static assets, and settings are stored in localStorage.

### Static Asset Configuration

Audio files should be placed in `public/sounds/` and will be served by the existing webpack dev server and production build process.

```javascript
// No webpack configuration changes needed
// Static assets in public/ are copied as-is to build output
```

---

## Integration with Existing Games

### Memory Game Integration

```typescript
// src/components/MemoryGame/MemoryGame.tsx

import { useSound } from '../../hooks/useSound';

export const MemoryGame: React.FC<MemoryGameProps> = ({ wordCount: defaultWordCount = 5, onBack }) => {
  const { playCorrect, playIncorrect, playGameComplete, playNewRecord } = useSound();

  // ... existing state ...

  const handleCardClick = (cardId: string) => {
    // ... existing logic ...

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);
      setIsChecking(true);

      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.wordId === secondCard.wordId) {
        // Match found - play correct sound
        playCorrect();

        setTimeout(() => {
          // ... existing match logic ...
          setMatchedPairs((prev) => prev + 1);

          // Check for game completion
          if (matchedPairs + 1 === wordCount) {
            playGameComplete();
          }
        }, 500);
      } else {
        // No match - play incorrect sound
        playIncorrect();

        setTimeout(() => {
          // ... existing flip-back logic ...
        }, 1000);
      }
    }
  };

  // Check for new record when game completes
  useEffect(() => {
    if (matchedPairs === wordCount && matchedPairs > 0) {
      const isNew = saveRecord(wordCount, moves);
      if (isNew) {
        setRecord(moves);
        setIsNewRecord(true);
        playNewRecord();
      }
    }
  }, [matchedPairs, wordCount, moves, playNewRecord]);

  // ... rest of component ...
};
```

### Spelling Game Integration

```typescript
// src/components/SpellingGame/SpellingGame.tsx

import { useSound } from '../../hooks/useSound';

export const SpellingGame: React.FC<SpellingGameProps> = ({ onBack }) => {
  const { playCorrect, playIncorrect, playStreak, playNewRecord } = useSound();

  // ... existing state ...

  const checkAnswer = () => {
    if (!currentWord || feedback) return;
    if (letterBoxes.some(box => box === null)) return;

    const answer = letterBoxes.join('').toLowerCase().trim();
    const correct = currentWord.english.toLowerCase().trim();

    const isCorrect = answer === correct;

    if (isCorrect) {
      playCorrect();
      setFeedback('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);
      speak(currentWord.english, 'en');

      // Check for streak milestones (Phase 2)
      if (newStreak === 5 || newStreak === 10 || newStreak === 15 || newStreak === 20) {
        setTimeout(() => playStreak(), 300);
      }

      const isNew = saveRecord(newStreak);
      if (isNew) {
        setRecord(newStreak);
        setIsNewRecord(true);
        setTimeout(() => playNewRecord(), 500);
      }
    } else {
      playIncorrect();
      setFeedback('incorrect');
      if (streak > 0) {
        saveRecord(streak);
      }
    }
  };

  // ... rest of component ...
};
```

### Flashcards Game Integration

```typescript
// src/components/FlashcardsGame/FlashcardsGame.tsx

import { useSound } from '../../hooks/useSound';

export const FlashcardsGame: React.FC<FlashcardsGameProps> = ({ onBack }) => {
  const { playCorrect, playIncorrect } = useSound();

  // ... existing state ...

  const handleAnswer = useCallback((selectedWord: Word) => {
    if (isAnswered || !currentCard) return;

    const isCorrect = selectedWord.id === currentCard.word.id;
    setSelectedAnswer(selectedWord.id);
    setIsAnswered(true);

    // Play feedback sound
    if (isCorrect) {
      playCorrect();
    } else {
      playIncorrect();
    }

    // ... existing spaced repetition logic ...
  }, [isAnswered, currentCard, allCards, questionLang, playCorrect, playIncorrect]);

  // ... rest of component ...
};
```

### Hangman Game Integration

```typescript
// src/components/HangmanGame/HangmanGame.tsx

import { useSound } from '../../hooks/useSound';

export const HangmanGame: React.FC<HangmanGameProps> = ({ onBack }) => {
  const {
    playCorrect,
    playIncorrect,
    playGameComplete,
    playGameOver,
    playStreak,
    playNewRecord
  } = useSound();

  // ... existing state ...

  const handleLetterGuess = (letter: string) => {
    if (gameStatus !== 'playing' || guessedLetters.has(letter)) return;

    const newGuessedLetters = new Set(guessedLetters);
    newGuessedLetters.add(letter);
    setGuessedLetters(newGuessedLetters);

    const targetWord = currentWord.english.toLowerCase();
    const isCorrect = targetWord.includes(letter);

    if (!isCorrect) {
      playIncorrect();
      const newWrongGuesses = [...wrongGuesses, letter];
      setWrongGuesses(newWrongGuesses);

      if (newWrongGuesses.length >= MAX_WRONG_GUESSES) {
        setGameStatus('lost');
        playGameOver();
        if (streak > 0) {
          saveRecord(streak);
        }
        speak(currentWord.english, 'en');
      }
    } else {
      playCorrect();

      const allLettersGuessed = targetWord.split('').every(char =>
        newGuessedLetters.has(char) || char === ' '
      );

      if (allLettersGuessed) {
        setGameStatus('won');
        playGameComplete();

        const newStreak = streak + 1;
        setStreak(newStreak);
        speak(currentWord.english, 'en');

        // Check for streak milestones
        if (newStreak === 5 || newStreak === 10 || newStreak === 15) {
          setTimeout(() => playStreak(), 400);
        }

        const isNew = saveRecord(newStreak);
        if (isNew) {
          setRecord(newStreak);
          setIsNewRecord(true);
          setTimeout(() => playNewRecord(), 600);
        }
      }
    }
  };

  // ... rest of component ...
};
```

### GameMenu Integration

```typescript
// src/components/GameMenu/GameMenu.tsx

import React from 'react';
import { APP_VERSION } from '../../constants/version';
import { SoundToggle } from '../SoundToggle';

// ... existing types and constants ...

export const GameMenu: React.FC<GameMenuProps> = ({ onSelectGame }) => {
  return (
    <div className="game-menu">
      <div className="menu-header">
        <h1>Learn English</h1>
        <p>Choose a game to start</p>
      </div>

      <div className="games-grid">
        {/* ... existing game cards ... */}
      </div>

      <div className="menu-footer">
        <SoundToggle size="medium" />
        <div className="app-version">v{APP_VERSION}</div>
      </div>
    </div>
  );
};
```

### App.tsx Integration

```typescript
// src/App.tsx

import React, { useState, useEffect } from 'react';
import { SoundProvider } from './contexts/SoundContext';
import { MemoryGame } from './components/MemoryGame';
import { SpellingGame } from './components/SpellingGame';
import { FlashcardsGame } from './components/FlashcardsGame';
import { HangmanGame } from './components/HangmanGame';
import { GameMenu, GameType } from './components/GameMenu';
import './styles/main.css';

export const App: React.FC = () => {
  const [currentGame, setCurrentGame] = useState<GameType>(null);

  // ... existing viewport fix ...

  const handleBackToMenu = () => {
    setCurrentGame(null);
  };

  return (
    <SoundProvider>
      <div className="app">
        {currentGame === null && (
          <GameMenu onSelectGame={setCurrentGame} />
        )}
        {currentGame === 'memory' && (
          <MemoryGame onBack={handleBackToMenu} />
        )}
        {currentGame === 'spelling' && (
          <SpellingGame onBack={handleBackToMenu} />
        )}
        {currentGame === 'flashcards' && (
          <FlashcardsGame onBack={handleBackToMenu} />
        )}
        {currentGame === 'hangman' && (
          <HangmanGame onBack={handleBackToMenu} />
        )}
      </div>
    </SoundProvider>
  );
};
```

---

## Audio File Management and Preloading Strategy

### File Structure

```
public/
+-- sounds/
    +-- correct.mp3          # ~15KB, 300ms, feedback sound
    +-- correct.ogg          # ~12KB, 300ms, feedback sound
    +-- incorrect.mp3        # ~20KB, 400ms, feedback sound
    +-- incorrect.ogg        # ~16KB, 400ms, feedback sound
    +-- game-complete.mp3    # ~40KB, 1000ms, celebration (Phase 2)
    +-- game-complete.ogg    # ~32KB, 1000ms, celebration (Phase 2)
    +-- game-over.mp3        # ~28KB, 600ms, celebration (Phase 2)
    +-- game-over.ogg        # ~22KB, 600ms, celebration (Phase 2)
    +-- streak.mp3           # ~25KB, 500ms, celebration (Phase 2)
    +-- streak.ogg           # ~20KB, 500ms, celebration (Phase 2)
    +-- new-record.mp3       # ~50KB, 1200ms, celebration (Phase 2)
    +-- new-record.ogg       # ~40KB, 1200ms, celebration (Phase 2)
```

### Audio File Specifications

| Property | Specification |
|----------|---------------|
| Format | MP3 (fallback), OGG (preferred) |
| Sample Rate | 44.1 kHz |
| Bit Depth | 16-bit |
| Channels | Mono |
| Bitrate | 128 kbps (MP3), Variable (OGG) |
| Normalization | -12dB to -6dB peak |
| Silence Padding | <10ms at start, <50ms at end |

### Preloading Strategy

1. **Lazy Initialization**: AudioContext is only created after the first user interaction (click, touch, or keydown) to comply with browser autoplay policies.

2. **Parallel Loading**: All sound files are fetched in parallel using `Promise.all()` for faster preloading.

3. **Format Selection**: The service tries OGG first (better compression, no licensing), then falls back to MP3 for broader compatibility.

4. **Graceful Degradation**: If a sound file fails to load, the service continues without it. Missing sounds are silently skipped during playback.

5. **Buffer Caching**: Decoded AudioBuffers are stored in a Map for instant playback without re-decoding.

```typescript
// Preloading sequence
User interaction detected
        |
        v
Create AudioContext (resume if suspended)
        |
        v
Parallel fetch all sound files
        |
        v
Decode each file to AudioBuffer
        |
        v
Store buffers in Map<SoundType, AudioBuffer>
        |
        v
Set preloaded = true
```

### Browser Audio Format Support

| Browser | OGG | MP3 | Preferred |
|---------|-----|-----|-----------|
| Chrome | Yes | Yes | OGG |
| Firefox | Yes | Yes | OGG |
| Safari | No | Yes | MP3 |
| Edge | Yes | Yes | OGG |
| Mobile Safari | No | Yes | MP3 |
| Chrome Android | Yes | Yes | OGG |

---

## Technical Considerations

### Performance

1. **Latency**: Using Web Audio API with pre-decoded buffers achieves <50ms latency.
2. **Memory**: ~300KB total for all audio buffers - acceptable overhead.
3. **CPU**: BufferSource creation is lightweight; no significant CPU impact.
4. **Initial Load**: Sounds are loaded after first interaction, not blocking initial render.

### Security

1. **No External Dependencies**: Audio files are self-hosted static assets.
2. **No User Data**: Sound preferences are stored in localStorage only.
3. **CSP Compatible**: No inline scripts or external audio sources required.

### Scalability

1. **Singleton Pattern**: Single AudioContext instance prevents resource exhaustion.
2. **Lazy Loading**: Sounds only loaded when audio is first needed.
3. **Category System**: Ready for future sound pack expansion.

### Error Handling

```typescript
// Error handling strategy

1. AudioContext creation failure
   -> Log warning, disable audio silently
   -> Visual feedback continues to work

2. Sound file fetch failure
   -> Log warning, skip this sound
   -> Other sounds continue to load

3. Audio decode failure
   -> Log warning, skip this sound
   -> Other sounds continue to work

4. Playback failure
   -> Log warning, continue execution
   -> No visible error to user

5. localStorage unavailable
   -> Use default settings (enabled)
   -> Settings not persisted
```

### Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Web Audio API | 66+ | 60+ | 14+ | 79+ |
| AudioContext.state | Yes | Yes | Yes | Yes |
| OGG decoding | Yes | Yes | No | Yes |
| MP3 decoding | Yes | Yes | Yes | Yes |
| localStorage | Yes | Yes | Yes | Yes |

### Mobile Considerations

1. **iOS Audio Session**: AudioContext must be resumed after app backgrounding.
2. **Safari Webkit Prefix**: Use `webkitAudioContext` fallback.
3. **Touch Target Size**: Minimum 48x48px for toggle button.
4. **System Silent Mode**: Respect iOS silent switch (no special handling needed with Web Audio API).

---

## Testing Strategy

### Unit Tests

```typescript
// __tests__/services/audioService.test.ts

describe('AudioService', () => {
  beforeEach(() => {
    // Reset singleton for each test
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('initialization', () => {
    it('should create singleton instance', () => {
      const instance1 = AudioService.getInstance();
      const instance2 = AudioService.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should initialize AudioContext on first call', async () => {
      const service = AudioService.getInstance();
      await service.initialize();
      expect(service.getState().initialized).toBe(true);
    });

    it('should not re-initialize if already initialized', async () => {
      const service = AudioService.getInstance();
      await service.initialize();
      await service.initialize();
      // AudioContext should only be created once
    });
  });

  describe('settings', () => {
    it('should load default settings when localStorage is empty', () => {
      const service = AudioService.getInstance();
      expect(service.isEnabled()).toBe(true);
    });

    it('should persist enabled state to localStorage', () => {
      const service = AudioService.getInstance();
      service.setEnabled(false);
      expect(localStorage.getItem(AUDIO_SETTINGS_KEY)).toContain('"enabled":false');
    });

    it('should load settings from localStorage', () => {
      localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify({ enabled: false }));
      const service = AudioService.getInstance();
      expect(service.isEnabled()).toBe(false);
    });
  });

  describe('playback', () => {
    it('should not play when disabled', async () => {
      const service = AudioService.getInstance();
      await service.initialize();
      service.setEnabled(false);
      // Mock AudioContext and verify no source created
      service.play('correct');
    });

    it('should handle missing sounds gracefully', async () => {
      const service = AudioService.getInstance();
      await service.initialize();
      // Should not throw
      expect(() => service.play('correct')).not.toThrow();
    });
  });
});
```

### Component Tests

```typescript
// __tests__/components/SoundToggle.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { SoundToggle } from '../../components/SoundToggle';
import { SoundProvider } from '../../contexts/SoundContext';

const renderWithProvider = (component: React.ReactNode) => {
  return render(
    <SoundProvider>
      {component}
    </SoundProvider>
  );
};

describe('SoundToggle', () => {
  it('should render speaker icon when sound is enabled', () => {
    renderWithProvider(<SoundToggle />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('should toggle sound on click', () => {
    renderWithProvider(<SoundToggle />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('should have correct aria-label', () => {
    renderWithProvider(<SoundToggle />);
    expect(screen.getByLabelText(/mute sound effects/i)).toBeInTheDocument();
  });

  it('should apply size class', () => {
    renderWithProvider(<SoundToggle size="large" />);
    expect(screen.getByRole('button')).toHaveClass('sound-toggle--large');
  });
});
```

### Integration Tests

```typescript
// __tests__/integration/soundIntegration.test.tsx

describe('Sound Integration', () => {
  it('should play correct sound on correct answer in SpellingGame', async () => {
    const playSpy = jest.spyOn(audioService, 'play');

    render(
      <SoundProvider>
        <SpellingGame />
      </SoundProvider>
    );

    // Simulate correct answer
    // ...

    expect(playSpy).toHaveBeenCalledWith('correct');
  });

  it('should persist sound preference across page reload', () => {
    // Disable sound
    audioService.setEnabled(false);

    // Simulate page reload
    const newService = AudioService.getInstance();

    expect(newService.isEnabled()).toBe(false);
  });
});
```

### Manual Testing Checklist

- [ ] Sound plays immediately on correct answer (<50ms perceived)
- [ ] Sound plays immediately on incorrect answer (<50ms perceived)
- [ ] Toggle button visually indicates current state
- [ ] Toggle persists across page refresh
- [ ] Toggle persists across browser sessions
- [ ] No audio overlap on rapid actions
- [ ] Works on Chrome desktop
- [ ] Works on Firefox desktop
- [ ] Works on Safari desktop
- [ ] Works on Chrome Android
- [ ] Works on Safari iOS
- [ ] Respects system mute on iOS
- [ ] No console errors during playback
- [ ] Accessible via keyboard (Tab + Enter)
- [ ] Screen reader announces toggle state

---

## Implementation Plan

### Phase 1: MVP (2-3 days)

**Day 1: Core Infrastructure**
- [ ] Create TypeScript interfaces and types (`src/types/audio.ts`)
- [ ] Implement AudioService class (`src/services/audioService.ts`)
- [ ] Create sound configuration registry (`src/config/sounds.ts`)
- [ ] Add correct.mp3, correct.ogg, incorrect.mp3, incorrect.ogg to `public/sounds/`

**Day 2: React Integration**
- [ ] Implement SoundContext and Provider (`src/contexts/SoundContext.tsx`)
- [ ] Create useSound hook (`src/hooks/useSound.ts`)
- [ ] Build SoundToggle component with CSS (`src/components/SoundToggle/`)
- [ ] Wrap App with SoundProvider
- [ ] Add SoundToggle to GameMenu

**Day 3: Game Integration**
- [ ] Integrate with MemoryGame (match/mismatch sounds)
- [ ] Integrate with SpellingGame (correct/incorrect sounds)
- [ ] Integrate with FlashcardsGame (correct/incorrect sounds)
- [ ] Integrate with HangmanGame (correct letter/wrong guess sounds)
- [ ] Manual testing on all browsers
- [ ] Write unit tests for AudioService

### Phase 2: Enhanced Feedback (1-2 days)

- [ ] Add game-complete.mp3/ogg, game-over.mp3/ogg sounds
- [ ] Add streak.mp3/ogg, new-record.mp3/ogg sounds
- [ ] Integrate game completion sounds in MemoryGame
- [ ] Integrate game win/lose sounds in HangmanGame
- [ ] Add streak milestone sounds (5, 10, 15+) to SpellingGame and HangmanGame
- [ ] Add new record celebration sound to all games
- [ ] Add SoundToggle to in-game headers (optional)
- [ ] Enhanced visual feedback when sound disabled

### Phase 3: Advanced Features (Future)

- [ ] Volume slider control in settings
- [ ] Sound category toggles (feedback/celebration/UI)
- [ ] First-time user intro toast
- [ ] Keyboard shortcut for mute (M key)
- [ ] Sound preview in settings

### Dependencies

```
Phase 1: No external dependencies
  |
  v
Phase 2: Depends on Phase 1 completion
  |
  v
Phase 3: Depends on Phase 2 completion
```

### Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Audio files not loading | Medium | Low | Graceful degradation, fallback formats |
| Browser autoplay blocked | High | Medium | User interaction trigger, clear error handling |
| Safari webkit issues | Medium | Medium | webkit prefix handling, testing |
| Mobile performance | Medium | Low | Efficient buffer reuse, minimal CPU |
| Sound quality complaints | Low | Low | Professional sound design, user volume control |

---

## Open Questions

1. **Sound Sourcing**: Should we use free sound libraries (Freesound.org, Zapsplat) or commission custom sounds?
   - Recommendation: Start with royalty-free sounds from Mixkit or Zapsplat, iterate based on feedback

2. **Incorrect Sound Tone**: How "negative" should the incorrect sound be?
   - Recommendation: Gentle wooden block sound, supportive not punishing

3. **Streak Sound Frequency**: Play at every milestone or only significant ones?
   - Recommendation: 5, 10, 15, 20 (not every 5 after 20)

4. **TTS Coexistence**: How should sound effects interact with text-to-speech?
   - Recommendation: Play sound effect first, TTS follows naturally (no special handling needed)

---

## Assumptions

1. Users have modern browsers supporting Web Audio API (Chrome 66+, Firefox 60+, Safari 14+)
2. Sound effects default to ON matches user expectations for educational games
3. Total audio bundle size <300KB is acceptable for this application type
4. Simple on/off toggle is sufficient for MVP (category controls in Phase 3)
5. Same sounds used across all games (no game-specific audio variations)
6. No background music needed (sound effects only)
7. Existing localStorage patterns in the app work reliably

---

## Appendix A: CSS Additions to main.css

```css
/* ===================================
   SOUND TOGGLE IN GAME MENU
   =================================== */

.menu-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: auto;
  padding-top: 15px;
}

/* Position version near sound toggle */
.menu-footer .app-version {
  position: static;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
}

/* Sound toggle in game headers */
.game-header .sound-toggle {
  position: absolute;
  top: 10px;
  left: 10px;
}

/* Ensure game headers have relative positioning */
.memory-game .game-header,
.spelling-game .game-header,
.flashcards-game .game-header,
.hangman-game .game-header {
  position: relative;
}
```

---

## Appendix B: Sound File Acquisition

### Recommended Free Sound Sources

| Source | License | URL |
|--------|---------|-----|
| Mixkit | Royalty-free | https://mixkit.co/free-sound-effects/ |
| Freesound | CC0/CC-BY | https://freesound.org/ |
| Zapsplat | Royalty-free | https://www.zapsplat.com/ |
| OpenGameArt | CC0/CC-BY | https://opengameart.org/ |

### Sound Design Guidelines

**Correct Sound**: Cheerful, affirming
- Instrument: Marimba, xylophone, or bell
- Duration: 200-400ms
- Pitch: Medium-high
- Examples to search: "success chime", "correct answer ding", "positive notification"

**Incorrect Sound**: Gentle, not harsh
- Instrument: Soft wooden block or muted pluck
- Duration: 300-500ms
- Pitch: Lower than correct
- Examples to search: "wrong answer", "gentle error", "soft negative"

---

*End of Technical Design Document*
