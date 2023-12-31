import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class UserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MaxLength(15)
  name: string;

  @IsString()
  @MinLength(8)
  password: string;
}
//   @IsEmailConfirmed : boolean;
// }
// function IsEmailConfirmed(target: UserDto, propertyKey: ''): void {
//   throw new Error('Function not implemented.');
// }
