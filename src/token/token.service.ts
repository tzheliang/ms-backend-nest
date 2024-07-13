import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from './token.entity';
import { TokenPayload } from './token-payload.entity';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async createMemberToken(): Promise<Token> {
    const payload: TokenPayload = { role: 'member' };
    const accessToken = await this.jwtService.signAsync(payload);

    const token = new Token();
    token.accessToken = accessToken;

    return token;
  }

  async createAdminToken(): Promise<Token> {
    const payload: TokenPayload = { role: 'admin' };
    const accessToken = await this.jwtService.signAsync(payload);

    const token = new Token();
    token.accessToken = accessToken;

    return token;
  }
}
