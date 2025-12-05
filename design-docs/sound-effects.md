# Feature Design: Sound Effects for Feedback

**Version**: 1.0
**Date Created**: 2025-12-05
**Status**: Design Complete

---

## 1. Feature Overview

### Feature Name
**Audio Feedback System** - Add sound effects for correct/incorrect answers and game events.

### One-Line Description
A comprehensive audio feedback system that provides pleasant, non-intrusive sound effects for game events (correct answers, incorrect answers, game completion, streaks, achievements), with user-configurable settings and visual alternatives for accessibility.

### Problem Statement
Currently, all four games (Memory, Spelling, Flashcards, Hangman) provide only visual feedback for user actions. This creates several limitations:

1. **Reduced engagement**: Without audio cues, the learning experience feels flat and less rewarding
2. **Weaker reinforcement**: Sound provides immediate, instinctive feedback that strengthens learning associations
3. **Accessibility gap**: Users who rely on audio cues have a diminished experience
4. **Missing celebration moments**: Achievements and milestones lack the satisfying audio punctuation that makes them memorable
5. **Attention fragmentation**: Users must constantly watch the screen to know their answer result; audio allows peripheral awareness

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Sound Adoption | >60% of users keep sounds enabled after first session | Track sound setting state |
| Engagement Increase | 10% increase in average session duration | Compare sessions with/without sound |
| Preference Split | Healthy distribution (50-70% enabled) | Track setting preferences |
| Mute Accessibility | 100% of users can easily toggle sound | Observe toggle usage patterns |
| Audio Quality | <1% complaints about audio issues | User feedback monitoring |
| Performance Impact | <50ms latency for sound playback | Performance testing |

---

## 2. User Stories

### Primary User Stories

**US-1: Hear Feedback on Answers**
> As a learner, I want to hear a sound when I answer correctly or incorrectly so that I receive immediate audio confirmation of my response.

**Acceptance Criteria:**
- Distinct sound plays for correct answers
- Distinct sound plays for incorrect answers
- Sounds are clearly different and easily distinguishable
- Sounds play immediately (<100ms latency)
- Sounds work across all four games

---

**US-2: Toggle Sound On/Off**
> As a learner, I want to easily turn sound effects on or off so that I can use the app in quiet environments or according to my preference.

**Acceptance Criteria:**
- Sound toggle visible in game menu or header
- Single tap to toggle sound on/off
- Toggle state persists across sessions
- Clear visual indicator of current sound state
- Sound preference remembered per device

---

**US-3: Experience Celebration Audio**
> As a learner, I want to hear celebratory sounds when I complete a game or achieve a streak so that I feel rewarded for my accomplishments.

**Acceptance Criteria:**
- Unique sound for game completion
- Escalating sounds for streak milestones (5, 10, 15+)
- Special sound for new records
- Celebratory sounds are more prominent but not jarring

---

**US-4: Have Pleasant Audio Experience**
> As a learner, I want the sound effects to be pleasant and non-intrusive so that they enhance rather than distract from my learning.

**Acceptance Criteria:**
- Sounds are gentle, not harsh or loud
- Volume is appropriate (not startling)
- Sounds are short (under 1 second for feedback)
- No audio overlap or clipping issues
- Sounds complement the visual design aesthetic

---

**US-5: Access Visual Alternatives**
> As a learner who cannot hear or prefers no sound, I want clear visual feedback alternatives so that I have an equivalent experience without audio.

**Acceptance Criteria:**
- All audio feedback has visual equivalent
- Visual feedback is prominent when sound is disabled
- Color, animation, or icon changes indicate results
- Screen reader announcements for key events

---

### Secondary User Stories

**US-6: Volume Control (Future)**
> As a learner, I want to adjust the volume of sound effects so that I can find my preferred listening level.

**Acceptance Criteria:**
- Volume slider in settings
- Range from muted to full volume
- Volume preference persisted
- Separate from device volume

---

