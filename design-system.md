# GovDB Shield Design System

## Design Principles
- Professional and serious aesthetic
- Blue and gray color palette emphasizing security and reliability
- Clean, intuitive interface for quick adoption
- Detailed audit logs and visual reporting

## Color System

### Primary Colors
- Navy Blue (#1e3a5f) - Primary brand color, header and main actions
- Safety Blue (#2563eb) - Secondary actions, links, highlights
- Slate (#334155) - Text, neutral UI elements

### Status Colors
- Green (#16a34a) - Normal/Active/Resolved
- Yellow (#ca8a04) - Warning/Investigating
- Red (#dc2626) - Critical/Suspended/Terminated
- Blue (#2563eb) - Info status

### Neutral Colors
- Light Gray (#f1f5f9) - Backgrounds
- Medium Gray (#94a3b8) - Secondary text
- Dark Gray (#1e293b) - Primary text

## Typography

### Font Stack
- Headings: system-ui, "PingFang SC", "Microsoft YaHei", sans-serif
- UI Text: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- Data/Code: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace

### Scale
- Heading 1: 2rem (32px), bold
- Heading 2: 1.5rem (24px), semibold
- Heading 3: 1.25rem (20px), medium
- Body: 1rem (16px), regular
- Small: 0.875rem (14px), regular
- Caption: 0.75rem (12px), regular

## Spacing System
- Base unit: 4px
- Tight: 8px (2 units)
- Standard: 16px (4 units)
- Comfortable: 24px (6 units)
- Spacious: 32px (8 units)

## Components

### Buttons
- Primary: Safety Blue background, white text, rounded-lg
- Secondary: White background, Slate border, Slate text, rounded-lg
- Danger: Red background, white text, rounded-lg
- Ghost: Transparent, Safety Blue text, hover background

### Cards
- White background
- 1px border: #e2e8f0
- Shadow-sm
- Rounded-xl corners
- Comfortable padding

### Status Badges
- Rounded-full
- px-2.5 py-0.5
- Border matching background color
- Text-xs, font-medium

### Tables
- Clean borders
- Hover states
- Sortable headers
- Responsive overflow

## Page Structure
- Header (64px height)
- Sidebar (256px width)
- Main content area (flex-1)
- Footer (optional)
