export interface GoogleProfile {
    emails: Array<{ value: string; verified: boolean }>;
    displayName: string; 
    photos: Array<{ value: string;}>;
    id: string;
}