**US-7: Sound Category Control (Future)**
> As a learner, I want to choose which types of sounds to enable so that I can customize my audio experience.

**Acceptance Criteria:**
- Toggle for answer feedback sounds
- Toggle for celebration sounds
- Toggle for UI interaction sounds
- Each category can be individually disabled

---

### Edge Cases

- **Device on silent mode**: Respect system silent/vibrate mode (iOS especially)
- **Multiple rapid answers**: Handle sound overlap gracefully (cancel previous or allow overlap)
- **Browser audio restrictions**: Handle autoplay policies gracefully
- **First-time user**: Default sounds to ON with easy discovery of toggle
- **Page refresh during sound**: Clean up audio resources properly
- **Slow connection**: Sounds should be preloaded, not delay gameplay
- **Mobile background tab**: Handle audio context suspension/resumption

---

## 3. User Experience Flow

### Entry Points for Sound Settings

1. **Game Menu Header**
   - Primary: Sound icon (speaker) in main menu header
   - Tap to toggle on/off instantly

2. **In-Game Header**
   - Secondary: Sound icon in game header during play
   - Same toggle behavior as menu

3. **Settings Page (Future)**
   - Tertiary: Full audio settings in dedicated settings screen
   - Volume control and category toggles

### Sound Toggle Flow

```
[Any Screen]
     |
     v
[Tap Sound Icon]
     |
     +-- Sound ON --> [Mute icon, sounds disabled]
     |
     +-- Sound OFF --> [Speaker icon, sounds enabled]
     |
     v
[Preference saved to localStorage]
[Immediate effect on next sound event]
```

### Sound Event Flow

```
[User Action in Game]
     |
     v
[Determine Event Type]
     |
     +-- Correct Answer --> [Play "correct" sound]
     |
     +-- Incorrect Answer --> [Play "incorrect" sound]
     |
     +-- Game Win --> [Play "game-complete" sound]
     |
     +-- Game Loss --> [Play "game-over" sound]
     |
     +-- Streak Milestone --> [Play "streak" sound]
     |
     +-- New Record --> [Play "record" sound]
     |
     v
[Check Sound Enabled]
     |
     +-- Enabled --> [Play Audio]
     |
     +-- Disabled --> [Show Visual Feedback Only]
```

### Sound Loading Flow

```
[App Initialize]
     |
     v
[Preload all audio files]
     |
     v
[Store in AudioContext/Audio pool]
     |
     v
[Ready for instant playback]
```

### Error States and Recovery

| Error | User Message | Recovery Action |
|-------|--------------|-----------------|
| Audio file failed to load | Silent - no user message | Fall back to visual feedback only |
| AudioContext blocked by browser | "Tap anywhere to enable sounds" | One-time user interaction prompt |
| Storage unavailable | Silent | Use default (sounds enabled) |
| Audio playback fails | Silent | Log error, continue with visual |

---

## 4. UI/UX Specifications

### 4.1 Sound Toggle Button

**Location**: Top-right area of game menu and in-game headers

**States:**
```
Sound ON:                    Sound OFF:
+--------+                   +--------+
|  ))    |                   |  ))    |
| (( ))  |                   | (( /)) |
|  ))    |                   |  /))   |
+--------+                   +--------+
  Speaker                     Muted
```

**Implementation:**
```
+------------------------------------------+
|  [<-]  Game Menu           [Settings] [Sound] |
+------------------------------------------+
```

**Visual Specifications:**
- Icon size: 24x24px (touch target: 48x48px)
- Color: White with opacity (matches header icons)
- Muted state: Diagonal line through speaker OR "x" badge
- Active feedback: Brief scale animation on tap (1.1x for 100ms)

**Behavior:**
- Tap toggles immediately
- Brief visual pulse confirms toggle
- No confirmation dialog needed (easily reversible)

---

### 4.2 Sound Toggle in Game Menu

**Location**: Game menu header, alongside version number area

