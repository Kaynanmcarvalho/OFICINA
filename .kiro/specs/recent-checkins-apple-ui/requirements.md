# Requirements Document

## Introduction

This specification defines the requirements for a premium, Apple-level UI component that displays recent vehicle check-ins in a modern automotive workshop management system. The component must embody Apple's design philosophy of clarity, depth, and deference while providing essential information at a glance with elegant microinteractions and adaptive theming.

## Glossary

- **RecentCheckinsSection**: The container component that displays a list of recent vehicle check-in cards
- **CheckinCard**: An individual card component representing a single vehicle check-in record
- **VehicleTypeIcon**: A visual indicator showing the type of vehicle (car, motorcycle, truck, etc.)
- **StatusBadge**: A pill-shaped indicator showing the current status of the check-in
- **ActionButton**: An interactive button that triggers detail view or other actions
- **AdaptiveTheme**: A color system that automatically adjusts between light and dark modes
- **Microinteraction**: Subtle animations and feedback that respond to user actions
- **Glassmorphism**: A design technique using frosted transparency and blur effects
- **SF Pro Typography**: Apple's system font family (or similar sans-serif alternative)

## Requirements

### Requirement 1

**User Story:** As a workshop manager, I want to see recent vehicle check-ins in an elegant card layout, so that I can quickly identify active work orders at a glance.

#### Acceptance Criteria

1. WHEN the RecentCheckinsSection loads, THE System SHALL display check-in records in horizontally-oriented card format with rounded corners between 16px and 20px radius
2. THE System SHALL render each CheckinCard with three distinct visual zones: left icon area, middle information column, and right action/status area
3. THE System SHALL apply consistent spacing of 16px to 24px between card elements following a clean grid layout
4. THE System SHALL display a maximum of 10 recent check-ins ordered by creation timestamp descending
5. WHEN no check-ins exist, THE System SHALL display an empty state message with appropriate iconography

### Requirement 2

**User Story:** As a user, I want check-in cards to display essential vehicle and owner information clearly, so that I can identify specific work orders without confusion.

#### Acceptance Criteria

1. THE System SHALL display the owner name in semibold typography as the primary focus element
2. THE System SHALL display the vehicle model and license plate in regular or medium weight typography at a smaller size than the owner name
3. THE System SHALL display the check-in date and time in light gray or secondary label color using a lighter font weight
4. THE System SHALL format the license plate text in a monospace font style for improved readability
5. THE System SHALL truncate text content that exceeds the card width with ellipsis to prevent overflow

### Requirement 3

**User Story:** As a user, I want vehicle type icons to be visually distinctive and elegant, so that I can quickly identify the type of vehicle without reading text.

#### Acceptance Criteria

1. THE System SHALL display a VehicleTypeIcon in the left zone of each CheckinCard
2. THE System SHALL render vehicle icons in a size between 20px and 28px with monochromatic styling
3. THE System SHALL apply subtle gradient or glass effect backgrounds to icon containers
4. THE System SHALL use distinct icons for different vehicle types including car, motorcycle, truck, and van
5. THE System SHALL apply a circular or rounded square container with dimensions between 48px and 56px for each icon

### Requirement 4

**User Story:** As a user, I want status indicators to be immediately recognizable, so that I can understand the current state of each check-in at a glance.

#### Acceptance Criteria

