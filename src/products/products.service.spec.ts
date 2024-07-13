import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findProduct', () => {
    beforeEach(() => {
      mockRepository.findOneBy.mockClear();
    });

    it('should return a product with the specified id', async () => {
      const mockProduct = {
        productCode: '1000',
        location: 'KL',
        price: 500,
      } as Product;

      jest.spyOn(mockRepository, 'findOneBy').mockReturnValue(mockProduct);

      const productCode = '1000';
      const location = 'KL';

      const result = await service.findProduct({ productCode, location });

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        productCode,
        location,
      });

      expect(result).toEqual(mockProduct);
    });
  });

  describe('createProduct', () => {
    beforeEach(() => {
      mockRepository.findOneBy.mockClear();
      mockRepository.create.mockClear();
      mockRepository.insert.mockClear();
    });

    it('should create a new product', async () => {
      const createDto = {
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

      const newProduct = {
        productCode: '1000',
        location: 'KL',
        price: 500,
      } as Product;

      jest.spyOn(mockRepository, 'findOneBy').mockReturnValue(null);
      jest.spyOn(mockRepository, 'create').mockReturnValue(newProduct);
      jest.spyOn(mockRepository, 'insert');

      // to simulate TypeORM adding the ID after insert
      newProduct.id = product.id;

      const result = await service.createProduct(createDto);

      expect(result).toEqual(product);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        productCode: createDto.productCode,
      });
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.insert).toHaveBeenCalled();
      expect(mockRepository.insert).toHaveBeenCalledWith(newProduct);
    });

    it('should prevent creating a duplicate product', async () => {
      const createDto = {
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

      jest.spyOn(mockRepository, 'findOneBy').mockReturnValue(product);

      await expect(service.createProduct(createDto)).rejects.toThrow();

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        productCode: createDto.productCode,
      });
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.insert).not.toHaveBeenCalled();
    });
  });

  describe('updateProduct', () => {
    beforeEach(() => {
      mockRepository.update.mockClear();
      mockRepository.findOneBy.mockClear();
    });

    it('should update the product with the specified id', async () => {
      const productCode = '1000';
      const updateBody = {
        location: 'SG',
        price: 750,
      };

      const updateResult = { affected: 1 } as UpdateResult;

      const newProduct = {
        id: 1,
        productCode: '1000',
        location: 'SG',
        price: 750,
      } as Product;

      jest.spyOn(mockRepository, 'update').mockReturnValue(updateResult);
      jest.spyOn(mockRepository, 'findOneBy').mockReturnValue(newProduct);

      await expect(
        service.updateProduct(productCode, updateBody),
      ).resolves.toBe(newProduct);

      expect(mockRepository.update).toHaveBeenCalled();
      expect(mockRepository.update).toHaveBeenCalledWith(
        { productCode: productCode },
        updateBody,
      );

      expect(mockRepository.findOneBy).toHaveBeenCalled();
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        productCode: productCode,
      });
    });

    it('should return null if it failed to update the product with the specified id', async () => {
      const productCode = '9000';
      const updateBody = {
        location: 'SG',
        price: 750,
      };

      const updateResult = { affected: 0 } as UpdateResult;
      const newProduct = null;

      jest.spyOn(mockRepository, 'update').mockReturnValue(updateResult);
      jest.spyOn(mockRepository, 'findOneBy').mockReturnValue(newProduct);

      await expect(
        service.updateProduct(productCode, updateBody),
      ).resolves.toBe(newProduct);

      expect(mockRepository.update).toHaveBeenCalled();
      expect(mockRepository.update).toHaveBeenCalledWith(
        { productCode },
        updateBody,
      );

      expect(mockRepository.findOneBy).not.toHaveBeenCalled();
    });
  });

  describe('deleteProduct', () => {
    beforeEach(() => {
      mockRepository.delete.mockClear();
    });

    it('should delete the product with the specified id and return true', async () => {
      const outcome = true;
      const productCode = '1000';

      const deleteResult = { affected: 1 } as DeleteResult;

      jest.spyOn(mockRepository, 'delete').mockReturnValue(deleteResult);

      await expect(service.deleteProduct(productCode)).resolves.toBe(outcome);

      expect(mockRepository.delete).toHaveBeenCalled();
      expect(mockRepository.delete).toHaveBeenCalledWith({ productCode });
    });

    it('should fail to delete the product with the specified id and return false', async () => {
      const outcome = false;
      const productCode = '9000';

      const deleteResult = { affected: 0 } as DeleteResult;

      jest.spyOn(mockRepository, 'delete').mockReturnValue(deleteResult);

      await expect(service.deleteProduct(productCode)).resolves.toBe(outcome);

      expect(mockRepository.delete).toHaveBeenCalled();
      expect(mockRepository.delete).toHaveBeenCalledWith({ productCode });
    });
  });
});
