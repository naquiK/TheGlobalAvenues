# The Global Avenues - Redesigned Website

## 🎨 Design Overview

This is a complete redesign of The Global Avenues website with modern UI/UX, smooth animations, and professional aesthetics suitable for international education recruitment.

### Key Features:

✨ **Animated Design Elements**
- Scroll-triggered animations on all sections
- Parallax effects for floating elements
- Smooth fade-in, slide-up, and scale animations
- Staggered animations for list items

🌙 **Dark & Light Mode**
- Automatic theme detection based on system preferences
- Toggle button in header for manual switching
- Persistent theme storage using localStorage
- Optimized colors for both modes

📱 **Responsive Design**
- Mobile-first approach
- Fully responsive across all screen sizes
- Touch-friendly interactive elements
- Optimized navigation for mobile

🎯 **Professional Sections**
1. **Hero Section** - Eye-catching introduction with call-to-actions
2. **Services** - 6 comprehensive service offerings with hover effects
3. **About** - Detailed information with step-by-step support guide
4. **Testimonials** - Carousel with client feedback
5. **Contact** - Form with location and communication details
6. **Footer** - Newsletter signup and comprehensive links
7. **Portfolio Brochure Cards** - Official university PDFs with extracted brochure imagery, responsive cards, and explicit view/download actions

## 🛠️ Technical Stack

- **React 19** - Latest React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Advanced animation library (optional)

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx           # Navigation header with dark mode toggle
│   ├── Hero.jsx             # Hero section with animations
│   ├── Services.jsx         # Services grid with hover effects
│   ├── About.jsx            # About section with step-by-step guide
│   ├── Testimonials.jsx     # Testimonials carousel
│   ├── Contact.jsx          # Contact form and information
│   ├── Footer.jsx           # Footer with links and newsletter
│   ├── ScrollToTop.jsx      # Floating scroll-to-top button
│   └── ParallaxSection.jsx  # Parallax scroll component
├── context/
│   └── ThemeContext.jsx     # Dark/light mode context
├── hooks/
│   └── useScrollAnimation.js # Scroll visibility hook
├── App.jsx                  # Main application component
└── index.css                # Global styles and animations
```

## 🎨 Color Theme

**Light Mode:**
- Primary: Royal Blue (#2196F3)
- Secondary: Steel Blue (#283593)
- Accent: Amber (#FFEB3B)
- Background: White (#FFFFFF)
- Foreground: Dark Blue (#141428)

**Dark Mode:**
- Primary: Sky Blue (#3BA9FF)
- Secondary: Light Blue (#4A90E2)
- Accent: Amber (#FFEB3B)
- Background: Dark Blue (#1A1F3A)
- Foreground: Near White (#F0F0F0)

## ⚡ Animation Features

### Scroll-Triggered Animations
- Elements animate when they enter the viewport
- Uses Intersection Observer API for performance
- Configurable animation styles (fade-in-up, fade-in-left, etc.)

### Pre-built Animation Classes
- `animate-fade-in-up` - Fades in while moving up
- `animate-fade-in-down` - Fades in while moving down
- `animate-fade-in-left` - Fades in from left
- `animate-fade-in-right` - Fades in from right
- `animate-scale-in` - Fades in with scale effect
- `animate-float` - Continuous floating motion
- `animate-glow` - Glowing shadow effect

### Staggered Animations
- Sequential animations with `.stagger-1` to `.stagger-6` classes
- Creates cascading effect for lists and grids

## 🚀 Getting Started

### Installation

1. Extract the project files
2. Install dependencies:
```bash
npm install
# or
pnpm install
```

### Development

Start the development server:
```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
pnpm build
```

## 🎯 Customization

### Changing Colors

Edit the CSS variables in `src/index.css` in the `:root` and `.dark` sections:

```css
:root {
  --primary: 210 100% 45%;
  --secondary: 200 40% 35%;
  --accent: 45 100% 50%;
  /* ... more colors ... */
}
```

### Modifying Animations

All animations are defined in `src/index.css` using `@keyframes`. You can customize:
- Duration (currently 0.6s)
- Easing (currently ease-out)
- Transform values (currently 30px)

### Adding New Sections

1. Create a new component in `src/components/`
2. Use the `useScrollAnimation` hook for scroll effects
3. Import and add to `App.jsx`

## 📞 Content Areas to Update

Replace the following with your actual content:
- Company details in Header
- Contact information in Contact section
- Service descriptions in Services section
- Testimonials in Testimonials component
- Social media links in Footer

### Portfolio Brochure PDFs

University brochure metadata lives in `src/data/portfolioData.js` under each profile's `details.catalogs` array. Static PDF and extracted brochure image assets live under `public/universities/<university-slug>/brochures/`.

Current brochure assets:
- `public/universities/estonian-entrepreneurship-university-of-applied-sciences/brochures/euas-english-booklet-business-it-design.pdf`
- `public/universities/mjm-graphic-design/brochures/mjm-paris-london-international-programmes.pdf`
- `public/universities/mjm-graphic-design/brochures/mjm-international-master-interior-architecture-eco-design-management.pdf`

Security note: the app exposes PDFs as static public files, so a lead form cannot securely block access without a backend or trusted form service. The current implementation keeps safe browser behavior with `noopener noreferrer` for PDF viewing and browser-native download links.

## 🌐 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

All components are optimized for these breakpoints using Tailwind's responsive prefixes.

## 🎬 Animation Performance

- Uses CSS animations for better performance
- Intersection Observer API for efficient scroll detection
- RequestAnimationFrame for smooth parallax effects
- Minimal re-renders with optimized hook usage

## 📝 Notes

- All animations respect user's `prefers-reduced-motion` preference (can be added)
- Loading is optimized with code splitting
- No external API dependencies for basic functionality
- SEO-friendly structure with semantic HTML

---

**Created with ❤️ for The Global Avenues**