```
+------------------------------------------+
|           Learn English                   |
+------------------------------------------+
|                                          |
|      [Memory Game]                       |
|      [Spelling Game]                     |
|      [Flashcards]                        |
|      [Hangman]                           |
|                                          |
|                              [Speaker]   |
|                              v1.2.0      |
+------------------------------------------+
```

**Position Options:**
1. Top-right header (preferred for quick access)
2. Near version number (grouped with settings)
3. Floating action button (always accessible)

---

### 4.3 Sound Toggle in Game Header

**Location**: Right side of game header, before or after existing stats

```
Before:
+------------------------------------------+
|  [<-]  Spelling Game         Streak: 5   |
+------------------------------------------+

After:
+------------------------------------------+
|  [<-]  Spelling Game    Streak: 5  [Snd] |
+------------------------------------------+
```

**Design Considerations:**
- Same icon style as menu
- Smaller if space constrained (20x20px icon)
- Does not interrupt gameplay flow
- Accessible without leaving game

---

### 4.4 First-Time Sound Introduction

**When**: First app launch OR first game start with sounds available

**Approach**: Subtle, non-blocking

```
+------------------------------------------+
|  Sounds are enabled!                     |
|  Tap [speaker icon] to mute anytime.     |
|                              [Got it]    |
+------------------------------------------+
```

**Behavior:**
- Shows once per device
- Does not block interaction
- Auto-dismisses after 5 seconds
- Can be manually dismissed

---

### 4.5 Visual Feedback Alternatives

When sounds are disabled, visual feedback should be enhanced:

**Correct Answer (No Sound):**
- Green flash/pulse on answer area
- Checkmark icon appears briefly
- Larger/longer animation than with sound

**Incorrect Answer (No Sound):**
- Red flash on answer area
- X icon appears briefly
- Subtle shake animation

**Game Complete (No Sound):**
- Confetti or stars animation
- Prominent "Complete!" badge
- Extended celebration animation

**Streak Milestone (No Sound):**
- Fire/flame animation on streak counter
- Number scales up dramatically
- Glow effect on streak display

---

### 4.6 Responsive Design

**Mobile (< 480px)**
- Sound icon in header is 24x24px (48x48 touch target)
- Icon positioned for easy thumb reach
- No label, icon only

**Tablet (480px - 1024px)**
- Sound icon can include short label "Sound"
- Same toggle behavior

**Desktop (> 1024px)**
- Icon with tooltip on hover
- Keyboard shortcut possible (M for mute)

---

### 4.7 Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| WCAG 2.1 AA | Sound is not sole information carrier |
| Screen readers | "Sound effects enabled/disabled" announcement |
| Keyboard navigation | Sound toggle focusable and operable |
| Focus indicators | Visible focus ring on toggle |
| No seizure triggers | Sounds do not trigger visual seizure effects |
| User control | Sound can be disabled before any sound plays |
| Persistence | Setting persists, user not surprised by sound on return |

---

## 5. Sound Design Guidelines

### 5.1 Sound Types and Characteristics

| Sound Type | Duration | Pitch | Character | Usage |
|------------|----------|-------|-----------|-------|
| Correct | 200-400ms | Medium-high | Cheerful, affirming | Answer correct |
| Incorrect | 300-500ms | Low | Gentle, not harsh | Answer wrong |
| Game Complete | 800-1200ms | Ascending | Triumphant | Win game |
| Game Over | 500-800ms | Descending | Neutral, not sad | Lose game |
| Streak | 400-600ms | High | Sparkling, excited | Streak milestones |
| New Record | 1000-1500ms | Complex | Fanfare, celebration | Beat personal best |
| UI Click | 50-100ms | Neutral | Subtle, tactile | Button interactions (future) |

### 5.2 Sound Palette Recommendations

**Overall Aesthetic:**
- Friendly and child-appropriate
- Consistent with app's colorful, encouraging visual design
- Not overly gamified/arcade-like
- Clear and distinct without being jarring

**Sound Design Inspiration:**
- Duolingo: Cheerful, encouraging sounds
- Educational apps: Gentle, supportive feedback
- Meditation apps: Non-intrusive, pleasant tones

