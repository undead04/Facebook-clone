import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsDateString,
  MinLength,
} from "class-validator";

export class RegisterInput {
  @IsEmail({}, { message: "Email is not valid" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @IsNotEmpty({ message: "Password is required" })
  @IsString({ message: "Password must be a string" })
  password!: string;

  @IsNotEmpty({ message: "First name is required" })
  @IsString({ message: "First name must be a string" })
  firstName!: string;

  @IsNotEmpty({ message: "Last name is required" })
  @IsString({ message: "Last name must be a string" })
  lastName!: string;

  @IsNotEmpty({ message: "Birthday is required" })
  @IsDateString({}, { message: "Birthday must be a valid date string" })
  birthday!: string; // dùng string để phù hợp với IsDateString

  @IsNotEmpty({ message: "Gender is required" })
  @IsString({ message: "Gender must be a string" })
  gender!: string;
}

export class LoginInput {
  @IsEmail({}, { message: "Email is not valid" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @IsNotEmpty({ message: "Password is required" })
  @IsString({ message: "Password must be a string" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  password!: string;
}
export class VerifyEmailInput {
  @IsEmail({}, { message: "Email is not valid" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @IsNotEmpty({ message: "OTP is required" })
  @IsString({ message: "OTP must be a string" })
  otp!: string;
}

export class SendVerifyEmailInput {
  @IsEmail({}, { message: "Email is not valid" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;
}

export class RefreshTokenInput {
  @IsNotEmpty({ message: "Refresh token is required" })
  @IsString({ message: "Refresh token must be a string" })
  refreshToken!: string;
}
