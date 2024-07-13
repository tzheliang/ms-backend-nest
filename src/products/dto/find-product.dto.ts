import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FindProductDTO {
  @IsNotEmpty()
  @ApiProperty({ description: 'Unique product code' })
  productCode: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Location of the product' })
  location: string;
}
