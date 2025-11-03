# Requirements Document - CheckIn Premium Enhancements

## Introduction

This specification defines comprehensive enhancements for the `/checkin` page of an automotive workshop management system. The goal is to transform the check-in experience into a highly functional, intuitive, and visually elegant Apple-level interface while maintaining full compatibility with existing code and Firebase infrastructure.

## Glossary

- **CheckInDashboard**: Operational dashboard showing vehicle status cards and productivity metrics
- **StatusCard**: Visual card displaying count and status of vehicles (in repair, awaiting quote, ready for pickup, delivered)
- **ProductivityIndicator**: Real-time metric showing daily completion progress against targets
- **RepairTimer**: Visual chronometer showing time elapsed since vehicle check-in
- **SmartFilters**: Intelligent filtering system by status, date, client, or service type
- **PhotoCapture**: Camera integration for documenting vehicle condition on entry
- **DynamicChecklist**: Adaptive verification checklist based on vehicle type
- **VoiceRecognition**: Voice-to-text capability for observations field
- **QRCodeIntegration**: QR code scanning for vehicles with internal tags
- **CheckoutSummary**: Automated service summary with before/after photos
- **PDFGenerator**: Automatic PDF generation of service reports
- **DigitalSignature**: Touch/mouse/stylus signature capture for client approval
- **MaintenanceScheduler**: Automated scheduling system for next service with reminders
- **ServiceRating**: Quick 1-5 star rating system for service quality
- **VehicleTimeline**: Visual timeline of vehicle service history
- **RecurrenceAnalyzer**: System to identify recurring issues across visits
- **InsightsDashboard**: Mini dashboard with service metrics and analytics
- **WhatsAppIntegration**: Direct WhatsApp messaging integration with client data
- **EmailIntegration**: Automated email sending with service summaries

## Requirements

### Requirement 1: Operational Dashboard

**User Story:** As a workshop manager, I want a visual dashboard showing vehicle status at a glance, so that I can quickly understand workshop capacity and workflow.

#### Acceptance Criteria

1. THE CheckInDashboard SHALL display four StatusCards showing counts for "Em reparo", "Aguardando orçamento", "Pronto para retirada", and "Entregue"
2. EACH StatusCard SHALL update in real-time when vehicle status changes in Firebase
3. THE CheckInDashboard SHALL display a ProductivityIndicator showing format "X carros concluídos / meta Y"
4. THE ProductivityIndicator SHALL calculate completion percentage and display visual progress bar
5. THE CheckInDashboard SHALL use glassmorphism design with backdrop-blur and subtle gradients

### Requirement 2: Smart Filtering System

**User Story:** As a workshop employee, I want to filter vehicles by multiple criteria, so that I can quickly find specific records.

#### Acceptance Criteria

1. THE SmartFilters SHALL provide dropdown filters for status, date range, client name, and service type
2. THE SmartFilters SHALL apply filters in real-time without page reload
3. THE SmartFilters SHALL display active filter count badge
4. THE SmartFilters SHALL provide "Clear all filters" button when any filter is active
5. THE SmartFilters SHALL persist filter state in localStorage for session continuity

### Requirement 3: Repair Timer Display

**User Story:** As a workshop manager, I want to see how long each vehicle has been in repair, so that I can manage turnaround times effectively.

#### Acceptance Criteria

1. EACH vehicle card SHALL display a RepairTimer showing elapsed time since check-in
2. THE RepairTimer SHALL format time as "Xh Ym" for times under 24 hours
3. THE RepairTimer SHALL format time as "X dias" for times over 24 hours
4. THE RepairTimer SHALL update every minute without full component re-render
5. THE RepairTimer SHALL display warning color (amber) when time exceeds 48 hours

### Requirement 4: Enhanced Check-In with Photo Capture

**User Story:** As a service advisor, I want to capture photos of vehicle condition during check-in, so that I have visual documentation of entry state.

#### Acceptance Criteria

1. THE check-in modal SHALL provide PhotoCapture button to access device camera
2. THE PhotoCapture SHALL support multiple photo uploads (minimum 4 photos)
3. THE PhotoCapture SHALL compress images to maximum 1MB per photo before Firebase upload
4. THE PhotoCapture SHALL display thumbnail preview of captured photos
5. THE PhotoCapture SHALL allow photo deletion before final submission

### Requirement 5: Dynamic Vehicle Checklist

**User Story:** As a service advisor, I want a smart checklist that adapts to vehicle type, so that I perform relevant inspections efficiently.

