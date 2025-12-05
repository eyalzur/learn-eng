# Feature Design: Vocabulary Expansion - Example Sentences

## Summary
Extend the dictionary data model to include example sentences for each word, showing how English words are used in context. This enhancement will provide learners with practical usage examples, helping them understand not just individual words but how to use them in real sentences. Example sentences will be displayed in games where appropriate (Flashcards, Hangman post-game), with Hebrew translations to aid comprehension.

## Target Users
Hebrew-speaking children and beginners learning English vocabulary who need contextual examples to understand proper word usage beyond simple translation.

## Problem Solved
- **Limited Context**: Current word pairs only show translation, not usage
- **Passive Learning**: Learners memorize words but don't know how to use them in sentences
- **Missing Real-World Application**: No bridge between vocabulary and actual communication
- **Enhanced Retention**: Contextual learning improves memory and understanding
- **Grammar Hints**: Example sentences naturally demonstrate basic grammar patterns

## User Experience

### Where Sentences Appear

#### 1. Flashcards Game (Primary Use Case)
After answering a question, show the example sentence as additional learning material:

**Current Flow:**
```
Question: חָתוּל (cat)
[A] dog   [B] cat   [C] fish   [D] bird
→ User selects "cat"
→ Feedback: "נכון!" (Correct!)
→ Next card
```

**Enhanced Flow:**
```
Question: חָתוּל (cat)
[A] dog   [B] cat   [C] fish   [D] bird
→ User selects "cat"
→ Feedback: "נכון!" (Correct!)
→ Example: "The cat is sleeping on the sofa."
→ Hebrew: "החתול ישן על הספה."
→ [🔊 Play sentence] [הבא →]
```

#### 2. Hangman Game (Post-Game)
After winning or losing, show the example sentence:

**Current Flow:**
```
Game Over: PIG
חֲזִיר = PIG
[הבא →]
```

**Enhanced Flow:**
```
Game Over: PIG
חֲזִיר = PIG

Example: "The pig is playing in the mud."
דוגמה: "החזיר משחק בבוץ."
[🔊 Play] [הבא →]
```

#### 3. Memory Game (Optional - Future)
After completing the game, show a summary screen with example sentences for all matched words.

#### 4. Spelling Game (Optional - Future)
Show example sentence after successfully spelling a word.

### UI Components

#### Sentence Display Component
```
┌─────────────────────────────────────┐
│ Example Usage / דוגמה לשימוש        │
├─────────────────────────────────────┤
│ "The cat is sleeping on the sofa."  │ [🔊]
│                                     │
│ "החתול ישן על הספה."                │ [🔊]
└─────────────────────────────────────┘
```

**Visual Design:**
- Light background panel (semi-transparent white)
- English sentence in LTR direction
- Hebrew translation in RTL direction
- Speaker icons for audio playback (both English and Hebrew)
- Subtle border or shadow to distinguish from main content
- Compact design to fit mobile viewports

### Interactions

1. **Automatic Display**: Example sentence appears automatically after correct answer or game completion
2. **Audio Playback**:
   - Tap English speaker icon → plays English sentence
   - Tap Hebrew speaker icon → plays Hebrew sentence (if Hebrew TTS supported)
3. **Dismissal**: User can proceed to next card/word without forced interaction
4. **Opt-in/Opt-out**: Settings option to show/hide example sentences (default: on)

### Accessibility
- Text is readable (minimum 14px font)
- High contrast for readability
- Audio support for pronunciation
- Optional toggle in settings for users who prefer word-only learning

## Technical Design

### Data Model Changes

#### Extended Word Interface
```typescript
// src/data/dictionary.ts

export interface Word {
  id: string;
  english: string;
  hebrew: string;
  transcription: string; // Hebrew phonetic transcription with nikud
  category: Category;
  exampleSentence?: {
    english: string;
    hebrew: string;
  };
}
```

**Why Optional (`?`)**:
- Allows gradual migration (add sentences over time)
- Not all words need sentences immediately
- Backwards compatible with existing code
- Games can check for existence before displaying

#### Example Data Structure
```typescript
const exampleWord: Word = {
  id: 'animal-1',
  english: 'cat',
  hebrew: 'חָתוּל',
  transcription: 'קֶט',
  category: 'animals',
  exampleSentence: {
    english: 'The cat is sleeping on the sofa.',
    hebrew: 'החתול ישן על הספה.',
  },
};
```

