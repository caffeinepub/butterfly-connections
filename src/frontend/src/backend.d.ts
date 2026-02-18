import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type ThreadId = bigint;
export interface ConnectionsThread {
    id: ThreadId;
    title: string;
    content: string;
    createdAt: bigint;
    author: Principal;
    isVisible: boolean;
    replies: Array<ConnectionsReply>;
}
export interface ConnectionRequest {
    to: Principal;
    from: Principal;
    timestamp: bigint;
}
export type ReplyId = bigint;
export interface ConnectionsReply {
    id: ReplyId;
    content: string;
    createdAt: bigint;
    author: Principal;
    threadId: ThreadId;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    acceptConnectionRequest(requester: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createThread(title: string, content: string): Promise<ThreadId>;
    getCallerUserRole(): Promise<UserRole>;
    getPendingConnectionRequests(): Promise<Array<ConnectionRequest>>;
    getThread(threadId: ThreadId): Promise<ConnectionsThread>;
    getThreadReplies(threadId: ThreadId): Promise<Array<ConnectionsReply>>;
    getUserConnections(user: Principal): Promise<Array<Principal>>;
    isCallerAdmin(): Promise<boolean>;
    listThreads(offset: bigint, limit: bigint): Promise<Array<ConnectionsThread>>;
    replyToThread(threadId: ThreadId, content: string): Promise<ReplyId>;
    sendConnectionRequest(target: Principal): Promise<void>;
}
