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
import {
  getCacheID,
  setCacheIDExprication,
  deleteCacheID,
} from "../models/Repo/cache.repo";
import { OtpStrategyFactory, typeOTP } from "./verifyOTP/OtpStrategyFactory";
import { UserRepo } from "../models/Repo/user.repo";
export class AuthService {
  private userRepo = new UserRepo();
  // register
  register = async (data: RegisterInput) => {
    const { email, password, firstName, lastName, birthday, gender } = data;

    // check if user already exists
    const user = await this.userRepo.findbyEmail(email);
    if (user) {
      throw new BadRequestError("User already exists");
    }
    console.log(user, email);
    // hash password
    const hashedPassword = await hashPassword(password);

    // create user
    await userModel.create({
      email,
      password: hashedPassword,
      profile: {
        firstName,
        lastName,
        birthday,
        gender,
      },
    });

    await this.sendOTP(email, typeOTP.register);

    return "Register successfully";
  };
  login = async ({ email, password }: LoginInput) => {
    const user = await this.userRepo.findbyEmail(email);
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
    const user = await this.userRepo.findById(userId);
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

    if (user._id.toString() !== decoded._id) {
      throw new BadRequestError("User not found");
    }

    if (user.isVerified === false) {
      throw new BadRequestError("User not verified");
    }

    const accessToken = createAccessToken(user._id.toString());

    return accessToken;
  };

  async sendOTP(email: string, type: typeOTP) {
    const factory = OtpStrategyFactory.getStrategy(type);
    await factory.sendOTP(email);
  }

  async verifyUser(email: string, otp: string) {
    const user = await this.userRepo.findbyEmail(email);
    if (user && user.isVerified) {
      throw new BadRequestError("User already verified");
    }
    const factory = OtpStrategyFactory.getStrategy(typeOTP.register);
    const isOTP = await factory.verifyOTP(email, otp);
    if (!isOTP) {
      throw new BadRequestError("OTP is invalid");
    }
    await this.userRepo.findByUpdateVerify(email);
  }

  async verifyPassword(email: string, otp: string) {
    const factory = OtpStrategyFactory.getStrategy(typeOTP.forgot);
    const isOTP = await factory.verifyOTP(email, otp);
    if (!isOTP) {
      throw new BadRequestError("OTP is invalid");
    }
    const newOTP = generateOTP();
    const key = `password:${email}`;
    await setCacheIDExprication({ key, value: newOTP, exp: 60 * 15 });
    return {
      newOTP,
    };
  }

  async forgotPassword(otp: string, email: string, password: string) {
    const key = `password:${email}`;
    const cacheOTP = await getCacheID({ key });
    console.log(cacheOTP);
    if (otp !== cacheOTP) {
      throw new BadRequestError("OTP is invalid");
    }
    const passwordHash = await hashPassword(password);
    await this.userRepo.findByUpdatePassword(email, passwordHash);
    await deleteCacheID({ key });
  }
}
