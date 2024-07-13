import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { JwtService } from '@nestjs/jwt';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ProductsController', () => {
  let controller: ProductsController;
  let mockJwtService = {};
  let mockProductsService = {
    findProduct: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProduct', () => {
    beforeEach(() => {
      mockProductsService.findProduct.mockClear();
    });

    it('should return product when product found with productCode and location', async () => {
      const productCode = '1000';
      const location = 'KL';

      const product = {
        id: 1,
        productCode: '1000',
        location: 'KL',
        price: 500,
      } as Product;

      jest.spyOn(mockProductsService, 'findProduct').mockReturnValue(product);

      await expect(
        controller.getProduct({ productCode, location }),
      ).resolves.toEqual(product);

      expect(mockProductsService.findProduct).toHaveBeenCalled();
      expect(mockProductsService.findProduct).toHaveBeenCalledWith({
        productCode,
        location,
      });
    });

    it('should throw not found exception when no product found with productCode and location', async () => {
      const productCode = '9000';
      const location = 'KL';

      jest.spyOn(mockProductsService, 'findProduct').mockReturnValue(null);

      await expect(
        controller.getProduct({ productCode, location }),
      ).rejects.toThrow(NotFoundException);

      expect(mockProductsService.findProduct).toHaveBeenCalled();
      expect(mockProductsService.findProduct).toHaveBeenCalledWith({
        productCode,
        location,
      });
    });
  });

  describe('createProduct', () => {
    beforeEach(() => {
      mockProductsService.createProduct.mockClear();
    });

    it('should return a new product when the product is not a duplicate of existing product', async () => {
      const createProductBody = {
        productCode: '1000',
        location: 'KL',
        price: 500,
      };

      const product = {
        id: 1,
        productCode: '1000',
        location: 'KL',
        price: 500,
      } as Product;

      jest.spyOn(mockProductsService, 'createProduct').mockReturnValue(product);

      await expect(
        controller.createProduct(createProductBody),
      ).resolves.toEqual(product);

      expect(mockProductsService.createProduct).toHaveBeenCalled();
      expect(mockProductsService.createProduct).toHaveBeenCalledWith(
        createProductBody,
      );
    });

    it('should throw bad request exception when productCode is duplicated', async () => {
      const createProductBody = {
        productCode: '1000',
        location: 'KL',
        price: 500,
      };

      jest
        .spyOn(mockProductsService, 'createProduct')
        .mockRejectedValue(new Error('DUPLICATE_PRODUCT'));

      await expect(controller.createProduct(createProductBody)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockProductsService.createProduct).toHaveBeenCalled();
      expect(mockProductsService.createProduct).toHaveBeenCalledWith(
        createProductBody,
      );
    });

    it('should re-throw error when unhandled exception occurs', async () => {
      const createProductBody = {
        productCode: '1000',
        location: 'KL',
        price: 500,
      };

      jest
        .spyOn(mockProductsService, 'createProduct')
        .mockRejectedValue(new Error('OTHER_ERROR'));

      await expect(controller.createProduct(createProductBody)).rejects.toThrow(
        'OTHER_ERROR',
      );

      expect(mockProductsService.createProduct).toHaveBeenCalled();
      expect(mockProductsService.createProduct).toHaveBeenCalledWith(
        createProductBody,
      );
    });
  });

  describe('updateProduct', () => {
    beforeEach(() => {
      mockProductsService.updateProduct.mockClear();
    });

    it('should return updated product when product is successfully updated with productCode', async () => {
      const productCode = '1000';
      const updateProductBody = {
        location: 'SG',
        price: 750,
      };

      const product = {
        id: 1,
        productCode: '1000',
        location: 'SG',
        price: 750,
      } as Product;

      jest.spyOn(mockProductsService, 'updateProduct').mockReturnValue(product);

      await expect(
        controller.updateProduct(productCode, updateProductBody),
      ).resolves.toEqual(product);

      expect(mockProductsService.updateProduct).toHaveBeenCalled();
      expect(mockProductsService.updateProduct).toHaveBeenCalledWith(
        productCode,
        updateProductBody,
      );
    });

    it('should throw not found exception when product fails to update with productCode', async () => {
      const productCode = '9000';
      const updateProductBody = {
        location: 'SG',
        price: 750,
      };

      jest.spyOn(mockProductsService, 'updateProduct').mockReturnValue(null);

      await expect(
        controller.updateProduct(productCode, updateProductBody),
      ).rejects.toThrow(NotFoundException);

      expect(mockProductsService.updateProduct).toHaveBeenCalled();
      expect(mockProductsService.updateProduct).toHaveBeenCalledWith(
        productCode,
        updateProductBody,
      );
    });
  });

  describe('deleteProduct', () => {
    beforeEach(() => {
      mockProductsService.deleteProduct.mockClear();
    });

    it('should resolve when successfully deleted a product with productCode', async () => {
      const productCode = '1000';

      jest.spyOn(mockProductsService, 'deleteProduct').mockReturnValue(true);

      await expect(
        controller.deleteProduct(productCode),
      ).resolves.not.toThrow();

      expect(mockProductsService.deleteProduct).toHaveBeenCalled();
      expect(mockProductsService.deleteProduct).toHaveBeenCalledWith(
        productCode,
      );
    });

    it('should throw a not found exception when product fails to delete with productCode', async () => {
      const productCode = '9000';

      jest.spyOn(mockProductsService, 'deleteProduct').mockReturnValue(false);

      await expect(controller.deleteProduct(productCode)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockProductsService.deleteProduct).toHaveBeenCalled();
      expect(mockProductsService.deleteProduct).toHaveBeenCalledWith(
        productCode,
      );
    });
  });
});
