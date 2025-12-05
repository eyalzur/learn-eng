# Technical Design: Category Selection

## Overview

This document provides a comprehensive technical specification for implementing a category/topic selection system across all four games (Memory, Spelling, Flashcards, Hangman) in the learn-eng application. The system allows users to filter vocabulary words by category before starting any game, enabling personalized and targeted learning sessions.

## Design Document Reference

Source: `/design-docs/category-selection.md` (Version 1.0, Status: Design Complete)

## Requirements Summary

### Functional Requirements

1. **Category Selection**: Multi-select system allowing users to choose one or more categories (animals, food, colors, numbers, bodyParts, household, nature, verbs)
2. **"All Categories" Toggle**: Master toggle to quickly select/deselect all categories
3. **Word Count Display**: Show available word count based on selected categories
4. **Minimum Word Validation**: Warn users when selected categories have insufficient words for the chosen game/difficulty
5. **Per-Game Persistence**: Remember category selections independently for each game
6. **Game Integration**: Apply category filtering to all four games

### Non-Functional Requirements

1. **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation, RTL support, screen reader compatible
2. **Performance**: No perceptible delay when filtering words (dictionary is small at 110 words)
3. **Default Behavior**: All categories selected by default for new users
4. **Backward Compatibility**: Existing users experience no change unless they choose to filter

---

## Architecture

### System Overview

The category selection system is implemented as a cross-cutting concern that integrates with each game component through:
1. A centralized category configuration in the existing dictionary module
2. Custom React hooks for category state management and persistence
3. Reusable UI components for category selection display
4. Game-specific integration patterns that consume filtered word pools

### Component Diagram

```
+-------------------+     +----------------------+     +-------------------+
|                   |     |                      |     |                   |
|   App.tsx         |---->|   Game Components    |---->|   GameSettings    |
|                   |     |   (Memory, Spelling, |     |   (DifficultySelector
|                   |     |    Flashcards,       |     |    + CategoryFilter)
|                   |     |    Hangman)          |     |                   |
+-------------------+     |                      |     +-------------------+
                          +----------+-----------+
                                     |
                                     v
                          +----------+-----------+
                          |                      |
                          |   useGameSettings    |<----+
                          |   (custom hook)      |     |
                          |                      |     |
                          +----------+-----------+     |
                                     |                 |
                                     v                 |
                          +----------+-----------+     |
                          |                      |     |
                          |   categoryUtils.ts   |     |
                          |   (filtering logic)  |     |
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

1. **App.tsx**: No changes required; games manage their own settings flow
2. **Game Components**: Each game receives category filter and applies to word selection
3. **GameSettings Component**: Unified settings screen combining difficulty + categories
4. **dictionary.ts**: Enhanced `getRandomWords` function to accept category array
5. **localStorage**: Persists game settings (difficulty + categories)

### File Structure

```
src/
+-- components/
|   +-- GameSettings/
|   |   +-- GameSettings.tsx         # Combined settings screen
|   |   +-- CategoryFilter.tsx       # Category selection component
|   |   +-- CategoryChip.tsx         # Individual category chip
|   |   +-- CategoryWarning.tsx      # Insufficient words warning
|   |   +-- GameSettings.css         # Component-specific styles
|   |   +-- index.ts                 # Barrel export
|   |
|   +-- CategoryIndicator/
|   |   +-- CategoryIndicator.tsx    # In-game badge (Phase 2)
|   |   +-- index.ts
|   |
|   +-- DifficultySelector/          # Existing (no changes)
|   +-- MemoryGame/                   # Modified
|   +-- SpellingGame/                 # Modified
|   +-- FlashcardsGame/               # Modified
|   +-- HangmanGame/                  # Modified
|
+-- hooks/
|   +-- useGameSettings.ts           # Combined difficulty + categories
|   +-- useDifficulty.ts             # Existing (no changes)
|
+-- utils/
|   +-- categoryUtils.ts             # Category filtering utilities
|
+-- types/
|   +-- category.ts                  # Category-related TypeScript interfaces
|   +-- difficulty.ts                # Existing (no changes)
|
+-- data/
|   +-- dictionary.ts                # Enhanced with multi-category filtering
|
+-- styles/
    +-- main.css                     # Add category-specific CSS variables
```

---

## Data Models and TypeScript Interfaces

### Core Types (`src/types/category.ts`)

```typescript
import { Category } from '../data/dictionary';
import { DifficultyLevel } from './difficulty';

/**
 * Game identifiers matching the existing GameType
 */
export type GameId = 'memory' | 'spelling' | 'flashcards' | 'hangman';

/**
 * All available categories (re-exported from dictionary for convenience)
 */
export type { Category } from '../data/dictionary';

/**
 * List of all category values for iteration
 */
export const ALL_CATEGORIES: Category[] = [
  'animals',
  'food',
  'colors',
  'numbers',
  'bodyParts',
  'household',
  'nature',
  'verbs',
];

/**
 * Category metadata for UI display
 */
export interface CategoryInfo {
  id: Category;
  nameHe: string;
  nameEn: string;
  wordCount: number;
  color: string;
}

/**
 * Static category metadata
 * Word counts are computed at runtime from dictionary
 */
export const CATEGORY_INFO: Record<Category, Omit<CategoryInfo, 'wordCount'>> = {
  animals: {
    id: 'animals',
    nameHe: 'חיות',
    nameEn: 'Animals',
    color: '#8BC34A',
  },
  food: {
    id: 'food',
    nameHe: 'אוכל',
    nameEn: 'Food',
    color: '#FF9800',
  },
  colors: {
    id: 'colors',
    nameHe: 'צבעים',
    nameEn: 'Colors',
    color: '#E91E63',
  },
  numbers: {
    id: 'numbers',
    nameHe: 'מספרים',
    nameEn: 'Numbers',
    color: '#2196F3',
  },
  bodyParts: {
    id: 'bodyParts',
    nameHe: 'חלקי גוף',
    nameEn: 'Body Parts',
    color: '#9C27B0',
  },
  household: {
    id: 'household',
    nameHe: 'בית',
    nameEn: 'Household',
    color: '#795548',
  },
  nature: {
    id: 'nature',
    nameHe: 'טבע',
    nameEn: 'Nature',
    color: '#4CAF50',
  },
  verbs: {
    id: 'verbs',
    nameHe: 'פעלים',
    nameEn: 'Verbs',
    color: '#00BCD4',
  },
};

/**
 * Game settings combining difficulty and category selection
 */
export interface GameSettings {
  difficulty: DifficultyLevel;
  categories: Category[];  // Empty array means "all categories"
}

/**
 * Default game settings for new users
 */
export const DEFAULT_GAME_SETTINGS: GameSettings = {
  difficulty: 'easy',
  categories: [],  // Empty = all categories
};

/**
 * All games settings structure for storage
 */
