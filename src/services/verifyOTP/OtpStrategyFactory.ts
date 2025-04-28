import { ForgotOtpStrategy } from "./ForgotOtpStrategy";
import { IOTPStrategy } from "./interface/IOTPStrategy";
import { RegisterOtpStrategy } from "./RegisterOtpStrategy";

export enum typeOTP {
  register = "register",
  forgot = "forgot",
}
export class OtpStrategyFactory {
  static getStrategy(type: "register" | "forgot"): IOTPStrategy {
    switch (type) {
      case "register":
        return new RegisterOtpStrategy();
      case "forgot":
        return new ForgotOtpStrategy();
      default:
        throw new Error("Loại OTP không hợp lệ");
    }
  }
}
