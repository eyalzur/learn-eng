# Technical Design: Vocabulary Expansion - Example Sentences

## Overview

This document provides the technical architecture and implementation plan for adding example sentences to the dictionary data model. The feature enhances word learning by showing contextual usage examples with both English sentences and Hebrew translations. Example sentences will be displayed in the Flashcards game (after answering) and Hangman game (in the result screen), with optional audio playback for both languages.

## Design Document Reference

- **Source Document**: `/docs/features/vocabulary-expansion-sentences.md`
- **Feature ID**: P1 - Vocabulary Expansion (Example Sentences)
- **Estimated Effort**: 8-12 hours across 5 phases

## Requirements Summary

### Functional Requirements

1. **Data Model Extension**
   - Add optional `exampleSentence` field to the `Word` interface
   - Each sentence includes both English text and Hebrew translation
   - Backwards compatible (existing code continues to work without sentences)

2. **Flashcards Game Integration**
   - Display example sentence after user answers (correct or incorrect)
   - Show both English and Hebrew versions
   - Provide audio playback buttons for each language

3. **Hangman Game Integration**
   - Display example sentence in win/lose result screen
   - Show alongside the revealed word
   - Include audio playback functionality

4. **Shared UI Component**
   - Reusable `SentenceDisplay` component
   - Handles bilingual display with proper text direction (LTR/RTL)
   - Integrates with existing speech utility

5. **Settings (Future Enhancement)**
   - Optional toggle to show/hide example sentences
   - Persist preference in localStorage

### Non-Functional Requirements

- **Performance**: Sentences are static data, no additional network requests
- **Accessibility**: Minimum 14px font, high contrast, audio support
- **Responsive**: Mobile-first design, compact layout for small screens
- **Backwards Compatibility**: Games must handle words without sentences gracefully

## Architecture

### System Overview

The example sentences feature extends the existing dictionary-based architecture without introducing new backend services. All data remains client-side in TypeScript files.

```
                    +------------------+
                    |   dictionary.ts  |
                    |  (Word[] data)   |
                    +--------+---------+
                             |
              +--------------+--------------+
              |                             |
    +---------v----------+       +----------v---------+
    |  FlashcardsGame.tsx|       |  HangmanGame.tsx   |
    |  (uses Word data)  |       |  (uses Word data)  |
    +---------+----------+       +----------+---------+
              |                             |
              +-------------+---------------+
                            |
                  +---------v---------+
                  | SentenceDisplay   |
                  | (shared component)|
                  +---------+---------+
                            |
                  +---------v---------+
                  |    speech.ts      |
                  | (TTS utility)     |
                  +-------------------+
```

### Component Diagram

```
src/
├── components/
│   ├── shared/                      # NEW DIRECTORY
│   │   └── SentenceDisplay.tsx      # NEW: Reusable sentence component
│   ├── FlashcardsGame/
│   │   └── FlashcardsGame.tsx       # MODIFIED: Add sentence after answer
│   └── HangmanGame/
│       └── HangmanGame.tsx          # MODIFIED: Add sentence in result
├── data/
│   └── dictionary.ts                # MODIFIED: Extended Word interface
├── utils/
│   └── speech.ts                    # UNCHANGED: Already supports 'en'/'he'
└── styles/
    └── main.css                     # MODIFIED: Add sentence styles
```

### Integration Points

1. **Dictionary Data Layer** (`dictionary.ts`)
   - Extended `Word` interface with optional `exampleSentence` field
   - No changes to existing functions (`getRandomWords`, `getWordsByCategory`)

2. **Speech Utility** (`speech.ts`)
   - Existing `speak(text, lang)` function fully supports sentence playback
   - No modifications required

3. **Game Components**
   - Import and conditionally render `SentenceDisplay`
   - Check for sentence existence before rendering

## Frontend Design

### Component Structure

#### 1. SentenceDisplay Component

**File**: `/src/components/shared/SentenceDisplay.tsx`

**Purpose**: Reusable component for displaying bilingual example sentences with audio playback.

**Component Tree**:
```
<SentenceDisplay>
  <div className="sentence-display">
    <div className="sentence-header">
      "Example Usage / Hebrew translation"
    </div>
    <div className="sentence-row english" dir="ltr">
      <span className="sentence-text">"English sentence"</span>
      <button className="speaker-btn">Speaker Icon</button>
    </div>
    <div className="sentence-row hebrew" dir="rtl">
      <span className="sentence-text">"Hebrew translation"</span>
      <button className="speaker-btn">Speaker Icon</button>
    </div>
  </div>
</SentenceDisplay>
```