### New Components

#### 1. SentenceDisplay Component
**File**: `/src/components/shared/SentenceDisplay.tsx`

**Responsibilities**:
- Display example sentence in both languages
- Handle audio playback for sentences
- Responsive layout for mobile/desktop
- Optional show/hide toggle

**Props**:
```typescript
interface SentenceDisplayProps {
  sentence: {
    english: string;
    hebrew: string;
  };
  onPlayEnglish?: () => void;
  onPlayHebrew?: () => void;
  showSpeakerButtons?: boolean; // default: true
  className?: string;
}
```

**Implementation**:
```typescript
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
    // Hebrew TTS may not be well-supported
    // Could use external API or skip Hebrew audio
    speak(sentence.hebrew, 'he');
    onPlayHebrew?.();
  };

  return (
    <div className={`sentence-display ${className}`}>
      <div className="sentence-header">דוגמה לשימוש / Example Usage</div>
      <div className="sentence-row english" dir="ltr">
        <span className="sentence-text">"{sentence.english}"</span>
        {showSpeakerButtons && (
          <button
            className="speaker-btn"
            onClick={handlePlayEnglish}
            aria-label="Play English sentence"
          >
            🔊
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
            🔊
          </button>
        )}
      </div>
    </div>
  );
};
```

### Integration Points

#### 1. Flashcards Game Integration
**File**: `/src/components/FlashcardsGame/FlashcardsGame.tsx`

**Changes**:
- Add state: `showSentence: boolean` (toggles after answer)
- After correct/incorrect answer, display sentence if available
- Delay "Next" button or show alongside sentence
- Add setting to enable/disable sentence display

**Modified Flow**:
```typescript
const handleAnswer = (selectedWord: Word) => {
  setIsAnswered(true);
  setSelectedAnswer(selectedWord.id);

  // Existing logic...

  // NEW: Show sentence if available
  if (currentCard.word.exampleSentence) {
    setShowSentence(true);
  }
};

// In render:
{isAnswered && currentCard.word.exampleSentence && (
  <SentenceDisplay sentence={currentCard.word.exampleSentence} />
)}
```

#### 2. Hangman Game Integration
**File**: `/src/components/HangmanGame/HangmanGame.tsx`

**Changes**:
- Show sentence in win/lose feedback screen
- Display alongside final word reveal
- Add speaker button for sentence playback

**Modified Result Screen**:
```typescript
{gameStatus !== 'playing' && (
  <div className="result-screen">
    <div className="result-message">
      {gameStatus === 'won' ? '✓ כל הכבוד!' : '✗ אופס...'}
    </div>

    {/* Existing word display */}

    {/* NEW: Example sentence */}
    {currentWord.exampleSentence && (
      <SentenceDisplay sentence={currentWord.exampleSentence} />
    )}

    <button onClick={handleNextWord}>הבא →</button>
  </div>
)}
```

#### 3. Settings Integration (Optional - Future)
**File**: `/src/components/FlashcardsGame/FlashcardsGame.tsx` (and others)

**New Setting**:
```typescript
interface GameSettings {
  // Existing settings...
  showExampleSentences: boolean; // default: true
}
```

Store in localStorage:
```typescript
const SETTINGS_KEY = 'learn-eng-game-settings';
```

### Files to Create/Modify

#### New Files
1. `/src/components/shared/SentenceDisplay.tsx` - Reusable sentence component

#### Modified Files
1. `/src/data/dictionary.ts`
   - Update `Word` interface with optional `exampleSentence`
   - Add example sentences to all 110 words
   - Keep existing exports and functions unchanged

2. `/src/components/FlashcardsGame/FlashcardsGame.tsx`
   - Import `SentenceDisplay`
   - Add state for showing sentences
   - Integrate sentence display after answer
   - Add optional settings toggle

3. `/src/components/HangmanGame/HangmanGame.tsx`
   - Import `SentenceDisplay`
   - Show sentence in result screen
   - Add audio playback for sentence

4. `/src/styles/main.css`
   - Add `.sentence-display` styles
   - Add `.sentence-row` styles for English/Hebrew
   - Add `.sentence-header` styles
   - Add responsive breakpoints
   - Ensure proper RTL/LTR direction handling

5. `/src/constants/version.ts`
   - Increment version (v0.1.26 → v0.2.0 for minor feature)

