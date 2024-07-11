import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProductDTO {
  @IsNotEmpty()
  location: string;

  @IsNumber()
  price: number;
}
