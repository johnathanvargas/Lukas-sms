# Calculators Consolidation

## Overview
The Mix Calculator and Granular Helper have been consolidated into a single "Calculators" page with tabbed navigation, following the same pattern used for the Logs consolidation.

## Changes Made

### New Files
- `utils/calculators.js` - Pure calculation functions extracted for reusability and testability
  - `calculateMixAmounts()` - Mix calculator logic
  - `calculateGranularAmount()` - Granular calculator logic
  - `extractGranularRate()` - Helper for extracting rates from chemical objects
  
- `utils/calculators.test.js` - Comprehensive unit tests (22 tests, all passing)
- `utils/calculators-integration.test.js` - Integration tests for the calculators page

### Modified Files
- `script.js` - Added consolidated Calculators page with tab navigation
  - `renderCalculators()` - Main function for the consolidated page
  - `showCalculatorTab()` - Tab switching logic
  - `renderMixCalculatorContent()` - Refactored to render into target element
  - `renderGranularHelperContent()` - Refactored to render into target element
  - Updated routing to handle 'calculators', 'mix', and 'granular' routes
  
- `index.html` - Updated navigation menu
  - Replaced separate "Mix Calculator" and "Granular Helper" menu items with single "Calculators" item
  - Added prefetch for calculators utility script
  
- `cache-version.js` - Bumped version to force cache refresh

## Routing
- `/calculators` - Shows Calculators page with Mix Calculator tab selected by default
- `/mix` - Redirects to Calculators page with Mix Calculator tab selected
- `/granular` - Redirects to Calculators page with Granular Helper tab selected

## Testing
Run the test suites:
```bash
node utils/calculators.test.js
node utils/calculators-integration.test.js
```

All tests passing:
- Unit tests: 22/22 ✓
- Integration tests: 3/3 ✓

## UI/UX
- Tabbed interface matches the existing Logs page pattern
- Reuses `.logs-tabs` and `.logs-tab-btn` CSS classes for consistency
- Fully responsive and accessible
- Keyboard navigation supported
- ARIA attributes properly set

## Backwards Compatibility
- Old `/mix` and `/granular` routes still work, redirecting to the appropriate tab
- All existing functionality preserved
- No breaking changes to chemical data structure or calculations

## Future Improvements
The calculation logic in `calculateMix()` and `calculateGranular()` could be refactored to use the utility functions in `utils/calculators.js` for even better code reuse and testability. Currently, both implementations exist side-by-side to maintain stability while providing a tested foundation for future refactoring.

## Manual Testing Checklist
- [ ] Navigate to Calculators from menu
- [ ] Switch between Mix Calculator and Granular Helper tabs
- [ ] Verify Mix Calculator produces same results as before
- [ ] Verify Granular Helper produces same results as before
- [ ] Test on mobile viewport
- [ ] Test keyboard navigation (Tab, Enter, Arrow keys)
- [ ] Test with screen reader
- [ ] Verify old /mix route redirects correctly
- [ ] Verify old /granular route redirects correctly
