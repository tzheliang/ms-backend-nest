import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  // find one
  async findProduct(where: FindOptionsWhere<Product>): Promise<Product> {
    return this.productsRepository.findOneBy(where);
  }

  // create one
  async createProduct(createBody: CreateProductDTO): Promise<Product> {
    // Duplicate check
    const findProduct = await this.productsRepository.findOneBy({
      productCode: createBody.productCode,
    });

    // simple duplicate checking
    if (findProduct) {
      throw new Error('DUPLICATE_PRODUCT');
    }

    const newProduct = this.productsRepository.create(createBody);
    await this.productsRepository.insert(newProduct);

    return newProduct;
  }

  // update one
  async updateProduct(
    productCode: string,
    updateBody: UpdateProductDTO,
  ): Promise<Product> {
    const result = await this.productsRepository.update(
      { productCode },
      updateBody,
    );

    if (result.affected === 0) {
      return null;
    }

    const product = await this.productsRepository.findOneBy({ productCode });
    return product;
  }

  // delete one
  async deleteProduct(productCode: string): Promise<boolean> {
    const result = await this.productsRepository.delete({
      productCode,
    });

    if (result.affected === 0) {
      return false;
    }

    return true;
  }
}
