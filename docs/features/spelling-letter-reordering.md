# Feature Design: Spelling Game - Letter Reordering

## Summary
Enhance the Spelling Game by allowing users to reorder letters that have already been placed in answer boxes. Users can drag-and-drop letters between boxes or tap to swap them, providing more flexibility to correct mistakes without returning letters to the basket. This feature also enables dragging letters from the basket directly onto placed letters to swap positions.

## Target Users
Hebrew speakers (primarily children) learning English spelling through the interactive spelling game.

## Problem Solved
- **Current limitation**: If a user places a letter in the wrong box, they must remove it back to the basket and then place it in the correct box - this is a two-step process
- **User frustration**: Cannot easily rearrange letters once placed, leading to more trial and error
- **Inefficient workflow**: Extra taps/drags needed to fix simple ordering mistakes
- **Learning impediment**: Focus shifts from spelling to interface manipulation

**With this feature**:
- Users can directly swap letters between boxes with a single interaction
- Reduces cognitive load - users can focus on spelling rather than interface mechanics
- Supports natural trial-and-error learning pattern
- More forgiving interface encourages experimentation
- Aligns with modern drag-drop UX expectations

## User Experience

### Current Behavior (Before Enhancement)
1. User drags/taps letter from basket to Box 1
2. User drags/taps letter from basket to Box 2
3. **Realizes Box 1 and Box 2 letters should be swapped**
4. User clicks Box 1 to return letter to basket
5. User clicks Box 2 to return letter to basket
6. User drags/taps correct letters to boxes (2 more actions)
7. **Total**: 6 interactions to fix a simple swap

### New Behavior (After Enhancement)

#### Method 1: Drag-and-Drop Swap (Desktop/Tablet)
1. User drags letter from Box 1
2. User drops letter onto Box 2
3. **Result**: Letters in Box 1 and Box 2 are swapped
4. **Total**: 1 drag action to fix the swap

#### Method 2: Tap-to-Swap (Mobile-Friendly)
1. User taps letter in Box 1 (selects it, shows orange highlight)
2. User taps letter in Box 2
3. **Result**: Letters in Box 1 and Box 2 are swapped
4. **Total**: 2 taps to fix the swap

#### Method 3: Basket-to-Box Swap (New Capability)
1. User drags letter from basket
2. User drops letter onto filled Box 1
3. **Result**: Basket letter moves to Box 1, Box 1's old letter moves to basket
4. **Total**: 1 drag action (already works in current implementation, needs explicit documentation)

#### Method 4: Tap Basket-to-Box Swap (New Capability)
1. User taps letter in basket (selects it, shows orange highlight)
2. User taps filled Box 1
3. **Result**: Basket letter moves to Box 1, Box 1's old letter returns to basket
4. **Total**: 2 taps (already works in current implementation, needs explicit documentation)

### UI Screens & Interactions

#### Visual States

**Default State** (Letter in box):
```
┌─────────┐
│    C    │  ← Letter in box (white border, light fill)
└─────────┘
```

**Dragging State** (Dragging letter from box):
```
┌─────────┐
│    C    │  ← Being dragged (semi-transparent, following cursor)
└─────────┘

┌─────────┐
│         │  ← Source box (empty with dashed border, pulsing to indicate it's temporary)
└─────────┘
```

**Drop Target State** (Dragging over another filled box):
```
┌─────────┐
│    A    │  ← Destination box (highlighted border, pulsing to indicate swap will occur)
└─────────┘
```

**Selected State** (Tap to select):
```
┌─────────┐
│    C    │  ← Selected letter (orange glow, scaled up 1.1x)
└─────────┘
```

**Awaiting Swap State** (Another box when letter is selected):
```
┌─────────┐
│    A    │  ← Other filled boxes (pulsing orange border to indicate tappable for swap)
└─────────┘
```

#### Complete Game Screen with New Feature

