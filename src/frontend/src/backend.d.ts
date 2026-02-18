import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type ReasonType = {
    __kind__: "violation";
    violation: null;
} | {
    __kind__: "troll";
    troll: null;
} | {
    __kind__: "other";
    other: string;
} | {
    __kind__: "lecture";
    lecture: null;
} | {
    __kind__: "insensitive";
    insensitive: null;
} | {
    __kind__: "offTopic";
    offTopic: null;
};
export interface HelloCornerMessage {
    id: MessageId;
    video?: ExternalBlob;
    createdAt: bigint;
    text: string;
    author: Principal;
    photo?: ExternalBlob;
}
export interface CommunityProfile {
    bio: string;
    seekingMentorship: boolean;
    displayName: string;
    profilePhoto?: ExternalBlob;
    tags: Array<string>;
    pronouns: string;
    openToMentoring: boolean;
    supporterOfCommunity: boolean;
    avatar?: ExternalBlob;
}
export interface Report {
    id: ReportId;
    status: ReportStatus;
    contentId: string;
    reasonType: ReasonType;
    description: string;
    reportType: ReportType;
    timestamp: bigint;
    reporter: Principal;
}
export type ReportId = bigint;
export type MessageId = bigint;
export interface PaginatedMessages {
    nextOffset: bigint;
    hasMore: boolean;
    messages: Array<HelloCornerMessage>;
}
export enum ReactionType {
    like = "like",
    dislike = "dislike"
}
export enum ReportStatus {
    pending = "pending",
    reviewed = "reviewed"
}
export enum ReportType {
    message = "message",
    profile = "profile"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    acceptContact(_requester: Principal): Promise<void>;
    addContact(to: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    banUser(user: Principal, reason: string): Promise<void>;
    browseMentors(lookingFor: {
        supporterOfCommunity: boolean;
        mentorship: boolean;
        mentoring: boolean;
    }): Promise<Array<CommunityProfile>>;
    confirmEligibility(): Promise<void>;
    createHelloCornerMessage(text: string, photo: ExternalBlob | null, video: ExternalBlob | null): Promise<MessageId>;
    getBanReason(user: Principal): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    getCommunityProfile(user: Principal): Promise<CommunityProfile>;
    getContacts(user: Principal): Promise<Array<Principal>>;
    getLectureReports(skip: bigint, take: bigint): Promise<Array<Report>>;
    getMessageReactions(messageId: MessageId): Promise<{
        dislikeCount: bigint;
        likeCount: bigint;
    }>;
    getPendingTrollReports(skip: bigint, take: bigint): Promise<{
        pendingTrollReports: Array<Report>;
        totalCount: bigint;
    }>;
    getProfilePhoto(user: Principal): Promise<ExternalBlob | null>;
    getReport(reportId: ReportId): Promise<Report>;
    getUserReportStats(_user: Principal): Promise<{
        profileReportCount: bigint;
        messageReportCount: bigint;
    }>;
    hasConfirmedEligibility(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isUserBannedForAdminCheck(user: Principal): Promise<boolean>;
    listHelloCornerMessages(offset: bigint, limit: bigint): Promise<PaginatedMessages>;
    listReports(skip: bigint, take: bigint): Promise<Array<Report>>;
    reactToMessage(messageId: MessageId, reaction: ReactionType): Promise<void>;
    removeReaction(messageId: MessageId): Promise<void>;
    reportContent(contentId: string, contentType: ReportType, reasonType: ReasonType, description: string): Promise<void>;
    resolveReport(reportId: ReportId): Promise<void>;
    unbanUser(user: Principal): Promise<void>;
    updateCommunityProfile(profile: CommunityProfile): Promise<void>;
    uploadProfilePhoto(blob: ExternalBlob): Promise<void>;
}
