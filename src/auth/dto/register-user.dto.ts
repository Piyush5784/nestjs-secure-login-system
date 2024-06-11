import { IsString, Length } from 'class-validator';

//Register user dto for validating inputs
export class CreateUserDto {
  @IsString()
  @Length(5, 10)
  username: string;

  @IsString()
  @Length(6, 12)
  password: string;
}
