# Specification

## Summary
**Goal:** Add Tamil/English voice search to the Home page search bar via a microphone button that converts speech to text and runs the existing search flow.

**Planned changes:**
- Add a tap-friendly microphone icon button positioned inside the Home page main search input UI (frontend/src/pages/HomePage.tsx), visible and usable on mobile browsers without requiring login.
- Implement client-side speech-to-text using the browser’s Web Speech API: start recognition on tap, fill the search input with the final transcript, and automatically trigger the existing Home page search navigation to `/search` with `q=<recognized text>`.
- Configure recognition to support Tamil and English (including mixed/transliterated queries) and pass the transcript into the existing search pipeline unchanged except for trimming.
- Add safe fallback behavior for unsupported browsers (hide/disable mic button and optionally show a simple English-only message) without impacting typed search or causing runtime errors.

**User-visible outcome:** Users can tap a microphone inside the Home page search box to speak in Tamil/English, see the recognized text fill the search field, and be taken to the search results automatically; on unsupported browsers, typed search still works normally.