```
┌─────────────────────────────────────────┐
│  ← חזרה לתפריט      משחק איות          │
│                                         │
│  רצף: 5        שיא: 12                 │
│  [משחק חדש]                             │
├─────────────────────────────────────────┤
│                                         │
│         חָתוּל (transcription)          │
│                                         │
│   ┌───┐ ┌───┐ ┌───┐                    │
│   │ C │ │ A │ │ T │   ← Letter boxes   │
│   └───┘ └───┘ └───┘     (can reorder)  │
│                                         │
│  Available letters:                     │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐              │
│  │ E │ │ R │ │ S │ │ M │              │
│  └───┘ └───┘ └───┘ └───┘              │
│                                         │
│  [רמז (הגייה)] [בדוק]                  │
│                                         │
└─────────────────────────────────────────┘

User Actions:
1. Drag C from Box 1 → Drop on A in Box 2
   Result: Box 1 = A, Box 2 = C

2. Tap C in Box 2 (selected) → Tap T in Box 3
   Result: Box 2 = T, Box 3 = C

3. Tap E in basket → Tap C in Box 3
   Result: Box 3 = E, C returns to basket
```

### Interaction Flows

#### Flow 1: Drag Box-to-Box Swap
```
User starts dragging letter from Box A
  ↓
Visual: Letter becomes semi-transparent, follows cursor
Visual: Box A shows dashed border (temporarily empty)
  ↓
User drags over Box B (which has a letter)
  ↓
Visual: Box B gets highlighted border with pulse animation
Visual: Cursor shows "swap" indicator (CSS cursor change)
  ↓
User releases mouse/finger (drops)
  ↓
Action: Swap letters between Box A and Box B
Visual: Brief swap animation (letters cross paths - optional)
Result: Box A now has Box B's letter, Box B now has Box A's letter
```

#### Flow 2: Tap-to-Select Box-to-Box Swap
```
User taps letter in Box A
  ↓
Visual: Box A letter scales up (1.1x), orange glow
State: Box A letter is selected
Visual: All other filled boxes get pulsing orange border (indicating swappable)
  ↓
User taps letter in Box B
  ↓
Action: Swap letters between Box A and Box B
Visual: Brief highlight flash on both boxes
State: Selection cleared
Result: Box A now has Box B's letter, Box B now has Box A's letter
```

#### Flow 3: Drag Basket-to-Box Swap (Already Exists, Needs Documentation)
```
User drags letter from basket
  ↓
Visual: Letter follows cursor, basket letter becomes semi-transparent
  ↓
User drags over Box A (which has a letter)
  ↓
Visual: Box A gets highlighted border
  ↓
User drops letter on Box A
  ↓
Action: Place basket letter in Box A, return Box A's old letter to basket
Result: Box A has new letter, old letter appears in basket
```

### Edge Cases

1. **Selecting then clicking empty box**
   - Behavior: Move selected letter to empty box (same as current behavior)
   - No swap needed

2. **Selecting then clicking same letter again**
   - Behavior: Deselect (toggle off the selection)
   - Current behavior already handles this

3. **Dragging box letter to empty box**
   - Behavior: Move letter to new box (not a swap, just a move)
   - Simple position change

4. **Dragging box letter back to basket area**
   - Behavior: Return letter to basket
   - Works like current "remove from box" behavior

5. **Feedback state active (correct/incorrect shown)**
   - Behavior: All drag/tap interactions disabled
   - Prevent modifications after answer is checked

6. **Two rapid taps on same box**
   - Behavior: Select on first tap, deselect on second tap
   - No action taken

### Accessibility
- Maintains existing 48px minimum tap targets
- Clear visual feedback for all states (drag, select, swap-ready)
- Works with both drag-drop (desktop) and tap (mobile)
- Visual cues (colors, animations) indicate available actions
- No new accessibility barriers introduced

## Technical Design

### Components

#### Main Component: SpellingGame.tsx
**File**: `/src/components/SpellingGame/SpellingGame.tsx`

**New/Modified State**:
```typescript
// Existing state (no changes needed)
const [letterBoxes, setLetterBoxes] = useState<(string | null)[]>([]);
const [selectedLetter, setSelectedLetter] = useState<{ letter: string; id: string } | null>(null);
const [draggedLetter, setDraggedLetter] = useState<{ letter: string; id: string } | null>(null);
const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

// New state to track where dragged letter came from
const [draggedFromBox, setDraggedFromBox] = useState<number | null>(null);
```

**New/Modified Handler Functions**:

1. **handleDragStartFromBox** (NEW)
```typescript
const handleDragStartFromBox = (boxIndex: number, letter: string) => {
  if (feedback) return; // Disable during feedback state

  // Set dragged letter with special flag to track origin
  setDraggedLetter({ letter, id: `box-${boxIndex}-${letter}` });
  setDraggedFromBox(boxIndex); // Track source box
};
```

