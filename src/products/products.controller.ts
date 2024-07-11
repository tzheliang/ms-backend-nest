import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Post,
  Put,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { Product } from './product.entity';
import { FindProductDto } from './dto/find-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';

@Controller('products')
@SerializeOptions({ strategy: 'excludeAll' })
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProduct(
    @Query() { productCode, location }: FindProductDto,
  ): Promise<Product> {
    const product = await this.productsService.findProduct({
      productCode,
      location,
    });

    if (!product) {
      throw new NotFoundException('Product information not found.');
    }

    return product;
  }

  @Post()
  @HttpCode(200)
  async createProduct(@Body() body: CreateProductDTO): Promise<Product> {
    try {
      const product = await this.productsService.createProduct(body);
      return product;
    } catch (exception: any) {
      if (
        exception instanceof Error &&
        exception.message === 'DUPLICATE_PRODUCT'
      ) {
        throw new BadRequestException('Product code already exists.');
      }

      // re-throw as internal server error for others
      throw exception;
    }
  }

  @Put()
  async updateProduct(
    @Query('productCode') productCode: string,
    @Body() body: UpdateProductDTO,
  ): Promise<Product> {
    const product = await this.productsService.updateProduct(productCode, body);

    if (!product) {
      throw new NotFoundException('Product information not found.');
    }

    return product;
  }

  @Delete()
  @HttpCode(204)
  async deleteProduct(
    @Query() { productCode }: DeleteProductDto,
  ): Promise<void> {
    const success = await this.productsService.deleteProduct(productCode);

    if (!success) {
      throw new NotFoundException('Product information not found.');
    }

    return;
  }
}
