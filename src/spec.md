# Specification

## Summary
**Goal:** Ensure category slugs are always displayed as consistent, human-readable English labels across the UI via a centralized mapping.

**Planned changes:**
- Introduce a strict `CATEGORY_LABELS` slug→label dictionary (including the provided mappings) and a single shared helper to normalize raw slugs and return display labels.
- Enforce UI rendering rules so raw slugs are never shown; unknown slugs render as a safe capitalized-words fallback (display-only).
- Replace all existing category label rendering (home category cards, search results titles/labels, worker profile badges, live suggestions text, and filter/category UI chips/buttons/headings) to use the shared helper while keeping stored values and URL/search params unchanged.

**User-visible outcome:** Users see clean, consistent category names (e.g., “Home Services”, “Specialized Cleaning”) everywhere in the app, with no raw taxonomy slugs displayed.
