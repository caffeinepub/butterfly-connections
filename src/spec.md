# Specification

## Summary
**Goal:** Build the initial Butterfly Connections 18+ authenticated social platform with profiles, posting, connections, mentorship directory, and basic safety/moderation.

**Planned changes:**
- Add Internet Identity sign-in and route protection so only landing + age gate are accessible without authentication.
- Implement an 18+ eligibility confirmation gate that must be completed before accessing any community features, persisted per authenticated user.
- Create user profiles with display name, pronouns (free-text), bio, optional tags, mentorship flags (open to mentoring / seeking mentorship), and avatar selection with generated defaults.
- Implement social posting: create post (text + optional image), global feed, single post view, and delete own posts.
- Implement comments on posts: view thread, add comment, and delete own comments.
- Implement connections: send/accept/decline requests, list connections and pending requests, and remove connections.
- Add a mentor/peer support directory with browse + basic filters (mentorship flags, tags) linking to profiles.
- Add safety basics: Community Guidelines page, report post/comment with preset reason + optional text, and a moderation view to review reports and remove reported content.
- Add authenticated navigation to Feed, Directory, Connections, Profile, Guidelines, and Sign out.
- Apply a coherent warm, cozy visual theme consistently across all pages.
- Generate and include required static branding/UX image assets under `frontend/public/assets/generated` and render them in the UI.

**User-visible outcome:** Visitors can view a landing page and confirm 18+ eligibility, then sign in with Internet Identity to create a profile, browse a feed, post stories (optionally with images), comment, connect with others, browse a mentorship directory, view guidelines, report content, and (via moderation view) remove reported content.
