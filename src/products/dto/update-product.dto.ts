import { OmitType } from '@nestjs/swagger';
import { CreateProductDTO } from './create-product.dto';

export class UpdateProductDTO extends OmitType(CreateProductDTO, [
  'productCode',
] as const) {}
