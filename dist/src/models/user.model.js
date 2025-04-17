"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String, default: "" },
    isDelete: { type: Boolean, default: false },
    profile: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        avatarName: { type: String, default: "" },
        coverPhotoName: { type: String, default: "" },
        avatarUrl: { type: String, default: "" },
        coverPhotoUrl: { type: String, default: "" },
        bio: { type: String, default: "" },
        birthday: { type: Date, default: null },
        location: { type: String, default: "" },
        gender: { type: String, enum: ["male", "female", "other"] },
        friendsCount: { type: Number, default: 0 },
    },
}, { timestamps: true });
// 🎯 Thêm index full-text để tìm kiếm theo tên và bio
userSchema.index({
    "profile.firstName": "text",
    "profile.lastName": "text",
    "profile.bio": "text",
});
const userModel = (0, mongoose_1.model)("User", userSchema);
exports.default = userModel;
