# Feature Design: Category/Topic Selection in Game Settings

**Version**: 1.0
**Date Created**: 2025-12-05
**Status**: Design Complete

---

## 1. Feature Overview

### Feature Name
**Category Selection** - Allow users to select specific vocabulary categories/topics to practice before starting a game.

### One-Line Description
A category filtering system that lets learners focus their practice on specific vocabulary topics (animals, food, colors, etc.), enabling personalized and targeted learning sessions.

### Problem Statement
Currently, all games in the application use the full dictionary of 110 words across 8 categories. This creates several challenges:

1. **Overwhelming breadth**: New learners may find it difficult to practice specific topics they are currently studying
2. **No topical focus**: Users cannot align game practice with classroom learning or personal interests
3. **Scattered reinforcement**: Words from different categories appear randomly, reducing topic-focused retention
4. **Limited control**: Users have no way to customize their learning experience based on current needs
5. **Motivation challenges**: Users interested in specific topics (e.g., animals for a child, food for a traveler) cannot prioritize those words

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Feature Adoption | >60% of users use category filtering at least once within first week | Track filter usage events |
| Category Distribution | All 8 categories used at least 10% each (no abandoned categories) | Track category selection frequency |
| Session Focus | 40% increase in consecutive practice of same-category words | Track category consistency per session |
| User Satisfaction | Positive feedback on filtering usefulness | In-app survey or feedback |
| Completion Rates | No decrease in game completion rates when filtering | Compare filtered vs. unfiltered sessions |

---

## 2. Category Taxonomy

### Existing Categories

The dictionary already defines 8 well-organized categories:

| Category ID | Display Name (Hebrew) | Word Count | Example Words |
|-------------|----------------------|------------|---------------|
| `animals` | חיות | 15 | cat, dog, elephant, lion |
| `food` | אוכל | 15 | apple, bread, milk, cheese |
| `colors` | צבעים | 12 | red, blue, green, yellow |
| `numbers` | מספרים | 20 | one, two, three... twenty |
| `bodyParts` | חלקי גוף | 12 | head, hand, eye, ear |
| `household` | בית | 12 | house, table, chair, bed |
| `nature` | טבע | 12 | sun, moon, tree, flower |
| `verbs` | פעלים | 12 | go, eat, sleep, run |

**Total**: 110 words across 8 categories

### Category Grouping (Future Enhancement)

For easier selection, categories can be grouped into meta-themes:

```
Living Things       Things Around Us     Actions & Abstract
- Animals           - Household          - Numbers
- Body Parts        - Nature             - Colors
                    - Food               - Verbs
```

### Category Selection Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| All Categories | No filter, full dictionary | General practice |
| Single Category | One category only | Focused topic study |
| Multiple Categories | 2-7 categories | Broader topical focus |

---

## 3. User Experience Flows

### Entry Points

1. **Pre-Game Settings Screen**
   - Primary entry: Category selector appears on game settings screen before starting
   - User can select/deselect categories then start game

2. **Quick Filter from Menu**
   - Secondary entry: Filter icon on game menu shows current selection
   - Tap to quickly change filter without entering game settings

3. **In-Game Filter Change** (Phase 2)
   - Tertiary entry: Change filter mid-session from settings panel
   - Starts new game with new filter

### Main User Journey

```
[Game Menu]
     |
     v
[Select Game] --> [Game Settings Screen]
                          |
          +---------------+---------------+
          |                               |
          v                               v
   [Difficulty Selector]          [Category Filter]
          |                               |
          +---------------+---------------+
                          |
                          v
                   [Selected: 3 categories]
                          |
                          v
                   [Start Game Button]
                          |
                          v
                   [Game Begins with
                    filtered words]
```

### Category Selection Flow

```
[Category Filter Section]
        |
        v
[Select Categories]
        |
        +-- [All] toggle (master select/deselect)
        |
        +-- [Animals] checkbox
        +-- [Food] checkbox
        +-- [Colors] checkbox
        +-- [Numbers] checkbox
        +-- [Body Parts] checkbox
        +-- [Household] checkbox
        +-- [Nature] checkbox
        +-- [Verbs] checkbox
        |
        v
[Show: "X words available"]
        |
        v
[Minimum word warning if < required]
```

