import { IsNotEmpty } from "class-validator";

export class PrivateMessageDto {
  @IsNotEmpty()
  to: number;
  from: number;

  @IsNotEmpty()
  message: string;
}
