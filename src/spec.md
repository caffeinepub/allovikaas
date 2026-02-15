# Specification

## Summary
**Goal:** Fix all broken category/subcategory icons by using local SVG assets only, ensuring icons never load from external URLs and always fall back gracefully without changing the existing layout.

**Planned changes:**
- Audit the frontend for every category/subcategory icon usage (img src, CSS background-image, etc.) and replace any http/https or stale paths with local `/assets/generated/*.svg` references.
- Route all category and subcategory icon rendering through the existing `SafeIconImage` (or equivalent centralized icon component) so invalid/missing sources automatically render the local fallback icon.
- Add/generate any missing local SVG icon files under `frontend/public/assets/generated` using the exact filenames referenced by the frontend.

**User-visible outcome:** Category and subcategory icon grids (e.g., Home page and Local Skilled Workers subcategories) show consistent local SVG icons with no broken-image placeholders, and missing/invalid icons display a fallback icon—while the layout remains unchanged.
