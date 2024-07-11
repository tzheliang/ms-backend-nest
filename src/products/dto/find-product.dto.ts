import { IsNotEmpty } from "class-validator";

export class FindProductDto {
  @IsNotEmpty()
  productCode: string;

  @IsNotEmpty()
  location: string;
}
