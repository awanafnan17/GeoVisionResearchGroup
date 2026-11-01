# Geo Vision Research Group & GeoSentry: Editorial Swiss Design System

## 1. Audit of Previous Interface & Identified Weaknesses

Before this redesign (archived at Git tag `pre-redesign-checkpoint` / commit `be57003`, with baseline screenshots preserved in `screenshots/before/`), the frontend exhibited several generic AI/SaaS template characteristics:
1. **Repetitive Dark SaaS Card Grids**: Services, Team, Courses, Portfolio, and Blog relied on uniform `rounded-2xl` dark navy cards with identical border treatments, glowing hover shadows (`glow-gold`), and pill badges (`rounded-full`).
2. **Decorative 3D / Floating Effects**: The homepage hero and login screen relied on floating particle/crystal canvases, animated pulsing rings, and gradient text clips (`bg-gradient-to-r from-geo-gold via-geo-gold-light to-geo-gold`) rather than typographic authority and authentic geological imagery.
3. **Lack of Editorial Rhythm & Surface Contrast**: Every public page shared the same continuous `#0B1929` dark background without alternating warm stone/alabaster (`#F6F4EF`) editorial reading surfaces, Swiss hairline dividers, or asymmetric column layouts.
4. **Uniform Section Structures**: Internal pages (About, Services, Courses, Portfolio, Blog) repeated centered eyebrow + centered title + 3-column rounded cards rather than purpose-built layouts (monograph index tables, syllabus ledgers, technical field dossiers, and academic journal layouts).
5. **Generic Admin Template Portals**: The five role portals used heavy rounded cards and glowing accents instead of crisp, high-density enterprise research software conventions (tabular numerals, subtle 1px borders, structured ledger headers, and refined status indicators).

---

## 2. Reference Repository Study & Licensing Audit

| Repository | License | Legal Status | Extracted Architectural & Design Principles |
| :--- | :--- | :--- | :--- |
| [`chrhi/studio`](https://github.com/chrhi/studio) | **MIT License** | Permissive; patterns and primitives may be reused | Two-segment architectural hairline rules (`Border` with a 24px solid lead segment followed by a 1px muted rule), asymmetric `PageIntro` / `SectionIntro` headers with `[text-wrap:balance]`, and left-bordered `GridList` / `List` structures instead of boxed cards. |
| [`once-ui-system/nextjs-starter`](https://github.com/once-ui-system/nextjs-starter) | **MIT License** | Permissive; token structure may be reused | Semantic separation of typography roles (`heading`, `body`, `label`, `code`), flat high-contrast surface hierarchy, and subdued 11px monospace chart/axis labeling. |
| [`Afeng01/paperframe`](https://github.com/Afeng01/paperframe) | **MIT License** | Permissive; layout patterns may be reused | Quiet editorial publication rhythm: top metadata hairline bars (`flex items-baseline gap-4 text-[11px] uppercase tracking-[0.24em]` with `<span className="h-px flex-1" />`), 3-column monospace metadata ledgers beneath headlines (`grid-cols-3 border-t pt-6`), and borderless editorial story grids. |
| [`m90khan/07-meridian-advisory`](https://github.com/m90khan/07-meridian-advisory) | **No License** (All Rights Reserved) | **Visual study only; no code or assets copied** | High-contrast editorial serif paired with geometric humanist sans-serif and monospace coordinates, numbered capability indexes (`01` to `06`), and alternating warm stone and deep obsidian sections. |

---

## 3. Art Direction & Brand Positioning

- **Brand Positioning**: Geo Vision Research Group is an international geological research institute, geoscience consultancy, and mineral exploration advisory practice. **GeoSentry** is its institutional desktop geological screening and capital-allocation intelligence system.
- **Design Ethos**:
  - **Editorial Swiss Grid**: Visible `1px` architectural hairlines, asymmetric 12-column proportions (e.g., 4/8 and 5/7 splits), numbered index markers (`01`, `02`, `03`), and geographic/cartographic metadata coordinates (`23°35'N 58°24'E`, `SCALE 1:25,000`).
  - **Luxury Through Restraint**: Zero neon glows, zero floating 3D toys, zero emoji icons, zero gradient text clips. Antique brass/gold (`#B8964A`) is used sparingly as a precision instrument marker, active rule, or primary action accent.
  - **Surface Alternation**: Public pages alternate between **Deep Mineral Obsidian** (`#0B1320` / `#101A2B`) for monumental hero and technical intelligence sections and **Warm Alabaster Stone** (`#F6F3EC` / `#EFECE4`) for long-form editorial reading, case dossiers, and academic clarity.

---

## 4. Typography System (`next/font/google`)

1. **Editorial Display Serif (`Instrument Serif`):** `--font-playfair` / `font-heading`
   - Used for primary page headlines (`h1`), major section titles (`h2`), pull quotes, and monograph numerals.
   - Tight tracking (`tracking-[-0.02em]`), crisp line-height (`leading-[1.02]` to `leading-[1.1]`), with italic emphasis for key geological or editorial concepts.
2. **Contemporary Geometric Humanist Sans (`Manrope`):** `--font-inter` / `font-sans`
   - Used for body copy, navigation, tables, form controls, and portal interfaces.
   - Clean, highly legible across dense technical tables and long-form reports.
3. **Technical & Cartographic Monospace (`JetBrains Mono`):** `--font-mono` / `font-mono`
   - Used for section index numbers (`INDEX // 01`), specimen reference codes (`GS-2026-0001`), UTM/lat-long coordinates, scoring metrics (`72 / 100`), and financial/statistical tables (`tabular-nums`).

---

## 5. Color Palette

| Token Role | Hex | Usage |
| :--- | :--- | :--- |
| **Deep Mineral Navy** (`geo-navy`) | `#0B1320` | Primary dark architectural surface, hero backdrops, footer, and portal shell |
| **Obsidian Slate** (`geo-navy-light`) | `#111C2D` | Elevated dark surface, dossier panels, and technical tables |
| **Warm Alabaster Stone** (`geo-stone`) | `#F6F3EC` | Primary light editorial surface for contrast sections and reading views |
| **Muted Limestone** (`geo-stone-muted`) | `#EBE6DC` | Secondary light surface and table header fill on stone sections |
| **Mineral Charcoal** (`geo-ink`) | `#14181F` | Primary ink color on Warm Alabaster Stone sections |
| **Weathered Slate** (`geo-slate`) | `#647080` | Secondary body copy and captions |
| **Antique Brass** (`geo-gold`) | `#B8964A` | Restrained accent for hairline lead rules, index numerals, and primary CTA |
| **Pale Brass** (`geo-gold-light`) | `#D2B46E` | Hover state and subtle dark-mode highlights |
| **Prussian Steel** (`geo-blue`) | `#1D426E` | Secondary institutional accent for cartographic and analytical callouts |
| **GeoSentry Low / Med / High** | `#4E7A56` / `#B8964A` / `#A93528` | Institutional risk indicators (muted earth/signal tones, never neon) |
