import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.log('Checking for valid JWT in Authorization header');

    const request: Request = context.switchToHttp().getRequest();
    // const token = this.ext
    const authHeader = request.headers.authorization ?? '';
    const [type, token] = authHeader.split(' ');

    this.logger.debug(`Auth Type: [${type}]`);
    this.logger.debug(`Token Val: [${token}]`);

    if (type !== 'Bearer') {
      throw new UnauthorizedException('Invalid bearer token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      this.logger.debug('Payload body: ' + JSON.stringify(payload));

      request['user'] = payload;
    } catch (err) {
      this.logger.error(err);

      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException('Expired bearer token');
      }

      throw new UnauthorizedException('Invalid bearer token');
    }

    return true;
  }
}
