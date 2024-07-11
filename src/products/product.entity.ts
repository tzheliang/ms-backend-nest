import { Expose } from 'class-transformer';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryColumn()
  @Expose()
  productCode: string;

  @Column()
  @Expose()
  location: string;

  @Column({ type: 'float' })
  @Expose()
  price: number;
}
