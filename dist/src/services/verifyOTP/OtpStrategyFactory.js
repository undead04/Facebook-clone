"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpStrategyFactory = exports.typeOTP = void 0;
const ForgotOtpStrategy_1 = require("./ForgotOtpStrategy");
const RegisterOtpStrategy_1 = require("./RegisterOtpStrategy");
var typeOTP;
(function (typeOTP) {
    typeOTP["register"] = "register";
    typeOTP["forgot"] = "forgot";
})(typeOTP || (exports.typeOTP = typeOTP = {}));
class OtpStrategyFactory {
    static getStrategy(type) {
        switch (type) {
            case "register": return new RegisterOtpStrategy_1.RegisterOtpStrategy();
            case "forgot": return new ForgotOtpStrategy_1.ForgotOtpStrategy();
            default: throw new Error("Loại OTP không hợp lệ");
        }
    }
}
exports.OtpStrategyFactory = OtpStrategyFactory;
