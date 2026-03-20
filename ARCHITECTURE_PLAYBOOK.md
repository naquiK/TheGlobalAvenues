# Architecture Playbook

This document is the practical map of this codebase for anyone new to the project.
It explains where things live, how they connect, and exactly how to edit safely.

---

## 1) Stack and Build

- Framework: React 19
- Router: `react-router-dom`
- Build tool: Vite
- Styling: Tailwind CSS + global CSS tokens in `src/index.css`
- Icons: `lucide-react`
- Motion: custom hooks + Framer Motion (still used in many pages)

Primary commands:

```bash
npm install
npm run dev
npm run lint
npm run build
```

---

## 2) Runtime Hierarchy (How App Boots)

Render tree order:

1. `src/main.jsx`
2. `ThemeProvider` from `src/context/ThemeContext.jsx`
3. `BrowserRouter`
4. `App` from `src/App.jsx`
5. `SettingsProvider` from `src/context/SettingsContext.jsx`
6. Layout shell: `ScrollRestoration -> Header -> Routes -> Footer`

Important behavior:

- Theme is controlled by `ThemeProvider` (`light`/`dark` class on `<html>`).
- Site settings are fetched once by `SettingsProvider` and merged with fallback config.
- `ScrollRestoration` currently does:
  - normal route navigation: scroll to top
  - browser refresh on same path: restore previous scroll position

---

## 3) Folder Architecture

```text
src/
  App.jsx                    # Route wiring + page lazy loading
  main.jsx                   # App entry
  config.js                  # Fallback company/contact/nav config
  index.css                  # Global tokens, utility classes, animations

  components/
    Header.jsx               # Navbar, dropdowns, route prefetch on hover
    Footer.jsx               # Footer links/contact/social area
    ScrollRestoration.jsx    # Route/reload scroll behavior
    ImageCarousel.jsx        # Home section
    Services.jsx             # Home section (named export)
    PortfolioSection.jsx     # Home section -> PortfolioDisplay
    Testimonials.jsx         # Home section (API + fallback)
    Contact.jsx              # Home section
    home/
      HeroSection.jsx        # Hero video + stats + mount animation
      UniversityTrustBar.jsx # Scrolling trust strip
    ui/
      PageLoader.jsx
      SectionSkeleton.jsx
      ThemeToggle.jsx

  pages/
    HomePage.jsx
    AboutPage.jsx
    CollaboratePage.jsx
    WhatWeOfferPage.jsx
    EducationProgramPage.jsx
    PortfolioPage.jsx
    PortfolioDetailPage.jsx
    UniversitiesPage.jsx
    GalleryPage.jsx
    PartnersPage.jsx
    NewsVlogPage.jsx
    NewsDetailPage.jsx
    ServicesPage.jsx

  context/
    ThemeContext.jsx
    SettingsContext.jsx

  hooks/
    useTheme.js
    useScrollAnimation.js
    useLazySection.js

  services/
    apiClient.js
    contentApi.js
    portfolioService.js

  data/
    educationProgramsData.js
    portfolioData.js
    partnersData.js
    newsData.js              # currently not used by routed pages
```

---

## 4) Route Map

Defined in `src/App.jsx` (all route pages are lazy-loaded).

| Route | Page File | Notes |
|---|---|---|
| `/` | `src/pages/HomePage.jsx` | Home sections are also lazy-loaded per section |
| `/about` | `src/pages/AboutPage.jsx` | Includes lazy heavy sections |
| `/collaborate` | `src/pages/CollaboratePage.jsx` | Includes lazy heavy sections |
| `/services` | `src/pages/ServicesPage.jsx` | Static page data inside file |
| `/what-we-offer` | `src/pages/WhatWeOfferPage.jsx` | Program content object inside page |
| `/education-program/:programType/:degreeLevel` | `src/pages/EducationProgramPage.jsx` | Driven by `educationProgramsData.js` |
| `/education-program` | redirect | Redirects to `/what-we-offer` |
| `/portfolio` | `src/pages/PortfolioPage.jsx` | Uses `portfolioService` |
| `/portfolio/:id` | `src/pages/PortfolioDetailPage.jsx` | Merges local + API detail |
| `/universities` | `src/pages/UniversitiesPage.jsx` | Uses `portfolioData` |
| `/gallery` | `src/pages/GalleryPage.jsx` | Uses gallery API |
| `/partners` | `src/pages/PartnersPage.jsx` | Uses `partnersData` |
| `/news-blog` | `src/pages/NewsVlogPage.jsx` | Uses blog list API |
| `/news/:id` | `src/pages/NewsDetailPage.jsx` | Uses blog detail API |

---

## 5) Data Flow (Where Content Comes From)

### 5.1 Global fallback config

Edit `src/config.js` for:

- company name/tagline/logo
- phone/email/address
- nav labels and paths
- footer groups
- collaborate team cards

### 5.2 Runtime settings override

`src/context/SettingsContext.jsx` fetches API settings (`getSettings`) and overlays fallback config.
So if API returns values, those can replace local defaults.

### 5.3 API-based pages/components

- `GalleryPage` -> `getGallery()`
- `NewsVlogPage` -> `getBlogList()`
- `NewsDetailPage` -> `getBlogDetail()`
- `Testimonials` component -> `getTestimonials()` with local fallback
- `PortfolioDetailPage` -> `getUniversityDetail()` + `portfolioService`

