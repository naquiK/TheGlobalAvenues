# Codebase Info and Editing Guide

This document is for anyone new to this project.  
Read this once, and you will know where code lives, how data flows, and how to safely edit content/layout without breaking the app.

---

## 1) Tech Stack

- React 19 + Vite
- Router: `react-router-dom`
- Styling: Tailwind CSS + shared tokens/utilities in `src/index.css`
- Animation: Framer Motion + custom hooks (`useScrollAnimation`, `useLazySection`)
- Icons: `lucide-react`
- Data sources:
  - Local fallback config/data files
  - API services in `src/services`

---

## 2) Runtime Architecture (Boot Flow)

App starts in this order:

1. `src/main.jsx`
2. `ThemeProvider` (`src/context/ThemeContext.jsx`)
3. `BrowserRouter`
4. `App` (`src/App.jsx`)
5. `SettingsProvider` (`src/context/SettingsContext.jsx`)
6. Shared layout shell:
   - `ScrollRestoration`
   - `Header`
   - routed page content
   - `Footer`

Key behavior:

- All route pages are lazy-loaded in `src/App.jsx`.
- `SettingsProvider` fetches settings API once and merges it with fallback values from `src/config.js`.
- `ScrollRestoration` restores scroll on browser refresh of same route, but scrolls to top on route navigation.

---

## 3) Folder Map (What Each Folder Does)

```txt
src/
  App.jsx                     # Route definitions + page lazy loading
  main.jsx                    # App entry
  config.js                   # Global fallback content (nav/contact/footer/stats)
  index.css                   # Theme tokens + shared classes + keyframes

  pages/                      # Route-level screens
  components/                 # Reusable UI sections/blocks
  context/                    # Global providers (theme/settings)
  hooks/                      # Reusable behavior hooks
  services/                   # API client + endpoint wrappers
  data/                       # Local structured content/fallback datasets
  utils/                      # Utility helpers
```

---

## 4) Route to Page Map

All routes are in `src/App.jsx`:

- `/` -> `src/pages/HomePage.jsx`
- `/about` -> `src/pages/AboutPage.jsx`
- `/services` -> `src/pages/ServicesPage.jsx`
- `/collaborate` -> `src/pages/CollaboratePage.jsx`
- `/universities` -> `src/pages/UniversitiesPage.jsx`
- `/gallery` -> `src/pages/GalleryPage.jsx`
- `/partners` -> `src/pages/PartnersPage.jsx`
- `/news-blog` -> `src/pages/NewsVlogPage.jsx`
- `/news/:id` -> `src/pages/NewsDetailPage.jsx`
- `/portfolio` -> `src/pages/PortfolioPage.jsx`
- `/portfolio/:id` -> `src/pages/PortfolioDetailPage.jsx`
- `/what-we-offer` -> `src/pages/WhatWeOfferPage.jsx`
- `/education-program` -> redirects to `/what-we-offer`
- `/education-program/:programType/:degreeLevel` -> `src/pages/EducationProgramPage.jsx`

---

## 5) Page Composition (Where Sections Come From)

### Home page (`src/pages/HomePage.jsx`)

Section order:

1. `src/components/home/HeroSection.jsx`
2. `src/components/home/UniversityTrustBar.jsx`
3. `src/components/ImageCarousel.jsx`
4. `src/components/Services.jsx`
5. `src/components/PortfolioSection.jsx`
6. `src/components/Testimonials.jsx`
7. `src/components/Contact.jsx`

All major sections are lazy-loaded with `Suspense`, and heavy sections are viewport-lazy via `useLazySection`.

### About page (`src/pages/AboutPage.jsx`)

- Fully section-based inside this page file.
- Team cards + accreditation + values are defined in this file.
- Uses `siteConfig` for stats fallback values.

### Collaborate page (`src/pages/CollaboratePage.jsx`)

- Form UI is local in page.
- Contact/team values come from `siteConfig` (`SettingsContext` + `config.js` fallback).

### API-driven pages

- Gallery: `src/pages/GalleryPage.jsx` -> `getGallery()`
- News list: `src/pages/NewsVlogPage.jsx` -> `getBlogList()`
- News detail: `src/pages/NewsDetailPage.jsx` -> `getBlogDetail(id)`
- Portfolio detail: `src/pages/PortfolioDetailPage.jsx` -> local portfolio + `getUniversityDetail(id)` merge

### Local-data pages

- `src/pages/WhatWeOfferPage.jsx` (program content currently hardcoded in this file)
- `src/pages/EducationProgramPage.jsx` (uses `src/data/educationProgramsData.js`)
- `src/pages/PartnersPage.jsx` (uses `src/data/partnersData.js`)
- `src/pages/UniversitiesPage.jsx` (uses `src/data/portfolioData.js` + global stats)

---

## 6) Where to Edit What (Quick Matrix)

- Global nav links, footer links, contact info, company text:
  - `src/config.js`
- Header structure/menu/hover prefetch:
  - `src/components/Header.jsx`
