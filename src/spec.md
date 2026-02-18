# Specification

## Summary
**Goal:** Replace the “My Connections” placeholder with a forum-style threaded board where authenticated, eligible, non-banned users can create and browse connection-scoped threads and replies.

**Planned changes:**
- Update `/connections` to show a thread list UI (title/preview, author, created time, reply count) and remove the “coming soon” placeholder.
- Add UI to create a new thread from the Connections page.
- Add a thread detail view reachable from the thread list to display the original post, replies, and a reply composer with empty states.
- Implement backend storage and APIs for connection threads and replies: create thread, list threads (paginated), get thread by id, create reply, list replies.
- Enforce access gating on all Connections forum endpoints: only authenticated, eligible, non-banned users; and visibility limited to the thread author plus the author’s accepted connections.
- Add React Query hooks for listing/creating threads, fetching thread details, listing/creating replies, and ensure UI updates without full page reload (invalidate/refresh after mutations).
- Handle unauthorized/forbidden backend errors with readable English messages in the UI.

**User-visible outcome:** Visiting `/connections` shows a forum-style list of threads with a “New thread” action; users can open a thread to view its replies and post a reply, and content is only visible within their connection network.
