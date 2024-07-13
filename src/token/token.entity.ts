import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class Token {
  @Expose()
  @ApiProperty({
    description: 'Valid JWT to be included in the authorization header',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...',
  })
  accessToken: string;
}
