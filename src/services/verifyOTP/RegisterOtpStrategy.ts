import { UserRepo } from "../../models/Repo/user.repo";
import { IOTPStrategy } from "./interface/IOTPStrategy";
import { generateOTP } from "../../utils";
import { deleteCacheID, getCacheID, setCacheIDExprication } from "../../models/Repo/cache.repo";
import { emailPublish } from "../../messaging/emailPublish";
import { BadRequestError, NotFoundError } from "../../middlewares/error.response";
import {generateVerifyEmailTemplate} from "../../utils/templates/verifyEmailTemplate"

export class RegisterOtpStrategy implements IOTPStrategy{
    private userRepo = new UserRepo()
    async verifyOTP(email: string, otp: string): Promise<boolean> {
        const key = `verify:${email}`
        const otpCache = await getCacheID({key})
        if(otpCache !== otp) return false
        await deleteCacheID({key})
        return true;
    }
    async sendOTP(email:string): Promise<void> {
        const user = await this.userRepo.findbyEmail(email)
        if(!user){
            throw new NotFoundError("User NotFound")
        }
        if(user.isVerified){
            throw new BadRequestError("User already verify")
        }
        const otp = generateOTP()
        const key = `verify:${email}`
        await setCacheIDExprication({ key, value: otp, exp: 60 * 15 })
        await emailPublish({
            to: email,
            subject: "OTP for verify email",
            html: generateVerifyEmailTemplate(otp, `${user.profile.firstName} ${user.profile.lastName}`),
          });
    }
}