**Instrument/Synthesis Suggestions:**
- Correct: Marimba, xylophone, or bell tones
- Incorrect: Soft wooden blocks or muted string pluck
- Celebration: Chimes, synthesized sparkles
- Achievements: Short brass or orchestral swells

### 5.3 Volume Guidelines

| Sound Type | Relative Volume | Notes |
|------------|-----------------|-------|
| Correct | 70% | Frequent, should not fatigue |
| Incorrect | 60% | Quieter to avoid discouragement |
| Game Complete | 90% | Celebratory moment |
| Game Over | 50% | Gentle, not punishing |
| Streak | 80% | Rewarding but not overwhelming |
| New Record | 100% | Maximum celebration |

**Absolute Volume:**
- All sounds normalized to -12dB to -6dB peak
- Comfortable listening at 50% device volume
- No compression artifacts or clipping

### 5.4 Timing and Latency

| Metric | Target | Reason |
|--------|--------|--------|
| Playback latency | <50ms | Instant feedback feeling |
| Sound gap after action | 0ms | Play immediately on event |
| Overlap handling | Cancel previous | Prevent cacophony on rapid actions |
| Preload time | <500ms | Ready before first game |

### 5.5 File Format Specifications

| Format | Usage | Reasoning |
|--------|-------|-----------|
| MP3 | Fallback | Universal browser support |
| OGG | Preferred (Firefox, Chrome) | Better compression, no licensing |
| M4A/AAC | Safari preferred | Native iOS/Safari support |

**Implementation Strategy:**
```html
<audio preload="auto">
  <source src="correct.m4a" type="audio/mp4">
  <source src="correct.ogg" type="audio/ogg">
  <source src="correct.mp3" type="audio/mpeg">
</audio>
```

**File Size Targets:**
- Each sound: <50KB (all formats combined)
- Total audio bundle: <300KB
- Minimal impact on app load time

---

## 6. Technical Considerations

### 6.1 Audio Service Architecture

```typescript
// src/services/audioService.ts

interface SoundType {
  correct: string;
  incorrect: string;
  gameComplete: string;
  gameOver: string;
  streak: string;
  newRecord: string;
}

class AudioService {
  private audioContext: AudioContext | null = null;
  private soundBuffers: Map<keyof SoundType, AudioBuffer> = new Map();
  private enabled: boolean = true;
  private initialized: boolean = false;

  // Initialize AudioContext (requires user gesture on mobile)
  async initialize(): Promise<void>

  // Preload all sound files
  async preloadSounds(): Promise<void>

  // Play a specific sound
  play(sound: keyof SoundType): void

  // Enable/disable sounds
  setEnabled(enabled: boolean): void

  // Get current state
  isEnabled(): boolean

  // Clean up resources
  dispose(): void
}

export const audioService = new AudioService();
```

### 6.2 Data Model

**Storage:**
```typescript
interface AudioSettings {
  enabled: boolean;
  volume: number;  // 0.0 - 1.0 (future)
  categories: {    // (future)
    feedback: boolean;
    celebration: boolean;
    ui: boolean;
  };
}
```

**LocalStorage Key:**
```typescript
const AUDIO_SETTINGS_KEY = 'learn-eng-audio-settings';
```

**Default Settings:**
```typescript
const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  enabled: true,
  volume: 0.7,
  categories: {
    feedback: true,
    celebration: true,
    ui: true
  }
};
```

### 6.3 Sound File Structure

```
public/
└── sounds/
    ├── correct.mp3
    ├── correct.ogg
    ├── correct.m4a
    ├── incorrect.mp3
    ├── incorrect.ogg
    ├── incorrect.m4a
    ├── game-complete.mp3
    ├── game-complete.ogg
    ├── game-complete.m4a
    ├── game-over.mp3
    ├── game-over.ogg
    ├── game-over.m4a
    ├── streak.mp3
    ├── streak.ogg
    ├── streak.m4a
    ├── new-record.mp3
    ├── new-record.ogg
    └── new-record.m4a
```

