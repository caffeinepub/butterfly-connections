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
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    acceptContact(_requester: Principal): Promise<void>;
    addContact(to: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    browseMentors(lookingFor: {
        supporterOfCommunity: boolean;
        mentorship: boolean;
        mentoring: boolean;
    }): Promise<Array<CommunityProfile>>;
    confirmEligibility(): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getCommunityProfile(user: Principal): Promise<CommunityProfile>;
    getContacts(user: Principal): Promise<Array<Principal>>;
    getProfilePhoto(user: Principal): Promise<ExternalBlob | null>;
    hasConfirmedEligibility(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    removeContent(_reportId: bigint): Promise<void>;
    reportContent(contentId: string, _reason: string): Promise<void>;
    updateCommunityProfile(profile: CommunityProfile): Promise<void>;
    uploadProfilePhoto(blob: ExternalBlob): Promise<void>;
}
