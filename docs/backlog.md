# Product Backlog

## Priority Legend
- P0: Critical / Next up
- P1: High priority
- P2: Medium priority
- P3: Nice to have

## Status Legend
- [ ] Not started
- [~] In progress
- [x] Completed

---

# Epics

## [P0] Mobile-First UX
Make the web app optimized for mobile devices before deploying to a server.

### Tasks
- [x] Add mobile meta tags (PWA-ready, theme color, touch icons) to index.html
- [x] Add CSS mobile-first breakpoints and responsive base styles
- [x] Make Game Menu responsive (single column on narrow screens)
- [x] Make Memory Game cards responsive (fit mobile viewport) **[BUG-002: Fixed]**
- [x] Add tap-to-place interaction to Spelling Game (touch-friendly alternative to drag) **[BUG-001: Fixed]**
- [x] Increase tap target sizes to 48px minimum throughout
- [x] Fix iOS Safari viewport height issues (use dvh or JS fallback)
- [x] Test and fix issues on mobile viewport

---

## [P1] New Learning Games
Add more interactive games to expand learning methods.

### Completed
- [x] Memory Game - Match English-Hebrew pairs
- [x] Spelling Game - Drag-and-drop letter spelling

### Tasks
- [ ] Flashcards game with spaced repetition
- [ ] Word Quiz game (multiple choice)
- [ ] Hangman game

---

## [P1] Vocabulary Expansion
Grow the dictionary and organize content for better learning.

### Tasks
- [ ] Define category schema (animals, food, colors, numbers, body parts, etc.)
- [ ] Organize existing 20 words into categories
- [ ] Add animal words (10+ words)
- [ ] Add food words (10+ words)
- [ ] Add color words (10+ words)
- [ ] Add number words (1-20)
- [ ] Add body parts words (10+ words)
- [ ] Add common verbs (10+ words)
- [ ] Add example sentences to words

---

## [P1] Progress Tracking
Track user learning progress across sessions and games.

### Tasks
- [ ] Design progress data model (words learned, attempts, success rate)
- [ ] Track which words user has learned per game
- [ ] Show overall score history
- [ ] Implement daily learning streaks
- [ ] Show progress dashboard on menu

---

## [P2] Game Enhancements
Improve existing games with new features.

### Tasks
- [ ] Spelling Game: Reorder letters between boxes (drag/tap to swap placed letters)
- [ ] Add difficulty levels (easy/medium/hard) to games
- [ ] Add timer mode option
- [ ] Add more hint types
- [ ] Add sound effects for correct/incorrect

---

## [P2] Content Features
Let users customize and manage vocabulary.

### Tasks
- [ ] Add category/topic selection in game settings
- [ ] Allow custom word lists
- [ ] Import/export word lists (JSON)
- [ ] AI-powered word addition (describe word → generate entry)

---

## [P2] Personalization
Customize the learning experience per user.

### Tasks
- [ ] User profiles in localStorage
- [ ] Favorite words feature
- [ ] Review weak words mode
- [ ] Persist settings across sessions

---

## [P2] Infrastructure
Platform and deployment improvements.

### Tasks
- [x] Add app version display (MAJOR.EPIC.TASK format, bottom corner of menu)
- [x] Deploy to static hosting (Render)
- [ ] Add PWA manifest for offline use
- [ ] Add service worker for caching
- [ ] Add basic analytics

---

## [P3] Polish & Delight
Visual improvements and celebrations.

### Tasks
- [ ] Add more animations and transitions
- [ ] Dark mode theme
- [ ] Celebration effects on achievements
- [ ] Confetti on new records

---

## [P3] Technical Debt
Code quality and maintainability.

### Tasks
- [ ] Add unit tests (Jest + RTL)
- [ ] Add E2E tests (Playwright)
- [ ] Code splitting for games (lazy loading)
- [ ] Performance optimization for large word lists

---

## [P3] React Native (Future)
Mobile app if web app proves successful.

### Tasks
- [ ] Evaluate if React Native is needed vs PWA
- [ ] React Native project setup
- [ ] Shared component library extraction
- [ ] iOS build and deploy
- [ ] Android build and deploy

---

# Ideas Parking Lot
Ideas for future consideration, not yet prioritized:

- Multiplayer mode (compete with friends)
- Leaderboards
- Daily challenges
- AI-generated sentences for context
- Speech recognition for pronunciation practice
- Word of the day notifications
- Parent/teacher dashboard
- Gamification (badges, levels, rewards)