#### 2. FlashcardsGame Integration

**Modified Component Tree** (after answer):
```
<FlashcardsGame>
  <div className="flashcards-game">
    ...existing content...

    {/* NEW: Conditional sentence display */}
    {isAnswered && currentCard.word.exampleSentence && (
      <SentenceDisplay sentence={currentCard.word.exampleSentence} />
    )}

    ...next button...
  </div>
</FlashcardsGame>
```

#### 3. HangmanGame Integration

**Modified Component Tree** (in result screen):
```
<HangmanGame>
  <div className="hangman-game">
    ...existing content...

    {(gameStatus === 'won' || gameStatus === 'lost') && (
      <div className="game-feedback">
        ...existing feedback...

        {/* NEW: Sentence display in result */}
        {currentWord.exampleSentence && (
          <SentenceDisplay sentence={currentWord.exampleSentence} />
        )}

        <button className="next-button">Next</button>
      </div>
    )}
  </div>
</HangmanGame>
```

### State Management

No new global state management is required. The feature uses:

1. **Static Data**: Sentences are part of the `Word` objects in `dictionary.ts`
2. **Local Component State**: Games already track `currentWord` or `currentCard`
3. **Conditional Rendering**: Check for `word.exampleSentence` existence

**State Flow in FlashcardsGame**:
```typescript
// Existing state
const [currentCard, setCurrentCard] = useState<CardState | null>(null);
const [isAnswered, setIsAnswered] = useState(false);

// Rendering logic (no new state needed)
{isAnswered && currentCard?.word.exampleSentence && (
  <SentenceDisplay sentence={currentCard.word.exampleSentence} />
)}
```

**State Flow in HangmanGame**:
```typescript
// Existing state
const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
const currentWord = words[currentIndex]; // Word object

// Rendering logic (no new state needed)
{gameStatus !== 'playing' && currentWord?.exampleSentence && (
  <SentenceDisplay sentence={currentWord.exampleSentence} />
)}
```

### Key Interactions

1. **Automatic Display**: Sentence appears immediately when conditions are met
2. **Audio Playback**: User taps speaker button to hear sentence
3. **Dismissal**: User proceeds with "Next" button (sentence disappears)
4. **Direction Handling**: English row uses `dir="ltr"`, Hebrew row uses `dir="rtl"`

## Backend Design

This feature requires no backend changes. All data is stored client-side in TypeScript files.

### API Specifications

Not applicable - purely frontend feature.

### Service Architecture

Not applicable - data is static dictionary.

### Business Logic

**Sentence Selection**: Each word has at most one example sentence. The sentence is displayed as-is without any selection logic.

**Audio Playback Logic**:
```typescript
// English playback
const handlePlayEnglish = () => {
  speak(sentence.english, 'en');
};

// Hebrew playback
const handlePlayHebrew = () => {
  speak(sentence.hebrew, 'he');
};
```

## Data Model

### Schema Design

#### Extended Word Interface

**File**: `/src/data/dictionary.ts`

```typescript
export interface ExampleSentence {
  english: string;  // English example sentence
  hebrew: string;   // Hebrew translation of the sentence
}

export interface Word {
  id: string;
  english: string;
  hebrew: string;
  transcription: string;   // Hebrew phonetic transcription with nikud
  category: Category;
  exampleSentence?: ExampleSentence;  // NEW: Optional example sentence
}
```

#### SentenceDisplay Props Interface

**File**: `/src/components/shared/SentenceDisplay.tsx`

```typescript
export interface SentenceDisplayProps {
  sentence: {
    english: string;
    hebrew: string;
  };
  onPlayEnglish?: () => void;   // Optional callback after English playback
  onPlayHebrew?: () => void;    // Optional callback after Hebrew playback
  showSpeakerButtons?: boolean; // Default: true
  className?: string;           // Additional CSS classes
}
```

### Entity Relationships

```
Word (1) -------- (0..1) ExampleSentence
  |
  +-- id: string
  +-- english: string
  +-- hebrew: string
  +-- transcription: string
  +-- category: Category
  +-- exampleSentence?: ExampleSentence
       |
       +-- english: string
       +-- hebrew: string
```

### Data Validation Rules

1. **Sentence Length**: English sentences should be 6-10 words (soft guideline)
2. **Hebrew Translation**: Must be natural Hebrew, not literal translation
3. **Word Reference**: Sentence must contain or reference the vocabulary word
4. **Content Appropriateness**: Age-appropriate for children
5. **Unicode Support**: Hebrew text uses standard UTF-8 encoding

