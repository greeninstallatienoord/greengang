# Visual assets

All website imagery is stored locally. Do not hotlink remote photos.

## Official brand

| File | Source | License / permission | Original URL | Local filename |
| --- | --- | --- | --- | --- |
| Wordmark + emblem | Supplied company artwork (`greeninstallatielogotransparant.png`) | Company-owned. Do not redraw. | Internal supply | `src/assets/images/branding/logo.png`, `public/logo.png` |
| Emblem crop | Derived from the official logo (left flame + gear only) | Same as official logo | — | `src/assets/images/branding/mark.png` |
| Favicon / apple-touch | Derived from the official emblem on a white square | Same as official logo | — | `public/favicon.ico`, `favicon-32.png`, `favicon-48.png`, `favicon-192.png`, `favicon-512.png`, `apple-touch-icon.png` |

Logo intrinsic size: 800 × 312. Always keep the aspect ratio. Header and footer use height-constrained `object-contain`.

## Generated editorial images

Created for this project with Cursor image generation. They are original files for Green Installatie Noord website use. They are **not** third-party stock and have no external download URL.

No manufacturer names or certificate marks were added to the pictures.

| Purpose | Local filename | Size after compress | Notes |
| --- | --- | --- | --- |
| Homepage hero | `src/assets/images/hero/home.jpg` | 1280 × 720, ~105 KB | Technician installing an indoor unit |
| CV-ketel | `src/assets/images/services/cv-ketel.jpg` | 1152 × 864, ~95 KB | Technical cupboard |
| Airco | `src/assets/images/services/airco.jpg` | 1152 × 864, ~112 KB | Bedroom indoor unit |
| Warmtepomp | `src/assets/images/services/warmtepomp.jpg` | 1152 × 864, ~241 KB | Outdoor unit, Dutch brick house |
| Service & onderhoud | `src/assets/images/services/onderhoud.jpg` | 1152 × 864, ~90 KB | Hands / gauges, no face |
| Blog: comfort | `src/assets/images/blog/comfort.jpg` | 1280 × 720, ~121 KB | Living room climate |
| Blog: tips | `src/assets/images/blog/tips.jpg` | 1280 × 720, ~81 KB | Notebook and indoor unit |
| OG base photo | `src/assets/images/social/og-base.jpg` | 1280 × 720 | Source plate for social image |

## Open Graph

| File | Source | License | URL | Local filename |
| --- | --- | --- | --- | --- |
| Social share | Generated house photo + official logo overlay | Company artwork + project-generated photo | — | `public/og-image.jpg` (1200 × 630, ~125 KB) |

Default SEO image: `/og-image.jpg`.

## How pages pick images

`src/data/media.ts` is the catalog. `MediaImage` is the shared renderer (aspect ratio, width/height, lazy load, fallback).

Blog thumbnails reuse the matching service photo, except:

- `energie-comfort` → `blog/comfort.jpg`
- `praktische-tips` → `blog/tips.jpg`

Contact uses the warmtepomp exterior as an **illustrative** Dutch house, not as a photo of the company street.

## Not used

- No Unsplash / Getty / random website downloads
- No third-party HVAC brand imagery
- `ImagePlaceholder` remains only as a fallback if a file fails to load
