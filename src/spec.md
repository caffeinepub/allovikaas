# Specification

## Summary
**Goal:** Add Tailoring subcategory dropdown support, allow anonymous worker registration while keeping admin-only publishing, and standardize local icon rendering with a robust fallback.

**Planned changes:**
- Update backend taxonomy returned by `getAllCategories()` to include Tailoring subcategories (including “Blouse Stitching” and a saree-related option) under the correct parent category so they populate frontend Subcategory dropdowns.
- Allow anonymous submissions in `submitWorkerRegistration` while keeping the Admin Panel and admin actions protected via Internet Identity/admin authorization.
- Enforce admin-approval gating so newly submitted workers remain pending and excluded from public browse/search results until approved.
- Fix/standardize frontend category/subcategory icons to use only local generated assets, and ensure `SafeIconImage` consistently falls back to a single local fallback SVG (no broken placeholders).
- Improve Worker Registration and Search UX clarity for category/subcategory selection (clear placeholders, correct disabled/enabled states, safe empty-state messaging) without adding new flows or routes.

**User-visible outcome:** Users can register workers without logging in; Tailoring subcategories appear correctly in registration and search filters; unapproved workers stay hidden until an admin approves them; and category/subcategory icons render reliably from local assets with a working fallback and clearer dropdown behavior.
