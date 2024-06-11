import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma, User } from '@prisma/client';
import { AuthGuard } from './auth.guard';
import { CreateUserDto } from './dto/register-user.dto';
import { loginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //create post request for registration
  @Post('/register')
  register(@Body(ValidationPipe) user: CreateUserDto) {
    return this.authService.register(user);
  }

  //created post login request for login
  @Post('/login')
  login(@Body(ValidationPipe) user: loginUserDto) {
    return this.authService.login(user);
  }

  //created get request for everyone
  @Get()
  forEveryone(): Object {
    return {
      message: 'Hello this route is for everyone',
    };
  }

  //created protected profile route for logged in users
  @UseGuards(AuthGuard)
  @Get('/profile')
  getLoggedUser(@Req() request: Request) {
    //getting the request
    const user: User = request['user'];
    return {
      message: 'Hello ' + user.username,
    };
  }
}
