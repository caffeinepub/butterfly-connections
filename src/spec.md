# Specification

## Summary
**Goal:** Add user banning, moderator appointment/removal, and a functional moderation dashboard for admins and moderators.

**Planned changes:**
- Backend: implement ban/unban by Principal, expose ban status checks, and block all authenticated community actions for banned users with clear errors; persist ban state across upgrades.
- Backend: add role management to distinguish regular user, moderator, and admin/owner; allow admin-only appointment/removal of moderators; persist role state across upgrades.
- Frontend: upgrade the existing Moderation page into a dashboard with sections for Reports, User Actions (ban/unban), and an admin-only Role Management section; show “Access Denied” to non-moderators/non-admins.
- Frontend + backend wiring: add React Query hooks and type-safe endpoints for role/permission checks, listing moderators (admin-only), banning/unbanning, and granting/revoking moderator role (admin-only); update nav/route gating so Moderation is visible to moderators and admins.
- Frontend: add a clear banned-user experience that shows an explicit English “You are banned” message after sign-in and blocks access to protected community features without spinner dead-ends.

**User-visible outcome:** Admins can appoint/remove moderators and ban/unban users; moderators can access a dedicated moderation dashboard to review reports and perform allowed moderation actions; banned users are clearly informed and prevented from using community features.
