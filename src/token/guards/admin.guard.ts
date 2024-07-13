import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TokenPayload } from '../token-payload.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    this.logger.log('Checking user admin status');

    const request: Request = context.switchToHttp().getRequest();
    const userPayload: TokenPayload = request['user'];

    if (typeof userPayload === 'undefined' || userPayload === null) {
      throw new UnauthorizedException('Invalid user');
    }

    if (userPayload.role !== 'admin') {
      throw new ForbiddenException('User is not admin');
    }

    return true;
  }
}
