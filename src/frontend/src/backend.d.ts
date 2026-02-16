import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface CategoryMapping {
    category: string;
    subcategories: Array<string>;
}
export interface Worker {
    id: bigint;
    status: {
        __kind__: "active";
        active: null;
    } | {
        __kind__: "rejected";
        rejected: string;
    };
    area: string;
    userId: Principal;
    name: string;
    experience: string;
    availableTime: string;
    category: string;
    phone: string;
    skills: Array<string>;
}
export interface UserProfile {
    name: string;
    email?: string;
    phone?: string;
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllCategories(): Promise<Array<CategoryMapping>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategoryBySubcategory(subcategory: string): Promise<string | null>;
    getPublicWorkers(): Promise<Array<Worker>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWorkerById(id: bigint): Promise<Worker | null>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    rejectWorker(workerId: bigint, reason: string): Promise<boolean>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    submitWorkerRegistration(name: string, phone: string, area: string, category: string, skills: Array<string>, availableTime: string, experience: string): Promise<string>;
}
