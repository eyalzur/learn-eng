# Technical Design

## Architecture Overview

```
learn-eng/
├── src/
│   ├── components/           # React components
│   │   ├── GameMenu/         # Game selection menu
│   │   ├── MemoryGame/       # Memory game feature
│   │   └── SpellingGame/     # Spelling game feature
│   ├── data/                 # Static data (dictionary)
│   ├── utils/                # Utility functions
│   │   └── speech.ts         # Text-to-speech
│   ├── styles/               # CSS styles
│   ├── App.tsx               # Root component with game routing
│   └── index.tsx             # Entry point
├── docs/                     # Documentation
├── dist/                     # Build output
└── .claude/commands/         # Claude Code commands
```

## Tech Stack

### Current (Web)
| Layer | Technology |
|-------|------------|
| Language | TypeScript |
| UI Framework | React 18 |
| Bundler | Webpack 5 |
| Styling | CSS (vanilla) |
| Dev Server | webpack-dev-server |
| Speech | Web Speech API |
| Storage | localStorage |

### Future (Mobile)
| Layer | Technology |
|-------|------------|
| Framework | React Native |
| Navigation | React Navigation (planned) |
| State | React Context or Zustand (TBD) |

## Key Design Decisions

### 1. React over alternatives
**Decision**: Use React for web, React Native for mobile
**Rationale**: Code sharing between web and mobile, large ecosystem, team familiarity

### 2. TypeScript
**Decision**: Use TypeScript throughout
**Rationale**: Type safety, better IDE support, catch errors early

### 3. Vanilla CSS over CSS-in-JS
**Decision**: Use plain CSS files
**Rationale**: Simpler setup, good enough for current scope, easy to understand

### 4. Local-first data
**Decision**: Dictionary is static TypeScript file, settings in localStorage
**Rationale**: No backend needed for MVP, fast loading, works offline

### 5. Component structure per game
**Decision**: Each game in its own folder under `components/`
**Rationale**: Encapsulation, easy to add new games, clear boundaries

### 6. RTL with LTR exceptions
**Decision**: Page is RTL for Hebrew, but English spelling uses LTR direction
**Rationale**: Natural reading direction for each language

## Data Models

### Word
```typescript
interface Word {
  id: string;
  english: string;        // English word
  hebrew: string;         // Hebrew translation (with nikud)
  transcription: string;  // Hebrew phonetic (with nikud)
}
```

### CardData (Memory Game)
```typescript
interface CardData {
  id: string;
  wordId: string;
  content: string;
  transcription?: string;
  type: 'english' | 'hebrew';
  isFlipped: boolean;
  isMatched: boolean;
  matchColor?: string;
}
```

### GameType
```typescript
type GameType = 'memory' | 'spelling' | null;
```

## Game-Specific Patterns

### Memory Game
- Word count configurable (4-10 pairs)
- Records stored per word count: `learn-eng-record-{count}`
- Column layout from center outward using CSS order
- Matched pairs get unique colors from MATCH_COLORS array

### Spelling Game
- Streak-based scoring (reset on wrong answer)
- Single record for best streak: `learn-eng-spelling-streak-record`
- Letter basket includes word letters + 50% extra random letters
- LTR direction on letter boxes for proper English spelling
- justDropped guard prevents accidental letter removal after drop

## Storage Keys
| Key | Purpose |
|-----|---------|
| `learn-eng-word-count` | Memory game word count preference |
| `learn-eng-record-{n}` | Memory game record for n pairs |
| `learn-eng-spelling-streak-record` | Spelling game best streak |

## Coding Conventions

### File Naming
- Components: PascalCase (`MemoryGame.tsx`)
- Utilities: camelCase (`dictionary.ts`, `speech.ts`)
- Styles: kebab-case or same as component (`main.css`)

### Component Structure
```typescript
// Imports
import React, { useState, useCallback } from 'react';

// Types/Interfaces
interface Props { ... }

// Constants
const STORAGE_KEY = '...';

// Helper functions
const helperFn = () => { ... };

// Component
export const MyComponent: React.FC<Props> = ({ ... }) => {
  // State
  // Callbacks
  // Effects
  // Render
};
```

### State Management
- Local state: `useState` for component-specific state
- Callbacks: `useCallback` for handlers passed to children
- Effects: `useEffect` for initialization and side effects
- Shared state: React Context (when needed)

## Performance Considerations
- Lazy loading for games (future)
- Memoization for expensive computations
- Virtual lists for large word lists (future)
- Avoid unnecessary re-renders with proper dependency arrays

## Testing Strategy (Future)
- Unit tests: Jest + React Testing Library
- E2E tests: Playwright (consideration)
- Manual testing: Primary method currently
