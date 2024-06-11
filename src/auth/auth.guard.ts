import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    //getting auth token from the header
    const authHeader = request.headers['authorization'];

    // checking if auth token is sent by user or not
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    // removing bearer from the token
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('JWT token is missing');
    }

    try {
      //verifying token using jwt
      const decoded = this.jwtService.verify(token);
      request['user'] = decoded;
      return true;
    } catch (err) {
      //Handling invalid token error
      throw new UnauthorizedException('Invalid token');
    }
  }
}
