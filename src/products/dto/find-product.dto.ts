import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FindProductDTO {
  @IsNotEmpty()
  @ApiProperty({ description: 'Unique product id' })
  productCode: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Unique product id' })
  location: string;
}
