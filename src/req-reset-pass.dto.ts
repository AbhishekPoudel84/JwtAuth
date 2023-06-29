import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class ReqResetPassDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
