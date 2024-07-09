import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRespository: Repository<Product>,
  ) {}

  // find all
  async findAllProducts(): Promise<Product[]> {
    return this.productsRespository.find();
  }

  // create one
  async createProduct(): Promise<Product> {
    return Promise.resolve({} as Product);
  }

  // update one
  async updateProduct(): Promise<Product> {
    return Promise.resolve({} as Product);
  }

  // delete one
  async deleteProduct(): Promise<void> {
    await Promise.resolve();
  }
}
