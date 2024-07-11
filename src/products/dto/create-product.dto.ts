import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductDTO {
  @IsNotEmpty()
  productCode: string;

  @IsNotEmpty()
  location: string;

  @IsNumber()
  price: number;
}
