import { IsNotEmpty, IsString } from "class-validator";

export class NotificationInput {
  @IsNotEmpty({ message: "Sender ID is required" })
  @IsString({ message: "Sender ID must be a string" })
  senderId!: string;

  @IsNotEmpty({ message: "Receiver ID is required" })
  @IsString({ message: "Receiver ID must be a string" })
  recevieId!: string;

  @IsNotEmpty({ message: "Type is required" })
  @IsString({ message: "Type must be a string" })
  type!: string;

  @IsNotEmpty({ message: "Content is required" })
  @IsString({ message: "Content must be a string" })
  content!: string;
}