### Wireframe: Game Settings Screen

```
+------------------------------------------+
|  [<-]  Memory Game Settings              |
+------------------------------------------+
|                                          |
|  DIFFICULTY                              |
|  +--------+  +--------+  +--------+      |
|  | Easy   |  | Medium |  |  Hard  |      |
|  +--------+  +--------+  +--------+      |
|                                          |
|  ----------------------------------------|
|                                          |
|  CATEGORIES                              |
|  Practice words from selected topics     |
|                                          |
|  [v] All Categories (110 words)          |
|                                          |
|  +----------+  +----------+  +----------+|
|  |[x]Animals|  |[x] Food  |  |[x]Colors ||
|  |  15 wrds |  |  15 wrds |  | 12 wrds  ||
|  +----------+  +----------+  +----------+|
|                                          |
|  +----------+  +----------+  +----------+|
|  |[x]Numbers|  |[x] Body  |  |[x] House ||
|  |  20 wrds |  |  12 wrds |  | 12 wrds  ||
|  +----------+  +----------+  +----------+|
|                                          |
|  +----------+  +----------+              |
|  |[x]Nature |  |[x] Verbs |              |
|  |  12 wrds |  |  12 wrds |              |
|  +----------+  +----------+              |
|                                          |
|  Available: 110 words                    |
|                                          |
|         [  Start Game  ]                 |
|                                          |
+------------------------------------------+
```

### Wireframe: Filtered State

```
+------------------------------------------+
|  [<-]  Spelling Game Settings            |
+------------------------------------------+
|                                          |
|  DIFFICULTY                              |
|  +--------+  +--------+  +--------+      |
|  | Easy   |  |[Medium]|  |  Hard  |      |
|  +--------+  +--------+  +--------+      |
|                                          |
|  ----------------------------------------|
|                                          |
|  CATEGORIES                              |
|  Practice words from selected topics     |
|                                          |
|  [ ] All Categories                      |
|                                          |
|  +----------+  +----------+  +----------+|
|  |[x]Animals|  |[ ] Food  |  |[ ]Colors ||
|  |  15 wrds |  |  15 wrds |  | 12 wrds  ||
|  +----------+  +----------+  +----------+|
|                                          |
|  +----------+  +----------+  +----------+|
|  |[ ]Numbers|  |[ ] Body  |  |[ ] House ||
|  |  20 wrds |  |  12 wrds |  | 12 wrds  ||
|  +----------+  +----------+  +----------+|
|                                          |
|  +----------+  +----------+              |
|  |[x]Nature |  |[ ] Verbs |              |
|  |  12 wrds |  |  12 wrds |              |
|  +----------+  +----------+              |
|                                          |
|  Available: 27 words (Animals + Nature)  |
|                                          |
|         [  Start Game  ]                 |
|                                          |
+------------------------------------------+
```

### Insufficient Words Warning

```
+------------------------------------------+
|  [<-]  Memory Game Settings              |
+------------------------------------------+
|                                          |
|  DIFFICULTY                              |
|  +--------+  +--------+  +--------+      |
|  | Easy   |  | Medium |  |[ Hard ]|      |
|  +--------+  +--------+  +--------+      |
|                                          |
|  ----------------------------------------|
|                                          |
|  CATEGORIES                              |
|                                          |
|  [ ] All Categories                      |
|                                          |
|  +----------+  +----------+  +----------+|
|  |[ ]Animals|  |[ ] Food  |  |[x]Colors ||
|  +----------+  +----------+  +----------+|
|  ... (other unchecked) ...               |
|                                          |
|  +--------------------------------------+|
|  | ! Not enough words                   ||
|  |   Hard mode needs 8+ word pairs.     ||
|  |   Colors has only 12 words.          ||
|  |   Select more categories or lower    ||
|  |   the difficulty.                    ||
|  +--------------------------------------+|
|                                          |
|  Available: 12 words (need 16 for Hard)  |
|                                          |
|         [  Start Game  ] (disabled)      |
|                                          |
+------------------------------------------+
```

