import type { backendInterface } from './backend';

// This file extends the backend interface with additional types needed by the frontend
// These represent backend capabilities that will be implemented but aren't yet in the interface

declare module './backend' {
  // Post-related types
  export interface Post {
    id: string;
    author: Principal;
    content: string;
    image?: ExternalBlob;
    video?: ExternalBlob;
    timestamp: bigint;
  }

  export interface Comment {
    id: string;
    postId: string;
    author: Principal;
    content: string;
    timestamp: bigint;
  }

  // Moderator role is now part of UserRole enum in backend
  // Extended backend interface (for future implementation)
  export interface ExtendedBackendInterface extends backendInterface {
    // Posts
    createPost(content: string, image?: ExternalBlob, video?: ExternalBlob): Promise<string>;
    getPost(postId: string): Promise<Post | null>;
    getFeed(limit: number, offset: number): Promise<Post[]>;
    deletePost(postId: string): Promise<void>;

    // Comments
    createComment(postId: string, content: string): Promise<string>;
    getComments(postId: string): Promise<Comment[]>;
    deleteComment(commentId: string): Promise<void>;

    // Future moderation capabilities
    listModerators(): Promise<Principal[]>;
    grantModeratorRole(user: Principal): Promise<void>;
    revokeModeratorRole(user: Principal): Promise<void>;
  }
}
