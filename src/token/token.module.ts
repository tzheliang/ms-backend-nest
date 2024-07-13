import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtSecret } from './constants';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtSecret,
      signOptions: { expiresIn: '5m' },
    }),
  ],
  controllers: [TokenController],
  providers: [TokenService],
})
export class TokenModule {}