export interface AllGameSettings {
  memory: GameSettings;
  spelling: GameSettings;
  flashcards: GameSettings;
  hangman: GameSettings;
}

/**
 * Default settings for all games
 */
export const DEFAULT_ALL_GAME_SETTINGS: AllGameSettings = {
  memory: { ...DEFAULT_GAME_SETTINGS },
  spelling: { ...DEFAULT_GAME_SETTINGS },
  flashcards: { ...DEFAULT_GAME_SETTINGS },
  hangman: { ...DEFAULT_GAME_SETTINGS },
};

/**
 * Minimum words required per game and difficulty
 */
export interface MinimumWordsConfig {
  memory: Record<DifficultyLevel, number>;
  spelling: Record<DifficultyLevel, number>;
  flashcards: Record<DifficultyLevel, number>;
  hangman: Record<DifficultyLevel, number>;
}

export const MINIMUM_WORDS_REQUIRED: MinimumWordsConfig = {
  memory: {
    easy: 8,      // 4 pairs
    medium: 12,   // 6 pairs
    hard: 20,     // 8-10 pairs
  },
  spelling: {
    easy: 1,
    medium: 1,
    hard: 1,
  },
  flashcards: {
    easy: 2,      // 2 choices
    medium: 4,    // 4 choices
    hard: 6,      // 6 choices
  },
  hangman: {
    easy: 1,
    medium: 1,
    hard: 1,
  },
};
```

### Category Info with Word Count (`src/utils/categoryUtils.ts`)

```typescript
import { Category, dictionary, getWordsByCategory, Word } from '../data/dictionary';
import {
  CategoryInfo,
  CATEGORY_INFO,
  ALL_CATEGORIES,
  GameId,
  MINIMUM_WORDS_REQUIRED,
} from '../types/category';
import { DifficultyLevel } from '../types/difficulty';

/**
 * Get category info with computed word count
 */
export function getCategoryInfo(category: Category): CategoryInfo {
  const baseInfo = CATEGORY_INFO[category];
  const wordCount = getWordsByCategory(category).length;
  return { ...baseInfo, wordCount };
}

/**
 * Get all categories with computed word counts
 */
export function getAllCategoriesInfo(): CategoryInfo[] {
  return ALL_CATEGORIES.map(getCategoryInfo);
}

/**
 * Get words filtered by selected categories
 * Empty array means all words (no filter)
 */
export function getFilteredWords(categories: Category[]): Word[] {
  if (categories.length === 0) {
    return dictionary;
  }
  return dictionary.filter(word => categories.includes(word.category));
}

/**
 * Get word count for selected categories
 */
export function getWordCount(categories: Category[]): number {
  return getFilteredWords(categories).length;
}

/**
 * Get total word count (all categories)
 */
export function getTotalWordCount(): number {
  return dictionary.length;
}

/**
 * Check if category selection meets minimum word requirement
 */
export function hasMinimumWords(
  categories: Category[],
  game: GameId,
  difficulty: DifficultyLevel
): boolean {
  const required = MINIMUM_WORDS_REQUIRED[game][difficulty];
  const available = getWordCount(categories);
  return available >= required;
}

/**
 * Get minimum words required for a game/difficulty combination
 */
export function getMinimumWordsRequired(
  game: GameId,
  difficulty: DifficultyLevel
): number {
  return MINIMUM_WORDS_REQUIRED[game][difficulty];
}

/**
 * Check if all categories are selected
 * Empty array is treated as "all selected"
 */
export function isAllCategoriesSelected(categories: Category[]): boolean {
  return categories.length === 0 || categories.length === ALL_CATEGORIES.length;
}

/**
 * Toggle a category in the selection
 * Returns new array with category added/removed
 */
export function toggleCategory(
  categories: Category[],
  category: Category
): Category[] {
  // If currently "all" (empty), initialize with all except the toggled one
  if (categories.length === 0) {
    return ALL_CATEGORIES.filter(c => c !== category);
  }

  // If category exists, remove it
  if (categories.includes(category)) {
    const filtered = categories.filter(c => c !== category);
    // If removing results in empty, keep at least one
    return filtered.length === 0 ? [category] : filtered;
  }

  // Add category
  const newCategories = [...categories, category];

  // If all categories are now selected, return empty (represents "all")
  if (newCategories.length === ALL_CATEGORIES.length) {
    return [];
  }

  return newCategories;
}

/**
 * Select all categories (returns empty array)
 */
export function selectAllCategories(): Category[] {
  return [];
}

/**
 * Format category names for display
 */
export function formatCategoryNames(categories: Category[]): string {
  if (categories.length === 0) {
    return 'כל הקטגוריות';
  }
  return categories.map(c => CATEGORY_INFO[c].nameHe).join(', ');
}

/**
 * Get random words from filtered categories
 */
export function getRandomFilteredWords(
  count: number,
  categories: Category[]
): Word[] {
  const pool = getFilteredWords(categories);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
}
```

---

## Custom Hooks Architecture

### useGameSettings Hook (`src/hooks/useGameSettings.ts`)

```typescript
import { useState, useCallback, useEffect } from 'react';
import { Category } from '../data/dictionary';
import { DifficultyLevel } from '../types/difficulty';
import {
  GameId,
  GameSettings,
  AllGameSettings,
  DEFAULT_ALL_GAME_SETTINGS,
} from '../types/category';

const STORAGE_KEY = 'learn-eng-game-settings';

/**
 * Get stored game settings from localStorage
 */
const getStoredSettings = (): AllGameSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);

      // Validate structure
      const games: GameId[] = ['memory', 'spelling', 'flashcards', 'hangman'];
      const validLevels: DifficultyLevel[] = ['easy', 'medium', 'hard'];

      for (const game of games) {
        if (!parsed[game]) {
          return DEFAULT_ALL_GAME_SETTINGS;
        }
        if (!validLevels.includes(parsed[game].difficulty)) {
          return DEFAULT_ALL_GAME_SETTINGS;
        }
        if (!Array.isArray(parsed[game].categories)) {
          return DEFAULT_ALL_GAME_SETTINGS;
        }
      }

      return parsed;
    }
  } catch (error) {
    console.warn('Failed to parse game settings:', error);
  }
  return DEFAULT_ALL_GAME_SETTINGS;
};

/**
 * Save game settings to localStorage
 */
const saveSettings = (settings: AllGameSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save game settings:', error);
  }
};

/**
 * Hook for managing combined game settings (difficulty + categories)
 */