- Footer layout/content usage:
  - `src/components/Footer.jsx`
- Home section order:
  - `src/pages/HomePage.jsx`
- About team cards/content:
  - `src/pages/AboutPage.jsx`
- Collaborate form cards/contact blocks:
  - `src/pages/CollaboratePage.jsx`
- Offerings tabs/program content:
  - `src/pages/WhatWeOfferPage.jsx`
- Degree-wise program details:
  - `src/data/educationProgramsData.js`
- Partner logos and partner content:
  - `src/data/partnersData.js`
- University/portfolio local dataset:
  - `src/data/portfolioData.js`
- Global colors/tokens/shared animation classes:
  - `src/index.css`
- Theme behavior:
  - `src/context/ThemeContext.jsx`

---

## 7) API Layer and Fallback Logic

Core files:

- `src/services/apiClient.js`
  - `buildApiUrl(route, slug)`
  - `resolveMediaUrl(path)`
  - `fetchJson(url, options)`
- `src/services/contentApi.js`
  - `getSettings`
  - `getGallery`
  - `getBlogList`
  - `getBlogDetail`
  - `getTestimonials`
  - `getUniversityDetail`

Fallback pattern used in UI:

- Try API data
- If API fails or returns empty, use local defaults/fallback arrays/config
- Never leave UI blank by default

Global settings merge flow:

1. Fallback base from `src/config.js`
2. Runtime override from settings API via `src/context/SettingsContext.jsx`
3. Components read merged `siteConfig`

---

## 8) How to Reorder or Move Sections Safely

### Reorder sections on same page

1. Open target page file.
2. Move full section JSX blocks up/down.
3. Keep related hooks (`ref`, `isVisible`, animation refs) with that block.
4. Keep lazy wrappers (`Suspense`, `SectionSkeleton`, `useLazySection`) intact.

### Move a section to another page

1. Extract section to `src/components/...` as its own component.
2. Import it in destination page (prefer lazy import for heavy sections).
3. If it uses page-local state/hooks, move those dependencies into the section component too.
4. Verify scroll/animations still trigger correctly.

---

## 9) How to Add New Page/Route

1. Create new page in `src/pages/NewPage.jsx`.
2. Add lazy import in `src/App.jsx`.
3. Add route in `<Routes>`.
4. Add nav item in `src/config.js` if needed.
5. Add prefetch mapping in `src/components/Header.jsx` `preloadRoute()` for hover preload.

---

## 10) Light/Dark Mode System

- Theme provider: `src/context/ThemeContext.jsx`
- Toggle UI: `src/components/ui/ThemeToggle.jsx` (used inside `src/components/Header.jsx`)
- The root `dark` class is set on `<html>`.
- Theme values are persisted in `localStorage` key `tga-theme`.
- Most color values are semantic classes (`bg-background`, `text-foreground`, etc.) backed by `src/index.css`.

---

## 11) Performance Features Already in Project

- Route-level code splitting in `src/App.jsx` via `React.lazy`.
- Home/About/Collaborate heavy section lazy reveal via `useLazySection`.
- Suspense fallback components:
  - `src/components/ui/PageLoader.jsx`
  - `src/components/ui/SectionSkeleton.jsx`
- Route preloading on nav hover in `src/components/Header.jsx`.
- `loading="lazy"` and `decoding="async"` on images in most places.

---

## 12) Unused/Legacy Components (Safe to Ignore Unless Reused)

These exist in `src/components` but are not used by current routes:

- `src/components/About.jsx`
- `src/components/CTA.jsx`
- `src/components/EducationSpotlight.jsx`
- `src/components/Hero.jsx`
- `src/components/Navigation.jsx`
- `src/components/ParallaxSection.jsx`
- `src/components/Portfolio.jsx`
- `src/components/PortfolioPreview.jsx`
- `src/components/Process.jsx`
- `src/components/ScrollToTop.jsx`

Do not delete them unless you first confirm no future dependency.

---

## 13) Media and Static Assets

- Public assets live in `public/`.
- Team images: `public/team/*`
- Hero video/poster:
  - `public/videos/hero.mp4`
  - `public/videos/hero-poster.png`
- Logos and general images are referenced by absolute `/...` paths in components/config.

---

## 14) Safe Working Checklist (Before Push)

1. `npm run lint`
2. `npm run build`
3. Test key routes manually:
   - Home, About, Collaborate, Portfolio list/detail, News list/detail, Gallery
4. Verify:
   - light mode
   - dark mode
   - mobile layout
   - desktop layout
   - route scroll behavior
5. Check browser console for runtime errors

---

## 15) If You Are New and Need Fast Start

Start with these 5 files first:

1. `src/App.jsx` (routing + page loading)
2. `src/config.js` (global content defaults)
3. `src/pages/HomePage.jsx` (homepage section order)
4. `src/components/Header.jsx` (navigation + prefetch)
5. `src/context/SettingsContext.jsx` (API setting overrides + fallback merge)

Once these are clear, the rest of the project becomes easy to edit.
