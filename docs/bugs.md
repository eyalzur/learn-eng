# Bug Reports

## Status Legend
- **Open**: Not yet fixed
- **In Progress**: Being worked on
- **Fixed**: Resolved (include fix version/commit)
- **Won't Fix**: Intentional or out of scope

---

## BUG-001: Spelling Game drag-and-drop not working on mobile

**Reported**: 2025-12-04
**Status**: Fixed
**Severity**: Blocker
**Location**: Spelling Game

### Description
Drag and drop functionality for moving letters from the basket to the letter boxes does not work on mobile devices. Users cannot play the Spelling Game on mobile at all.

### Steps to Reproduce
1. Open the app on a mobile device (tested on Chrome mobile)
2. Navigate to Spelling Game
3. Try to drag a letter from the basket to a letter box
4. Nothing happens - letter doesn't move

### Expected Behavior
User should be able to move letters from the basket to the boxes to spell the word.

### Actual Behavior
No response when trying to drag letters. Tapping letters also does nothing.

### Environment
- Device: Mobile phone
- Browser: Chrome (mobile)
- OS: Android/iOS

### Root Cause
HTML5 Drag and Drop API is not supported on touch devices. The current implementation uses `draggable`, `onDragStart`, `onDragEnd`, and `onDrop` events which only work with mouse interactions.

### Resolution
Linked to Epic #1 (Mobile-First UX), Task #5: "Add tap-to-place interaction to Spelling Game (touch-friendly alternative to drag)"

### Fix
**Fixed**: 2025-12-04
**Solution**: Added tap-to-place interaction alongside drag-and-drop:
- Tap a letter in the basket to select it (highlighted in orange)
- Tap an empty box to place the selected letter
- Empty boxes pulse when a letter is selected
- Tap a filled box to return the letter to basket
- Drag-and-drop still works on desktop

---

## BUG-002: Memory Game grid overflows viewport with 7+ word pairs

**Reported**: 2025-12-04
**Status**: Fixed
**Severity**: Blocker
**Location**: Memory Game

### Description
When selecting more than 6 word pairs (7-10) in the Memory Game, the card grid extends beyond the viewport width, making the game unplayable. Horizontal scrolling is required to see all cards.

### Steps to Reproduce
1. Open the app (mobile or desktop)
2. Navigate to Memory Game
3. Select 7 or more word pairs from the dropdown
4. Observe that cards extend beyond the screen

### Expected Behavior
All cards should fit within the viewport, possibly with smaller cards or a different grid layout.

### Actual Behavior
Cards overflow horizontally, requiring scroll to see all cards. On mobile, this is especially problematic.

### Environment
- Device: Both mobile and desktop
- All browsers affected

### Root Cause
The grid uses `grid-auto-flow: column` with `grid-template-rows: repeat(4, 1fr)`, creating unlimited columns. With 14+ cards (7 pairs), this creates more than 3-4 columns which overflow on smaller screens.

### Resolution
Linked to Epic #1 (Mobile-First UX), Task #4: "Make Memory Game cards responsive (fit mobile viewport)"

### Fix
**Fixed**: 2025-12-04
**Solution**: Changed grid layout from column-based to responsive:
- Use `grid-template-columns: repeat(auto-fit, minmax(80px, 1fr))` for responsive columns
- Set `max-width: 600px` on grid to constrain width
- Cards use `aspect-ratio: 1/1.2` instead of fixed height
- Cards have flexible width with min/max constraints
- Grid scrolls vertically if needed instead of horizontally

---
