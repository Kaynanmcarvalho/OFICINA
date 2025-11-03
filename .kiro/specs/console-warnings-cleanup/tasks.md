# Implementation Plan

- [ ] 1. Fix critical motion import errors



  - Locate and fix ClientTableSkeleton.jsx motion import error
  - Search for all files using motion without proper imports
  - Add missing framer-motion imports to affected components
  - Verify framer-motion is properly installed in package.json
  - _Requirements: 1.1, 1.2, 1.4_

- [ ] 2. Update React Router configuration for v7 compatibility
  - Add v7_startTransition future flag to router configuration
  - Add v7_relativeSplatPath future flag to router configuration
  - Update main App.jsx or router setup file with future flags
  - Test all routing functionality after configuration changes
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 3. Fix AnimatePresence configuration issues
  - Identify all AnimatePresence components using mode="wait" with multiple children
  - Either remove wait mode or restructure to single child pattern
  - Test animation transitions work smoothly after fixes
  - Verify no AnimatePresence warnings appear in console
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 4. Clean up debug console logs
  - Create debug utility functions for conditional logging
  - Replace theme change console.log statements with conditional logging
  - Remove or conditionalize other debug logs in RecentItem and RecentSection components
  - Ensure logs only appear in development environment
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 5. Enhance error boundary handling
  - Update ErrorBoundary component to provide better user experience
  - Implement minimal, actionable error logging instead of full stack traces
  - Add retry functionality to error boundary fallback UI
  - Test error boundary catches component failures gracefully
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ]* 6. Add comprehensive testing for console cleanup
  - Write tests to verify no console warnings in production builds
  - Create tests for proper AnimatePresence configuration
  - Add tests for router configuration without deprecation warnings
  - Write error boundary tests for graceful error handling
  - _Requirements: 1.1, 2.3, 3.3, 4.3, 5.1_