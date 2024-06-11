import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './register-user.dto';

//extending the createUserDto because of same register and login type input
export class loginUserDto extends PartialType(CreateUserDto) {}