### Exit Points

1. **Start Game**: Begin with selected categories
2. **Back to Menu**: Return without starting (selection is saved)
3. **Reset to All**: Quick action to clear filter

### Error States and Recovery

| Error | User Message | Recovery Action |
|-------|--------------|-----------------|
| No categories selected | "Select at least one category to continue" | Prevent game start, highlight categories |
| Too few words for game mode | "Need at least X words. Select more categories or lower difficulty." | Show warning, disable start button |
| Category data missing | Silent fallback | Use all categories |
| Invalid stored selection | Silent recovery | Reset to all categories |

---

## 4. UI/UX Design Specifications

### 4.1 Category Chip Component

**Purpose**: Individual selectable category tile

**Layout**:
```
+-------------------+
|  [x]  Animals     |
|       15 words    |
+-------------------+
```

**States**:
- **Unselected**: Light background, muted text
- **Selected**: Colored background, checkmark visible
- **Disabled**: Grayed out (used when would make game impossible)

**Interactions**:
- Tap to toggle selection
- Visual feedback on tap (scale animation)
- Checkmark animates in/out

**Styling**:
```css
.category-chip {
  min-width: 100px;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 2px solid var(--border-color);
  background: var(--surface);
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-chip.selected {
  border-color: var(--accent-color);
  background: var(--accent-light);
}

.category-chip:active {
  transform: scale(0.95);
}

.category-chip .word-count {
  font-size: 0.75rem;
  color: var(--text-muted);
}
```

### 4.2 Category Grid Layout

**Mobile (< 480px)**:
- 2 columns
- Full-width chips
- Scrollable if needed

```
+----------+  +----------+
| Animals  |  |   Food   |
+----------+  +----------+
+----------+  +----------+
|  Colors  |  | Numbers  |
+----------+  +----------+
...
```

**Tablet (480px - 1024px)**:
- 3 columns
- Centered grid

**Desktop (> 1024px)**:
- 4 columns
- Larger chips with more padding

### 4.3 "All Categories" Toggle

**Purpose**: Quick select/deselect all

**Layout**:
```
+---------------------------------------+
|  [x]  All Categories (110 words)      |
+---------------------------------------+
```

**Behavior**:
- When checked: All categories selected
- When unchecked: No automatic deselection
- Becomes unchecked when any individual category is deselected
- Becomes checked when all categories are manually selected

### 4.4 Word Count Summary

**Purpose**: Show available words based on selection

**Layout**:
```
Available: 27 words
```

**States**:
- Normal: Neutral color
- Warning (< minimum): Orange color with warning icon
- Error (< game requirement): Red color, game start disabled

### 4.5 In-Game Category Indicator

**Purpose**: Show which categories are active during gameplay

**Location**: Game header, near difficulty badge

```
+------------------------------------------+
|  [<-]  Spelling    [M] [Animals, Nature] |
+------------------------------------------+
```

**Mobile**: Collapsed to icon, tap to expand
```
+------------------------------------------+
|  [<-]  Spelling    [M] [2 topics]        |
+------------------------------------------+
```

### 4.6 Colors and Visual Design

```css
:root {
  /* Category filter colors */
  --category-selected-bg: rgba(66, 133, 244, 0.15);
  --category-selected-border: #4285F4;
  --category-unselected-bg: var(--surface);
  --category-unselected-border: var(--border-color);

  /* Category-specific accent colors (optional) */
  --category-animals: #8BC34A;      /* Green - nature/animals */
  --category-food: #FF9800;         /* Orange - food warmth */
  --category-colors: #E91E63;       /* Pink - colorful */
  --category-numbers: #2196F3;      /* Blue - logical */
  --category-body: #9C27B0;         /* Purple - body/self */
  --category-household: #795548;    /* Brown - home */
  --category-nature: #4CAF50;       /* Green - nature */
  --category-verbs: #00BCD4;        /* Cyan - action */
}
```

### 4.7 Responsive Considerations

