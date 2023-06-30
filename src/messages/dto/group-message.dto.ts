import { IsNotEmpty } from "class-validator";

export class GroupMessageDto {
  @IsNotEmpty()
  message: string;

  mentionedIds: number[];

  repliedMessageId: number;

  saveFileUploadIds: number[];
}
