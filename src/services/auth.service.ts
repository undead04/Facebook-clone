import userModel from "../models/user.model";
import { RegisterInput, LoginInput } from "../validations/auth";
import { BadRequestError } from "../middlewares/error.response";
import {
  hashPassword,
  generateOTP,
  comparePassword,
  createAccessToken,
  createRefreshToken,
  getInfoData,
  verifyToken,
} from "../utils";
import redisClient from "../databases/init.redis";
import emailPublish from "../messaging/emailPublish";
import { generateVerifyEmailTemplate } from "../utils/templates/verifyEmailTemplate";

export class AuthService {
  // register
  register = async (data: RegisterInput) => {
    const { email, password, firstName, lastName, birthday, gender } = data;

    // check if user already exists
    const user = await userModel.findOne({ email }).lean();
    if (user) {
      throw new BadRequestError("User already exists");
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    // create user
    const newUser = await userModel.create({
      email,
      password: hashedPassword,
      profile: {
        firstName,
        lastName,
        birthday,
        gender,
      },
    });

    // generate OTP
    const otp = generateOTP();

    // save OTP to redis
    await this.setOPTRedis(email, otp);

    // send OTP to user
    await this.sendEmailVerify(email, otp, firstName, lastName);

    return "Register successfully";
  };
  login = async ({ email, password }: LoginInput) => {
    const user = await userModel.findOne({ email }).lean();
    if (!user) {
      throw new BadRequestError("User not found");
    }

    // check if password is correct
    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      throw new BadRequestError("Password is incorrect");
    }

    if (user.isVerified === false) {
      throw new BadRequestError("User not verified");
    }

    // generate token
    const refreshToken = createRefreshToken(user._id.toString());

    const accessToken = createAccessToken(user._id.toString());

    // save refresh token to database
    await userModel.findByIdAndUpdate(user._id, {
      $set: {
        refreshToken,
      },
      new: true,
    });

    return {
      user: getInfoData(
        [
          "_id",
          "email",
          "profile.firstName",
          "profile.lastName",
          "profile.avatar",
        ],
        user
      ),
      refreshToken,
      accessToken,
    };
  };
  logout = async (userId: string) => {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    user.refreshToken = "";
    await user.save();
    return user;
  };

  refreshToken = async (refreshToken: string) => {
    const user = await userModel.findOne({ refreshToken });
    if (!user) {
      throw new BadRequestError("Refresh token is invalid");
    }

    const decoded = await verifyToken(refreshToken);

    console.log("user", user);
    console.log("decoded", decoded);

    if (user._id.toString() !== decoded._id) {
      throw new BadRequestError("User not found");
    }

    if (user.isVerified === false) {
      throw new BadRequestError("User not verified");
    }

    const accessToken = createAccessToken(user._id.toString());

    return accessToken;
  };

  sendVerifyEmail = async (email: string) => {
    const user = await userModel.findOne({ email }).lean();
    if (!user) {
      throw new BadRequestError("User not found");
    }
    if (user.isVerified) {
      throw new BadRequestError("User already verified");
    }

    const otp = generateOTP();

    await this.setOPTRedis(email, otp);

    // send OTP to user
    await this.sendEmailVerify(
      email,
      otp,
      user.profile.firstName,
      user.profile.lastName
    );

    return "Verify email sent";
  };

  verifyEmail = async (email: string, otp: string) => {
    const user = await userModel.findOne({ email }).lean();
    if (!user) {
      throw new BadRequestError("User not found");
    }
    if (user.isVerified) {
      throw new BadRequestError("User already verified");
    }

    const otpFromRedis = await this.getOPTRedis(email);
    if (otpFromRedis !== otp) {
      throw new BadRequestError("OTP is incorrect");
    }

    await userModel.findByIdAndUpdate(user._id, {
      $set: {
        isVerified: true,
      },
      new: true,
    });

    await this.deleteOPTRedis(email);

    return "Email verified";
  };
  private async setOPTRedis(email: string, otp: string) {
    await redisClient.set(`verify:${email}`, otp, "EX", 60 * 15);
  }
  private async getOPTRedis(email: string) {
    return await redisClient.get(`verify:${email}`);
  }
  private async deleteOPTRedis(email: string) {
    await redisClient.del(`verify:${email}`);
  }
  private async sendEmailVerify(
    email: string,
    otp: string,
    firstName: string,
    lastName: string
  ) {
    await emailPublish({
      to: email,
      subject: "OTP for verify email",
      html: generateVerifyEmailTemplate(otp, `${firstName} ${lastName}`),
    });
  }
}
