import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/register-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUser(username: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException();
    }
    delete user.password;
    return user;
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        username: data.username,
      },
    });
    if (existingUser) throw new ConflictException('user already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
      },
    });

    delete user.password;
    delete user.id;

    return user;
  }
}