| Breakpoint | Layout | Notes |
|------------|--------|-------|
| < 480px | 2-column grid, stacked sections | Touch-friendly, 48px min tap targets |
| 480-768px | 3-column grid | Balanced layout |
| 768-1024px | 3-column with sidebar | Settings in sidebar |
| > 1024px | 4-column grid | Maximum information density |

### 4.8 Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| WCAG 2.1 AA | 4.5:1 contrast on all category labels |
| Screen readers | `role="checkbox"`, `aria-checked`, `aria-label="Animals category, 15 words"` |
| Keyboard navigation | Tab through chips, Space/Enter to toggle |
| Focus indicators | Visible focus ring on each chip |
| Color independence | Checkmark icon supplements color change |
| RTL support | Full RTL layout, Hebrew labels |
| Touch targets | 48x48px minimum on category chips |

---

## 5. Game Integration

### 5.1 How Categories Affect Each Game

| Game | Category Impact | Minimum Words Needed |
|------|----------------|---------------------|
| Memory Game | Pairs drawn from selected categories only | Easy: 8, Medium: 12, Hard: 16-20 |
| Spelling Game | Words drawn from selected categories | Any (1+ works) |
| Flashcards | Quiz choices from selected categories | 4 (for 4-choice mode) |
| Hangman | Words drawn from selected categories | Any (1+ works) |

### 5.2 Word Selection Logic

```typescript
// Pseudocode for filtered word selection
function getFilteredWords(
  selectedCategories: Category[],
  count: number,
  difficultyParams?: DifficultyParams
): Word[] {
  // Get words from selected categories
  let pool = dictionary.filter(word =>
    selectedCategories.includes(word.category)
  );

  // Apply difficulty filters if provided
  if (difficultyParams?.wordLengthFilter) {
    pool = pool.filter(word =>
      word.english.length >= difficultyParams.wordLengthFilter.min &&
      word.english.length <= difficultyParams.wordLengthFilter.max
    );
  }

  // Shuffle and return requested count
  return shuffleArray(pool).slice(0, count);
}
```

### 5.3 Memory Game Integration

**Current Flow**:
1. User selects word count
2. Words randomly selected from full dictionary
3. Game creates English-Hebrew pairs

**New Flow**:
1. User selects difficulty (determines word count)
2. User selects categories
3. Validate sufficient words available
4. Words randomly selected from filtered pool
5. Game creates pairs from filtered words

**Edge Cases**:
- If category has duplicate English words (none currently), dedupe
- If insufficient words after difficulty filter, show warning

### 5.4 Spelling Game Integration

**Current Flow**:
1. Random word selected
2. Letters shuffled with decoys
3. User spells word

**New Flow**:
1. Random word from filtered categories
2. Same gameplay
3. Streak tracks correctly

**Edge Cases**:
- Single category with few short words could feel repetitive
- Consider showing "You've practiced all words in [Category]!" message

### 5.5 Flashcards Game Integration

**Current Flow**:
1. Word presented with Hebrew options
2. User selects correct translation
3. Leitner box system for repetition

**New Flow**:
1. Word from filtered categories
2. Distractor options from same filtered pool
3. Leitner boxes scoped to filtered words

**Edge Cases**:
- Need 4 words minimum for 4-choice mode
- If filtered pool < 4 words, reduce choices or show warning
- Hard mode "similar distractors" may not apply well to small pools

### 5.6 Hangman Game Integration

**Current Flow**:
1. Random word selected
2. Limited keyboard shown
3. User guesses letters

**New Flow**:
1. Word from filtered categories
2. Same gameplay
3. Keyboard can remain word-based or full

**Edge Cases**:
- Very short words (3 letters) easier regardless of category
- Categories like "numbers" have words like "seventeen" (9 letters) - significant difficulty variance

### 5.7 Category Persistence Per Game

Each game stores its own category selection:

```typescript
interface GameCategorySettings {
  memory: Category[];
  spelling: Category[];
  flashcards: Category[];
  hangman: Category[];
}
```

**Storage Key**: `learn-eng-category-settings`

**Default**: All categories selected for each game

---

