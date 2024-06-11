import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/register-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { loginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaServices: PrismaService,
    private readonly usersService: UserService,
    private jwtService: JwtService,
  ) {}

  // function that passes response and create user in a database
  async register(CreateUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(CreateUserDto);
    return {
      message: 'user successfully registerd',
      user,
    };
  }

  // function check user in a database and validates password
  async login(CreateUserDto: loginUserDto) {
    const { username, password } = CreateUserDto;

    const user = await this.prismaServices.user.findUnique({
      where: { username },
    });

    if (!user) throw new NotFoundException('user not found');

    const validatePassword = await bcrypt.compare(password, user.password);

    if (!validatePassword) throw new UnauthorizedException('invalid password');

    return {
      token: this.jwtService.sign({
        username,
      }),
    };
  }
}
