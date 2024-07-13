import {
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { Token } from './token.entity';

@Controller('token')
@SerializeOptions({ strategy: 'excludeAll' })
@UseInterceptors(ClassSerializerInterceptor)
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('/member')
  @HttpCode(200)
  async createMemberToken(): Promise<Token> {
    return this.tokenService.createMemberToken();
  }

  @Post('/admin')
  @HttpCode(200)
  async createAdminToken(): Promise<Token> {
    return this.tokenService.createAdminToken();
  }
}
