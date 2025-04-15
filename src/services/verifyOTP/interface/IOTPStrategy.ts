export interface IOTPStrategy {
    verifyOTP(email: string, otp: string): Promise<boolean>;
    sendOTP(email:string): Promise<void>;
}