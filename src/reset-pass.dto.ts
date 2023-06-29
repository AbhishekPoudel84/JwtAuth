import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetPassDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  retypeNewPassword: string;

  @IsNotEmpty()
  otp: string;
}