#### Acceptance Criteria

1. THE DynamicChecklist SHALL display different items based on detected vehicle type (car, motorcycle, truck)
2. THE DynamicChecklist SHALL include common items: "Freios", "Óleo", "Pneus", "Luzes", "Bateria"
3. THE DynamicChecklist SHALL include motorcycle-specific items when type is motorcycle
4. THE DynamicChecklist SHALL save checklist state to Firebase with check-in record
5. THE DynamicChecklist SHALL use checkbox UI with three states: unchecked, checked-ok, checked-issue

### Requirement 6: Voice Recognition for Observations

**User Story:** As a service advisor, I want to dictate observations instead of typing, so that I can document issues faster while inspecting the vehicle.

#### Acceptance Criteria

1. THE observations field SHALL provide microphone button for voice input
2. THE voice recognition SHALL use Web Speech API when available
3. THE voice recognition SHALL display "listening" indicator during capture
4. THE voice recognition SHALL append transcribed text to existing observations
5. THE voice recognition SHALL show fallback message when Web Speech API is unavailable

### Requirement 7: QR Code Integration

**User Story:** As a workshop employee, I want to scan vehicle QR tags for instant check-in, so that I can process vehicles faster.

#### Acceptance Criteria

1. THE check-in modal SHALL provide QR code scanner button
2. THE QR scanner SHALL use device camera to read QR codes
3. THE QR scanner SHALL auto-populate vehicle and client data when valid code is scanned
4. THE QR scanner SHALL display error message for invalid or unrecognized codes
5. THE QR scanner SHALL work on both mobile and desktop devices with camera access

### Requirement 8: Automated Checkout Summary

**User Story:** As a service advisor, I want an automatic service summary during checkout, so that I can review completed work with the client.

#### Acceptance Criteria

1. THE checkout modal SHALL display CheckoutSummary with before/after photos side-by-side
2. THE CheckoutSummary SHALL list all services performed from check-in record
3. THE CheckoutSummary SHALL display total service time duration
4. THE CheckoutSummary SHALL show checklist items and their final status
5. THE CheckoutSummary SHALL include observations field for final notes

### Requirement 9: PDF Generation and Sharing

**User Story:** As a workshop manager, I want to generate PDF service reports, so that I can provide professional documentation to clients.

#### Acceptance Criteria

1. THE checkout process SHALL provide "Gerar PDF" button
2. THE PDFGenerator SHALL create formatted PDF with workshop branding
3. THE PDF SHALL include vehicle details, services performed, photos, and signature
4. THE PDFGenerator SHALL save PDF to Firebase Storage with unique filename
5. THE PDFGenerator SHALL provide download link immediately after generation

### Requirement 10: WhatsApp and Email Integration

**User Story:** As a service advisor, I want to send service summaries via WhatsApp or email, so that clients receive documentation instantly.

#### Acceptance Criteria

1. THE checkout modal SHALL provide "Enviar WhatsApp" and "Enviar Email" buttons
2. THE WhatsAppIntegration SHALL fetch client phone from `/clients` collection
3. THE WhatsAppIntegration SHALL open WhatsApp with pre-filled message and PDF link
4. THE EmailIntegration SHALL fetch client email from `/clients` collection
5. THE EmailIntegration SHALL send email with PDF attachment using Firebase Functions

### Requirement 11: Digital Signature Capture

**User Story:** As a service advisor, I want clients to sign digitally for service approval, so that I have documented authorization.

#### Acceptance Criteria

1. THE checkout modal SHALL provide DigitalSignature canvas for client signature
2. THE DigitalSignature SHALL support mouse, touch, and stylus input
3. THE DigitalSignature SHALL provide "Clear" button to restart signature
4. THE DigitalSignature SHALL convert signature to PNG image before Firebase upload
5. THE DigitalSignature SHALL validate that signature is not empty before allowing checkout completion

### Requirement 12: Maintenance Scheduling

**User Story:** As a service advisor, I want to schedule next maintenance during checkout, so that clients receive timely service reminders.

#### Acceptance Criteria

1. THE checkout modal SHALL provide MaintenanceScheduler with date picker
2. THE MaintenanceScheduler SHALL suggest next service date based on service type
3. THE MaintenanceScheduler SHALL save scheduled date to Firebase with reminder flag
4. THE MaintenanceScheduler SHALL send WhatsApp reminder 3 days before scheduled date
5. THE MaintenanceScheduler SHALL allow client to opt-out of reminders

