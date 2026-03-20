# API Integration Checkpoint

Last updated: March 20, 2026

## Current Status

- We paused integration intentionally.
- `settings` route is already analyzed and documented in `API_ROUTE_FIELD_MAPPING.md`.
- Live verified endpoint:
  - `https://admin.theglobalavenues.com/public/api?route=settings`
- Verified returned fields:
  - `id, site_name, logo, favicon, email, phone, address, facebook, linkedin, instagram, twitter, updated_at`

## What Is Already Safe

- Frontend has fallback defaults in `src/config.js` if API values are empty/missing.
- Settings mapping logic is in `src/context/SettingsContext.jsx`.
- No runtime-breaking dependency on settings API completeness.

## Resume Plan (Do This Next Time)

Follow this exact order:

1. `settings` final confirm + backend clean values
2. `gallery`
3. `blog` list + `blog&post=...` detail
4. `offerings`
5. `portfolio`
6. `testimonials`
7. remaining APIs

## FileZilla Files To Open First (When Resuming)

1. `public/api/index.php`
2. `public/api/SettingsApi.php`
3. `public/api/GalleryApi.php`
4. `public/api/BlogApi.php`
5. `public/api/OfferingApi.php`
6. `public/api/PortfolioApi.php`
7. `public/api/TestimonialApi.php`
8. `public/api/response.php`
9. `public/api/header.php`
10. `public/api/cache.php`

## Quick Resume Commands

```powershell
curl.exe -sS -L "https://admin.theglobalavenues.com/public/api?route=settings"
curl.exe -sS -L "https://admin.theglobalavenues.com/public/api?route=gallery"
curl.exe -sS -L "https://admin.theglobalavenues.com/public/api?route=blog"
curl.exe -sS -L "https://admin.theglobalavenues.com/public/api?route=blog&post=test"
curl.exe -sS -L "https://admin.theglobalavenues.com/public/api?route=offerings"
curl.exe -sS -L "https://admin.theglobalavenues.com/public/api?route=portfolio"
curl.exe -sS -L "https://admin.theglobalavenues.com/public/api?route=testimonials"
```

## Paste This When You Return

Use this message to restart instantly:

`Resume API integration from API_INTEGRATION_CHECKPOINT.md. Continue from gallery route, keep fallback-safe mapping, and update API_ROUTE_FIELD_MAPPING.md after each route.`