### 6.4 Web Audio API Implementation

```typescript
// Using Web Audio API for low-latency playback

class AudioService {
  private audioContext: AudioContext | null = null;
  private soundBuffers: Map<string, AudioBuffer> = new Map();
  private enabled: boolean = true;

  async initialize(): Promise<void> {
    // Create AudioContext (Safari requires webkit prefix check)
    const AudioContextClass = window.AudioContext ||
      (window as any).webkitAudioContext;

    this.audioContext = new AudioContextClass();

    // Resume if suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  async preloadSounds(): Promise<void> {
    const soundFiles: Record<string, string> = {
      correct: '/sounds/correct.mp3',
      incorrect: '/sounds/incorrect.mp3',
      gameComplete: '/sounds/game-complete.mp3',
      gameOver: '/sounds/game-over.mp3',
      streak: '/sounds/streak.mp3',
      newRecord: '/sounds/new-record.mp3'
    };

    const loadPromises = Object.entries(soundFiles).map(async ([name, url]) => {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
        this.soundBuffers.set(name, audioBuffer);
      } catch (error) {
        console.warn(`Failed to load sound: ${name}`, error);
      }
    });

    await Promise.all(loadPromises);
  }

  play(soundName: string): void {
    if (!this.enabled || !this.audioContext) return;

    const buffer = this.soundBuffers.get(soundName);
    if (!buffer) return;

    // Create new buffer source for each play
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.start(0);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    localStorage.setItem('learn-eng-sound-enabled', String(enabled));
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}
```

### 6.5 Custom Hook: useSound

```typescript
// src/hooks/useSound.ts

import { useCallback, useEffect, useState } from 'react';
import { audioService } from '../services/audioService';

export const useSound = () => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const stored = localStorage.getItem('learn-eng-sound-enabled');
    return stored === null ? true : stored === 'true';
  });

  useEffect(() => {
    // Initialize audio on first user interaction
    const initAudio = async () => {
      await audioService.initialize();
      await audioService.preloadSounds();
    };

    // Listen for first interaction
    const handleFirstInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  const toggleSound = useCallback(() => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    audioService.setEnabled(newState);
  }, [soundEnabled]);

  const playSound = useCallback((sound: string) => {
    if (soundEnabled) {
      audioService.play(sound);
    }
  }, [soundEnabled]);

  return {
    soundEnabled,
    toggleSound,
    playSound,
    playCorrect: () => playSound('correct'),
    playIncorrect: () => playSound('incorrect'),
    playGameComplete: () => playSound('gameComplete'),
    playGameOver: () => playSound('gameOver'),
    playStreak: () => playSound('streak'),
    playNewRecord: () => playSound('newRecord')
  };
};
```

### 6.6 Component Architecture

**New Components:**
```
src/
├── components/
│   └── SoundToggle/
│       ├── SoundToggle.tsx       # Toggle button component
│       └── index.ts
│
├── services/
│   └── audioService.ts           # Core audio service
│
└── hooks/
    └── useSound.ts               # Sound hook for components
```

**Modified Components:**
```
src/components/
├── GameMenu/
│   └── GameMenu.tsx              # Add SoundToggle to header
├── MemoryGame/
│   └── MemoryGame.tsx            # Add sound on match/mismatch
├── SpellingGame/
│   └── SpellingGame.tsx          # Add sound on correct/incorrect
├── FlashcardsGame/
│   └── FlashcardsGame.tsx        # Add sound on answer
└── HangmanGame/
    └── HangmanGame.tsx           # Add sound on win/lose
```

### 6.7 Integration Example

