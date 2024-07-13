import { ApiProperty } from '@nestjs/swagger';
import { ApiError } from '../interface/api-error.interface';

export class UnauthorizedErrorDTO implements ApiError {
  @ApiProperty({
    description: 'Detailed error description',
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  message: string | string[];

  @ApiProperty({
    description: 'HTTP error description',
    example: 'Unathorized',
  })
  error: string;

  @ApiProperty({ description: 'HTTP response code', example: 401 })
  statusCode: number;
}
