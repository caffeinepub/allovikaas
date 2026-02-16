# Specification

## Summary
**Goal:** Redeploy a clean production build to the live domain https://areaworkars.caffeine.ai to fix NXDOMAIN and ensure the site is reachable and rendering correctly.

**Planned changes:**
- Perform a forced clean production rebuild (clear prior build artifacts/caches) and ensure the production build completes without errors.
- Deploy the fresh production build directly to the live environment (no draft/preview deployment) so https://areaworkars.caffeine.ai serves the app.
- Add a post-deploy verification step that checks https://areaworkars.caffeine.ai responds successfully and renders the app shell (not a blank page).

**User-visible outcome:** Visiting https://areaworkars.caffeine.ai resolves correctly (no NXDOMAIN) and loads the application after a successful live redeploy.
