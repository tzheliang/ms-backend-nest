import { PickType } from '@nestjs/swagger';
import { FindProductDTO } from './find-product.dto';

export class UpdateDeleteProductDTO extends PickType(FindProductDTO, [
  'productCode',
] as const) {}
