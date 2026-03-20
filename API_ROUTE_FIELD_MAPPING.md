# API Route and Field Mapping (Frontend <-> PHP API)

Last updated: March 20, 2026  
Focus now: **Step 1 - `settings` API only** (as requested)

---

## 1) Live `settings` API response (verified)

Endpoint:

`https://admin.theglobalavenues.com/public/api?route=settings`

Live response snapshot:

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "id": 1,
    "site_name": "The Global Avenues",
    "logo": "",
    "favicon": "",
    "email": "",
    "phone": "",
    "address": "",
    "facebook": "",
    "linkedin": "",
    "instagram": "",
    "twitter": "",
    "updated_at": "2026-03-15 18:42:36"
  }
}
```

Exact keys currently returned by backend:

- `id`
- `site_name`
- `logo`
- `favicon`
- `email`
- `phone`
- `address`
- `facebook`
- `linkedin`
- `instagram`
- `twitter`
- `updated_at`

---

## 2) How to get fields quickly (for future checks)

### Browser

Open:

`https://admin.theglobalavenues.com/public/api?route=settings`

### Terminal (Windows PowerShell)

```powershell
curl.exe -sS -L "https://admin.theglobalavenues.com/public/api?route=settings"
```

### Quick field-only view

```powershell
$r = curl.exe -sS -L "https://admin.theglobalavenues.com/public/api?route=settings" | ConvertFrom-Json
$r.data | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name
```

---

## 3) Frontend files that consume `settings`

Main fetch + mapping layer:

- `src/services/contentApi.js` -> `getSettings()`
- `src/context/SettingsContext.jsx` -> fetch + transform + fallback merge
- `src/config.js` -> default fallback values (`SITE_CONFIG`)

UI files using mapped `siteConfig`:

- `src/components/Header.jsx`
- `src/components/Footer.jsx`
- `src/pages/AboutPage.jsx`
- `src/pages/CollaboratePage.jsx`
- `src/pages/UniversitiesPage.jsx`

---

## 4) What frontend can map from settings (accepted aliases)

From `src/context/SettingsContext.jsx`:

- Company name: `site_name`, `company_name`, `name`
- Tagline: `tagline`, `site_tagline`, `slogan`
- Description: `description`, `site_description`, `about`
- Light logo: `logo_light`, `logo`, `site_logo`, `logo_white`
- Dark logo: `logo_dark`, `logo_dark_mode`, `logo_black`
- Phones: `phones`, `phone`, `contact_phone`, `mobile`
- General email: `email`, `contact_email`, `general_email`, `site_email`
- Admissions email: `admissions_email`, `admission_email`
- Partnerships email: `partnerships_email`, `partners_email`
- Address line: `address`, `address_line1`, `street`, `office_address`
- Address meta: `city`, `state`, `country`, `zipcode`, `zip`, `postal_code`
- Social:
  - `facebook`, `facebook_url`
  - `linkedin`, `linkedin_url`
  - `youtube`, `youtube_url`
  - `instagram`, `instagram_url`
  - `twitter`, `twitter_url`, `x`, `x_url`
  - `whatsapp`, `whatsapp_url`
- Stats:
  - `students_recruited`, `students`, `students_placed`
  - `partner_universities`, `universities`
  - `countries_covered`, `countries`
  - `visa_success_rate`, `visa_success`

---

## 5) Current `settings` field -> frontend mapping status

| API Field | Frontend Reads? | Mapped To | Notes |
|---|---|---|---|
| `id` | No | - | informational only |
| `site_name` | Yes | `siteConfig.company.name` | active |
| `logo` | Yes | `siteConfig.company.logo.lightSrc` | active |
| `favicon` | No | - | not wired in frontend yet |
| `email` | Yes | `siteConfig.contact.email.general` | active |
| `phone` | Yes | `siteConfig.contact.phone` | active |
| `address` | Yes | `siteConfig.contact.address.street` | active |
| `facebook` | Yes | `siteConfig.social.facebook` | stored; currently not rendered as clickable link in footer |
| `linkedin` | Yes | `siteConfig.social.linkedin` | stored; currently not rendered as clickable link in footer |
| `instagram` | Yes | `siteConfig.social.instagram` | stored; currently not rendered as clickable link in footer |
| `twitter` | Yes | `siteConfig.social.twitter` | stored; currently not rendered as clickable link in footer |
| `updated_at` | No | - | informational only |

---

## 6) Where mapped values appear in UI

### Header (`src/components/Header.jsx`)

- `siteConfig.company.logo.lightSrc`
- `siteConfig.company.logo.darkSrc`
- `siteConfig.navigation.*` (from local config; not from settings API)

### Footer (`src/components/Footer.jsx`)

- `siteConfig.company.name`
- `siteConfig.company.description`
- `siteConfig.company.logo.*`
- `siteConfig.contact.email.general`
- `siteConfig.contact.phone[0]`
- `siteConfig.contact.address`

### About (`src/pages/AboutPage.jsx`)

- `siteConfig.stats.partnerUniversities`
- `siteConfig.stats.countriesCovered`
- `siteConfig.stats.studentsRecruited`

### Collaborate (`src/pages/CollaboratePage.jsx`)

- `siteConfig.contact.phone`
- `siteConfig.contact.email.general`
- `siteConfig.contact.address`
- `siteConfig.stats.*`
- `siteConfig.social.whatsapp`

### Universities (`src/pages/UniversitiesPage.jsx`)

- `siteConfig.stats.partnerUniversities`
- `siteConfig.stats.studentsRecruited`
- `siteConfig.stats.visaSuccessRate`

---

## 7) Fallback behavior (very important)

If `settings` API fails OR any field is empty:

1. App keeps defaults from `src/config.js` (`SITE_CONFIG`)
2. Empty strings from API are ignored by mapper
3. Only valid non-empty values override defaults
4. UI remains stable (no blank content crash)

---

## 8) What to open in FileZilla for `settings` route

Start with these backend files:

1. `public/api/index.php` (or route entry file handling `route=settings`)
2. `public/api/SettingsApi.php` (or `public/api/controllers/SettingsApi.php`)
3. `public/api/config.php`
4. `public/api/header.php`
5. `public/api/response.php`
6. `public/api/cache.php`

Check these points inside `SettingsApi.php`:

- SQL query field list (`SELECT ... FROM settings`)
- response shape uses `ApiResponse::success($data)` style
- ensure field names match frontend mapper aliases above
- avoid returning empty strings for critical fields when DB has data

---

## 9) Integration order we will follow next

As discussed, we will proceed in this order:

1. `settings` (current)
2. `gallery`
3. `blog` + `blog&post=...`
4. `offerings`
5. `portfolio`
6. `testimonials`
7. then remaining APIs

---

## 10) Immediate next action for you

From FileZilla, open `SettingsApi.php` and share:

- SQL `SELECT` part
- final response block (where `$data` is returned)

Then I will give you exact backend edits (if needed) and exact frontend field replacement map line-by-line.