#### Documentation Updates
1. `/docs/state.md` - Document new example sentence feature
2. `/docs/backlog.md` - Mark "Add example sentences" as completed
3. `/docs/tech-design.md` - Update Word interface documentation

### CSS Styling

```css
/* Sentence Display Component */
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

.sentence-row .speaker-btn:active {
  transform: scale(0.95);
}

/* Responsive adjustments */
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
    font-size: 1rem;
  }
}

@media (min-width: 768px) {
  .sentence-display {
    max-width: 600px;
    margin: 20px auto;
  }
}
```

### Example Sentence Guidelines

#### Principles for Writing Sentences
1. **Simple & Clear**: Use basic sentence structures appropriate for beginners
2. **Relevant Context**: Match the word's primary meaning
3. **Common Usage**: Show typical, everyday usage
4. **Age-Appropriate**: Suitable for children (no complex topics)
5. **Short Length**: Keep sentences under 10 words when possible
6. **Natural Hebrew**: Provide accurate, natural Hebrew translations

#### Examples by Category

**Animals:**
```typescript
{ english: 'cat', hebrew: 'חָתוּל' }
→ "The cat is sleeping on the sofa."
→ "החתול ישן על הספה."

{ english: 'dog', hebrew: 'כֶּלֶב' }
→ "The dog is playing in the park."
→ "הכלב משחק בפארק."
```

**Food:**
```typescript
{ english: 'apple', hebrew: 'תַּפּוּחַ' }
→ "I eat an apple every day."
→ "אני אוכל תפוח כל יום."

{ english: 'milk', hebrew: 'חָלָב' }
→ "The baby is drinking milk."
→ "התינוק שותה חלב."
```

**Colors:**
```typescript
{ english: 'red', hebrew: 'אָדֹם' }
→ "The apple is red."
→ "התפוח אדום."

{ english: 'blue', hebrew: 'כָּחֹל' }
→ "The sky is blue."
→ "השמיים כחולים."
```

**Verbs:**
```typescript
{ english: 'run', hebrew: 'לָרוּץ' }
→ "The children run in the park."
→ "הילדים רצים בפארק."

{ english: 'eat', hebrew: 'לֶאֱכֹל' }
→ "We eat breakfast at seven."
→ "אנחנו אוכלים ארוחת בוקר בשבע."
```

**Numbers:**
```typescript
{ english: 'five', hebrew: 'חָמֵשׁ' }
→ "I have five fingers on my hand."
→ "יש לי חמש אצבעות ביד."

{ english: 'ten', hebrew: 'עֶשֶׂר' }
→ "There are ten candles on the cake."
→ "יש עשרה נרות על העוגה."
```

### Implementation Strategy

#### Phase 1: Foundation (Priority: High)
1. Update `Word` interface with optional `exampleSentence`
2. Create `SentenceDisplay` component
3. Add CSS styles
4. Add example sentences to 20 sample words (for testing)

#### Phase 2: Integration (Priority: High)
1. Integrate into Flashcards game
2. Test display and audio playback
3. Verify mobile responsiveness
4. Collect internal feedback

#### Phase 3: Content (Priority: Medium)
1. Write example sentences for all 110 words
2. Review Hebrew translations for accuracy
3. Test audio playback for all sentences
4. Iterate based on testing

#### Phase 4: Enhancement (Priority: Low)
1. Integrate into Hangman game
2. Add settings toggle for show/hide
3. Consider integration into Memory and Spelling games
4. Add sentence length variations

## Implementation Tasks

### Phase 1: Foundation & Component
1. [ ] Update Word interface in dictionary.ts with optional exampleSentence field - **Small**
2. [ ] Create SentenceDisplay component with props interface - **Small**
3. [ ] Implement SentenceDisplay rendering (English + Hebrew rows) - **Small**
4. [ ] Add speaker button handlers with audio playback - **Small**
5. [ ] Add CSS styles for sentence-display component - **Small**
6. [ ] Test SentenceDisplay component in isolation - **Small**

### Phase 2: Content Creation
7. [ ] Write example sentences for Animals category (15 words) - **Medium**
8. [ ] Write example sentences for Food category (15 words) - **Medium**
9. [ ] Write example sentences for Colors category (12 words) - **Small**
10. [ ] Write example sentences for Numbers category (20 words) - **Medium**
11. [ ] Write example sentences for Body Parts category (12 words) - **Small**
12. [ ] Write example sentences for Household category (12 words) - **Small**
13. [ ] Write example sentences for Nature category (12 words) - **Small**
14. [ ] Write example sentences for Verbs category (12 words) - **Small**
15. [ ] Review all Hebrew translations for accuracy - **Medium**

