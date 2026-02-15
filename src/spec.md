# Specification

## Summary
**Goal:** Add consistent English + Tamil bilingual (two-line) labels across Local Skilled Workers taxonomy displays, Worker Registration, and Worker Search Results using the existing i18n system.

**Planned changes:**
- Update Local Skilled Workers group names and subcategory names to support bilingual labels and render them as two-line text (English first line, Tamil second line) wherever shown, including the Home page grid.
- Update the Worker Registration page to render bilingual labels for the page title/helper text, all field labels, placeholders, validation/error messages, and primary/secondary buttons; show bilingual dropdown option text while keeping submitted values as the existing English strings.
- Update the Worker Search Results page to render bilingual labels for the page title, filters/placeholders, action buttons, loading/error/empty states, and active filter chips; show bilingual dropdown option text while keeping internal filter values as the existing English strings.
- Extend the i18n translation dictionary with keys for all newly bilingualized UI strings (English + Tamil), relying on existing fallback behavior for missing keys.

**User-visible outcome:** When Tamil Nadu (TN) is selected, Local Skilled Workers categories/subcategories, registration form text (including errors), and search/filter UI display as two-line English + Tamil labels while keeping backend-facing category/subcategory values unchanged.
