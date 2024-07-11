import { IsNotEmpty } from 'class-validator';

export class DeleteProductDto {
  @IsNotEmpty()
  productCode: string;
}
