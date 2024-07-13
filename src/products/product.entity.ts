import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryColumn()
  @Expose()
  @ApiProperty({
    description: 'Unique product id',
    example: '1000',
  })
  productCode: string;

  @Column()
  @Expose()
  @ApiProperty({
    description: 'Location of the product',
    example: 'KL',
    minLength: 1,
  })
  location: string;

  @Column({ type: 'float' })
  @Expose()
  @ApiProperty({
    description: 'Price of the premium of the product',
    example: 500,
    type: 'number',
    format: 'float',
  })
  price: number;
}