### Sample Data

```typescript
// Example word with sentence
{
  id: 'animal-1',
  english: 'cat',
  hebrew: 'chatool',
  transcription: 'ket',
  category: 'animals',
  exampleSentence: {
    english: 'The cat is sleeping on the sofa.',
    hebrew: 'Hachatool yashen al hasapa.',
  },
}

// Example word without sentence (backwards compatible)
{
  id: 'animal-2',
  english: 'dog',
  hebrew: 'kelev',
  transcription: 'dog',
  category: 'animals',
  // No exampleSentence field - games handle this gracefully
}
```

### Migration Strategy

No database migration required. The approach is:

1. **Additive Change**: New optional field added to interface
2. **Incremental Content**: Sentences added to words over time
3. **Backwards Compatible**: Existing code continues to work
4. **No Breaking Changes**: All existing functionality preserved

## Technical Considerations

### Performance

1. **Bundle Size**: Example sentences add approximately 10-15KB to dictionary.ts
   - 110 words x ~100 chars average per sentence = ~11KB
   - Acceptable trade-off for educational value

2. **Render Performance**:
   - SentenceDisplay is a simple functional component
   - No expensive computations or effects
   - Conditional rendering prevents unnecessary renders

3. **Audio Latency**:
   - Web Speech API is browser-native, minimal latency
   - Existing speech.ts handles voice loading asynchronously

### Security

1. **Static Data**: No user input accepted in sentence display
2. **XSS Prevention**: React's JSX automatically escapes text content
3. **No External Resources**: All content is bundled, no CDN dependencies

### Scalability

1. **Content Growth**: Interface supports unlimited words with sentences
2. **Future Enhancements**:
   - Multiple sentences per word (change to `exampleSentences: ExampleSentence[]`)
   - Difficulty levels (add `difficulty?: 'beginner' | 'intermediate'`)
3. **Component Reuse**: SentenceDisplay can be used in future games

### Error Handling

1. **Missing Sentence**: Graceful fallback - component not rendered
   ```typescript
   {word.exampleSentence && <SentenceDisplay ... />}
   ```

2. **Speech Synthesis Unavailable**:
   - Existing speech.ts warns to console
   - Speaker buttons still visible but silent

3. **Hebrew TTS Unavailable**:
   - Some browsers may not support Hebrew voices
   - Graceful degradation - button click has no effect
   - Future: Add visual feedback for unavailable TTS

### Accessibility

1. **Screen Reader Support**:
   - Semantic HTML structure
   - `aria-label` on speaker buttons
   - Text content is readable by assistive technologies

2. **Touch Targets**:
   - Speaker buttons maintain 44px minimum size (existing pattern)
   - Adequate spacing between interactive elements

3. **Visual Design**:
   - High contrast text on light background
   - Minimum 14px font size
   - RTL/LTR direction properly set

4. **Audio Alternative**:
   - Text always visible alongside audio option
   - Audio is enhancement, not requirement

### Browser Compatibility

1. **Web Speech API**:
   - Chrome: Full support
   - Safari: Full support
   - Firefox: Full support
   - Edge: Full support
   - Hebrew TTS: Varies by browser/device

2. **CSS Features Used**:
   - Flexbox: Universal support
   - CSS `dir` attribute: Universal support
   - Custom properties: Universal modern browser support

## Implementation Plan

### Phases

#### Phase 1: Foundation (2 hours)

**Tasks**:
1. Update `Word` interface in `dictionary.ts`
2. Create `SentenceDisplay` component
3. Add CSS styles to `main.css`
4. Add example sentences to 20 sample words for testing

**Dependencies**: None

**Deliverables**:
- Extended `Word` interface
- Working `SentenceDisplay` component
- CSS styles for sentence display
- 20 words with test sentences

#### Phase 2: Flashcards Integration (1 hour)

**Tasks**:
1. Import `SentenceDisplay` in `FlashcardsGame.tsx`
2. Add conditional rendering after answer
3. Test sentence display in game flow
4. Verify audio playback works

**Dependencies**: Phase 1 complete

**Deliverables**:
- Flashcards game displays sentences
- Audio playback functional

#### Phase 3: Hangman Integration (1 hour)

**Tasks**:
1. Import `SentenceDisplay` in `HangmanGame.tsx`
2. Add to win/lose result screen
3. Test sentence display
4. Verify mobile layout

