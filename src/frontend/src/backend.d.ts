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
export type Time = bigint;
export interface CategoryMapping {
    category: string;
    subcategories: Array<string>;
}
export interface JobPost {
    id: bigint;
    status: Variant_pending_approved_rejected;
    workType: string;
    salary: string;
    area: string;
    description: string;
    phone: string;
    dateTime: Time;
}
export type WorkerStatus = {
    __kind__: "pendingVerification";
    pendingVerification: null;
} | {
    __kind__: "approved";
    approved: null;
} | {
    __kind__: "rejected";
    rejected: string;
};
export interface Worker {
    id: bigint;
    status: WorkerStatus;
    verified: boolean;
    featured: boolean;
    subcategory: string;
    area: string;
    userId: Principal;
    name: string;
    experience: string;
    workingHours: string;
    category: string;
    comments?: string;
    phone: string;
    photo: ExternalBlob;
}
export interface UserProfile {
    name: string;
    email?: string;
    phone?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_pending_approved_rejected {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export interface backendInterface {
    approveJobPost(jobId: bigint): Promise<void>;
    approveWorker(workerId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createJobPost(workType: string, area: string, dateTime: Time, salary: string, description: string, phone: string): Promise<string>;
    featureWorker(workerId: bigint): Promise<void>;
    getAllCategories(): Promise<Array<CategoryMapping>>;
    getAllJobPosts(): Promise<Array<JobPost>>;
    getAllWorkers(): Promise<Array<Worker>>;
    getApprovedJobs(): Promise<Array<JobPost>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategoryBySubcategory(subcategory: string): Promise<string | null>;
    getFeaturedWorkers(): Promise<Array<Worker>>;
    getJobPostById(id: bigint): Promise<JobPost | null>;
    getPendingJobPosts(): Promise<Array<JobPost>>;
    getPendingWorkers(): Promise<Array<Worker>>;
    getSafeCategoryWorkers(category: string): Promise<Array<Worker>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWorkerById(id: bigint): Promise<Worker | null>;
    getWorkersByCategory(category: string): Promise<Array<Worker>>;
    getWorkersBySubcategory(subcategory: string): Promise<Array<Worker>>;
    isCallerAdmin(): Promise<boolean>;
    markWorkerVerified(workerId: bigint): Promise<void>;
    rejectJobPost(jobId: bigint): Promise<void>;
    rejectWorker(workerId: bigint, reason: string): Promise<void>;
    repairDataIntegrity(): Promise<string>;
    safeQueryWorker(id: bigint): Promise<Worker | null>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchWorkersByArea(area: string): Promise<Array<Worker>>;
    searchWorkersByAreaAndCategory(area: string, category: string): Promise<Array<Worker>>;
    searchWorkersByAreaAndSubcategory(area: string, subcategory: string): Promise<Array<Worker>>;
    submitWorkerRegistration(name: string, phone: string, category: string, subcategory: string, area: string, experience: string, workingHours: string, photo: ExternalBlob, comments: string | null): Promise<string>;
    unfeatureWorker(workerId: bigint): Promise<void>;
}
