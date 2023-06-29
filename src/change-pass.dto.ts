import { IsNotEmpty, IsString, MinLength, isNotEmpty } from "class-validator";

export class ChangePassDto {
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  retypeNewPassword: string;
}