## 6. Multi-Select vs Single-Select Considerations

### Analysis

| Approach | Pros | Cons |
|----------|------|------|
| **Single-Select** | Simple UI, clear focus, always sufficient words | Limited flexibility, can't combine topics |
| **Multi-Select** | Maximum flexibility, user control | More complex UI, risk of insufficient words |
| **Hybrid** | Best of both worlds | Additional UI complexity |

### Recommendation: Multi-Select

**Rationale**:
1. Users can choose to focus on one category (effective single-select)
2. Users learning multiple topics can combine (e.g., classroom lesson covers animals + colors)
3. Prevents feeling "locked in" to one topic
4. More engaging for varied practice

**UI Mitigations for Multi-Select Complexity**:
1. "All Categories" toggle for quick full selection
2. Clear word count feedback
3. Minimum word warnings with actionable guidance
4. Visual grid makes multi-select feel natural

### Selection Behavior

| Action | Result |
|--------|--------|
| Tap category | Toggle that category |
| Tap "All" when some selected | Select all |
| Tap "All" when all selected | Deselect all |
| Select last remaining | "All" auto-checked |
| Deselect any | "All" becomes unchecked |

---

## 7. Default Behavior

### When No Category Selection Exists

| Scenario | Default Behavior |
|----------|------------------|
| First-time user | All categories selected |
| Returning user, no stored preference | All categories selected |
| User clears storage | All categories selected |
| Corrupted storage | Reset to all categories |

### When User Starts Game Without Selecting

- Use previously saved selection (or default all)
- Do NOT prompt for category selection if user wants quick start
- Category selector is visible but optional in settings screen

### "All Categories" as Default

**Benefits**:
1. No friction for users who don't want to filter
2. Games work exactly as before (backward compatible)
3. Users discover filtering organically

### Quick Start Flow

```
[Tap "Memory Game" on Menu]
        |
        v
[Settings Screen with saved preferences]
  - Difficulty: [last used or Easy]
  - Categories: [last used or All]
        |
        v
[User can directly tap "Start Game"]
        |
        v
[Game begins with saved settings]
```

No forced selection - users can ignore category filtering entirely.

---

## 8. Technical Considerations

### 8.1 Data Model

#### Category Selection Type
```typescript
type CategorySelection = Category[] | 'all';

// Or explicit array representation:
type CategorySelection = Category[]; // empty = all, non-empty = filtered
```

#### Game Settings Interface Update
```typescript
interface GameSettings {
  difficulty: DifficultyLevel;
  categories: Category[];  // Empty array means "all"
}

interface AllGameSettings {
  memory: GameSettings;
  spelling: GameSettings;
  flashcards: GameSettings;
  hangman: GameSettings;
}
```

### 8.2 Storage Approach

**LocalStorage Key**: `learn-eng-game-settings`

```typescript
// Storage structure
interface StoredGameSettings {
  memory: {
    difficulty: 'easy' | 'medium' | 'hard';
    categories: string[];  // Category IDs
  };
  spelling: { /* same */ };
  flashcards: { /* same */ };
  hangman: { /* same */ };
}
```

### 8.3 Utility Functions

```typescript
// src/utils/categoryUtils.ts

import { Category, dictionary, getWordsByCategory } from '../data/dictionary';

/**
 * Get words filtered by selected categories
 */
export function getFilteredWords(categories: Category[]): Word[] {
  if (categories.length === 0) {
    return dictionary; // Empty = all
  }
  return dictionary.filter(word => categories.includes(word.category));
}

/**
 * Check if selection has enough words for game requirements
 */
export function hasMinimumWords(
  categories: Category[],
  minimumRequired: number
): boolean {
  const filtered = getFilteredWords(categories);
  return filtered.length >= minimumRequired;
}

/**
 * Get word count for display
 */
export function getWordCount(categories: Category[]): number {
  return getFilteredWords(categories).length;
}

/**
 * Determine minimum words needed per game and difficulty
 */
export function getMinimumWordsRequired(
  game: 'memory' | 'spelling' | 'flashcards' | 'hangman',
  difficulty: 'easy' | 'medium' | 'hard'
): number {
  const requirements = {
    memory: { easy: 8, medium: 12, hard: 20 },
    spelling: { easy: 1, medium: 1, hard: 1 },
    flashcards: { easy: 2, medium: 4, hard: 6 },
    hangman: { easy: 1, medium: 1, hard: 1 }
  };
  return requirements[game][difficulty];
}
```

