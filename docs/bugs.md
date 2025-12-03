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