### Phase 3: Game Integration
16. [ ] Integrate SentenceDisplay into FlashcardsGame (after answer) - **Medium**
17. [ ] Add state management for showing/hiding sentences - **Small**
18. [ ] Test sentence display in Flashcards game flow - **Small**
19. [ ] Integrate SentenceDisplay into HangmanGame (result screen) - **Small**
20. [ ] Test sentence display in Hangman game flow - **Small**

### Phase 4: Polish & Settings
21. [ ] Add settings option to show/hide example sentences - **Medium**
22. [ ] Persist sentence display preference in localStorage - **Small**
23. [ ] Add fade-in animation for sentence appearance - **Small**
24. [ ] Test Hebrew TTS support (may need fallback handling) - **Small**
25. [ ] Mobile viewport testing across all integrated games - **Small**

### Phase 5: Documentation
26. [ ] Update docs/state.md with example sentence feature - **Small**
27. [ ] Update docs/backlog.md to mark task as completed - **Small**
28. [ ] Update docs/tech-design.md with Word interface changes - **Small**
29. [ ] Increment app version to v0.2.0 - **Small**

### Total Estimated Time: 8-12 hours

**Breakdown:**
- Phase 1 (Foundation): 2 hours
- Phase 2 (Content): 4-6 hours (most time-consuming)
- Phase 3 (Integration): 1.5 hours
- Phase 4 (Polish): 1 hour
- Phase 5 (Documentation): 0.5 hours

### Complexity Assessment
- **Overall Complexity**: Medium
- **Highest Risk**: Content creation (110 sentences with accurate translations)
- **Technical Risk**: Low (straightforward component + data extension)
- **Testing Scope**: Medium (need to verify all 110 sentences)

## Design Decisions

### 1. Optional vs Required Sentences
**Decision**: Make `exampleSentence` optional in Word interface

**Rationale**:
- Allows incremental rollout (add sentences gradually)
- Backwards compatible with existing code
- Games can gracefully handle missing sentences
- Reduces initial workload (can start with subset)

**Alternative Considered**: Required field for all words
**Why Not**: Would require completing all 110 sentences before shipping

### 2. Component Location
**Decision**: Create shared component in `/src/components/shared/`

**Rationale**:
- Reusable across multiple games
- Centralizes sentence display logic
- Easier to maintain and update
- Follows DRY principle

**Alternative Considered**: Inline in each game
**Why Not**: Code duplication, harder to maintain consistency

### 3. Display Timing (Flashcards)
**Decision**: Show sentence immediately after answer, alongside feedback

**Rationale**:
- Contextual learning moment (right after testing knowledge)
- Reinforces correct answer
- Provides value even for incorrect answers
- Doesn't interrupt game flow significantly

**Alternative Considered**: Show only after correct answers
**Why Not**: Learners benefit from examples even when wrong

### 4. Hebrew Translation Inclusion
**Decision**: Include Hebrew sentence translation alongside English

**Rationale**:
- Target audience is Hebrew speakers with limited English
- Helps comprehension of sentence structure
- Shows how translation differs from literal word-by-word
- Educational value for understanding context

**Alternative Considered**: English only (let learners infer)
**Why Not**: Too challenging for beginners, reduces accessibility

### 5. Audio Playback for Sentences
**Decision**: Provide speaker buttons for both English and Hebrew sentences

**Rationale**:
- Aligns with existing app pattern (word pronunciation)
- Helps with listening comprehension
- Demonstrates natural sentence intonation
- Accessible learning for different learning styles

**Alternative Considered**: English only, or no audio
**Why Not**: Reduces learning effectiveness, inconsistent with app philosophy

### 6. Settings Toggle
**Decision**: Add optional settings to show/hide sentences (default: on)

**Rationale**:
- User control over learning experience
- Some advanced learners may not need sentences
- Reduces screen clutter for users who prefer it
- Respects different learning preferences

**Alternative Considered**: Always show (no toggle)
**Why Not**: Less flexible, may frustrate users who find it distracting

