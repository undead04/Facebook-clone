import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsDateString,
} from "class-validator";

export class updateUserInput {
  @IsString({ message: "Location must be a string" })
  @IsNotEmpty({ message: "Location is required" })
  @IsOptional()
  location?: string;

  @IsString({ message: "Bio must be a string" })
  @IsNotEmpty({ message: "Bio is required" })
  @IsOptional()
  bio?: string;

  @IsDateString({}, { message: "Birthday must be a valid date string" })
  @IsOptional()
  birthday!: string; // dùng string để phù hợp với IsDateString

  @IsString({ message: "Gender must be a string" })
  @IsNotEmpty({ message: "Gender is required" })
  @IsOptional()
  gender?: string;
}

export class changePasswordInput {
  @IsString({ message: "Password must be a string" })
  @IsNotEmpty({ message: "Password is required" })
  password!: string;

  @IsString({ message: "New password must be a string" })
  @IsNotEmpty({ message: "New password is required" })
  newPassword!: string;

  @IsString({ message: "Confirm password must be a string" })
  @IsNotEmpty({ message: "Confirm password is required" })
  confirmPassword!: string;
}
