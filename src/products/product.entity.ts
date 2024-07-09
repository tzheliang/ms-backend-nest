import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productCode: string;

  @Column()
  productDescription: string;

  @Column()
  locationCode: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  price: number;
}