export function useGameSettings(game: GameId) {
  const [allSettings, setAllSettings] = useState<AllGameSettings>(getStoredSettings);

  const settings = allSettings[game];

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setAllSettings(prev => {
      const updated: AllGameSettings = {
        ...prev,
        [game]: {
          ...prev[game],
          ...newSettings,
        },
      };
      saveSettings(updated);
      return updated;
    });
  }, [game]);

  const setDifficulty = useCallback((difficulty: DifficultyLevel) => {
    updateSettings({ difficulty });
  }, [updateSettings]);

  const setCategories = useCallback((categories: Category[]) => {
    updateSettings({ categories });
  }, [updateSettings]);

  const toggleCategory = useCallback((category: Category) => {
    const currentCategories = settings.categories;

    // If currently "all" (empty), initialize with all except the toggled one
    let newCategories: Category[];

    if (currentCategories.length === 0) {
      const allCats: Category[] = [
        'animals', 'food', 'colors', 'numbers',
        'bodyParts', 'household', 'nature', 'verbs'
      ];
      newCategories = allCats.filter(c => c !== category);
    } else if (currentCategories.includes(category)) {
      // Remove category (but don't allow empty)
      const filtered = currentCategories.filter(c => c !== category);
      newCategories = filtered.length === 0 ? currentCategories : filtered;
    } else {
      // Add category
      newCategories = [...currentCategories, category];
      // If all selected, return to empty (represents "all")
      if (newCategories.length === 8) {
        newCategories = [];
      }
    }

    updateSettings({ categories: newCategories });
  }, [settings.categories, updateSettings]);

  const selectAllCategories = useCallback(() => {
    updateSettings({ categories: [] });
  }, [updateSettings]);

  const resetSettings = useCallback(() => {
    updateSettings({
      difficulty: 'easy',
      categories: [],
    });
  }, [updateSettings]);

  return {
    settings,
    difficulty: settings.difficulty,
    categories: settings.categories,
    setDifficulty,
    setCategories,
    toggleCategory,
    selectAllCategories,
    resetSettings,
    updateSettings,
  };
}

/**
 * Hook return type for type safety
 */
export interface UseGameSettingsReturn {
  settings: GameSettings;
  difficulty: DifficultyLevel;
  categories: Category[];
  setDifficulty: (difficulty: DifficultyLevel) => void;
  setCategories: (categories: Category[]) => void;
  toggleCategory: (category: Category) => void;
  selectAllCategories: () => void;
  resetSettings: () => void;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
}
```

---

## React Component Architecture

### GameSettings Component (`src/components/GameSettings/GameSettings.tsx`)

```typescript
import React, { useState, useMemo } from 'react';
import { DifficultySelector } from '../DifficultySelector';
import { CategoryFilter } from './CategoryFilter';
import { CategoryWarning } from './CategoryWarning';
import { Category } from '../../data/dictionary';
import { DifficultyLevel } from '../../types/difficulty';
import { GameId } from '../../types/category';
import {
  getWordCount,
  hasMinimumWords,
  getMinimumWordsRequired,
} from '../../utils/categoryUtils';
import './GameSettings.css';

interface GameSettingsProps {
  game: GameId;
  difficulty: DifficultyLevel;
  categories: Category[];
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  onCategoriesChange: (categories: Category[]) => void;
  onToggleCategory: (category: Category) => void;
  onSelectAll: () => void;
  onStart: () => void;
  onBack: () => void;
}

const GAME_TITLES: Record<GameId, string> = {
  memory: 'משחק זיכרון',
  spelling: 'משחק איות',
  flashcards: 'כרטיסיות',
  hangman: 'משחק תליין',
};

export const GameSettings: React.FC<GameSettingsProps> = ({
  game,
  difficulty,
  categories,
  onDifficultyChange,
  onCategoriesChange,
  onToggleCategory,
  onSelectAll,
  onStart,
  onBack,
}) => {
  const wordCount = useMemo(() => getWordCount(categories), [categories]);
  const minimumRequired = useMemo(
    () => getMinimumWordsRequired(game, difficulty),
    [game, difficulty]
  );
  const canStart = useMemo(
    () => hasMinimumWords(categories, game, difficulty),
    [categories, game, difficulty]
  );

  const isAllSelected = categories.length === 0;

  return (
    <div className="game-settings">
      <div className="settings-header">
        <button className="back-button" onClick={onBack}>
          &rarr; חזרה לתפריט
        </button>
        <h1>{GAME_TITLES[game]}</h1>
      </div>

      <div className="settings-content">
        {/* Difficulty Section */}
        <div className="settings-section">
          <h2 className="section-title">רמת קושי</h2>
          <DifficultySelector
            currentDifficulty={difficulty}
            onSelect={onDifficultyChange}
            compact
          />
        </div>

        {/* Category Section */}
        <div className="settings-section">
          <h2 className="section-title">קטגוריות</h2>
          <p className="section-description">
            בחר נושאים לתרגול
          </p>

          <CategoryFilter
            selectedCategories={categories}
            onToggleCategory={onToggleCategory}
            onSelectAll={onSelectAll}
            isAllSelected={isAllSelected}
          />

          <div className={`word-count-summary ${!canStart ? 'error' : ''}`}>
            זמינות: {wordCount} מילים
            {!canStart && ` (נדרשות לפחות ${minimumRequired})`}
          </div>

          {!canStart && (
            <CategoryWarning
              available={wordCount}
              required={minimumRequired}
              difficulty={difficulty}
            />
          )}
        </div>
      </div>

      <button
        className="start-button"
        onClick={onStart}
        disabled={!canStart}
      >
        התחל משחק
      </button>
    </div>
  );
};
```

### CategoryFilter Component (`src/components/GameSettings/CategoryFilter.tsx`)

```typescript
import React from 'react';
import { CategoryChip } from './CategoryChip';
import { Category } from '../../data/dictionary';
import { getAllCategoriesInfo } from '../../utils/categoryUtils';

interface CategoryFilterProps {
  selectedCategories: Category[];
  onToggleCategory: (category: Category) => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategories,
  onToggleCategory,
  onSelectAll,
  isAllSelected,
}) => {
  const categoriesInfo = getAllCategoriesInfo();

  // A category is "checked" if:
  // - isAllSelected is true (empty array = all selected), OR
  // - it's explicitly in the selectedCategories array
  const isCategorySelected = (category: Category): boolean => {
    return isAllSelected || selectedCategories.includes(category);
  };

  return (
    <div className="category-filter">
      {/* All Categories Toggle */}
      <button
        className={`category-all-toggle ${isAllSelected ? 'selected' : ''}`}
        onClick={onSelectAll}
        role="checkbox"
        aria-checked={isAllSelected}
        aria-label="בחר את כל הקטגוריות"
      >
        <span className="checkbox-icon">
          {isAllSelected ? '✓' : ''}
        </span>
        <span className="toggle-label">כל הקטגוריות</span>
        <span className="toggle-count">(110 מילים)</span>
      </button>

      {/* Category Grid */}
      <div className="category-grid">
        {categoriesInfo.map((info) => (
          <CategoryChip
            key={info.id}
            category={info}
            isSelected={isCategorySelected(info.id)}
            onToggle={() => onToggleCategory(info.id)}
          />
        ))}
      </div>
    </div>
  );
};
```

### CategoryChip Component (`src/components/GameSettings/CategoryChip.tsx`)

```typescript
import React from 'react';
import { CategoryInfo } from '../../types/category';