### 8.4 Component Architecture

#### New Components
```
src/
├── components/
│   ├── GameSettings/
│   │   ├── GameSettings.tsx        # Combined settings screen
│   │   ├── DifficultySelector.tsx  # Existing, extracted
│   │   ├── CategoryFilter.tsx      # New category filter
│   │   ├── CategoryChip.tsx        # Individual category chip
│   │   └── index.ts
│   │
│   └── CategoryIndicator/
│       ├── CategoryIndicator.tsx   # In-game badge showing active categories
│       └── index.ts
│
├── hooks/
│   ├── useGameSettings.ts          # Combined difficulty + categories
│   └── useCategoryFilter.ts        # Category selection logic
│
└── utils/
    └── categoryUtils.ts            # Filtering utilities
```

### 8.5 Hook: useGameSettings

```typescript
// src/hooks/useGameSettings.ts

import { useState, useEffect } from 'react';
import { Category } from '../data/dictionary';
import { DifficultyLevel } from '../types/difficulty';

const STORAGE_KEY = 'learn-eng-game-settings';

interface GameSettings {
  difficulty: DifficultyLevel;
  categories: Category[];
}

const DEFAULT_SETTINGS: GameSettings = {
  difficulty: 'easy',
  categories: [], // Empty = all
};

export function useGameSettings(game: string) {
  const [settings, setSettings] = useState<GameSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed[game] || DEFAULT_SETTINGS;
    }
    return DEFAULT_SETTINGS;
  });

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    // Persist
    const stored = localStorage.getItem(STORAGE_KEY);
    const allSettings = stored ? JSON.parse(stored) : {};
    allSettings[game] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allSettings));
  };

  return { settings, updateSettings };
}
```

### 8.6 Integration with Existing Code

**Current getRandomWords function**:
```typescript
export function getRandomWords(count: number, category?: Category): Word[] {
  const source = category ? getWordsByCategory(category) : dictionary;
  const shuffled = [...source].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
```

**Updated to support multiple categories**:
```typescript
export function getRandomWords(
  count: number,
  categories?: Category[]
): Word[] {
  let source: Word[];

  if (!categories || categories.length === 0) {
    // No filter = all words
    source = dictionary;
  } else {
    // Filter by selected categories
    source = dictionary.filter(word => categories.includes(word.category));
  }

  const shuffled = [...source].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
```

### 8.7 Performance Considerations

| Concern | Solution |
|---------|----------|
| Filter computation | Dictionary is small (110 words), filter on every render is fine |
| Storage reads | Cache in state, sync to localStorage on change |
| Re-renders | Memoize filtered word list |
| Large category counts | Current 8 categories fits well, grid layout scales |

---

## 9. Learning Design Considerations

### Alignment with Language Learning Methodologies

| Methodology | How Category Selection Supports It |
|-------------|-----------------------------------|
| **Thematic Learning** | Learners can focus on vocabulary themes, building semantic networks |
| **Scaffolded Difficulty** | Narrowing category scope reduces cognitive load for beginners |
| **Interest-Based Learning** | Users motivated by topics they care about (animals for kids, food for travelers) |
| **Spaced Repetition** | When combined with Flashcards, enables focused SR on specific topics |
| **Contextual Learning** | Same-category words share semantic context, improving retention |

### Category Size Balance

| Category | Words | Assessment |
|----------|-------|------------|
| Animals | 15 | Good variety |
| Food | 15 | Good variety |
| Numbers | 20 | Large, consider splitting 1-10 / 11-20 (future) |
| Others | 12 each | Adequate for focused practice |

### Gamification Integration