```typescript
// SpellingGame.tsx integration example

import { useSound } from '../../hooks/useSound';

export const SpellingGame: React.FC<Props> = ({ onBack }) => {
  const { playCorrect, playIncorrect, playStreak, playNewRecord } = useSound();

  // Existing state...
  const [streak, setStreak] = useState(0);
  const [record, setRecord] = useState(0);

  const handleCorrectAnswer = () => {
    playCorrect();

    const newStreak = streak + 1;
    setStreak(newStreak);

    // Check for streak milestones
    if (newStreak === 5 || newStreak === 10 || newStreak === 15) {
      setTimeout(() => playStreak(), 300); // Delay for separation
    }

    // Check for new record
    if (newStreak > record) {
      setRecord(newStreak);
      setTimeout(() => playNewRecord(), 500);
    }

    // ... rest of logic
  };

  const handleIncorrectAnswer = () => {
    playIncorrect();
    setStreak(0);
    // ... rest of logic
  };

  // ... rest of component
};
```

### 6.8 Sound Toggle Component

```typescript
// src/components/SoundToggle/SoundToggle.tsx

import React from 'react';
import { useSound } from '../../hooks/useSound';
import './SoundToggle.css';

interface SoundToggleProps {
  size?: 'small' | 'medium' | 'large';
}

export const SoundToggle: React.FC<SoundToggleProps> = ({ size = 'medium' }) => {
  const { soundEnabled, toggleSound } = useSound();

  return (
    <button
      className={`sound-toggle sound-toggle-${size} ${soundEnabled ? 'enabled' : 'disabled'}`}
      onClick={toggleSound}
      aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
      title={soundEnabled ? 'Sound on' : 'Sound off'}
    >
      {soundEnabled ? (
        <SpeakerIcon />
      ) : (
        <MutedIcon />
      )}
    </button>
  );
};
```

### 6.9 Performance Considerations

| Concern | Solution |
|---------|----------|
| Initial load time | Preload sounds after first interaction, not on page load |
| Audio latency | Use Web Audio API with pre-decoded buffers |
| Memory usage | ~300KB for all sounds - acceptable |
| Rapid playback | Cancel or overlap with volume ducking |
| Mobile battery | Audio context suspended when app backgrounded |
| Browser autoplay | Wait for user interaction before creating AudioContext |
| Safari quirks | Handle webkit prefixes and audio session interruptions |

### 6.10 Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 66+ | Full | Web Audio API supported |
| Firefox 60+ | Full | Prefers OGG format |
| Safari 14+ | Full | Requires webkit prefix, prefers M4A |
| Edge 79+ | Full | Chromium-based |
| Mobile Safari | Full | Requires user gesture to init audio |
| Chrome Android | Full | Respects system mute |
| Samsung Internet | Full | Chromium-based |

### 6.11 Error Handling

```typescript
class AudioService {
  private handleLoadError(soundName: string, error: Error): void {
    console.warn(`[AudioService] Failed to load ${soundName}:`, error);
    // Continue without this sound - graceful degradation
  }

  private handlePlayError(soundName: string, error: Error): void {
    console.warn(`[AudioService] Failed to play ${soundName}:`, error);
    // Silent failure - user sees visual feedback instead
  }

  private handleContextError(error: Error): void {
    console.warn('[AudioService] AudioContext error:', error);
    this.enabled = false;
    // Disable audio entirely if context fails
  }
}
```

---

## 7. Accessibility Considerations

### 7.1 Sound as Enhancement, Not Requirement

**Core Principle:** Sound effects enhance the experience but are never the sole means of conveying information.

| Information | Audio Feedback | Visual Feedback | Screen Reader |
|-------------|----------------|-----------------|---------------|
| Correct answer | "Correct" sound | Green highlight, checkmark | "Correct" announcement |
| Incorrect answer | "Incorrect" sound | Red highlight, X icon | "Incorrect" announcement |
| Game complete | Celebration sound | Victory animation | "Game complete" announcement |
| Streak milestone | Streak sound | Number animation | "5 correct in a row" |
| New record | Fanfare sound | Record badge | "New record" announcement |

### 7.2 User Control

**Always Controllable:**
- Sound can be toggled before any sound plays
- Setting persists across sessions
- No unexpected sounds on return visits