### Requirement 13: Service Rating System

**User Story:** As a workshop manager, I want clients to rate service quality, so that I can track customer satisfaction.

#### Acceptance Criteria

1. THE checkout modal SHALL display ServiceRating with 1-5 star selection
2. THE ServiceRating SHALL use interactive star icons with hover effects
3. THE ServiceRating SHALL save rating to Firebase with checkout record
4. THE ServiceRating SHALL be optional (allow checkout without rating)
5. THE ServiceRating SHALL display thank you message after rating submission

### Requirement 14: Vehicle History Timeline

**User Story:** As a service advisor, I want to see vehicle service history in timeline format, so that I understand maintenance patterns.

#### Acceptance Criteria

1. THE vehicle detail view SHALL display VehicleTimeline with chronological service records
2. THE VehicleTimeline SHALL show date, services performed, and duration for each visit
3. THE VehicleTimeline SHALL use vertical timeline design with connecting lines
4. THE VehicleTimeline SHALL highlight recurring services with visual indicator
5. THE VehicleTimeline SHALL provide "Export History" button for PDF generation

### Requirement 15: Recurrence Analysis

**User Story:** As a workshop manager, I want to identify recurring vehicle issues, so that I can recommend preventive solutions.

#### Acceptance Criteria

1. THE vehicle detail view SHALL display RecurrenceAnalyzer showing repeated issues
2. THE RecurrenceAnalyzer SHALL identify services performed 2+ times in 6 months
3. THE RecurrenceAnalyzer SHALL display recurrence count and date range
4. THE RecurrenceAnalyzer SHALL highlight high-frequency issues in warning color
5. THE RecurrenceAnalyzer SHALL suggest preventive maintenance based on patterns

### Requirement 16: Insights Mini Dashboard

**User Story:** As a workshop manager, I want service analytics at a glance, so that I can make data-driven decisions.

#### Acceptance Criteria

1. THE CheckInDashboard SHALL display InsightsDashboard with key metrics
2. THE InsightsDashboard SHALL show average service time by service type
3. THE InsightsDashboard SHALL display average revenue per check-in
4. THE InsightsDashboard SHALL show productivity ranking by mechanic (if mechanic field exists)
5. THE InsightsDashboard SHALL highlight most recurrent vehicle of the month

### Requirement 17: Responsive Design and Theme Compatibility

**User Story:** As a user, I want the enhanced check-in page to work perfectly on all devices and themes, so that I have consistent experience.

#### Acceptance Criteria

1. ALL new components SHALL adapt to light and dark themes automatically
2. ALL new components SHALL be fully responsive for mobile, tablet, and desktop
3. ALL interactive elements SHALL have minimum 44px touch target on mobile
4. ALL animations SHALL respect prefers-reduced-motion user preference
5. ALL components SHALL maintain visual hierarchy and readability in both themes

### Requirement 18: Performance and Optimization

**User Story:** As a user, I want the check-in page to load and respond quickly, so that I can work efficiently.

#### Acceptance Criteria

1. THE CheckInDashboard SHALL load initial data within 1 second on 3G connection
2. THE photo upload SHALL compress images before Firebase upload to reduce bandwidth
3. THE real-time updates SHALL use Firebase listeners efficiently without excessive re-renders
4. THE component SHALL use React.memo and useMemo for expensive computations
5. THE page SHALL maintain 60fps during animations and transitions

### Requirement 19: Accessibility Compliance

**User Story:** As a user with disabilities, I want the check-in page to be fully accessible, so that I can use all features independently.

#### Acceptance Criteria

1. ALL interactive elements SHALL be keyboard navigable with logical tab order
2. ALL images and icons SHALL have descriptive alt text or aria-labels
3. ALL form fields SHALL have associated labels and error messages
4. ALL color-coded information SHALL have non-color alternatives (icons, text)
5. THE page SHALL maintain WCAG AA contrast ratios in both light and dark themes

### Requirement 20: Data Integrity and Firebase Integration

**User Story:** As a developer, I want all new features to integrate seamlessly with Firebase, so that data remains consistent and reliable.

#### Acceptance Criteria

1. ALL new data fields SHALL be added to existing Firebase collections without breaking changes
2. ALL Firebase writes SHALL include error handling and user feedback
3. ALL Firebase queries SHALL use appropriate indexes for performance
4. ALL uploaded files SHALL be stored in organized Firebase Storage structure
5. ALL real-time listeners SHALL be properly cleaned up on component unmount