1. THE System SHALL display a StatusBadge in pill-shaped format in the right zone of each CheckinCard
2. WHEN the check-in status is "active" or "in progress", THE System SHALL display the badge with amber color accent (#F59E0B or similar)
3. WHEN the check-in status is "completed", THE System SHALL display the badge with emerald color accent (#10B981 or similar)
4. THE System SHALL apply subtle glow effect to active status badges using box-shadow with matching color
5. THE System SHALL display status text in Portuguese ("Em andamento", "Concluído", "Ativo")

### Requirement 5

**User Story:** As a user, I want smooth microinteractions when hovering over cards, so that the interface feels responsive and premium.

#### Acceptance Criteria

1. WHEN the user hovers over a CheckinCard, THE System SHALL apply a scale transformation between 1.01 and 1.02 with smooth easing
2. WHEN the user hovers over a CheckinCard, THE System SHALL apply a subtle upward translation of 2px to 4px
3. THE System SHALL complete all hover animations within 200ms to 300ms using cubic-bezier easing function
4. WHEN the user hovers over an ActionButton, THE System SHALL apply a scale transformation of 1.1 with 150ms duration
5. WHEN the user clicks an ActionButton, THE System SHALL apply a scale transformation of 0.95 for tactile feedback

### Requirement 6

**User Story:** As a user, I want the interface to adapt seamlessly between light and dark themes, so that I can work comfortably in any lighting condition.

#### Acceptance Criteria

1. WHEN AdaptiveTheme is set to dark mode, THE System SHALL render cards with deep graphite background colors between #121212 and #1C1C1E
2. WHEN AdaptiveTheme is set to dark mode, THE System SHALL apply subtle translucency or gradient overlays with rgba(255,255,255,0.05) to rgba(255,255,255,0.1)
3. WHEN AdaptiveTheme is set to light mode, THE System SHALL render cards with soft neutral white backgrounds between #F9F9FB and #FFFFFF
4. WHEN AdaptiveTheme is set to light mode, THE System SHALL apply faint shadows with blur radius between 8px and 20px
5. THE System SHALL transition between theme modes smoothly over 300ms duration

### Requirement 7

**User Story:** As a user, I want action buttons to be intuitive and accessible, so that I can view check-in details or perform actions efficiently.

#### Acceptance Criteria

1. THE System SHALL display an ActionButton with external link icon in the right zone of each CheckinCard
2. WHEN the user clicks an ActionButton, THE System SHALL trigger a callback function to display detailed check-in information
3. THE System SHALL render ActionButton as a rounded icon button with padding between 8px and 12px
4. WHEN the user hovers over an ActionButton, THE System SHALL apply a background color change with 200ms transition
5. THE System SHALL ensure ActionButton has sufficient contrast ratio (minimum 4.5:1) for accessibility compliance

### Requirement 8

**User Story:** As a user, I want the typography to follow Apple's design principles, so that the interface feels cohesive and professional.

#### Acceptance Criteria

1. THE System SHALL use SF Pro Display, SF Pro Text, or similar sans-serif typeface for all text elements
2. THE System SHALL apply font size between 14px and 16px for owner names with semibold weight (600)
3. THE System SHALL apply font size between 12px and 14px for vehicle model and plate with regular weight (400) or medium weight (500)
4. THE System SHALL apply font size between 11px and 13px for date/time labels with light weight (300) or regular weight (400)
5. THE System SHALL maintain consistent line height ratio between 1.4 and 1.6 for optimal readability

### Requirement 9

**User Story:** As a user, I want cards to have depth and elevation, so that the interface feels layered and premium.

#### Acceptance Criteria

1. THE System SHALL apply soft shadows to CheckinCard with blur radius between 12px and 24px
2. THE System SHALL use shadow colors with low opacity between rgba(0,0,0,0.1) and rgba(0,0,0,0.3) for light mode
3. THE System SHALL use shadow colors with higher opacity between rgba(0,0,0,0.4) and rgba(0,0,0,0.6) for dark mode
4. WHERE glassmorphism is enabled, THE System SHALL apply backdrop-filter blur between 8px and 16px
5. THE System SHALL apply subtle gradient borders or inner glow effects with 1px width for premium detail

### Requirement 10

**User Story:** As a user, I want the interface to be responsive and prevent layout issues, so that I can view check-ins on different screen sizes without horizontal scrolling.

#### Acceptance Criteria

1. THE System SHALL constrain CheckinCard width to 100% of its container with no fixed pixel width
2. THE System SHALL apply min-width of 0 to flex children to enable proper text truncation
3. THE System SHALL use flexbox layout with appropriate flex-shrink and flex-grow values to prevent overflow
4. WHEN the viewport width is below 768px, THE System SHALL stack card elements vertically while maintaining visual hierarchy
5. THE System SHALL ensure all interactive elements have minimum touch target size of 44px by 44px for mobile accessibility
