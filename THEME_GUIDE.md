# Theme Customization Guide

This project includes a comprehensive theme system that allows you to customize colors, fonts, spacing, and more from the admin panel.

## Admin Configuration

### Accessing Theme Settings

1. Log in to the admin panel at `/admin`
2. Navigate to **Configuration > Site Settings**
3. Click on the **Theme** tab

### Theme Options

#### 1. Color Scheme

Customize all primary colors using hex codes:

- **Primary Color** - Main brand color (buttons, links, accents)
- **Secondary Color** - Secondary accent color
- **Accent Color** - Highlight/accent color
- **Success Color** - Success states and notifications
- **Warning Color** - Warning states
- **Error Color** - Error states and validation
- **Background Color** - Main page background
- **Secondary Background** - Alternative background (cards, sections)
- **Text Color** - Primary text color
- **Secondary Text Color** - Muted/secondary text
- **Border Color** - Default border color

**Example:** Change primary from `#2563eb` (blue) to `#7c3aed` (purple) for a purple theme.

#### 2. Typography

- **Font Family** - Body text font (Inter, Roboto, Poppins, etc.)
- **Heading Font Family** - Headings font (can be different from body)
- **Base Font Size** - Root font size (14-20px)
- **Line Height** - Text line height (1.2-2.0)
- **Heading Weight** - Font weight for headings (400-900)

**Available Fonts:**
- Modern Sans: Inter, Roboto, Poppins, Montserrat, DM Sans
- Classic: Open Sans, Lato, Source Sans Pro, Work Sans
- Elegant: Raleway, Nunito, Space Grotesk
- Serif: Playfair Display, Merriweather

#### 3. Spacing & Layout

- **Max Container Width** - Page content width (1200px - Full Width)
- **Border Radius Style** - Corner roundness (None to Extra Rounded)
- **Shadow Style** - Drop shadow intensity (None to Dramatic)

#### 4. Button Styles

- **Button Style** - Solid, Gradient, Outline, or Ghost
- **Button Border Radius** - Sharp to Pill-shaped

#### 5. Animation Settings

- **Enable Animations** - Toggle all page animations
- **Animation Speed** - Fast (200ms), Normal (300ms), or Slow (500ms)

## Using Theme in Code

### CSS Custom Properties

The theme system generates CSS custom properties that you can use anywhere:

```css
.my-component {
  /* Colors */
  color: var(--color-primary);
  background-color: var(--color-background);
  border-color: var(--color-border);

  /* Typography */
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: var(--line-height);

  /* Spacing */
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);

  /* Animations */
  transition-duration: var(--animation-speed);
}
```

### Utility Classes

Pre-built utility classes for common patterns:

```html
<!-- Colors -->
<div class="theme-primary">Primary color text</div>
<div class="theme-bg-primary">Primary background</div>
<div class="theme-text">Theme text color</div>
<div class="theme-bg-secondary">Secondary background</div>

<!-- Gradients -->
<div class="gradient-text">Gradient text (primary → secondary)</div>
<div class="bg-theme-gradient">Gradient background</div>

<!-- Borders & Shadows -->
<div class="theme-rounded">Theme border radius</div>
<div class="shadow-theme">Theme shadow</div>

<!-- Transitions -->
<div class="transition-base">Uses theme animation speed</div>
```

### React Hook

Access theme settings in React components:

```tsx
import { useTheme } from '@/contexts/ThemeContext'

function MyComponent() {
  const { theme, loading } = useTheme()

  if (loading) return <div>Loading theme...</div>

  return (
    <div style={{
      backgroundColor: theme.colors.primary,
      fontFamily: theme.typography.fontFamily
    }}>
      Themed content
    </div>
  )
}
```

## Examples

### Example 1: Purple Theme

In admin Theme settings:
- Primary Color: `#7c3aed`
- Secondary Color: `#a78bfa`
- Accent Color: `#c084fc`

### Example 2: Dark Professional

- Primary Color: `#1e293b`
- Secondary Color: `#334155`
- Background: `#0f172a`
- Text Color: `#f1f5f9`

### Example 3: Warm & Friendly

- Primary Color: `#f59e0b`
- Secondary Color: `#fbbf24`
- Font Family: Nunito
- Border Radius: Large

## Best Practices

1. **Color Contrast** - Ensure sufficient contrast between text and background colors
2. **Font Pairing** - Use complementary fonts for body and headings
3. **Consistency** - Use theme variables instead of hardcoded colors
4. **Testing** - Test theme changes across all pages
5. **Performance** - Limit font families to 2-3 to reduce load time

## Troubleshooting

### Fonts Not Loading

If custom fonts aren't appearing:
1. Check browser console for font loading errors
2. Verify font name matches exactly in Theme settings
3. Clear browser cache and reload

### Colors Not Updating

1. Ensure you saved changes in admin panel
2. Hard refresh the page (Ctrl/Cmd + Shift + R)
3. Check browser DevTools to verify CSS variables are set

### Animation Issues

If animations are too slow/fast:
1. Adjust Animation Speed in Theme settings
2. Or disable animations entirely for accessibility

## Revert to Defaults

To reset theme to defaults:
1. Go to Admin > Site Settings > Theme
2. Delete values from fields (they'll use defaults)
3. Save changes

Default theme matches the original design:
- Primary: Blue (#2563eb)
- Font: Inter
- Border Radius: Medium
- Shadows: Medium
