# Specification

## Summary
**Goal:** Fix broken homepage category and “Local Skilled Workers” subcategory icons by replacing external/PNG icon references with locally hosted SVG assets and adding a local fallback icon behavior.

**Planned changes:**
- Add local SVG icon assets for every homepage category and every “Local Skilled Workers” subcategory under `frontend/public/assets/generated`, ensuring no icon uses an external URL.
- Update frontend icon references to point to the new local `.svg` files (replacing `.png`), including paths in `frontend/src/pages/HomePage.tsx` and `frontend/src/config/localSkilledWorkers.ts`.
- Implement a default fallback icon for category/subcategory icons when an icon path is missing/empty or fails to load, using a local SVG under `/assets/generated/` without changing layout or spacing.

**User-visible outcome:** Category and subcategory icons render reliably (no broken images), using local SVGs with a consistent local fallback icon when any icon can’t be loaded.
