# Specification

## Summary
**Goal:** Add a “Supporter of the community” flag to user profiles and the directory, including saving/loading, filtering, and display.

**Planned changes:**
- Backend: Add a boolean `supporterOfCommunity` field to `CommunityProfile`, persist it via `updateCommunityProfile`, return it via `getCommunityProfile`, and default existing profiles to `false`.
- Backend: Extend the directory browsing API to accept a `supporterOfCommunity` filter and include it in filter behavior alongside existing mentorship filters.
- Frontend (My Profile): Add a third mentorship-section toggle labeled exactly “Supporter of the community”, save it with the profile, and show “✓ Supporter of the community” in view mode when enabled.
- Frontend (Directory): Add a third filter toggle labeled exactly “Supporter of the community”, include it in browse requests, and visually indicate supporter status on profile cards when `supporterOfCommunity` is true.

**User-visible outcome:** Users can mark themselves as “Supporter of the community” on their profile, see that status reflected on their profile, filter the directory by it, and see supporter indicators on directory profile cards.
