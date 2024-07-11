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
    private readonly productsRespository: Repository<Product>,
  ) {}

  // find one
  async findProduct(where: FindOptionsWhere<Product> = {}): Promise<Product> {
    return this.productsRespository.findOneBy(where);
  }

  // create one
  async createProduct(createBody: CreateProductDTO): Promise<Product> {
    // Duplicate check
    const findProduct = await this.productsRespository.findOneBy({
      productCode: createBody.productCode,
    });

    // simple duplicate checking
    if (findProduct) {
      throw new Error('DUPLICATE_PRODUCT');
    }

    const newProduct = this.productsRespository.create(createBody);
    await this.productsRespository.save(newProduct);

    return newProduct;
  }

  // update one
  async updateProduct(
    productCode: string,
    updateBody: UpdateProductDTO,
  ): Promise<Product> {
    const result = await this.productsRespository.update(
      { productCode },
      updateBody,
    );

    if (result.affected === 0) {
      return null;
    }

    return this.productsRespository.findOneBy({ productCode });
  }

  // delete one
  async deleteProduct(productCode: string): Promise<boolean> {
    const result = await this.productsRespository.delete({
      productCode,
    });

    if (result.affected === 0) {
      return false;
    }

    return true;
  }
}
