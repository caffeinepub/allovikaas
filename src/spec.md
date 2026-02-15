# Specification

## Summary
**Goal:** Upgrade the /search “no workers found” empty state into a mobile-first smart recovery flow that always gives users a clear next action.

**Planned changes:**
- Replace the static empty-state UI in `frontend/src/pages/WorkerSearchResultsPage.tsx` with a recovery layout shown only after a zero-results search completes (keep the existing non-empty results UI unchanged).
- Add new i18n keys (English + Tamil) for the empty-state friendly message, section labels, button labels, and WhatsApp prompt; render bilingual text via the existing bilingual pattern (e.g., `BilingualText`) and `useI18n().t`.
- Show the exact Tamil friendly message (via i18n):  
  "உங்கள் பகுதியில் வேலைக்காரர்கள் இன்னும் சேரவில்லை.\nஅருகிலுள்ள பகுதிகளில் தேடலாம் அல்லது வேலை பதிவு செய்யலாம்."
- When browser geolocation is available, automatically fetch and render a “nearby approved workers” section using the existing nearby-workers flow (no new filter UI), with safe rendering when optional worker fields are missing.
- Add a mobile-friendly “Expand Search Area” secondary action (i18n-labeled) that increases the nearby radius and refreshes the nearby workers list without page reload; hide/disable safely when geolocation is unavailable.
- Add a “related skill suggestions” section derived from the current search context (prefer `q` when present); render tap-friendly chips/buttons that navigate to `/search?q=<suggestion>`.
- Add a prominent primary CTA button “Post a Work Request” (i18n-labeled) that navigates to the existing `/post-job` route.
- Add a WhatsApp help CTA with the exact Tamil prompt text (via i18n): "உங்களுக்கு உடனடி உதவி வேண்டுமா?" and a WhatsApp button that opens a WhatsApp help/chat link.
- Ensure the empty-state recovery UI never displays raw taxonomy slugs/codes; all labels shown must be human-readable and use existing bilingual label helpers / i18n mappings with safe humanized fallbacks.

**User-visible outcome:** When a search returns no workers, users see a clear, mobile-friendly recovery experience with bilingual guidance, nearby worker options (when location is available), related search suggestions, a direct path to post a job request, and an easy WhatsApp help action.