### 5.4 Local data files

- `src/data/portfolioData.js`
- `src/data/educationProgramsData.js`
- `src/data/partnersData.js`

These are best for quick content updates when not API-driven.

---

## 6) Page Hierarchy (Section Order)

### Home (`src/pages/HomePage.jsx`)

Order:

1. `HeroSection`
2. `UniversityTrustBar`
3. `ImageCarousel`
4. `Services`
5. `PortfolioSection`
6. `Testimonials`
7. `Contact`

### About (`src/pages/AboutPage.jsx`)

Order:

1. Hero intro
2. Stats
3. Story + Promise
4. Core Values (lazy)
5. Leadership & Team (lazy)
6. Recognition / Accreditation (lazy)

### Collaborate (`src/pages/CollaboratePage.jsx`)

Order:

1. Hero
2. Form + Contact cards
3. Collaboration flow (lazy)
4. Team contact cards (lazy)
5. WhatsApp CTA

For most other pages, sections are self-contained in the page file and follow comments like `Hero Section`, `Content Section`, `CTA Section`.

---

## 7) Edit Playbook (Most Common Tasks)

### A) Change company info, nav, phone, footer links

1. Edit `src/config.js` (fallback source of truth).
2. If API is overriding and you still see old values, update backend settings response too.

### B) Change logo/video/images

- Logos: update paths in `src/config.js`, ensure files exist in `public/`.
- Hero video: `public/videos/hero.mp4` and `public/videos/hero-poster.png` used by `src/components/home/HeroSection.jsx`.
- Team photos: `public/team/*` referenced by `src/pages/AboutPage.jsx`.

### C) Reorder sections on a page

For Home:

1. Open `src/pages/HomePage.jsx`.
2. Move the JSX blocks in the new order.
3. Keep matching `ref` + `isVisible` pairs with their section block.
4. Keep `Suspense` + `SectionSkeleton` wrappers intact.

For About/Collaborate:

1. Open corresponding page file.
2. Move full section blocks (`<section ...>...</section>` or lazy wrapper `<div ref=...>` blocks).
3. Preserve local hook refs used by that section.

### D) Add a new page route

1. Create `src/pages/NewPage.jsx`.
2. Add lazy import in `src/App.jsx`:

```jsx
const NewPage = lazy(() => import('./pages/NewPage'));
```

3. Add route in `<Routes>`.
4. Add nav link in `src/config.js` if needed.
5. Update `preloadRoute` mapping in `src/components/Header.jsx` for hover prefetch.

### E) Move a section from one page to another

Best practice:

1. Extract that section into `src/components/...` if reusable.
2. Import lazily in both page(s) if it is heavy.
3. Wrap in `<Suspense fallback={<SectionSkeleton .../>}>`.
4. If section has expensive content, add `useLazySection()` wrapper.

### F) Change theme colors globally

1. Edit CSS tokens in `src/index.css` under `:root` and `html.dark`.
2. Tailwind semantic mapping is in `tailwind.config.js`.
3. Re-run build and manually test both modes.

### G) Change page text quickly

- Home text is mostly inside section components under `src/components/`.
- About text is in `src/pages/AboutPage.jsx`.
- Collaborate text is in `src/pages/CollaboratePage.jsx`.
- What We Offer text is in `programsData` object inside `src/pages/WhatWeOfferPage.jsx`.

---

## 8) Performance Features Already Implemented

- Route-level lazy loading in `src/App.jsx`.
- Section-level lazy loading on heavy areas (`useLazySection`) in Home/About/Collaborate.
- Suspense fallbacks: `PageLoader` and `SectionSkeleton`.
- Navigation hover prefetch in `src/components/Header.jsx`.
- Image lazy loading attributes are broadly applied.
- Vendor chunk splitting in `vite.config.js` (`node_modules` -> `vendor`).

---

## 9) Important Guardrails

- Do not reintroduce manual chunk splits for `src/pages` / `src/components` in Vite without deep testing.  
  This previously caused production blank screen (`createContext` runtime error).
- Keep `ScrollRestoration` in `App.jsx`; removing it changes the route/reload behavior.
- If a new nav route is added but missing in `Header.jsx` `preloadRoute`, the page still works, but hover prefetch will not.

---

## 10) Environment Variables

Supported variables:

- `VITE_API_BASE_URL` (content API base with route support)
- `VITE_API_MEDIA_BASE_URL` (media host base)
- `VITE_API_URL` (portfolio service backend URL if mock mode disabled)

Files reading them:

- `src/services/apiClient.js`
- `src/services/portfolioService.js`

---

## 11) QA Checklist Before Push

1. Run `npm run lint`
2. Run `npm run build`
3. Test routes in browser:
   - Home, About, Collaborate, Portfolio list/detail, News list/detail, Gallery
4. Test:
   - Light and dark mode
   - Mobile and desktop
   - Hero video load/play
   - Scroll behavior (navigate vs refresh)
5. Deploy preview and check console for runtime errors.

---

## 12) Fast Onboarding Summary

If you only remember 5 files, remember these:

1. `src/App.jsx` -> routing + page loading
2. `src/config.js` -> global content defaults (nav/contact/footer)
3. `src/pages/HomePage.jsx` -> homepage section order
4. `src/components/Header.jsx` -> menus + prefetch
5. `src/index.css` -> global design tokens and shared style behavior