2. **handleDropOnBox** (MODIFIED)
```typescript
const handleDropOnBox = (boxIndex: number) => {
  if (!draggedLetter || feedback) return;

  // Case 1: Dragging from basket to filled box (existing behavior, keep as-is)
  if (draggedFromBox === null) {
    // Return old letter to basket, place new letter in box
    if (letterBoxes[boxIndex] !== null) {
      const oldLetter = letterBoxes[boxIndex]!;
      setLetterBasket(prev => [...prev, { letter: oldLetter, id: `${oldLetter}-returned-${Date.now()}` }]);
    }

    const newBoxes = [...letterBoxes];
    newBoxes[boxIndex] = draggedLetter.letter;
    setLetterBoxes(newBoxes);

    setLetterBasket(prev => prev.filter(l => l.id !== draggedLetter.id));
    setDraggedLetter(null);
    setJustDropped(true);
    setTimeout(() => setJustDropped(false), 100);
    return;
  }

  // Case 2: Dragging from box to another box (NEW BEHAVIOR - SWAP)
  if (draggedFromBox !== null) {
    const newBoxes = [...letterBoxes];

    // Swap the letters
    const sourceBoxLetter = newBoxes[draggedFromBox];
    const targetBoxLetter = newBoxes[boxIndex];

    newBoxes[draggedFromBox] = targetBoxLetter; // Can be null (empty) or a letter
    newBoxes[boxIndex] = sourceBoxLetter;

    setLetterBoxes(newBoxes);
    setDraggedLetter(null);
    setDraggedFromBox(null);
    setJustDropped(true);
    setTimeout(() => setJustDropped(false), 100);
  }
};
```

3. **handleDragEndFromBox** (NEW)
```typescript
const handleDragEndFromBox = () => {
  setDraggedLetter(null);
  setDraggedFromBox(null);
};
```

4. **handleBoxClick** (MODIFIED)
```typescript
const handleBoxClick = (boxIndex: number) => {
  if (feedback || justDropped) return;

  const letter = letterBoxes[boxIndex];

  // Case 1: Letter is selected from basket, place it in this box
  if (selectedLetter && !selectedLetter.id.startsWith('box-')) {
    placeSelectedLetter(boxIndex);
    return;
  }

  // Case 2: Letter is selected from another box, SWAP them (NEW BEHAVIOR)
  if (selectedLetter && selectedLetter.id.startsWith('box-')) {
    // Extract source box index from id: "box-3-C" → 3
    const sourceBoxIndex = parseInt(selectedLetter.id.split('-')[1]);

    if (sourceBoxIndex === boxIndex) {
      // Clicking same box - deselect
      setSelectedLetter(null);
      return;
    }

    // Perform swap
    const newBoxes = [...letterBoxes];
    const sourceBoxLetter = newBoxes[sourceBoxIndex];
    const targetBoxLetter = newBoxes[boxIndex];

    newBoxes[sourceBoxIndex] = targetBoxLetter; // Can be null or a letter
    newBoxes[boxIndex] = sourceBoxLetter;

    setLetterBoxes(newBoxes);
    setSelectedLetter(null);
    return;
  }

  // Case 3: No letter selected, clicking filled box - SELECT IT (NEW BEHAVIOR)
  if (letter && !selectedLetter) {
    setSelectedLetter({ letter, id: `box-${boxIndex}-${letter}` });
    return;
  }

  // Case 4: No letter selected, clicking empty box - do nothing (or could show hint)
  if (!letter && !selectedLetter) {
    return;
  }
};
```

5. **handleDropOnBasket** (NEW - Optional Enhancement)
```typescript
const handleDropOnBasket = () => {
  if (!draggedLetter || feedback) return;

  // Only handle if dragging from a box
  if (draggedFromBox !== null) {
    const letter = letterBoxes[draggedFromBox];
    if (letter) {
      // Return letter to basket
      setLetterBasket(prev => [...prev, { letter, id: `${letter}-returned-${Date.now()}` }]);

      // Clear the box
      const newBoxes = [...letterBoxes];
      newBoxes[draggedFromBox] = null;
      setLetterBoxes(newBoxes);
    }
  }

  setDraggedLetter(null);
  setDraggedFromBox(null);
};
```

### Data Models

