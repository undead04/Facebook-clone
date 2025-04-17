"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordEmailTemplate = void 0;
const forgotPasswordEmailTemplate = (otpCode, name) => {
    return `
      <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background-color: #1877f2; color: white; padding: 20px 30px;">
          <h1 style="margin: 0;">Facebook Clone</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #333;">Xin chào ${name},</h2>
          <p style="font-size: 16px; color: #555;">
            Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản <strong>Facebook Clone</strong>.
          </p>
          <p style="font-size: 16px; color: #555;">
            Đây là mã xác minh của bạn:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; font-size: 36px; font-weight: bold; background-color: #f0f2f5; padding: 15px 30px; border-radius: 8px; letter-spacing: 6px; color: #1877f2;">
              ${otpCode}
            </span>
          </div>
          <p style="font-size: 14px; color: #999;">
            Mã có hiệu lực trong vòng <strong>15 phút</strong>. Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.
          </p>
          <hr style="margin: 40px 0;" />
          <p style="font-size: 12px; color: #aaa;">
            Để bảo vệ tài khoản, vui lòng không chia sẻ mã này với bất kỳ ai.
          </p>
        </div>
        <div style="background-color: #f0f2f5; text-align: center; padding: 15px; font-size: 12px; color: #888;">
          © 2025 Facebook Clone. All rights reserved.
        </div>
      </div>
    `;
};
exports.forgotPasswordEmailTemplate = forgotPasswordEmailTemplate;
