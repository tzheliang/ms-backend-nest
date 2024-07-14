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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { Product } from './product.entity';
import { FindProductDTO } from './dto/find-product.dto';
import { UpdateDeleteProductDTO } from './dto/update-delete-product.dto';
import { AuthGuard } from '../token/guards/auth.guard';
import { AdminGuard } from '../token/guards/admin.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UnauthorizedErrorDTO } from '../errors/dto/error-401.dto';
import { NotFoundErrorDTO } from '../errors/dto/error-404.dto';
import { BadRequestErrorDTO } from '../errors/dto/error-400.dto';
import { ForbiddenErrorDTO } from '../errors/dto/error-403.dto';

@Controller('product')
@SerializeOptions({ strategy: 'excludeAll' })
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Product')
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Retrieve Product' })
  @ApiOkResponse({ description: 'OK', type: Product })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: UnauthorizedErrorDTO,
  })
  @ApiNotFoundResponse({ description: 'Not Found', type: NotFoundErrorDTO })
  async getProduct(
    @Query() { productCode, location }: FindProductDTO,
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
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Create new Product' })
  @ApiOkResponse({ description: 'OK', type: Product })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: BadRequestErrorDTO,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: UnauthorizedErrorDTO,
  })
  @ApiForbiddenResponse({ description: 'Forbidden', type: ForbiddenErrorDTO })
  @ApiNotFoundResponse({ description: 'Not Found', type: BadRequestErrorDTO })
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
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Update Product' })
  @ApiQuery({
    name: 'productCode',
    description: 'Product unique id',
    example: '1000',
  })
  @ApiOkResponse({ description: 'OK', type: Product })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: UnauthorizedErrorDTO,
  })
  @ApiForbiddenResponse({ description: 'Forbidden', type: ForbiddenErrorDTO })
  @ApiNotFoundResponse({ description: 'Not Found', type: NotFoundErrorDTO })
  async updateProduct(
    @Query() { productCode }: UpdateDeleteProductDTO,
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
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Delete Product' })
  @ApiQuery({
    name: 'productCode',
    description: 'Product unique id',
    example: '1000',
  })
  @ApiNoContentResponse({ description: 'No Content' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: UnauthorizedErrorDTO,
  })
  @ApiForbiddenResponse({ description: 'Forbidden', type: ForbiddenErrorDTO })
  @ApiNotFoundResponse({ description: 'Not Found', type: NotFoundErrorDTO })
  async deleteProduct(
    @Query() { productCode }: UpdateDeleteProductDTO,
  ): Promise<void> {
    const success = await this.productsService.deleteProduct(productCode);

    if (!success) {
      throw new NotFoundException('Product information not found.');
    }

    return;
  }
}
