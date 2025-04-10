import { IsNotEmpty, IsString } from "class-validator";

export class FriendInput {
  @IsNotEmpty({ message: "User ID is required" })
  @IsString({ message: "User ID must be a string" })
  userId!: string;

  @IsNotEmpty({ message: "Friend ID is required" })
  @IsString({ message: "Friend ID must be a string" })
  friendId!: string;
}
