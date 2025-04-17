"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordInput = exports.RefreshTokenInput = exports.SendVerifyEmailInput = exports.VerifyOTPInput = exports.LoginInput = exports.RegisterInput = void 0;
const class_validator_1 = require("class-validator");
class RegisterInput {
}
exports.RegisterInput = RegisterInput;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: "Email is not valid" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Email is required" }),
    __metadata("design:type", String)
], RegisterInput.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Password is required" }),
    (0, class_validator_1.IsString)({ message: "Password must be a string" }),
    __metadata("design:type", String)
], RegisterInput.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "First name is required" }),
    (0, class_validator_1.IsString)({ message: "First name must be a string" }),
    __metadata("design:type", String)
], RegisterInput.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Last name is required" }),
    (0, class_validator_1.IsString)({ message: "Last name must be a string" }),
    __metadata("design:type", String)
], RegisterInput.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Birthday is required" }),
    (0, class_validator_1.IsDateString)({}, { message: "Birthday must be a valid date string" }),
    __metadata("design:type", String)
], RegisterInput.prototype, "birthday", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Gender is required" }),
    (0, class_validator_1.IsString)({ message: "Gender must be a string" }),
    __metadata("design:type", String)
], RegisterInput.prototype, "gender", void 0);
class LoginInput {
}
exports.LoginInput = LoginInput;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: "Email is not valid" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Email is required" }),
    __metadata("design:type", String)
], LoginInput.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Password is required" }),
    (0, class_validator_1.IsString)({ message: "Password must be a string" }),
    (0, class_validator_1.MinLength)(8, { message: "Password must be at least 8 characters long" }),
    __metadata("design:type", String)
], LoginInput.prototype, "password", void 0);
class VerifyOTPInput {
}
exports.VerifyOTPInput = VerifyOTPInput;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: "Email is not valid" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Email is required" }),
    __metadata("design:type", String)
], VerifyOTPInput.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "OTP is required" }),
    (0, class_validator_1.IsString)({ message: "OTP must be a string" }),
    __metadata("design:type", String)
], VerifyOTPInput.prototype, "otp", void 0);
class SendVerifyEmailInput {
}
exports.SendVerifyEmailInput = SendVerifyEmailInput;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: "Email is not valid" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Email is required" }),
    __metadata("design:type", String)
], SendVerifyEmailInput.prototype, "email", void 0);
class RefreshTokenInput {
}
exports.RefreshTokenInput = RefreshTokenInput;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Refresh token is required" }),
    (0, class_validator_1.IsString)({ message: "Refresh token must be a string" }),
    __metadata("design:type", String)
], RefreshTokenInput.prototype, "refreshToken", void 0);
class ForgotPasswordInput {
}
exports.ForgotPasswordInput = ForgotPasswordInput;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: "Email is not valid" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Email is required" }),
    __metadata("design:type", String)
], ForgotPasswordInput.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "OTP is required" }),
    __metadata("design:type", String)
], ForgotPasswordInput.prototype, "otp", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Password is required" }),
    (0, class_validator_1.IsString)({ message: "Password must be a string" }),
    (0, class_validator_1.MinLength)(8, { message: "Password must be at least 8 characters long" }),
    __metadata("design:type", String)
], ForgotPasswordInput.prototype, "password", void 0);