interface CategoryChipProps {
  category: CategoryInfo;
  isSelected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  category,
  isSelected,
  onToggle,
  disabled = false,
}) => {
  return (
    <button
      className={`category-chip ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={onToggle}
      disabled={disabled}
      role="checkbox"
      aria-checked={isSelected}
      aria-label={`${category.nameHe}, ${category.wordCount} מילים`}
      style={{
        '--category-color': category.color,
        '--category-color-light': `${category.color}20`,
      } as React.CSSProperties}
    >
      <div className="chip-header">
        <span className="chip-checkbox">
          {isSelected ? '✓' : ''}
        </span>
        <span className="chip-name">{category.nameHe}</span>
      </div>
      <span className="chip-count">{category.wordCount} מילים</span>
    </button>
  );
};
```

### CategoryWarning Component (`src/components/GameSettings/CategoryWarning.tsx`)

```typescript
import React from 'react';
import { DifficultyLevel, DIFFICULTY_INFO } from '../../types/difficulty';

interface CategoryWarningProps {
  available: number;
  required: number;
  difficulty: DifficultyLevel;
}

export const CategoryWarning: React.FC<CategoryWarningProps> = ({
  available,
  required,
  difficulty,
}) => {
  const difficultyName = DIFFICULTY_INFO[difficulty].labelHe;

  return (
    <div className="category-warning">
      <span className="warning-icon">!</span>
      <div className="warning-content">
        <div className="warning-title">אין מספיק מילים</div>
        <div className="warning-message">
          רמת קושי {difficultyName} דורשת לפחות {required} מילים.
          <br />
          בחר עוד קטגוריות או הורד את רמת הקושי.
        </div>
      </div>
    </div>
  );
};
```

### CategoryIndicator Component (Phase 2) (`src/components/CategoryIndicator/CategoryIndicator.tsx`)

```typescript
import React from 'react';
import { Category } from '../../data/dictionary';
import { CATEGORY_INFO } from '../../types/category';

interface CategoryIndicatorProps {
  categories: Category[];
  onClick?: () => void;
}

export const CategoryIndicator: React.FC<CategoryIndicatorProps> = ({
  categories,
  onClick,
}) => {
  const isAll = categories.length === 0;
  const displayText = isAll
    ? 'הכל'
    : categories.length <= 2
      ? categories.map(c => CATEGORY_INFO[c].nameHe).join(', ')
      : `${categories.length} נושאים`;

  return (
    <button
      className="category-indicator"
      onClick={onClick}
      title={isAll ? 'כל הקטגוריות' : categories.map(c => CATEGORY_INFO[c].nameHe).join(', ')}
      aria-label={`קטגוריות פעילות: ${displayText}. לחץ לשינוי`}
    >
      [{displayText}]
    </button>
  );
};
```

---

## CSS Styles

### GameSettings.css (`src/components/GameSettings/GameSettings.css`)

```css
/* Game Settings Container */
.game-settings {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  color: white;
  height: 100%;
  overflow-y: auto;
}

.settings-header {
  text-align: center;
  margin-bottom: 20px;
  width: 100%;
}

.settings-header h1 {
  font-size: 1.4rem;
  margin-bottom: 8px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.settings-content {
  width: 100%;
  max-width: 500px;
  flex: 1;
  overflow-y: auto;
}

.settings-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0.9;
  margin-bottom: 8px;
}

.section-description {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-bottom: 12px;
}

/* Category Filter */
.category-filter {
  width: 100%;
}

.category-all-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  font-family: 'Rubik', sans-serif;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 12px;
}

.category-all-toggle:hover {
  background: rgba(255, 255, 255, 0.15);
}

.category-all-toggle.selected {
  background: rgba(76, 175, 80, 0.2);
  border-color: #4CAF50;
}

.checkbox-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.category-all-toggle.selected .checkbox-icon {
  background: #4CAF50;
  border-color: #4CAF50;
}

.toggle-label {
  flex: 1;
  text-align: right;
}

.toggle-count {
  font-size: 0.8rem;
  opacity: 0.7;
}

/* Category Grid */
.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
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

/* Category Chip */
.category-chip {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  font-family: 'Rubik', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 60px;
}

.category-chip:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.category-chip:active:not(.disabled) {
  transform: scale(0.98);
}

.category-chip.selected {
  background: var(--category-color-light);
  border-color: var(--category-color);
}

.category-chip.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chip-header {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
}

.chip-checkbox {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  font-size: 0.7rem;
  flex-shrink: 0;
}

.category-chip.selected .chip-checkbox {
  background: var(--category-color);
  border-color: var(--category-color);
}

.chip-name {
  font-size: 0.9rem;
  font-weight: 600;
}

.chip-count {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 4px;
}

/* Word Count Summary */
.word-count-summary {
  margin-top: 12px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
}

.word-count-summary.error {
  background: rgba(244, 67, 54, 0.2);
  color: #ff8a80;
}

/* Category Warning */
.category-warning {
  display: flex;
  gap: 10px;
  padding: 12px;
  background: rgba(255, 152, 0, 0.15);
  border: 1px solid rgba(255, 152, 0, 0.4);
  border-radius: 10px;
  margin-top: 12px;
}

.warning-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 152, 0, 0.8);
  border-radius: 50%;
  font-size: 0.9rem;
  font-weight: 700;
  flex-shrink: 0;
}

.warning-content {
  flex: 1;
}

.warning-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.warning-message {
  font-size: 0.8rem;
  opacity: 0.9;
  line-height: 1.4;
}

/* Start Button */
.game-settings .start-button {
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
  margin-top: auto;
}

.game-settings .start-button:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.game-settings .start-button:disabled {
  background: rgba(255, 255, 255, 0.2);
  cursor: not-allowed;
  opacity: 0.5;
}

/* Category Indicator (In-Game Badge) */
.category-indicator {
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  font-size: 0.75rem;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Rubik', sans-serif;
}

.category-indicator:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Responsive adjustments */
@media (max-width: 360px) {
  .category-grid {
    grid-template-columns: 1fr;
  }

  .category-chip {
    flex-direction: row;
    align-items: center;
    min-height: auto;
    padding: 12px;
  }

  .chip-header {
    flex: 1;
  }

  .chip-count {
    margin-top: 0;
    margin-right: auto;
  }
}
```

---

## Integration with Existing Games

### Dictionary Enhancement (`src/data/dictionary.ts`)

Update the existing `getRandomWords` function to support multi-category filtering:

```typescript
/**
 * Enhanced getRandomWords to support multiple categories
 * @param count Number of words to return
 * @param categories Array of categories to filter by (empty = all words)
 */
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
  return shuffled.slice(0, Math.min(count, source.length));
}
```

### Memory Game Integration

**Modified File: `src/components/MemoryGame/MemoryGame.tsx`**

Key changes:
1. Add GameSettings component before game starts
2. Use `useGameSettings` hook for combined settings management
3. Pass categories to `getRandomWords`

```typescript
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardData } from './Card';
import { Word, getRandomWords } from '../../data/dictionary';
import { speak } from '../../utils/speech';
import { GameSettings } from '../GameSettings';
import { useGameSettings } from '../../hooks/useGameSettings';
import { DifficultyIndicator } from '../DifficultyIndicator';
import { CategoryIndicator } from '../CategoryIndicator';
import { MEMORY_CONFIG } from '../../config/difficultyConfig';

interface MemoryGameProps {
  onBack?: () => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ onBack }) => {
  // Combined settings management
  const {
    settings,
    difficulty,
    categories,
    setDifficulty,
    toggleCategory,
    selectAllCategories,
  } = useGameSettings('memory');

  const [showSettings, setShowSettings] = useState(true);

  // Get difficulty params
  const params = MEMORY_CONFIG[difficulty];
  const wordCount = params.wordCount;

  // Game state (existing)
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  // ... other existing state

  const initializeGame = useCallback(() => {
    // Use categories filter when getting words
    const words = getRandomWords(wordCount, categories);
    // ... rest of initialization logic
  }, [wordCount, categories]);

  const handleStart = () => {
    setShowSettings(false);
    initializeGame();
  };

  // Show settings screen first
  if (showSettings) {
    return (
      <GameSettings
        game="memory"
        difficulty={difficulty}
        categories={categories}
        onDifficultyChange={setDifficulty}
        onCategoriesChange={() => {}} // Not used directly
        onToggleCategory={toggleCategory}
        onSelectAll={selectAllCategories}
        onStart={handleStart}
        onBack={onBack || (() => {})}
      />
    );
  }

  // Existing game render with optional category indicator
  return (
    <div className="memory-game">
      <div className="game-header">
        {onBack && (
          <button className="back-button" onClick={onBack}>
            &rarr; חזרה לתפריט
          </button>
        )}
        <h1>משחק זיכרון</h1>
        <div className="game-stats">
          <span className="stat">
            מהלכים: <strong>{moves}</strong>
          </span>
          <span className="stat">
            זוגות: <strong>{matchedPairs}/{wordCount}</strong>
          </span>
          <DifficultyIndicator
            difficulty={difficulty}
            onClick={() => setShowSettings(true)}
          />
          {/* Phase 2: Add CategoryIndicator */}
        </div>
        {/* ... rest of header */}
      </div>
      {/* ... rest of game */}
    </div>
  );
};
```

### Spelling Game Integration

**Modified File: `src/components/SpellingGame/SpellingGame.tsx`**

Key changes:
1. Show GameSettings before game
2. Pass categories to word selection
3. Filter `getRandomWords(20, categories)` calls

```typescript
import { useGameSettings } from '../../hooks/useGameSettings';
import { GameSettings } from '../GameSettings';
import { getRandomWords } from '../../data/dictionary';
import { SPELLING_CONFIG } from '../../config/difficultyConfig';

export const SpellingGame: React.FC<SpellingGameProps> = ({ onBack }) => {
  const {
    difficulty,
    categories,
    setDifficulty,
    toggleCategory,
    selectAllCategories,
  } = useGameSettings('spelling');

  const [showSettings, setShowSettings] = useState(true);
  const params = SPELLING_CONFIG[difficulty];

  const initializeGame = useCallback(() => {
    // Filter words by categories AND apply length filter from difficulty
    const gameWords = getRandomWords(20, categories).filter(
      word => word.english.length >= params.wordLengthRange.min &&
              word.english.length <= params.wordLengthRange.max
    );
    setWords(gameWords);
    // ... rest
  }, [categories, params]);

  // When cycling words, also respect categories
  const nextWord = () => {
    const nextIndex = (currentIndex + 1) % words.length;
    if (nextIndex === 0) {
      // Get new batch from filtered categories
      const newWords = getRandomWords(20, categories).filter(
        word => word.english.length >= params.wordLengthRange.min &&
                word.english.length <= params.wordLengthRange.max
      );
      setWords(newWords);
      // ...
    }
    // ...
  };

  if (showSettings) {
    return (
      <GameSettings
        game="spelling"
        difficulty={difficulty}
        categories={categories}
        onDifficultyChange={setDifficulty}
        onCategoriesChange={() => {}}
        onToggleCategory={toggleCategory}
        onSelectAll={selectAllCategories}
        onStart={() => { setShowSettings(false); initializeGame(); }}
        onBack={onBack || (() => {})}
      />
    );
  }

  // ... rest of existing render
};
```

### Flashcards Game Integration

**Modified File: `src/components/FlashcardsGame/FlashcardsGame.tsx`**

Key changes:
1. Filter stored progress to only show cards from selected categories
2. Generate distractor choices from filtered word pool
3. Handle category filtering with Leitner box system

```typescript
import { useGameSettings } from '../../hooks/useGameSettings';
import { GameSettings } from '../GameSettings';
import { getFilteredWords } from '../../utils/categoryUtils';

export const FlashcardsGame: React.FC<FlashcardsGameProps> = ({ onBack }) => {
  const {
    difficulty,
    categories,
    setDifficulty,
    toggleCategory,
    selectAllCategories,
  } = useGameSettings('flashcards');

  const [showSettings, setShowSettings] = useState(true);

  // Get stored progress but filter by selected categories
  const getFilteredProgress = (): CardState[] => {
    const allProgress = getStoredProgress();
    if (categories.length === 0) {
      return allProgress; // All categories
    }
    return allProgress.filter(card => categories.includes(card.word.category));
  };

  const [allCards, setAllCards] = useState<CardState[]>([]);

  useEffect(() => {
    if (!showSettings) {
      setAllCards(getFilteredProgress());
    }
  }, [showSettings, categories]);

  // Generate distractors from filtered pool
  const getDistractors = (correctWord: Word, count: number): Word[] => {
    const pool = getFilteredWords(categories);
    const others = pool.filter((w) => w.id !== correctWord.id);
    const shuffled = [...others].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  if (showSettings) {
    return (
      <GameSettings
        game="flashcards"
        difficulty={difficulty}
        categories={categories}
        onDifficultyChange={setDifficulty}
        onCategoriesChange={() => {}}
        onToggleCategory={toggleCategory}
        onSelectAll={selectAllCategories}
        onStart={() => setShowSettings(false)}
        onBack={onBack || (() => {})}
      />
    );
  }

  // ... rest of existing render
};
```

### Hangman Game Integration

**Modified File: `src/components/HangmanGame/HangmanGame.tsx`**

Key changes:
1. Show GameSettings before game
2. Filter word selection by categories
3. Apply difficulty word length filters

```typescript
import { useGameSettings } from '../../hooks/useGameSettings';
import { GameSettings } from '../GameSettings';
import { getRandomWords } from '../../data/dictionary';
import { HANGMAN_CONFIG } from '../../config/difficultyConfig';

export const HangmanGame: React.FC<HangmanGameProps> = ({ onBack }) => {
  const {
    difficulty,
    categories,
    setDifficulty,
    toggleCategory,
    selectAllCategories,
  } = useGameSettings('hangman');

  const [showSettings, setShowSettings] = useState(true);
  const params = HANGMAN_CONFIG[difficulty];

  const initializeGame = useCallback(() => {
    // Filter by categories and word length
    const gameWords = getRandomWords(20, categories).filter(
      word => word.english.length >= params.wordLengthRange.min &&
              word.english.length <= params.wordLengthRange.max
    );
    setWords(gameWords);
    // ...
  }, [categories, params]);

  if (showSettings) {
    return (
      <GameSettings
        game="hangman"
        difficulty={difficulty}
        categories={categories}
        onDifficultyChange={setDifficulty}
        onCategoriesChange={() => {}}
        onToggleCategory={toggleCategory}
        onSelectAll={selectAllCategories}
        onStart={() => { setShowSettings(false); initializeGame(); }}
        onBack={onBack || (() => {})}
      />
    );
  }

  // ... rest of existing render
};
```

---

## State Management and Persistence

### Storage Keys

```typescript
// Centralized storage key definitions
export const STORAGE_KEYS = {
  // Combined game settings (difficulty + categories)
  GAME_SETTINGS: 'learn-eng-game-settings',

  // Legacy keys (maintained for backward compatibility)
  LEGACY_DIFFICULTY_SETTINGS: 'learn-eng-difficulty-settings',
  LEGACY_MEMORY_WORD_COUNT: 'learn-eng-word-count',
  LEGACY_MEMORY_RECORDS: 'learn-eng-records',
  LEGACY_SPELLING_STREAK: 'learn-eng-spelling-streak-record',
  LEGACY_HANGMAN_STREAK: 'learn-eng-hangman-streak-record',
  LEGACY_FLASHCARDS_PROGRESS: 'learn-eng-flashcards-progress',
  LEGACY_FLASHCARDS_SETTINGS: 'learn-eng-flashcards-settings',
} as const;
```

### Storage Structure

```typescript
// localStorage: learn-eng-game-settings
{
  "memory": {
    "difficulty": "medium",
    "categories": ["animals", "nature"]  // Empty array = all
  },
  "spelling": {
    "difficulty": "easy",
    "categories": []
  },
  "flashcards": {
    "difficulty": "hard",
    "categories": ["food", "colors", "numbers"]
  },
  "hangman": {
    "difficulty": "medium",
    "categories": []
  }
}
```

### Migration Strategy

For users with existing difficulty settings:
1. On first load, check for existing `learn-eng-difficulty-settings`
2. If found, migrate difficulty values to new combined structure
3. Initialize categories as empty array (all categories)
4. Keep legacy keys intact for rollback safety

```typescript
// Migration logic in useGameSettings initialization
const migrateFromLegacy = (): AllGameSettings | null => {
  try {
    const legacyDifficulty = localStorage.getItem('learn-eng-difficulty-settings');
    if (legacyDifficulty) {
      const parsed = JSON.parse(legacyDifficulty);
      return {
        memory: { difficulty: parsed.memory || 'easy', categories: [] },
        spelling: { difficulty: parsed.spelling || 'easy', categories: [] },
        flashcards: { difficulty: parsed.flashcards || 'easy', categories: [] },
        hangman: { difficulty: parsed.hangman || 'easy', categories: [] },
      };
    }
  } catch (error) {
    console.warn('Migration failed:', error);
  }
  return null;
};
```

### Data Flow

```
User Opens Game
         |
         v
GameSettings Component
         |
         +---> useGameSettings hook loads from localStorage
         |
         +---> User selects difficulty and categories
         |
         +---> Settings saved to localStorage on each change
         |
         v
User Clicks "Start Game"
         |
         v
Game Component
         |
         +---> Receives difficulty and categories
         |
         +---> Calls getRandomWords(count, categories)
         |
         +---> Game initialized with filtered word pool
         |
         v
User Plays Game
         |
         v
Game uses filtered words throughout
```

---

## Technical Considerations

### Performance

1. **Filtering**: Dictionary is small (110 words), filtering is O(n) and negligible
2. **Word Count Computation**: Cached via `useMemo` in components
3. **localStorage Access**: Cached in React state, synced on change only
4. **Re-renders**: Minimize with `useCallback` and `useMemo` for filter operations

### Security

1. **Data Validation**: Validate localStorage data structure on read
2. **Category Validation**: Only accept valid category IDs from `ALL_CATEGORIES`
3. **Input Sanitization**: No user-generated category names
4. **No Sensitive Data**: Only game preferences stored locally

### Scalability

1. **Adding Categories**: Add to `ALL_CATEGORIES` array and `CATEGORY_INFO` object
2. **Dynamic Categories**: Structure supports future server-side category definitions
3. **Word Pool Growth**: Filtering logic scales linearly with dictionary size

### Error Handling

1. **Invalid Stored Categories**: Filter out unknown category IDs, keep valid ones
2. **Empty Selection Edge Case**: Prevent deselecting all categories (keep at least one)
3. **Insufficient Words**: Show warning, disable start button
4. **localStorage Unavailable**: Graceful fallback to in-memory state

### Accessibility

1. **Keyboard Navigation**: Tab through chips, Space/Enter to toggle
2. **Screen Readers**: `role="checkbox"`, `aria-checked`, descriptive `aria-label`
3. **Focus Indicators**: Visible focus ring on all interactive elements
4. **Color Independence**: Checkmark icons supplement color changes
5. **RTL Support**: Full RTL layout maintained
6. **Touch Targets**: Minimum 48x48px on category chips

---

## Testing Strategy

### Unit Tests

**Category Utils**
```typescript
// __tests__/utils/categoryUtils.test.ts
describe('categoryUtils', () => {
  describe('getFilteredWords', () => {
    it('should return all words when categories is empty', () => {
      const words = getFilteredWords([]);
      expect(words.length).toBe(110);
    });

    it('should filter words by single category', () => {
      const words = getFilteredWords(['animals']);
      expect(words.every(w => w.category === 'animals')).toBe(true);
      expect(words.length).toBe(15);
    });

    it('should filter words by multiple categories', () => {
      const words = getFilteredWords(['animals', 'food']);
      expect(words.every(w => ['animals', 'food'].includes(w.category))).toBe(true);
      expect(words.length).toBe(30);
    });
  });

  describe('hasMinimumWords', () => {
    it('should return true when sufficient words available', () => {
      expect(hasMinimumWords(['animals', 'food'], 'memory', 'easy')).toBe(true);
    });

    it('should return false when insufficient words', () => {
      expect(hasMinimumWords(['colors'], 'memory', 'hard')).toBe(false);
    });
  });

  describe('toggleCategory', () => {
    it('should add category when not present', () => {
      const result = toggleCategory(['animals'], 'food');
      expect(result).toContain('food');
    });

    it('should remove category when present', () => {
      const result = toggleCategory(['animals', 'food'], 'food');
      expect(result).not.toContain('food');
    });

    it('should return all-except-one when toggling from empty', () => {
      const result = toggleCategory([], 'animals');
      expect(result.length).toBe(7);
      expect(result).not.toContain('animals');
    });
  });
});
```

**useGameSettings Hook**
```typescript
// __tests__/hooks/useGameSettings.test.ts
describe('useGameSettings', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return default settings for new users', () => {
    const { result } = renderHook(() => useGameSettings('memory'));
    expect(result.current.difficulty).toBe('easy');
    expect(result.current.categories).toEqual([]);
  });

  it('should persist category changes', () => {
    const { result } = renderHook(() => useGameSettings('memory'));
    act(() => {
      result.current.toggleCategory('animals');
    });
    // After toggling from "all", should have all except animals
    expect(result.current.categories).not.toContain('animals');
    expect(result.current.categories.length).toBe(7);
  });

  it('should maintain separate settings per game', () => {
    const { result: memory } = renderHook(() => useGameSettings('memory'));
    const { result: spelling } = renderHook(() => useGameSettings('spelling'));

    act(() => {
      memory.current.toggleCategory('animals');
    });

    expect(memory.current.categories.length).toBe(7);
    expect(spelling.current.categories).toEqual([]);
  });
});
```

### Component Tests

```typescript
// __tests__/components/CategoryFilter.test.tsx
describe('CategoryFilter', () => {
  it('should render all category chips', () => {
    render(
      <CategoryFilter
        selectedCategories={[]}
        onToggleCategory={jest.fn()}
        onSelectAll={jest.fn()}
        isAllSelected={true}
      />
    );

    expect(screen.getByText('חיות')).toBeInTheDocument();
    expect(screen.getByText('אוכל')).toBeInTheDocument();
    // ... other categories
  });

  it('should show "All Categories" as selected when empty array', () => {
    render(
      <CategoryFilter
        selectedCategories={[]}
        onToggleCategory={jest.fn()}
        onSelectAll={jest.fn()}
        isAllSelected={true}
      />
    );

    const allToggle = screen.getByRole('checkbox', { name: /כל הקטגוריות/i });
    expect(allToggle).toHaveAttribute('aria-checked', 'true');
  });

  it('should call onToggleCategory when chip clicked', () => {
    const onToggle = jest.fn();
    render(
      <CategoryFilter
        selectedCategories={[]}
        onToggleCategory={onToggle}
        onSelectAll={jest.fn()}
        isAllSelected={true}
      />
    );

    fireEvent.click(screen.getByText('חיות'));
    expect(onToggle).toHaveBeenCalledWith('animals');
  });
});
```

```typescript
// __tests__/components/GameSettings.test.tsx
describe('GameSettings', () => {
  it('should disable start button when insufficient words', () => {
    render(
      <GameSettings
        game="memory"
        difficulty="hard"
        categories={['colors']}  // Only 12 words, hard needs 20
        onDifficultyChange={jest.fn()}
        onCategoriesChange={jest.fn()}
        onToggleCategory={jest.fn()}
        onSelectAll={jest.fn()}
        onStart={jest.fn()}
        onBack={jest.fn()}
      />
    );

    expect(screen.getByText('התחל משחק')).toBeDisabled();
    expect(screen.getByText(/אין מספיק מילים/)).toBeInTheDocument();
  });

  it('should enable start button when sufficient words', () => {
    render(
      <GameSettings
        game="memory"
        difficulty="easy"
        categories={['animals', 'food']}  // 30 words, easy needs 8
        onDifficultyChange={jest.fn()}
        onCategoriesChange={jest.fn()}
        onToggleCategory={jest.fn()}
        onSelectAll={jest.fn()}
        onStart={jest.fn()}
        onBack={jest.fn()}
      />
    );

    expect(screen.getByText('התחל משחק')).not.toBeDisabled();
  });
});
```

### Integration Tests

```typescript
// __tests__/integration/memoryGameCategories.test.tsx
describe('Memory Game Category Integration', () => {
  it('should show settings screen with category filter', () => {
    render(<MemoryGame onBack={jest.fn()} />);
    expect(screen.getByText('קטגוריות')).toBeInTheDocument();
  });

  it('should start game with filtered words', async () => {
    render(<MemoryGame onBack={jest.fn()} />);

    // Select only animals
    fireEvent.click(screen.getByText('כל הקטגוריות'));
    fireEvent.click(screen.getByText('חיות'));

    // Start game
    fireEvent.click(screen.getByText('התחל משחק'));

    await waitFor(() => {
      // Game should show cards
      const cards = screen.getAllByRole('button');
      // Verify cards are from animals category (implementation detail)
    });
  });
});
```

### E2E Tests (Cypress)

```typescript
// cypress/e2e/categorySelection.cy.ts
describe('Category Selection', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('should allow category selection before starting game', () => {
    cy.contains('משחק זיכרון').click();

    // Default: all categories selected
    cy.get('[aria-checked="true"]').should('contain', 'כל הקטגוריות');

    // Deselect some categories
    cy.contains('חיות').click();

    // All toggle should be unchecked now
    cy.get('[aria-label="בחר את כל הקטגוריות"]')
      .should('have.attr', 'aria-checked', 'false');

    // Start game
    cy.contains('התחל משחק').click();

    // Game should start
    cy.contains('זוגות:').should('be.visible');
  });

  it('should remember category selection per game', () => {
    // Set memory to specific categories
    cy.contains('משחק זיכרון').click();
    cy.contains('חיות').click();
    cy.contains('התחל משחק').click();
    cy.contains('חזרה לתפריט').click();

    // Set spelling to different categories
    cy.contains('איות').click();
    cy.contains('צבעים').click();
    cy.contains('התחל משחק').click();
    cy.contains('חזרה לתפריט').click();

    // Verify memory still has original selection
    cy.contains('משחק זיכרון').click();
    cy.get('[aria-label*="חיות"]')
      .should('have.attr', 'aria-checked', 'false');
  });

  it('should show warning when insufficient words', () => {
    cy.contains('משחק זיכרון').click();

    // Select hard difficulty
    cy.contains('קשה').click();

    // Select only colors (12 words)
    cy.contains('כל הקטגוריות').click();
    cy.contains('צבעים').click();

    // Warning should appear
    cy.contains('אין מספיק מילים').should('be.visible');

    // Start button should be disabled
    cy.contains('התחל משחק').should('be.disabled');
  });
});
```

---

## Implementation Plan

### Phase 1: Core Infrastructure (1-2 days)

**Priority: P0 - Required for all subsequent work**

1. **Create Type Definitions** (`src/types/category.ts`)
   - All interfaces and types
   - Category metadata
   - Minimum words configuration
   - Complexity: Low

2. **Create Category Utilities** (`src/utils/categoryUtils.ts`)
   - Filtering functions
   - Word count helpers
   - Toggle logic
   - Complexity: Low

3. **Implement useGameSettings Hook** (`src/hooks/useGameSettings.ts`)
   - Combined state management
   - localStorage persistence
   - Migration from legacy settings
   - Complexity: Medium

4. **Update Dictionary** (`src/data/dictionary.ts`)
   - Enhance `getRandomWords` with categories parameter
   - Backward compatible
   - Complexity: Low

### Phase 2: UI Components (1-2 days)

**Priority: P0 - Required for user interaction**

1. **Create GameSettings Component**
   - Combined difficulty + categories screen
   - Section layout
   - Start button with validation
   - Complexity: Medium

2. **Create CategoryFilter Component**
   - "All Categories" toggle
   - Category grid container
   - Complexity: Low

3. **Create CategoryChip Component**
   - Individual category tile
   - Selection states
   - Accessibility attributes
   - Complexity: Low

4. **Create CategoryWarning Component**
   - Insufficient words alert
   - Complexity: Low

5. **Add CSS Styles**
   - GameSettings.css
   - Responsive grid
   - Category chip styles
   - Complexity: Medium

### Phase 3: Game Integration (2-3 days)

**Priority: P0 - Core feature delivery**

1. **Memory Game Integration** (0.5 days)
   - Add settings screen
   - Filter word selection
   - Complexity: Medium

2. **Spelling Game Integration** (0.5 days)
   - Add settings screen
   - Filter word selection
   - Handle word recycling
   - Complexity: Medium

3. **Hangman Game Integration** (0.5 days)
   - Add settings screen
   - Filter word selection
   - Complexity: Medium

4. **Flashcards Game Integration** (1 day)
   - Add settings screen
   - Filter progress by categories
   - Filter distractor selection
   - Most complex due to Leitner system
   - Complexity: High

### Phase 4: Testing and Polish (1-2 days)

**Priority: P1 - Quality assurance**

1. **Unit Tests**
   - categoryUtils
   - useGameSettings
   - Complexity: Medium

2. **Component Tests**
   - CategoryFilter
   - CategoryChip
   - GameSettings
   - Complexity: Medium

3. **Integration Tests**
   - Each game with categories
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

1. **CategoryIndicator in Game Header** (Phase 2)
   - Show active categories during gameplay
   - Tap to return to settings
   - Estimated: 0.5 days

2. **Category-Specific Colors** (Phase 2)
   - Accent colors on chips
   - Estimated: 0.5 days

3. **Quick Filter from Menu** (Phase 2)
   - Filter icon on game menu
   - Estimated: 1 day

4. **Category Progress Tracking** (Phase 3)
   - Per-category mastery
   - Integration with progress system
   - Estimated: 2 days

### Dependencies Graph

```
Phase 1 (Types & Utils)
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

### Estimated Total: 5-9 days

| Phase | Effort | Complexity |
|-------|--------|------------|
| Phase 1 | 1-2 days | Low-Medium |
| Phase 2 | 1-2 days | Medium |
| Phase 3 | 2-3 days | Medium-High |
| Phase 4 | 1-2 days | Medium |
| **Total MVP** | **5-9 days** | - |

### Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Complex Flashcards integration | Delays | Medium | Start with simpler games first; test thoroughly |
| localStorage quota issues | Data loss | Low | Monitor storage size; implement cleanup |
| Category word count edge cases | Poor UX | Medium | Comprehensive validation; clear warnings |
| Migration breaks existing users | Frustration | Low | Keep legacy keys; test migration path |
| Accessibility issues | Compliance | Medium | Include a11y testing in each phase |

---

## Open Questions

1. **Flashcards Leitner Integration**: Should category filtering affect which words are in which Leitner box, or just which words are presented?
   - **Current assumption**: Filter presentation only; Leitner boxes remain global

2. **Category Changes Mid-Session**: If a user changes categories via header indicator, should progress (streak, score) reset?
   - **Current assumption**: Yes, changing categories restarts the game

3. **Future Category Expansion**: When new categories are added, should existing users' "all categories" selection auto-include them?
   - **Current assumption**: Yes; empty array always means "all available"

4. **Category-Specific Progress**: Should progress/mastery be tracked per-category?
   - **Current assumption**: Deferred to Phase 3 / Progress Tracking feature

5. **Minimum Word Override**: Should users be able to start a game even with insufficient words?
   - **Current assumption**: No; maintain validation for better UX

---

## Assumptions

1. **Multi-select is preferred**: Users want flexibility to combine categories
2. **Empty array = all categories**: Technical convention for representing "no filter"
3. **Per-game persistence**: Each game remembers its own category selection
4. **Difficulty settings remain independent**: Categories don't affect difficulty parameters
5. **Current 8 categories are sufficient**: No immediate need for subcategories
6. **No server-side persistence**: All data stored in localStorage
7. **Backward compatibility**: Existing users experience no breaking changes

---

## Appendix A: Category Word Distribution

| Category | Word Count | Examples |
|----------|------------|----------|
| Animals | 15 | cat, dog, elephant, lion |
| Food | 15 | apple, bread, milk, cheese |
| Colors | 12 | red, blue, green, yellow |
| Numbers | 20 | one, two, three... twenty |
| Body Parts | 12 | head, hand, eye, ear |
| Household | 12 | house, table, chair, bed |
| Nature | 12 | sun, moon, tree, flower |
| Verbs | 12 | go, eat, sleep, run |
| **Total** | **110** | - |

**Minimum Word Analysis:**

| Game | Difficulty | Required | Smallest Viable Combo |
|------|------------|----------|----------------------|
| Memory | Easy | 8 | Any single category (min 12) |
| Memory | Medium | 12 | Any single category (min 12) |
| Memory | Hard | 20 | Numbers (20) or any 2 categories |
| Spelling | All | 1 | Any category |
| Flashcards | Easy | 2 | Any category |
| Flashcards | Medium | 4 | Any category |
| Flashcards | Hard | 6 | Any category |
| Hangman | All | 1 | Any category |

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

*End of Technical Design Document*