**Respectful Defaults:**
- Default ON (most users expect sounds in games)
- Easy to find toggle (prominent in header)
- Remember preference permanently

### 7.3 Screen Reader Support

```typescript
// Announce important events to screen readers
const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);

  setTimeout(() => announcement.remove(), 1000);
};

// Usage in game logic
const handleCorrectAnswer = () => {
  playCorrect();
  announceToScreenReader('Correct!');
  // ... rest of logic
};
```

### 7.4 CSS for Screen-Reader-Only Content

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### 7.5 Keyboard Navigation

- Sound toggle button is focusable
- Tab order includes sound toggle
- Enter/Space activates toggle
- Visible focus indicator on toggle

### 7.6 Reduced Motion Preference

```typescript
// Respect reduced motion preference for audio-triggered animations
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  // Show celebration animation with sound
} else {
  // Show subtle feedback only
}
```

---

## 8. MVP vs Future Iterations

### MVP Scope (Phase 1)

**Must Have:**
1. AudioService with preloading and playback
2. Two core sounds: correct and incorrect
3. Sound toggle button in game menu header
4. Toggle persistence in localStorage
5. Integration with all four games
6. Visual feedback when sounds disabled

**MVP Sound Set:**
- `correct.mp3/ogg/m4a` - Answer correct
- `incorrect.mp3/ogg/m4a` - Answer incorrect

**Implementation Priority:**
1. AudioService with Web Audio API
2. useSound hook
3. SoundToggle component
4. Integration with SpellingGame (simplest feedback)
5. Integration with Memory Game
6. Integration with Flashcards
7. Integration with Hangman
8. Sound toggle in game menu

**Estimated Effort:** 2-3 development days

---

### Phase 2 Enhancements

**Should Have:**
1. Game complete and game over sounds
2. Streak milestone sounds
3. New record sound
4. In-game sound toggle (in game headers)
5. Enhanced visual feedback when muted
6. First-time sound introduction toast

**Additional Sounds:**
- `game-complete.mp3/ogg/m4a`
- `game-over.mp3/ogg/m4a`
- `streak.mp3/ogg/m4a`
- `new-record.mp3/ogg/m4a`

**Estimated Effort:** 1-2 development days

---

### Phase 3: Advanced Features

**Nice to Have:**
1. Volume slider control
2. Sound category toggles (feedback/celebration/UI)
3. Sound themes (classic, minimal, playful)
4. UI interaction sounds (button clicks, card flips)
5. Streak combo variations (different sounds for 5/10/15/20+)
6. Sound preview in settings

**Estimated Effort:** 2-3 development days

---

### Long-term Vision

1. **Custom Sound Packs**: Allow users to choose from different audio themes
2. **Audio Pronunciations**: Integrate word pronunciation sounds
3. **Adaptive Audio**: Adjust sound style based on difficulty level
4. **Multiplayer Sounds**: Audio cues for competitive modes
5. **Background Music**: Optional ambient music while playing

---

## 9. Open Questions

### Assumptions Made

1. **Sounds enhance learning**: Assumed audio feedback strengthens memory associations (supported by educational research)

2. **Default ON is appropriate**: Assumed users expect sounds in game-like learning apps

3. **Simple toggle is sufficient**: Assumed most users want all-or-nothing control (not per-category)

4. **Consistent sounds across games**: Assumed same sounds for correct/incorrect across all games (not game-specific)

5. **No background music**: Assumed music would be distracting; sound effects only

### Questions for Stakeholders

1. **Sound sourcing**: Should we use free sound libraries, commission custom sounds, or use synthesized/generated sounds?
   - Options: Freesound.org (CC), Zapsplat, custom composer, Web Audio synthesis

2. **Default state**: Should sounds default to ON or OFF for new users?
   - Recommendation: ON (matches user expectations for games)

3. **Incorrect sound tone**: How "negative" should the incorrect sound be?
   - Range: Very gentle (educational) to clearly negative (arcade)
   - Recommendation: Gentle and supportive for young learners