**Dependencies**: Phase 1 complete (can parallel with Phase 2)

**Deliverables**:
- Hangman game displays sentences
- Result screen layout verified

#### Phase 4: Content Creation (4-6 hours)

**Tasks**:
1. Write example sentences for all 110 words
2. Write Hebrew translations
3. Review translations for accuracy
4. Test all sentences in games

**Dependencies**: Phases 2 and 3 complete (for testing)

**Deliverables**:
- All 110 words have example sentences
- Hebrew translations reviewed

**Content Batching**:
- Animals (15 words): 1 hour
- Food (15 words): 1 hour
- Colors (12 words): 0.5 hours
- Numbers (20 words): 1 hour
- Body Parts (12 words): 0.5 hours
- Household (12 words): 0.5 hours
- Nature (12 words): 0.5 hours
- Verbs (12 words): 0.5 hours

#### Phase 5: Polish & Documentation (1 hour)

**Tasks**:
1. Add fade-in animation for sentences
2. Test mobile responsiveness across viewports
3. Test Hebrew TTS across browsers
4. Update version to v0.2.0
5. Update project documentation

**Dependencies**: Phase 4 complete

**Deliverables**:
- Polished UI with animations
- Documentation updated
- Version incremented

### Dependencies

```
Phase 1 (Foundation)
    |
    +---> Phase 2 (Flashcards) --+
    |                            |
    +---> Phase 3 (Hangman) -----+---> Phase 4 (Content) ---> Phase 5 (Polish)
```

### Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Hebrew TTS poor quality | Medium | High | Document known limitations; English TTS is primary |
| Content creation bottleneck | Medium | Medium | Ship with partial content; add sentences over time |
| Mobile layout issues | Low | Low | Test on smallest viewports; compact design ready |
| Translation accuracy | Medium | Medium | Native Hebrew speaker review before release |
| Bundle size increase | Low | Low | ~11KB acceptable; monitor with webpack-bundle-analyzer |

## Open Questions

### Resolved in Design

1. **Optional vs Required Sentences**: Decided optional for incremental rollout
2. **Component Location**: `/src/components/shared/` for reusability
3. **Display Timing**: Show immediately after answer (both correct and incorrect)
4. **Hebrew Translation**: Include for comprehension (target audience is Hebrew speakers)

### Pending Clarification

1. **Hebrew TTS Quality**: Test on target browsers/devices before release
   - **Action**: Test during Phase 5, document findings

2. **Memory/Spelling Game Integration**: Deferred to future phase
   - **Recommendation**: Focus on Flashcards and Hangman first

3. **Settings Toggle**: Optional show/hide preference
   - **Recommendation**: Defer to Phase 2 enhancement if users request

4. **Multiple Sentences per Word**: Future consideration
   - **Recommendation**: Start with single sentence; extend interface later if needed

## Assumptions

### Technical Assumptions

1. Web Speech API will be available on target browsers (Chrome, Safari, Firefox)
2. Hebrew TTS will be functional on most devices (quality may vary)
3. Existing `speak()` function handles sentence-length text appropriately
4. Bundle size increase of ~11KB is acceptable
5. No need for lazy loading sentences (static data is small)

### Content Assumptions

1. All 110 words can have meaningful example sentences
2. Hebrew translations can be provided for all sentences
3. Simple sentence structures (6-10 words) are appropriate for all vocabulary
4. Universal contexts are preferred over culturally-specific examples

### Design Assumptions

1. Users will benefit from seeing sentences immediately after answering
2. Audio playback for sentences adds educational value
3. Mobile viewport can accommodate sentence panel (tested compact design)
4. RTL/LTR mixed content displays correctly in target browsers

## Testing Strategy

### Unit Testing

**SentenceDisplay Component**:
```typescript
// Test cases
- Renders English sentence correctly
- Renders Hebrew sentence correctly
- Sets correct dir attribute (ltr/rtl)
- Calls speak() on speaker button click
- Applies custom className when provided
- Hides speaker buttons when showSpeakerButtons=false
```

### Integration Testing

**FlashcardsGame**:
```typescript
// Test cases
- Shows sentence after correct answer if sentence exists
- Shows sentence after incorrect answer if sentence exists
- Does not show sentence if exampleSentence is undefined
- Sentence disappears after clicking "Next"
- Audio plays when speaker button clicked
```

**HangmanGame**:
```typescript
// Test cases
- Shows sentence in win screen if sentence exists
- Shows sentence in lose screen if sentence exists
- Does not show sentence if exampleSentence is undefined
- Audio plays when speaker button clicked
```