No new interfaces needed! All existing types work:

```typescript
// Existing types (no changes)
interface Word {
  id: string;
  english: string;
  hebrew: string;
  transcription: string;
  category: Category;
}

// Letter basket items (existing)
interface BasketLetter {
  letter: string;
  id: string;
}

// Selected/dragged letter (existing)
interface LetterReference {
  letter: string;
  id: string; // Format: "box-{index}-{letter}" for box letters, or original ID for basket letters
}
```

### Files to Create/Modify

#### Modified Files

1. **`/src/components/SpellingGame/SpellingGame.tsx`**
   - Add `draggedFromBox` state
   - Add `handleDragStartFromBox()` handler
   - Modify `handleDropOnBox()` to detect box-to-box swaps
   - Add `handleDragEndFromBox()` handler
   - Modify `handleBoxClick()` to support selecting box letters and swapping
   - Update letter box rendering to be draggable
   - Add `onDragStart` and `onDragEnd` to letter boxes

2. **`/src/styles/main.css`**
   - Add `.letter-box.dragging` styles (box being dragged from)
   - Add `.letter-box.drag-over` styles (box being dragged over for swap)
   - Add `.letter-box.selected` styles (box letter selected via tap)
   - Add `.letter-box.swap-ready` styles (other boxes when one is selected)
   - Add swap animation keyframes (optional polish)

3. **`/docs/state.md`**
   - Update Spelling Game section to document letter reordering capability

4. **`/docs/backlog.md`**
   - Mark "Spelling Game: Reorder letters between boxes" as completed

5. **`/src/constants/version.ts`**
   - Increment version after implementation

#### No New Files Required
This is an enhancement to an existing component, not a new feature requiring new files.

### CSS Styling

Add to `/src/styles/main.css`:

```css
/* Letter Box - Dragging State (when dragging FROM this box) */
.letter-box.dragging-from {
  border-style: dashed;
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.05);
  animation: pulse-empty 1s ease-in-out infinite;
}

@keyframes pulse-empty {
  0%, 100% {
    border-color: rgba(255, 255, 255, 0.2);
  }
  50% {
    border-color: rgba(255, 255, 255, 0.5);
  }
}

/* Letter Box - Drop Target (when dragging OVER this box for swap) */
.letter-box.drag-over-swap {
  border-color: rgba(243, 156, 18, 1);
  border-width: 3px;
  background: rgba(243, 156, 18, 0.3);
  animation: pulse-swap 0.5s ease-in-out infinite;
  transform: scale(1.05);
}

@keyframes pulse-swap {
  0%, 100% {
    box-shadow: 0 0 10px rgba(243, 156, 18, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(243, 156, 18, 0.8);
  }
}

/* Letter Box - Selected (tapped box letter) */
.letter-box.selected {
  background: rgba(243, 156, 18, 0.4);
  border-color: rgba(243, 156, 18, 1);
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(243, 156, 18, 0.6);
  z-index: 10;
  position: relative;
}

/* Letter Box - Swap Ready (other filled boxes when one is selected) */
.letter-box.swap-ready {
  border-color: rgba(243, 156, 18, 0.6);
  animation: pulse-swap-ready 1.5s ease-in-out infinite;
  cursor: pointer;
}

@keyframes pulse-swap-ready {
  0%, 100% {
    border-color: rgba(243, 156, 18, 0.4);
  }
  50% {
    border-color: rgba(243, 156, 18, 0.8);
  }
}

/* Letter Box - Make filled boxes draggable */
.letter-box.filled {
  cursor: grab;
  user-select: none;
}

.letter-box.filled:active {
  cursor: grabbing;
}

/* Dragging letter from box - visual feedback */
.letter-box.filled.being-dragged {
  opacity: 0.6;
  cursor: grabbing;
}

/* Optional: Swap animation (smooth transition when swapping) */
.letter-box.swapping {
  animation: swap-flash 0.3s ease;
}

@keyframes swap-flash {
  0%, 100% {
    background: rgba(255, 255, 255, 0.25);
  }
  50% {
    background: rgba(243, 156, 18, 0.5);
  }
}

/* Basket drop zone (for returning letters) - Optional enhancement */
.letter-basket.drop-target {
  border: 2px solid rgba(243, 156, 18, 0.8);
  background: rgba(243, 156, 18, 0.2);
}
```

