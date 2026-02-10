
// Simple in-memory store for OTPs (In production, use Redis or DB)
// Map<phoneNumber, { otp: string, expires: number }>

export interface OtpData {
    otp: string;
    expires: number;
}

export const otpStore = new Map<string, OtpData>();