4. **Streak sound frequency**: Should streak sounds play at every milestone (5, 10, 15, 20...) or only significant ones (5, 10)?

5. **Text-to-speech coexistence**: How should sound effects interact with existing text-to-speech pronunciations?
   - Play sequentially? Lower TTS volume during effects?

### Areas Requiring User Research

1. **Sound preference by age**: Do children vs. adults have different sound preferences?

2. **Volume perception**: What volume level feels "right" across devices?

3. **Sound fatigue**: How long before repetitive sounds become annoying?

4. **Mute adoption**: What percentage of users will immediately mute?

5. **Accessibility needs**: Are visual alternatives sufficient for deaf/HoH users?

### Technical Questions

1. **iOS audio session**: Should we handle audio session interruptions (calls, other apps)?

2. **Audio sprite alternative**: Would a single sprite file with timing data be more efficient than separate files?

3. **Offline support**: Should sounds be cached via service worker for offline play?

4. **Performance budget**: What's the maximum acceptable latency for sound playback?

---

## Appendix A: Sound File Specifications

### Technical Requirements

| Property | Specification |
|----------|---------------|
| Format | MP3 (primary), OGG, M4A |
| Sample Rate | 44.1 kHz |
| Bit Depth | 16-bit |
| Channels | Mono (smaller files, no spatial need) |
| Bitrate | 128 kbps (MP3), Variable (OGG/M4A) |
| Normalization | -12dB to -6dB peak |
| Silence Padding | <10ms at start, <50ms at end |

### Size Targets

| Sound | Duration | Target Size |
|-------|----------|-------------|
| Correct | 200-400ms | <20KB |
| Incorrect | 300-500ms | <25KB |
| Game Complete | 800-1200ms | <50KB |
| Game Over | 500-800ms | <35KB |
| Streak | 400-600ms | <30KB |
| New Record | 1000-1500ms | <60KB |
| **Total** | - | **<220KB** |

---

## Appendix B: Sound Sources and Licensing

### Free Sound Libraries

| Source | License | Notes |
|--------|---------|-------|
| Freesound.org | CC0/CC-BY | Large variety, attribution may be required |
| Zapsplat | Royalty-free | Free with attribution, paid for no-attribution |
| Mixkit | Royalty-free | Free for commercial use |
| OpenGameArt | CC0/CC-BY | Game-focused sounds |

### Custom Sound Creation

**Tools for synthesis:**
- BFXR (8-bit/retro sounds)
- ChipTone (chip tune style)
- Audacity (editing/processing)
- Web Audio API (procedural generation)

**Considerations:**
- Custom sounds ensure unique identity
- No licensing concerns
- Can match app aesthetic exactly

---

## Appendix C: CSS for Sound Toggle

```css
/* Sound Toggle Button */
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
}

.sound-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sound-toggle:active {
  transform: scale(0.95);
}

.sound-toggle:focus {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

/* Icon sizes */
.sound-toggle-small svg {
  width: 20px;
  height: 20px;
}

.sound-toggle-medium svg {
  width: 24px;
  height: 24px;
}

.sound-toggle-large svg {
  width: 32px;
  height: 32px;
}

/* Icon colors */
.sound-toggle svg {
  fill: currentColor;
  color: rgba(255, 255, 255, 0.9);
}

.sound-toggle.disabled svg {
  color: rgba(255, 255, 255, 0.5);
}

/* Touch target */
.sound-toggle {
  min-width: 48px;
  min-height: 48px;
}

/* Toggle animation */
@keyframes soundTogglePulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.sound-toggle.just-toggled {
  animation: soundTogglePulse 0.2s ease;
}
```

---

## Appendix D: SVG Icons

```tsx
// Speaker Icon (Sound ON)
const SpeakerIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 5L6 9H2v6h4l5 4V5z" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

// Muted Icon (Sound OFF)
const MutedIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 5L6 9H2v6h4l5 4V5z" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);
```

---

*End of Design Document*
