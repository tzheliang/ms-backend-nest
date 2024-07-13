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
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('token')
@SerializeOptions({ strategy: 'excludeAll' })
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('/member')
  @HttpCode(200)
  @ApiOperation({ summary: 'Generate member JWT for API testing' })
  @ApiOkResponse({ description: 'OK', type: Token })
  async createMemberToken(): Promise<Token> {
    return this.tokenService.createMemberToken();
  }

  @Post('/admin')
  @HttpCode(200)
  @ApiOperation({ summary: 'Generate admin JWT for API testing' })
  @ApiOkResponse({ description: 'OK', type: Token })
  async createAdminToken(): Promise<Token> {
    return this.tokenService.createAdminToken();
  }
}