### Drag-and-Drop Event Handling

**Letter Box JSX** (example):
```tsx
{letterBoxes.map((letter, index) => (
  <div
    key={index}
    className={`letter-box
      ${letter ? 'filled' : ''}
      ${feedback || ''}
      ${selectedLetter && !letter ? 'awaiting' : ''}
      ${selectedLetter?.id === `box-${index}-${letter}` ? 'selected' : ''}
      ${selectedLetter && letter && selectedLetter.id !== `box-${index}-${letter}` && selectedLetter.id.startsWith('box-') ? 'swap-ready' : ''}
      ${draggedFromBox === index ? 'dragging-from' : ''}
      ${draggedLetter && draggedFromBox !== null && draggedFromBox !== index && letter ? 'drag-over-swap' : ''}
    `}
    draggable={!feedback && letter !== null} // Make filled boxes draggable
    onDragStart={() => letter && handleDragStartFromBox(index, letter)}
    onDragEnd={handleDragEndFromBox}
    onDragOver={(e) => e.preventDefault()} // Allow drop
    onDrop={() => handleDropOnBox(index)}
    onClick={() => handleBoxClick(index)}
  >
    {letter?.toUpperCase()}
  </div>
))}
```

**Letter Basket JSX** (optional enhancement for drop target):
```tsx
<div
  className={`letter-basket ${draggedFromBox !== null ? 'drop-target' : ''}`}
  onDragOver={(e) => e.preventDefault()}
  onDrop={handleDropOnBasket}
>
  {letterBasket.map((item) => (
    // ... existing basket letters ...
  ))}
</div>
```

### Integration Points

1. **Existing SpellingGame State**
   - No breaking changes to existing state structure
   - Add one new state variable: `draggedFromBox`
   - Modify existing handlers to support new swap behavior

2. **Existing CSS Classes**
   - Extend existing `.letter-box` styles
   - Add new state-based classes
   - No conflicts with existing styles

