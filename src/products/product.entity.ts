import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'PRODUCT' })
export class Product {
  @PrimaryGeneratedColumn()
  @Expose()
  @ApiProperty({
    description: 'Product unique id',
    example: 1,
    type: 'number',
  })
  id: number;

  @Column({ unique: true })
  @Expose()
  @ApiProperty({
    description: 'Unique product code',
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
