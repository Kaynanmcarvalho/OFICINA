# Recent Check-ins Component

Premium Apple-level UI component for displaying recent vehicle check-ins in an automotive workshop management system.

## Features

✨ **Apple Premium Design**
- Clean, minimalistic aesthetic following Apple's Human Interface Guidelines
- Glassmorphism effects with subtle depth
- Smooth microinteractions with Framer Motion
- Adaptive dark/light theming

🎨 **Visual Excellence**
- Three-zone horizontal layout (icon, info, actions)
- Color-coded status badges (active, completed, pending)
- Vehicle type icons with gradient backgrounds
- Responsive design with no horizontal overflow

⚡ **Performance Optimized**
- React.memo for efficient re-renders
- GPU-accelerated animations
- Stagger animation for smooth list rendering
- Optimized for 60fps animations

♿ **Accessibility Compliant**
- Semantic HTML with ARIA attributes
- Full keyboard navigation support
- WCAG AA color contrast ratios
- Screen reader friendly
- 44px minimum touch targets

## Installation

The component is already integrated into the project. Import it from:

```javascript
import { RecentCheckinsSection } from '../components/RecentCheckins';
```

## Usage

### Basic Example

```jsx
import { RecentCheckinsSection } from '../components/RecentCheckins';

function MyPage() {
  const checkins = [
    {
      id: 'CHK-001',
      clientName: 'João Silva',
      vehicleBrand: 'Honda',
      vehicleModel: 'Civic',
      vehiclePlate: 'ABC-1234',
      vehicleType: 'car',
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ];

  const handleSelect = (checkin) => {
    console.log('Selected:', checkin);
  };

  const handleViewDetails = (checkin) => {
    console.log('View details:', checkin);
  };

  return (
    <RecentCheckinsSection
      checkins={checkins}
      maxItems={10}
      onSelectCheckin={handleSelect}
      onViewDetails={handleViewDetails}
    />
  );
}
```

### With Empty State

```jsx
<RecentCheckinsSection
  checkins={[]}
  onSelectCheckin={handleSelect}
  onViewDetails={handleViewDetails}
/>
```

## Props

### RecentCheckinsSection

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checkins` | `Array<Checkin>` | `[]` | Array of check-in objects |
| `maxItems` | `number` | `10` | Maximum number of items to display |
| `onSelectCheckin` | `function` | - | Callback when a card is selected |
| `onViewDetails` | `function` | - | Callback when view details is clicked |
| `showFilters` | `boolean` | `false` | Show filter controls (future feature) |
| `className` | `string` | `''` | Additional CSS classes |

### Checkin Object

```typescript
interface Checkin {
  id: string;                    // Unique identifier
  clientName: string;            // Client/owner name
  vehicleBrand: string;          // Vehicle brand (e.g., "Honda")
  vehicleModel: string;          // Vehicle model (e.g., "Civic")
  vehiclePlate: string;          // License plate (e.g., "ABC-1234")
  vehicleType?: string;          // 'car' | 'motorcycle' | 'truck' | 'pickup'
  status: string;                // 'active' | 'completed' | 'pending'
  createdAt: string | Date;      // ISO date string or Date object
  services?: string[];           // Optional array of services
  notes?: string;                // Optional notes
}
```

## Status Types

The component supports three status types with distinct visual styling:

- **Active** (`active`): Amber color, "Em andamento" label
- **Completed** (`completed`): Emerald color, "Concluído" label, checkmark icon
- **Pending** (`pending`): Blue color, "Aguardando" label

## Vehicle Types

Automatically detects and displays appropriate icons:

- **Car** (`car`): Standard car icon
- **Motorcycle** (`motorcycle`): Motorcycle icon
- **Truck** (`truck`): Truck icon
- **Pickup** (`pickup`): Pickup truck icon

Vehicle type is auto-detected from brand/model if not explicitly provided.

## Keyboard Navigation

- **Tab**: Navigate between cards
- **Enter/Space**: Select card
- **Tab**: Navigate to action button
- **Enter/Space**: Trigger action
- **Escape**: Deselect (future feature)

## Responsive Behavior

- **Mobile (<768px)**: Vertical stacking with adjusted spacing
- **Tablet (768px-1024px)**: Horizontal layout with tighter gaps
- **Desktop (>1024px)**: Full horizontal layout with optimal spacing

All touch targets are minimum 44x44px for mobile accessibility.

## Animations

### Card Animations
- **Entry**: Fade in with upward motion (300ms)
- **Hover**: Scale 1.01 + lift 2px (200ms)
- **Stagger**: 50ms delay between cards

### Button Animations
- **Hover**: Scale 1.05 (150ms)
- **Tap**: Scale 0.95 (100ms)

### Icon Animations
- **Hover**: Scale 1.05 with subtle rotation (200ms)

All animations use custom easing: `cubic-bezier(0.22, 1, 0.36, 1)`

## Error Handling

The component includes an ErrorBoundary that catches and displays errors gracefully:

```jsx
// Automatically wrapped in ErrorBoundary
<RecentCheckinsSection checkins={checkins} />
```

Error state shows:
- Friendly error message
- Reload button
- Error logged to console

## Data Validation

The component handles missing or invalid data gracefully:

- Missing `clientName`: "Cliente não identificado"
- Missing `vehicleModel`: "Veículo não especificado"
- Missing `vehiclePlate`: "---"
- Invalid `createdAt`: "Data inválida"
- Missing `vehicleType`: Auto-detected or defaults to 'car'

## Styling

The component uses inline styles for precise control and theme consistency:

- Dark mode gradients: `#1C1C1E` → `#2C2C2E`
- Selected state: Emerald border glow
- Shadows: Layered for depth
- Borders: Subtle `rgba(255,255,255,0.08)`

## Performance Tips

1. **Limit Items**: Use `maxItems` prop to limit rendered cards
2. **Memoize Callbacks**: Wrap handlers in `useCallback`
3. **Stable Keys**: Ensure checkin IDs are stable and unique
4. **Virtualization**: For >50 items, consider implementing virtualization

## Demo

Run the demo page to see the component in action:

```bash
# Navigate to /recent-checkins-demo in your app
```

Or import the demo component:

```jsx
import RecentCheckinsDemo from './pages/RecentCheckinsDemo';
```

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

Requires modern browser with CSS Grid and Flexbox support.

## Dependencies

- `react` (^18.0.0)
- `framer-motion` (^10.0.0)
- `react-hot-toast` (^2.4.0)
- `lucide-react` (icons)
- `tailwindcss` (^3.0.0)

## Related Components

- `VehicleTypeIcon` - Vehicle icon system
- `vehicleTypeDetector` - Auto-detection service
- `useTheme` - Theme management hook

## Future Enhancements

- [ ] Filtering by status/date/type
- [ ] Sorting options
- [ ] Search functionality
- [ ] Bulk selection
- [ ] Drag to reorder
- [ ] Context menu
- [ ] Export to PDF/CSV
- [ ] Real-time updates via WebSocket

## License

Part of the automotive workshop management system.

## Support

For issues or questions, contact the development team.
