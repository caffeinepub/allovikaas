# Specification

## Summary
**Goal:** Grant admin role to the current user account and fix access denied error on admin pages.

**Planned changes:**
- Modify backend to automatically grant admin privileges to the currently authenticated user's principal ID
- Update AdminGuard component to allow access for the current user
- Ensure admin role persists across sessions

**User-visible outcome:** The current user can access the admin dashboard and admin panel pages without encountering an "Access Denied" screen.
