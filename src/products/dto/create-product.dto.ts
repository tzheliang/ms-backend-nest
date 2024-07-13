import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductDTO {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique product id',
    example: '1000',
    minLength: 1,
  })
  productCode: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Location of the product',
    example: 'KL',
    minLength: 1,
  })
  location: string;

  @IsNumber()
  @ApiProperty({
    description: 'Price of the premium of the product',
    example: 500,
    type: 'number',
    format: 'float',
  })
  price: number;
}