**Potential Achievements**:
- "Topic Explorer" - Practice words from all 8 categories
- "Animal Expert" - Master all animal words
- "Rainbow Scholar" - Master all color words
- "Number Wizard" - Master numbers 1-20
- "Category Collector" - Practice 5+ games with different category combinations

### Progress Tracking Per Category

**Integration with Progress Tracking feature**:
```typescript
interface CategoryProgress {
  category: Category;
  wordsTotal: number;
  wordsPracticed: number;
  wordsMastered: number; // >80% accuracy
  lastPracticed: Date;
}
```

---

## 10. MVP vs Future Iterations

### MVP Scope (Phase 1)

**Must Have**:
1. Category filter UI in game settings screen
2. Multi-select category chips
3. "All Categories" toggle
4. Word count display
5. Minimum word validation with warnings
6. Category persistence per game
7. Integration with Memory Game
8. Integration with Spelling Game
9. Integration with Hangman Game
10. Integration with Flashcards Game

**MVP Excludes**:
- Category-specific colors/icons
- In-game category indicator
- Quick filter from menu
- Category grouping
- Per-category progress tracking

**Estimated Effort**: 3-4 development days

---

### Phase 2 Enhancements

**Should Have**:
1. In-game category indicator badge
2. Category-specific accent colors on chips
3. Quick filter access from game menu
4. Smooth animations for selection
5. "Reset to All" quick action
6. Remember last used category across sessions (per game)

**Estimated Effort**: 2 development days

---

### Phase 3: Advanced Features

**Nice to Have**:
1. Category grouping (Living Things, Things Around Us, etc.)
2. "Focus Mode" - auto-suggest categories based on weak words
3. Category progress visualization
4. Category completion badges/achievements
5. Smart category suggestions based on learning history
6. "Random Category" option for variety

**Estimated Effort**: 3-4 development days

---

### Long-term Vision

1. **Sub-Categories**: Split large categories (Numbers -> Basic 1-10, Teens 11-19, Tens 20-100)
2. **Custom Categories**: Users create their own word groups
3. **Difficulty Per Category**: Different difficulty settings for different topics
4. **Category Challenges**: Daily/weekly challenges focused on specific categories
5. **Classroom Mode**: Teachers assign specific categories to students

---

## 11. Open Questions

### Assumptions Made

1. **Multi-select is preferred**: Assumed users want flexibility over simplicity
2. **Empty selection = all**: Assumed empty array means "no filter" rather than "no words"
3. **Per-game persistence**: Assumed each game should remember its own category selection
4. **No category-specific difficulty**: Assumed difficulty settings apply uniformly regardless of category
5. **Current categories are sufficient**: Assumed 8 categories cover initial learning needs

### Questions for Stakeholders

1. **Category icons**: Should each category have a distinctive icon (paw for animals, apple for food)?

2. **Selection persistence scope**: Should category selection persist per-game or globally across all games?

3. **Minimum word override**: Should users be able to start a game even with insufficient words (at their own risk)?

4. **Category completion**: What happens when a user has "completed" all words in a filtered selection? Repeat? Encourage broader selection?

5. **Numbers category**: Is it useful to split "numbers" into smaller groups (1-10, 11-20)?

### Areas Requiring User Research

1. **Category popularity**: Which categories are most frequently selected? Are any neglected?

2. **Combination patterns**: Do users typically select single categories or multiple?

3. **Filtering friction**: Does the category selection step feel like helpful customization or unnecessary friction?

4. **Word count perception**: Do users understand the relationship between category selection and available words?

5. **Child usability**: Can young learners (5-8 years) effectively use the category filter UI?

### Technical Questions

1. **Flashcards Leitner integration**: Should category filtering affect which words are in which Leitner box, or just which words are presented?

2. **Category changes mid-session**: If a user changes categories, should progress (streak, score) reset?

3. **Future category expansion**: When new categories are added, should existing users' "all categories" selection auto-include them?

---

## Appendix A: Category Word Counts

