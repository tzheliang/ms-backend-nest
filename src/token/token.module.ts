import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({ secret: 'THISISNOTAREALSECRET_FORTESTINGONLY' }),
  ],
  controllers: [TokenController],
  providers: [TokenService],
})
export class TokenModule {}