### 7. Sentence Complexity Level
**Decision**: Keep sentences simple (under 10 words, basic grammar)

**Rationale**:
- Target audience is beginners/children
- Focus is on vocabulary, not complex grammar
- Easier to translate accurately
- Reduces cognitive load

**Alternative Considered**: Varying complexity by word category
**Why Not**: Inconsistent experience, harder to maintain

### 8. Content Creation Approach
**Decision**: Manual creation with review process

**Rationale**:
- Ensures quality and appropriateness
- Accurate Hebrew translations
- Contextually relevant examples
- Educational value verified

**Alternative Considered**: AI-generated sentences
**Why Not**: May produce unnatural Hebrew, needs heavy review anyway

### 9. Animation & Visual Treatment
**Decision**: Subtle fade-in animation, distinct panel with light background

**Rationale**:
- Draws attention without being distracting
- Visually separates from main game content
- Feels like added value, not interruption
- Maintains clean UI

**Alternative Considered**: Modal/popup overlay
**Why Not**: More interruptive, requires dismissal action

## Open Questions

### 1. Hebrew TTS Support
**Question**: How well does the Web Speech API support Hebrew text-to-speech?

**Options**:
- Test Hebrew TTS across devices
- Use external TTS API for Hebrew if needed
- Skip Hebrew audio if TTS quality is poor

**Recommendation**: Test Hebrew TTS quality on major browsers/devices. If quality is insufficient, initially launch with English audio only, add Hebrew later via external API.

### 2. Sentence Display in Memory Game
**Question**: Should we show example sentences in Memory Game?

**Options**:
- Show summary of all matched words with sentences after game
- Show sentence when a pair is matched (during game)
- Skip Memory Game integration (keep it simple)

**Recommendation**: Defer to Phase 2. Memory Game is about matching, not reading. Could add post-game summary later if users request it.

### 3. Sentence Display in Spelling Game
**Question**: Should we show example sentences in Spelling Game?

**Options**:
- Show after successfully spelling a word
- Show in hint panel alongside transcription
- Skip Spelling Game integration

**Recommendation**: Defer to Phase 2. Focus on Flashcards and Hangman first (where context is most valuable), expand later based on feedback.

### 4. Multiple Sentences per Word
**Question**: Should some words have multiple example sentences?

**Options**:
- Single sentence per word (simpler)
- Multiple sentences for common/important words
- Rotate sentences each time word appears

**Recommendation**: Start with single sentence per word. Can add multiple sentences in future update with rotation logic.

### 5. Sentence Audio Pre-recording vs TTS
**Question**: Should we pre-record sentence audio by native speakers?

**Options**:
- Use TTS (immediate, scalable, free)
- Record native speaker audio (higher quality, more work)
- Hybrid (record key sentences, TTS for others)

**Recommendation**: Start with TTS (faster implementation). Consider pre-recorded audio in future if budget/time allows and users report TTS quality issues.

### 6. Sentence Length Variation
**Question**: Should longer words have longer sentences, or keep all uniform?

**Options**:
- Uniform length (~8 words average)
- Variable length based on word complexity
- Very short for simple words, longer for complex

**Recommendation**: Keep relatively uniform (6-10 words). Consistency helps learners, avoids overwhelming them.

### 7. Cultural Context
**Question**: Should sentences reference Israeli/Hebrew culture or be universal?

**Options**:
- Universal contexts (applicable anywhere)
- Israeli cultural references (more relatable to target audience)
- Mix of both

**Recommendation**: Keep universal for MVP (easier to create, more broadly applicable). Can add culturally-specific variants later.

### 8. Sentence Translation Style
**Question**: Should Hebrew translations be literal or natural/idiomatic?

**Options**:
- Literal (word-for-word when possible)
- Natural (how a Hebrew speaker would say it)
- Hybrid (natural but similar structure)

**Recommendation**: Natural Hebrew (how native speakers actually talk), but try to maintain similar sentence structure to aid learning of English grammar patterns.

## Success Metrics

### Quantitative
- **Completion Rate**: % of words that have example sentences
- **Display Rate**: How often sentences are viewed (not skipped)
- **Audio Playback Rate**: % of users who play sentence audio
- **Session Duration**: Increase in time spent per game session
- **Settings Usage**: % of users who disable sentence display

