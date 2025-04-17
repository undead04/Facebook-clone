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
exports.changePasswordInput = exports.updateUserInput = void 0;
const class_validator_1 = require("class-validator");
class updateUserInput {
}
exports.updateUserInput = updateUserInput;
__decorate([
    (0, class_validator_1.IsString)({ message: "Location must be a string" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Location is required" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], updateUserInput.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "Bio must be a string" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Bio is required" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], updateUserInput.prototype, "bio", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: "Birthday must be a valid date string" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], updateUserInput.prototype, "birthday", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "Gender must be a string" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Gender is required" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], updateUserInput.prototype, "gender", void 0);
class changePasswordInput {
}
exports.changePasswordInput = changePasswordInput;
__decorate([
    (0, class_validator_1.IsString)({ message: "Password must be a string" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Password is required" }),
    __metadata("design:type", String)
], changePasswordInput.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "New password must be a string" }),
    (0, class_validator_1.IsNotEmpty)({ message: "New password is required" }),
    __metadata("design:type", String)
], changePasswordInput.prototype, "newPassword", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "Confirm password must be a string" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Confirm password is required" }),
    __metadata("design:type", String)
], changePasswordInput.prototype, "confirmPassword", void 0);