| Category | Count | Shortest Word | Longest Word |
|----------|-------|---------------|--------------|
| Animals | 15 | cat (3) | elephant (8) |
| Food | 15 | egg (3) | banana (6) |
| Colors | 12 | red (3) | purple (6) |
| Numbers | 20 | one (3) | seventeen (9) |
| Body Parts | 12 | eye (3) | finger (6) |
| Household | 12 | bed (3) | bathroom (8) |
| Nature | 12 | sun (3) | mountain (8) |
| Verbs | 12 | go (2) | drink (5) |

**Implications**:
- All categories have at least 12 words (sufficient for most game modes)
- Word length varies significantly within categories (relevant for difficulty integration)
- Shortest word overall: "go" (2 letters)
- Longest word overall: "seventeen" (9 letters)

---

## Appendix B: Hebrew UI Labels

| English | Hebrew |
|---------|--------|
| Categories | קטגוריות |
| Topics | נושאים |
| All Categories | כל הקטגוריות |
| Select categories | בחר קטגוריות |
| words | מילים |
| Available | זמינות |
| Not enough words | אין מספיק מילים |
| Select more categories | בחר עוד קטגוריות |
| Animals | חיות |
| Food | אוכל |
| Colors | צבעים |
| Numbers | מספרים |
| Body Parts | חלקי גוף |
| Household | בית |
| Nature | טבע |
| Verbs | פעלים |

---

## Appendix C: CSS Styles

```css
/* Category Filter Component */

.category-filter {
  margin-top: 1.5rem;
}

.category-filter-header {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.category-filter-description {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.category-all-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--surface-elevated);
  border-radius: 8px;
  margin-bottom: 1rem;
  cursor: pointer;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

@media (min-width: 480px) {
  .category-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 768px) {
  .category-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.category-chip {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.75rem 1rem;
  background: var(--surface);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 60px;
}

.category-chip:hover {
  border-color: var(--accent-color);
}

.category-chip.selected {
  background: var(--accent-light);
  border-color: var(--accent-color);
}

.category-chip-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.category-chip-checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.category-chip.selected .category-chip-checkbox {
  background: var(--accent-color);
  border-color: var(--accent-color);
}

.category-chip-name {
  font-weight: 500;
  font-size: 0.875rem;
}

.category-chip-count {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

/* Word Count Summary */

.word-count-summary {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: var(--surface-elevated);
  border-radius: 8px;
  font-size: 0.875rem;
}

.word-count-summary.warning {
  background: rgba(255, 152, 0, 0.15);
  color: var(--warning-color);
}

.word-count-summary.error {
  background: rgba(244, 67, 54, 0.15);
  color: var(--error-color);
}

/* Warning Banner */

.category-warning {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 152, 0, 0.1);
  border: 1px solid var(--warning-color);
  border-radius: 8px;
  margin-top: 1rem;
}

.category-warning-icon {
  flex-shrink: 0;
  color: var(--warning-color);
}

.category-warning-content {
  font-size: 0.875rem;
}

.category-warning-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.category-warning-message {
  color: var(--text-secondary);
}
```

---

## Appendix D: Integration Checklist

### Memory Game Integration
- [ ] Update MemoryGame to accept categories prop
- [ ] Modify word selection to use filtered pool
- [ ] Update settings screen with category filter
- [ ] Validate word count before starting
- [ ] Update any records/storage to include category info

### Spelling Game Integration
- [ ] Update SpellingGame to accept categories prop
- [ ] Modify word selection to use filtered pool
- [ ] Update settings screen with category filter
- [ ] Consider "all words practiced" state

### Flashcards Game Integration
- [ ] Update FlashcardsGame to accept categories prop
- [ ] Modify word and distractor selection
- [ ] Ensure Leitner system works with filtered words
- [ ] Handle minimum 4 words for quiz mode

### Hangman Game Integration
- [ ] Update HangmanGame to accept categories prop
- [ ] Modify word selection to use filtered pool
- [ ] Update settings screen with category filter

### Shared Components
- [ ] Create GameSettings component
- [ ] Create CategoryFilter component
- [ ] Create CategoryChip component
- [ ] Create useGameSettings hook
- [ ] Create categoryUtils utility functions
- [ ] Update dictionary.ts getRandomWords function

---

*End of Design Document*