### Qualitative
- **User Feedback**: Do learners find sentences helpful?
- **Learning Outcomes**: Do users report better word retention?
- **Parent/Teacher Feedback**: Do they observe improved usage understanding?
- **User Requests**: Do users ask for sentences in other games?

### Success Criteria
- At least 80% of dictionary words have example sentences within 2 months
- Less than 10% of users disable sentence display (indicates value)
- Positive user feedback on feature usefulness
- No significant increase in bug reports or UI issues

## Risks & Mitigations

### Risk 1: Translation Accuracy
**Risk**: Hebrew translations may be inaccurate or unnatural

**Mitigation**:
- Have native Hebrew speaker review all translations
- Start with small batch (20 words) and validate approach
- Allow for easy corrections (just update dictionary.ts)
- Consider community feedback mechanism in future

### Risk 2: Content Creation Bottleneck
**Risk**: Writing 110 quality sentences takes significant time

**Mitigation**:
- Prioritize high-frequency words first (animals, food, colors)
- Implement feature with partial content (works with any # of sentences)
- Recruit native English/Hebrew speakers to help if needed
- Consider AI assistance for draft generation (with heavy review)

### Risk 3: Mobile Screen Space
**Risk**: Sentences take up too much screen space on small devices

**Mitigation**:
- Compact design with smaller font sizes
- Test on smallest common viewport (iPhone SE)
- Make collapsible if needed
- Settings toggle to disable if users find it cramped

### Risk 4: Hebrew TTS Quality
**Risk**: Hebrew text-to-speech may sound poor or be unavailable

**Mitigation**:
- Test extensively across browsers/devices
- Make Hebrew audio optional (English is primary)
- Consider external TTS API if needed (future enhancement)
- Document known limitations

### Risk 5: Game Flow Disruption
**Risk**: Sentences may slow down game pace, reduce engagement

**Mitigation**:
- Make sentences non-blocking (can skip immediately)
- Settings toggle for users who prefer faster pace
- A/B test with/without sentences to measure engagement
- Consider auto-hide after a few seconds (optional)

## Future Enhancements

### Phase 2 (Post-MVP)
1. **Multiple Sentences per Word** - Rotate different examples each time
2. **Sentence Complexity Levels** - Beginner/intermediate/advanced examples
3. **Memory Game Integration** - Post-game sentence summary
4. **Spelling Game Integration** - Show sentence after correct spelling
5. **Audio Pre-recording** - Native speaker recordings for key sentences
6. **Sentence Translation Toggle** - Hide Hebrew to practice comprehension
7. **Cultural Context Variants** - Israeli-specific examples alongside universal ones

### Phase 3 (Advanced)
1. **User-Generated Sentences** - Allow users to submit their own examples
2. **Sentence Games** - New game modes focused on sentence comprehension
3. **Fill-in-the-Blank** - Interactive sentence completion exercises
4. **Sentence Audio Recording** - Let users record their own pronunciation
5. **AI-Powered Variations** - Generate contextually similar sentences
6. **Conversation Patterns** - Link related sentences to show dialogue
7. **Grammar Hints** - Annotate sentences with grammar explanations

## Notes

### Content Creation Strategy
Given the significant content creation workload (110 words × 2 languages), consider:

1. **Batch Approach**:
   - Week 1: Animals (15) + Food (15) = 30 words
   - Week 2: Colors (12) + Numbers (20) = 32 words
   - Week 3: Body Parts (12) + Household (12) = 24 words
   - Week 4: Nature (12) + Verbs (12) = 24 words
   - Week 5: Review and polish all translations

2. **Quality over Speed**:
   - Better to ship with 50 great sentences than 110 mediocre ones
   - Can add more sentences in updates

3. **Community Involvement**:
   - If app gains users, consider crowdsourcing sentence suggestions
   - Moderation required to ensure quality

### Learning Science Principles
This feature aligns with:
- **Contextual Learning**: Words in context improve retention
- **Dual Coding**: Visual (text) + auditory (speech) reinforces learning
- **Elaborative Rehearsal**: Sentences provide deeper processing than word pairs
- **Transfer of Learning**: Shows how to use words in real situations

### Alignment with Product Vision
- **Educational-First**: Prioritizes learning over gamification
- **Accessibility**: Multiple modalities (visual, audio) serve different learners
- **Progressive Enhancement**: Optional feature doesn't disrupt existing games
- **Mobile-Optimized**: Designed for mobile-first experience from the start
