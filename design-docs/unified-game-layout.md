# Unified Game Layout + Word Teaching Modal

## Overview

Standardize all games with a consistent three-section layout (header, game area, footer) plus a unified teaching modal that appears after each word interaction. This creates a cohesive experience where games share common UI patterns while the modal reinforces learning with the word, translation, and example sentences with audio.

## Goals

1. **Consistency**: All games share the same layout structure
2. **Teaching Focus**: Every word interaction ends with a learning opportunity
3. **Reusability**: Shared components reduce code duplication
4. **Mobile-First**: Layout works well on all screen sizes

## Scope

### In Scope
- Spelling Game
- Flashcards Game
- Hangman Game

### Out of Scope (Separate Task)
- Memory Game (requires different modal behavior - multiple words per session)

---

## User Experience

### Target Users
Hebrew speakers learning English vocabulary through interactive games.

### Problem Solved
- Inconsistent game layouts create disjointed experience
- Not all games reinforce learning with example sentences
- Navigation and controls vary between games

### Solution
Unified layout with dedicated sections for navigation, gameplay, and actions, plus a teaching modal that appears after each word.

---

## UI Design

### Game Layout Structure

```
┌─────────────────────────────────────┐
│  HEADER (compact, ~48px)            │
│  ← Back    [Progress]    ⚙️ Settings│
├─────────────────────────────────────┤
│                                     │
│                                     │
│           GAME AREA                 │
│     (game-specific content)         │
│        (fills remaining space)      │
│                                     │
│                                     │
├─────────────────────────────────────┤
│  FOOTER (~80px)                     │
│  [Status Message]       [Next →]    │
└─────────────────────────────────────┘
```

### Header Details
- **Back button** (←): Small, left-aligned, returns to game menu
- **Progress**: Center, game-specific (streak, mastery %, etc.)
- **Settings** (⚙️): Right-aligned, opens game settings

### Footer Details
- **Status message**: Left side, shows success/failure feedback
- **Next button**: Right side, consistent position across games

### Word Teaching Modal

```
┌─────────────────────────────────────┐
│                                     │
│         ✓ נכון!                     │
│         (or ✗ לא נכון)              │
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │     🔊  DOG                   │  │
│  │         כֶּלֶב            🔊   │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │   משפט לדוגמה                  │  │
│  │                               │  │
│  │  🔊 The dog is playing.       │  │
│  │                               │  │
│  │  🔊 הכלב משחק.                 │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│          [ סגור / Close ]           │
│                                     │
└─────────────────────────────────────┘
```

### Modal Content
1. **Result indicator**: ✓ (green) for success, ✗ (red) for failure
2. **Word card**:
   - English word with speaker button
   - Hebrew translation with speaker button
3. **Example sentence** (if available):
   - English sentence with speaker button
   - Hebrew sentence with speaker button
4. **Close button**: Dismisses modal

### Modal Behavior
- Appears after each word/round completion
- Must be manually dismissed (tap Close or press Enter/Escape)
- Blocks game interaction while open
- Overlay darkens background

---

## Game-Specific Adaptations

### Spelling Game
| Section | Content |
|---------|---------|
| Header Progress | Streak: X (Record: Y) |
| Header Settings | (future: difficulty) |
| Footer Status | ✓ נכון! / ✗ לא נכון |
| Modal Trigger | After tapping "Check" button |

### Flashcards Game
| Section | Content |
|---------|---------|
| Header Progress | Mastery: X% |
| Header Settings | Answer count, question language |
| Footer Status | ✓ נכון! / ✗ לא נכון |
| Modal Trigger | After selecting an answer |

### Hangman Game
| Section | Content |
|---------|---------|
| Header Progress | Streak: X (Record: Y) |
| Header Settings | (future: difficulty) |
| Footer Status | ניצחת! / הפסדת |
| Modal Trigger | After win or loss |

---

## Technical Design

### New Shared Components

#### 1. GameLayout
Location: `src/components/shared/GameLayout/GameLayout.tsx`

```typescript
interface GameLayoutProps {
  // Header
  onBack: () => void;
  progress?: React.ReactNode;
  onSettings?: () => void;
  settingsContent?: React.ReactNode;

  // Game area
  children: React.ReactNode;

  // Footer
  statusMessage?: string;
  statusType?: 'success' | 'error' | 'neutral';
  showNext?: boolean;
  nextLabel?: string;
  onNext?: () => void;
  nextDisabled?: boolean;
}
```

#### 2. GameHeader
Location: `src/components/shared/GameHeader/GameHeader.tsx`

```typescript
interface GameHeaderProps {
  onBack: () => void;
  progress?: React.ReactNode;
  onSettings?: () => void;
}
```

#### 3. GameFooter
Location: `src/components/shared/GameFooter/GameFooter.tsx`

```typescript
interface GameFooterProps {
  statusMessage?: string;
  statusType?: 'success' | 'error' | 'neutral';
  showNext?: boolean;
  nextLabel?: string;
  onNext?: () => void;
  nextDisabled?: boolean;
}
```

#### 4. WordTeachingModal
Location: `src/components/shared/WordTeachingModal/WordTeachingModal.tsx`

```typescript
interface WordTeachingModalProps {
  isOpen: boolean;
  word: Word;
  isSuccess: boolean;
  onClose: () => void;
}
```

### CSS Classes

```css
/* Layout */
.game-layout { }
.game-header { }
.game-area { }
.game-footer { }

/* Modal */
.word-teaching-modal { }
.word-teaching-modal__overlay { }
.word-teaching-modal__content { }
.word-teaching-modal__result { }
.word-teaching-modal__word-card { }
.word-teaching-modal__sentence { }
.word-teaching-modal__close { }
```

### Integration Pattern

Each game will be refactored to:
1. Wrap content in `<GameLayout>` component
2. Move navigation/progress to header props
3. Move action buttons to footer
4. Add `<WordTeachingModal>` with appropriate trigger

---

## Implementation Tasks

| # | Task | Complexity |
|---|------|------------|
| 1 | Create GameLayout component | Medium |
| 2 | Create GameHeader component | Small |
| 3 | Create GameFooter component | Small |
| 4 | Create WordTeachingModal component | Medium |
| 5 | Add CSS for layout structure | Medium |
| 6 | Add CSS for modal | Small |
| 7 | Refactor Spelling Game | Medium |
| 8 | Refactor Flashcards Game | Medium |
| 9 | Refactor Hangman Game | Medium |
| 10 | Test on mobile and desktop | Small |

**Total Effort**: Large

---

## Future Considerations

- Memory Game will need a separate modal design (task to be created)
- Settings panels could be standardized across games
- Animations for modal open/close
- Keyboard navigation improvements
