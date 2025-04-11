import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class PostInput {
  @IsNotEmpty({ message: "Content is required" })
  @IsString({ message: "Content must be a string" })
  content!: string;
  @IsOptional()
  images!: Express.Multer.File[];
  @IsNotEmpty({ message: "Status post is required" })
  @IsString({ message: "Status post must be a string" })
  statusPost!: string;
}
export interface ICreatePost {
  userId: string;
  content: string;
  images: Express.Multer.File[];
  statusPost: string;
}
export class UpdateStatusPostInput {
  @IsNotEmpty({ message: "Status post is required" })
  @IsString({ message: "Status post must be a string" })
  statusPost!: string;
}
