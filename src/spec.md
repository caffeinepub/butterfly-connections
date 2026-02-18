# Specification

## Summary
**Goal:** Allow users to upload and manage profile photos (avatar plus additional photos) and display them across profile views, while preserving existing profile data through a safe backend migration.

**Planned changes:**
- Extend the community profile backend model to store an avatar reference and a list of additional uploaded profile photo references, using existing external blob storage for image blobs.
- Update profile fetch behavior (getCommunityProfile) to return avatar and additional photo references when present.
- Implement a conditional canister state migration to add new photo fields for existing profiles without losing or altering existing profile data.
- Add “My Profile” UI to upload/set/replace avatar, add additional photos, preview current photos, remove additional photos (with confirmation or undo-safe interaction), and save changes to persist to the backend.
- Update “View Profile” (and existing profile displays) to render the uploaded avatar when present (fallback to default avatar otherwise) and show additional photos in a simple responsive, accessible gallery.

**User-visible outcome:** Users can customize their profile by uploading an avatar and additional photos, manage/removing them from “My Profile,” and other users will see the uploaded images on profile views (with default avatar fallback when none is uploaded).