3. **Existing User Flows**
   - All existing interactions remain functional
   - New interactions are additive (don't break current behavior)
   - Backward compatible

## Implementation Tasks

### Task 1: Add Box Dragging Infrastructure (Small)
- Add `draggedFromBox` state variable
- Add `handleDragStartFromBox()` handler
- Add `handleDragEndFromBox()` handler
- Update letter box rendering to include `draggable` attribute on filled boxes
- Add `onDragStart` and `onDragEnd` events to letter boxes
- **Complexity**: Small
- **Estimated Time**: 30 minutes
- **Testing**: Verify boxes can be dragged, state updates correctly

### Task 2: Implement Drag-to-Swap Logic (Medium)
- Modify `handleDropOnBox()` to detect box-to-box vs basket-to-box
- Implement swap logic when `draggedFromBox !== null`
- Handle edge cases (dragging to empty box, dragging to same box)
- Test swap behavior with various letter combinations
- **Complexity**: Medium
- **Estimated Time**: 1 hour
- **Testing**: Verify all swap scenarios work correctly

### Task 3: Implement Tap-to-Swap Logic (Medium)
- Modify `handleBoxClick()` to handle selecting box letters
- Implement swap logic when clicking second box with selected box letter
- Handle deselection (clicking same box twice)
- Differentiate between basket letter selection and box letter selection
- **Complexity**: Medium
- **Estimated Time**: 1 hour
- **Testing**: Verify tap selection and swapping on mobile/touch devices

### Task 4: Add Visual Feedback Styles (Small)
- Add `.letter-box.dragging-from` styles
- Add `.letter-box.drag-over-swap` styles
- Add `.letter-box.selected` styles
- Add `.letter-box.swap-ready` styles
- Add pulse/glow animations
- Add conditional className logic in JSX
- **Complexity**: Small
- **Estimated Time**: 45 minutes
- **Testing**: Verify visual states appear correctly during interactions

### Task 5: Polish and Edge Cases (Small)
- Test all edge cases (empty boxes, same box, rapid clicks, etc.)
- Ensure `justDropped` guard works with new interactions
- Verify feedback state disables all new interactions
- Test on different screen sizes (mobile, tablet, desktop)
- Verify accessibility (48px tap targets maintained)
- Polish animations and transitions
- **Complexity**: Small
- **Estimated Time**: 45 minutes
- **Testing**: Comprehensive QA across devices and scenarios

### Task 6: Documentation (Small)
- Update game instructions text to mention reordering capability
- Update `/docs/state.md` with new feature description
- Mark task complete in `/docs/backlog.md`
- Increment version in `/src/constants/version.ts`
- **Complexity**: Small
- **Estimated Time**: 15 minutes

### Total Estimated Time: 4-5 hours

### Task Order
1. Task 1 (Drag Infrastructure) - Foundation for drag behavior
2. Task 2 (Drag Swap Logic) - Core swap functionality via drag
3. Task 3 (Tap Swap Logic) - Core swap functionality via tap
4. Task 4 (Visual Feedback) - User experience polish
5. Task 5 (Edge Cases & Polish) - Quality assurance
6. Task 6 (Documentation) - Project updates

### Complexity Assessment
- **Overall Complexity**: Medium
- **Similar to**: Existing drag-drop and tap-to-place interactions in SpellingGame
- **Risks**:
  - Managing state correctly between drag and tap modes
  - Ensuring `justDropped` guard doesn't interfere with new interactions
  - Visual state management (multiple conditional classes)
- **Mitigation**:
  - Thorough testing of all interaction paths
  - Clear separation of box-source vs basket-source logic
  - Reuse existing patterns where possible

## Design Decisions

### 1. Box Letters Should Be Draggable
**Decision**: Make all filled letter boxes draggable sources
**Rationale**:
- Natural UX expectation - if you can drag letters in, you should be able to drag them around
- Consistent with modern drag-drop interfaces
- Provides desktop/tablet users with efficient interaction method
- No downsides - mobile users can still use tap

**Alternative Considered**: Only allow tap-based reordering
**Why Not**: Limits desktop UX, feels restrictive

### 2. Swap Behavior vs Move Behavior
**Decision**: When dragging/tapping box-to-box with both boxes filled, swap the letters
**Rationale**:
- More intuitive - user expects the letters to exchange positions
- Preserves all letters (nothing lost or unexpectedly returned to basket)
- Consistent with mental model of "rearranging" vs "removing and placing"
- Faster workflow - single action vs multiple

**Alternative Considered**: Move letter and return displaced letter to basket
**Why Not**: Less intuitive, requires extra step to place returned letter

### 3. Allow Dragging to Empty Boxes
**Decision**: When dragging box letter to an empty box, just move it (no swap)
**Rationale**:
- Natural behavior - empty box has nothing to swap with
- Gives users flexibility to "spread out" letters before committing
- Consistent with drag-drop expectations

### 4. Visual Feedback for Selection State
**Decision**: Use orange color scheme for selected/swap-ready states
**Rationale**:
- Orange already used for selected basket letters (existing pattern)
- Distinct from green (correct) and red (incorrect)
- Warm, inviting color that suggests "ready for action"
- High contrast against white letter boxes

**Alternative Considered**: Use blue or purple
**Why Not**: Orange already established in codebase for selection

### 5. ID Format for Box Letters
**Decision**: Use `box-{index}-{letter}` format for box letter IDs
**Rationale**:
- Easy to parse and extract source box index
- Clearly distinguishes box letters from basket letters
- No ID collisions
- Simple string operations to check origin

**Alternative Considered**: Add boolean flag to selectedLetter state
**Why Not**: ID-based approach is cleaner, reuses existing structure

### 6. Tap-to-Deselect
**Decision**: Tapping the same box twice deselects the letter
**Rationale**:
- Gives users an "undo" for accidental selections
- Common UX pattern (toggle behavior)
- No side effects - safe action

### 7. Disable During Feedback State
**Decision**: Disable all reordering when feedback is showing (correct/incorrect)
**Rationale**:
- Consistent with existing behavior (no edits after checking answer)
- Prevents confusion - answer is locked in
- Enforces "check -> see result -> next word" flow

### 8. Optional Swap Animation
**Decision**: Include simple flash animation, but keep subtle
**Rationale**:
- Provides visual confirmation that swap occurred
- Helps user track which letters moved
- Keeps interface feeling responsive and polished
- Doesn't slow down interaction (brief 0.3s)

**Alternative Considered**: Complex cross-path animation
**Why Not**: Adds complexity, may feel slow, harder to implement

### 9. Basket as Drop Target
**Decision**: Allow dragging box letters back to basket (optional enhancement)
**Rationale**:
- Provides alternate way to remove letters besides clicking box
- Consistent with drag-drop mental model
- Nice-to-have but not critical

**Status**: Recommended for implementation but can be deferred if time is limited

## Open Questions

### 1. Should we add undo/redo functionality?
**Question**: Should there be an undo button to revert the last swap?
**Options**:
- Add undo/redo buttons
- Add undo stack tracking letter box states
- Keep it simple (no undo)

**Recommendation**: Defer to future iteration. The swap is quick enough that users can manually reverse it. Adding undo adds complexity (state history tracking, UI buttons) for marginal benefit. Gather user feedback first.

### 2. Should we show a tutorial/hint on first use?
**Question**: Should we show a tooltip or overlay explaining the reordering feature?
**Options**:
- One-time tooltip: "Tip: Drag or tap letters to swap them!"
- Animated hint on first game load
- Just update the instructions text
- No tutorial (let users discover)

**Recommendation**: Update the game instructions text at the bottom to mention reordering. Consider adding a dismissible tip overlay if user testing shows the feature isn't discoverable. Start minimal, add if needed.

### 3. Should swapping have a sound effect?
**Question**: Should there be audio feedback when letters swap?
**Options**:
- Subtle "whoosh" or "click" sound on swap
- Same sound as placing letters
- No sound (visual feedback only)

**Recommendation**: No sound for MVP. Sound effects are in the P2 backlog for all games. Implement consistently across games later rather than piecemeal.

### 4. Should we add haptic feedback on mobile?
**Question**: Should mobile devices vibrate briefly on successful swap?
**Options**:
- Use Vibration API for tactile feedback
- No haptic feedback

**Recommendation**: Defer to future enhancement. Haptic feedback requires additional testing across devices and may not be universally supported. Focus on visual feedback first.

### 5. Should we track analytics on feature usage?
**Question**: Should we measure how often users use reordering vs other methods?
**Options**:
- Track swap count, drag vs tap method usage
- No analytics

**Recommendation**: Defer to future. Analytics are not yet implemented in the app (P2 backlog item). When analytics are added, this would be a good metric to include.

## Future Enhancements

### Phase 2 (Post-MVP)
1. **Keyboard Shortcuts** - Arrow keys to move selected letter left/right
2. **Multi-Select** - Select multiple letters and move them as a group
3. **Undo/Redo** - Revert accidental swaps
4. **Tutorial Overlay** - One-time hint showing the feature
5. **Sound Effects** - Audio feedback for swaps (when sounds added to all games)
6. **Haptic Feedback** - Vibration on mobile for tactile confirmation

### Phase 3 (Advanced)
1. **Animated Swap Transitions** - Letters smoothly cross paths when swapping
2. **Gesture Support** - Swipe gestures to reorder letters
3. **Voice Commands** - "Swap first and third letter" (accessibility)
4. **Auto-Arrange** - Smart suggestion to reorder letters (AI hint)

## Success Metrics

### Qualitative
- User feedback on ease of fixing mistakes
- Observed reduction in frustration during gameplay
- Increase in completion rate (fewer abandoned games due to interface issues)
- User comments about interface responsiveness

### Quantitative
- Average time to complete a word (expect decrease)
- Number of "return to basket" actions (expect decrease)
- Number of successful completions vs abandoned attempts
- Frequency of reordering feature usage

### Success Criteria
- Feature is used in >20% of word completions (indicates users find it valuable)
- No increase in error rate (ensure feature doesn't confuse users)
- No performance degradation (smooth animations, no lag)
- Positive or neutral user feedback (no complaints about confusion)

## Notes

- This enhancement addresses a common UX friction point without disrupting existing workflows
- The feature is discoverable (users naturally try to drag filled boxes)
- Implementation reuses existing patterns (drag-drop, tap-select) from the codebase
- Low risk: Additive feature, doesn't break existing functionality
- High value: Significantly improves user experience for common correction scenario
- Mobile-first: Works well with both touch and mouse interactions
- Aligns with modern UX expectations for drag-drop interfaces

## Conclusion

The letter reordering feature transforms the Spelling Game from a "place once, remove if wrong" interface to a "rearrange freely" interface. This reduces cognitive load, supports trial-and-error learning, and aligns with user expectations for drag-drop UX. The implementation is straightforward, builds on existing patterns, and can be completed in a single development session.