### Manual Testing Checklist

**Visual/Layout**:
- [ ] Sentence panel displays correctly on iPhone SE (smallest viewport)
- [ ] English text is left-aligned (LTR)
- [ ] Hebrew text is right-aligned (RTL)
- [ ] Speaker buttons are properly sized (min 44px)
- [ ] Panel does not overflow on any viewport
- [ ] Font is readable (min 14px effective size)

**Functionality**:
- [ ] English audio plays on speaker click
- [ ] Hebrew audio plays on speaker click (if TTS available)
- [ ] Sentence appears after both correct and incorrect answers
- [ ] Games work correctly for words without sentences
- [ ] Next button advances game after viewing sentence

**Cross-Browser**:
- [ ] Chrome (desktop and mobile)
- [ ] Safari (desktop and iOS)
- [ ] Firefox (desktop)
- [ ] Edge (desktop)

**Accessibility**:
- [ ] Screen reader announces sentence content
- [ ] Touch targets are adequate size
- [ ] Color contrast meets WCAG guidelines

### Performance Testing

- [ ] No noticeable delay when sentence panel appears
- [ ] Audio starts within 500ms of button click
- [ ] Page load time not significantly impacted (< 100ms increase)

## Appendix

### CSS Styles Reference

```css
/* Sentence Display Component - Add to main.css */
.sentence-display {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sentence-header {
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
  text-align: center;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sentence-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
}

.sentence-row:last-child {
  margin-bottom: 0;
}

.sentence-row.english {
  direction: ltr;
  text-align: left;
}

.sentence-row.hebrew {
  direction: rtl;
  text-align: right;
}

.sentence-text {
  flex: 1;
  font-size: 1rem;
  line-height: 1.5;
  color: #333;
}

.sentence-row .speaker-btn {
  background: rgba(76, 175, 80, 0.15);
  border: 2px solid rgba(76, 175, 80, 0.3);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.sentence-row .speaker-btn:hover {
  background: rgba(76, 175, 80, 0.25);
  transform: scale(1.05);
}

/* Responsive */
@media (max-width: 480px) {
  .sentence-display {
    padding: 12px;
    margin: 12px 0;
  }

  .sentence-text {
    font-size: 0.9rem;
  }

  .sentence-row .speaker-btn {
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
  }
}

@media (min-width: 768px) {
  .sentence-display {
    max-width: 600px;
    margin: 20px auto;
  }
}
```

### Component Implementation Reference

```typescript
// /src/components/shared/SentenceDisplay.tsx
import React from 'react';
import { speak } from '../../utils/speech';

export interface SentenceDisplayProps {
  sentence: {
    english: string;
    hebrew: string;
  };
  onPlayEnglish?: () => void;
  onPlayHebrew?: () => void;
  showSpeakerButtons?: boolean;
  className?: string;
}

export const SentenceDisplay: React.FC<SentenceDisplayProps> = ({
  sentence,
  onPlayEnglish,
  onPlayHebrew,
  showSpeakerButtons = true,
  className = '',
}) => {
  const handlePlayEnglish = () => {
    speak(sentence.english, 'en');
    onPlayEnglish?.();
  };

  const handlePlayHebrew = () => {
    speak(sentence.hebrew, 'he');
    onPlayHebrew?.();
  };

  return (
    <div className={`sentence-display ${className}`}>
      <div className="sentence-header">Example Usage</div>
      <div className="sentence-row english" dir="ltr">
        <span className="sentence-text">"{sentence.english}"</span>
        {showSpeakerButtons && (
          <button
            className="speaker-btn"
            onClick={handlePlayEnglish}
            aria-label="Play English sentence"
          >
            speaker-icon
          </button>
        )}
      </div>
      <div className="sentence-row hebrew" dir="rtl">
        <span className="sentence-text">"{sentence.hebrew}"</span>
        {showSpeakerButtons && (
          <button
            className="speaker-btn"
            onClick={handlePlayHebrew}
            aria-label="Play Hebrew sentence"
          >
            speaker-icon
          </button>
        )}
      </div>
    </div>
  );
};
```

### Storage Keys (Future Enhancement)

If settings toggle is implemented:

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `learn-eng-show-sentences` | boolean | true | Show/hide example sentences |

---

**Document Version**: 1.0
**Last Updated**: 2025-12-05
**Author**: Technical Architect
**Status**: Ready for Implementation
